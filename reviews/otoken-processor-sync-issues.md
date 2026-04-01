# OToken Processor Sync Issue Analysis

**Date:** 2026-02-10
**Context:** OUSD OToken processor intermittently gets out of sync with on-chain state during execution. Reloading the squid always fixes it. The issue is usually specific to OUSD, which went through a contract reset after an on-chain hack.

---

## Issue #1: `isContract` cache inconsistency (HIGH likelihood)

**File:** `src/utils/isContract.ts:56-60`

The cache uses `Date.now()` for `expiresAt` but compares against `block.header.timestamp`:

```typescript
cache.set(account, {
  value: !isEOA,
  expiresAt: Date.now(),             // wall-clock time
  validFrom: block.header.timestamp, // blockchain time
})
```

The cache check: `entry.expiresAt > block.header.timestamp`. When the indexer is near real-time, these values are very close, and entries can expire between creation and use.

Additionally, in `otoken-2.ts:505-510`, the pre-cache call uses `ctx.blocks[0]`:

```typescript
await areContracts(ctx, ctx.blocks[0], areContractsAccounts, ...)
```

If a contract is deployed mid-batch, the pre-cache at block 0 would record it as an EOA. Then when the OToken class processes a trace involving that address at a later block, the cached "EOA" result (with `validFrom` from the earlier block) would be used, causing the account to be treated as **rebasing** instead of **non-rebasing**. This corrupts `rebasingCredits` and `nonRebasingSupply` permanently.

This matches the symptom pattern: reload fixes it (fresh cache), but drift accumulates during long-running execution.

---

## Issue #2: In-memory state not rolled back on chain reorgs (HIGH likelihood)

The `otoken` and `producer` variables (including `producer.addressMap`) are module-scoped closures that persist in memory. The `addressMap` is explicitly **never reset** (`otoken-entity-producer.ts:843`):

```typescript
// We don't reset `this.addressMap` - keep it in memory for performance.
```

If Subsquid detects a chain reorganization and replays blocks, the database transaction is rolled back, but the in-memory `addressMap`, `otoken` state, and `isContract` cache are NOT rolled back. This means:

- Account balances, earned amounts, rebasing options are stale in memory
- The in-memory OToken state (totalSupply, rebasingCredits, etc.) reflects the rolled-back blocks
- Subsequent processing uses this corrupted in-memory state

OUSD on mainnet would be more susceptible to this than L2 tokens since Ethereum mainnet has more frequent reorgs.

---

## Issue #3: `getOrCreateAddress` uses wrong ID for DB lookup (MEDIUM likelihood)

**File:** `otoken-entity-producer.ts:159`

```typescript
private async getOrCreateAddress(account: string): Promise<OTokenAddress> {
  const id = `${this.ctx.chain.id}:${this.otoken.address}:${account}`
  let address = this.addressMap.get(account)
  if (!address) {
    address = await this.ctx.store.get(OTokenAddress, account) // BUG: should be `id`
  }
```

The DB lookup passes `account` (the raw address) instead of `id` (the composite key `chainId:otoken:account`). This means the DB fallback **never finds existing records**. While masked by the persistent `addressMap`, any scenario that causes an address to be missing from the map (such as reorg rollback or memory pressure) would create duplicate entities rather than finding existing ones.

Compare with `getAddress` at line 148 which correctly uses `id`.

---

## Issue #4: OUSD proxy reset doesn't clear in-memory state (MEDIUM likelihood)

**File:** `otoken-2.ts:427-429`

When the OUSD contract was reset after the hack, `proxyInitializeTraceFilter` fires. Inside `updateOToken`:

```typescript
if (otoken instanceof ImplementationOTokenClass) {
  ctx.log.info('New implementation processed by same class.')
  return  // <-- Returns early, keeping ALL old state!
}
```

Since both the OUSDReset and OUSD map to `OToken_2021_01_02`, the `instanceof` check passes and the function returns early. The old (pre-hack) `creditBalances`, `totalSupply`, `rebasingCredits`, etc. are all preserved.

Then the `initialize` call path (`otoken-2.ts:543-551`) only fires for `isYieldDelegationContract` or `OToken_2023_12_21` instances. For `OToken_2021_01_02`, `initialize` via proxy data is **never called**, so the old corrupted state persists.

While this is a historical issue (Jan 2021), if the hack state wasn't perfectly corrected by subsequent events, the residual error would compound through every subsequent rebase.

---

## Issue #5: `governanceRebaseOptIn` is a no-op in older implementations (MEDIUM likelihood)

**Files:** `otoken-2021-01-02.ts:405-407`, `otoken-2021-01-08.ts:438-440`, `otoken-2021-01-25.ts:436-438`, `otoken-2021-06-06.ts:446-448`

```typescript
public async governanceRebaseOptIn(_caller: string, _account: string): Promise<void> {
  return  // Does nothing!
}
```

But the main processor (`otoken-2.ts:591-598`) processes `governanceRebaseOptIn` traces and calls `producer.afterRebaseOptIn`:

```typescript
} else if (governanceRebaseOptInTraceFilter.matches(trace)) {
  await otoken.governanceRebaseOptIn(sender, data._account) // No-op in old versions
  await producer.afterRebaseOptIn(trace, data._account)     // Creates entities based on wrong state
  addressesToCheck.add(sender)
}
```

If `governanceRebaseOptIn` traces were emitted during the pre-2023 era, the OToken state wouldn't be updated but the entity producer would create `OTokenRebaseOption` records reflecting the unchanged (incorrect) rebasing state.

---

## Issue #6: Shallow reference sharing in `copyState` (LOW-MEDIUM likelihood)

All `copyState` implementations copy object references, not deep copies:

```typescript
this.creditBalances = other.creditBalances    // shared reference
this.rebaseState = other.rebaseState          // shared reference
this.alternativeCreditsPerToken = other.alternativeCreditsPerToken
```

If any code path retains a reference to the old `otoken` instance after an upgrade, mutations would affect both. The old reference IS replaced at `otoken-2.ts:434-435`, but during the brief window between `copyData` and the reference update, both instances share the same mutable objects.

---

## Issue #7: `OToken_2021_01_08._isNonRebasingAccount` has dead code / missing check (LOW likelihood)

**File:** `otoken-2021-01-08.ts:325-362`

```typescript
private async _isNonRebasingAccount(account: string): Promise<boolean> {
  if (await isContract(this.ctx, this.block, account)) {
    if (this.rebaseState[account] == RebaseOptions.StdRebasing) { return false }
    this._ensureRebasingMigration(account)
    return true
  } else {
    if (await isContract(this.ctx, this.block, account)) { // <-- Duplicate, dead code
      this._ensureRebasingMigration(account)
      return true
    } else {
      if ((this.nonRebasingCreditsPerToken[account] ?? 0n) !== 0n) { throw new Error('Previous Contract') }
      return false
    }
  }
}
```

The inner `isContract` check in the `else` branch is dead code (the outer `if` already tested the same condition). More importantly, unlike the later implementations (`OToken_2021_01_25`+), this version doesn't check for `rebaseState == StdNonRebasing` in the EOA branch. An EOA that explicitly opted out via `rebaseOptOut` would NOT be recognized as non-rebasing on its next interaction, potentially causing incorrect state updates during that era.

---

## Recommendation

The most likely cause of the intermittent OUSD drift is a combination of **issues #1 and #2**: the `isContract` cache producing incorrect results during real-time processing, compounded by in-memory state not being rolled back during chain reorgs. Both would cause the in-memory `otoken` state to diverge from on-chain reality, and since that state is persisted to `OTokenRawData`, the error compounds.

To confirm, re-enable the `checkState` function (currently commented out at `otoken-2.ts:774-780`) to validate the in-memory state against the chain after each context. This would help identify exactly when and how the drift begins.
