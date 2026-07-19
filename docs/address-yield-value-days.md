# Proposal: fix per-address realized APY at the source (value-days denominator)

Status: **proposal / not yet implemented**
Branch: `feat/address-yield-value-days`
Supersedes the resolver guard shipped in `92174d0` (that guard stays as a backstop until
this lands and is validated).

## TL;DR

The per-address realized-APY resolvers divide a day's yield by the **end-of-day** balance.
On any day a holder reduces their position, the yield was earned by the **pre-reduction**
balance, so the denominator is wrong — and for holders who exit to share/rounding dust it
collapses to a few wei, blowing the money-weighted rate up to 1e9+ and overflowing
`power(1+d,365)`. The shipped guard filters those rows out; it works but is a band-aid.

The real fix is to stop discarding the earning balance. Each daily row should carry a
**value-days** accumulator — the time-integral of the position's value over that day,
captured at checkpoint time when the true intraday state is known — and the resolver should
divide `Σyield / Σvalue-days`. Then exit-day yield is divided by the capital that actually
earned it, no denominator ever collapses, and the guard/clamp/dust-corruption handling
become unnecessary.

This requires a schema field, changes to all four checkpoint engines, a migration, a
resolver change, and a **reindex** of the per-address yield tables. It cannot be done in
SQL alone: the correct denominator depends on intraday balance history that is not
recoverable from the persisted end-of-day rows.

## Root cause (grounded in code)

All four engines use the same accrual shape. ARM (`src/templates/origin-arm/origin-arm.ts`),
wrapped OToken (`src/templates/wotoken-yield/wotoken-yield.ts`), and xOGN
(`src/templates/exponential-staking/es-address-yield.ts`) share a literal `checkpoint()`:

```ts
const product = row.balance * (R - row.lastR) + row.yieldRemainder // yield earned by PRE-change balance
row.cumulativeYield += product / PRECISION
...
row.balance += balanceDelta          // THEN apply the deposit/withdraw
row.value    = row.balance * R / 1e18 // value from the POST-change balance
row.yield    = row.cumulativeYield - previousDay.cumulativeYield
```

OTokens (`src/templates/otoken/otoken-entity-producer.ts` `snapshotAddressYield`) reach the
same place by a rebase/credits route: `row.balance = address.balance` (post-change) while
`row.yield` is the `cumulativeYield` (= `address.earned`) delta that includes the pre-change
balance's earnings.

The resolver then computes `d = Σyield / Σvalue` and annualizes. On a normal day
`value ≈ earning balance`, so `d` is right. On a day the holder withdraws to dust, `yield`
is a real day's earnings on the pre-withdraw balance but `value` is the leftover wei.

Concrete trace (WETH ARM, holder `0xfdbb…35c9`):

```
2026-01-18   value = 10 wei     yield = 1,264,237,635,819 wei
```

`Σyield/Σvalue` for this position = `1.8e12 / 864` ≈ a 209-billion-percent daily rate →
`power(1+d,365)` overflows float8. Measured across live holders: ~2.3% error out, ~0.9%
return absurd-but-finite APYs (150%–6000%).

## Requirement this must satisfy

Per product decision: **the number shown is the all-time realized APY of the holder's
current positions.** So the per-product rate is realized over the full holding period, and
the portfolio blends the currently-held positions by current USD value. The design below
keeps that definition; it only fixes the denominator so the realized rate is correct.

## Design options considered

**A. Resolver-only, beginning-of-day denominator (`LAG(value)`).** No reindex. Divides each
day's yield by the prior day's end value (≈ start-of-day capital). Fixes the dominant case
but degrades on churny/gappy histories that bounce through `value=0`, where `LAG` lands on a
zero/stale row. Still heuristic → keep the guard. *Rejected as the permanent fix; viable as
an interim if we don't want to reindex yet.*

**B. Index-time value-days accumulator (recommended).** Persist per daily row the
time-integral of value over that day, computed when we have the true intraday balance and
timestamps. Resolver divides `Σyield / Σvalue-days`. Correct in all cases — exit days, churn,
gaps — because the earning capital is captured at the moment it was deployed, not
reconstructed afterward. Needs schema + engine changes + reindex.

**C. Store the pre-change earning value only.** Simpler than B but loses intraday accuracy on
days with multiple flows. B subsumes it. *Rejected.*

Recommendation: **B.**

## The value-days accumulator

Add one field per daily row (name TBD: `valueSeconds`, stored exact as `BigInt`):

```
valueSeconds += value_pre * dt_seconds     // accumulated at each checkpoint, per-day
```

where at each checkpoint, *before* applying the balance delta:
- `value_pre` = the position's value in the resolver's denomination
  (ARM/wOToken: `balance * R / 1e18`; OToken: `balance`; xOGN: `stakedBalance`),
- `dt_seconds` = `block.timestamp − row.lastCheckpointTs`.

`lastCheckpointTs` is the previous checkpoint's block time, carried across the day boundary
by seeding it from the previous day's row (so the overnight interval is attributed to the new
day's early hours). The existing forced daily checkpoint (`onDayEnd` /
`forEachBlockByDay`) guarantees at least one checkpoint per day, bounding each interval to
≤1 day and keeping the integral tight. `valueSeconds` resets each day (it lives on the
per-day row).

Resolver, replacing `Σyield / Σvalue`:

```sql
d = Σ(yield) / NULLIF(Σ(valueSeconds) / 86400.0, 0)   -- token / token-days = daily rate
apr = d * 365
apy = power(1 + d, 365) - 1
```

Because every day's yield is divided by that day's *actual* deployed capital, `d` is bounded
by the real yield rate (<< 1%/day) with no exit-day pathology — so the per-day filter, the
±0.2%/day clamp, and the dust-corruption role of the portfolio floor can all be removed. (The
$0.01 "current position" floor stays: it is a product rule about what counts as held, not a
corruption workaround.)

## Concrete changes

1. **Schema** (`schema.graphql` + the per-template `.graphql`): add `valueSeconds: BigInt!`
   to `ArmAddressYield`, `OTokenAddressYield`, `WOTokenAddressYield`, `ESAddressYield`;
   regenerate models (`sqd codegen`). ~4 entities.

2. **Shared checkpoint (ARM / wOToken / xOGN)** — these are three copies of the same
   `checkpoint()`. In each:
   - seed `valueSeconds = 0n` on new-day rows and `lastCheckpointTs` from the seed row's
     `timestamp`;
   - before `row.balance += delta`, compute `value_pre` and
     `row.valueSeconds += value_pre * BigInt(dtSeconds)`.
   Consider factoring these three into one shared helper while here (they already claim to
   "mirror" each other) to prevent future drift.

3. **OToken** (`snapshotAddressYield`): same accumulation, but checkpoints are rebase/transfer
   driven (no guaranteed daily tick) and sub-threshold dust holders are evicted. Accumulate
   `valueSeconds += balance * dt` across the sparse checkpoints; dust-evicted holders simply
   stop accruing (they are excluded from the blend anyway). Verify the ~daily rebase cadence
   keeps the integral tight enough; if not, add a daily forced snapshot for active holders.

4. **Migration**: new nullable→backfilled column; the reindex repopulates it. Add the
   `db/migrations` Data.js as usual.

5. **Resolver** (`src/server-extension/address-apy.ts`): swap the denominator from
   `value/balance/staked_balance` to `valueSeconds/86400` in both `computeApy` and the
   `addressApy` `native` CTE; drop `dailyRateFilter` and the clamp; keep the `DUST_USD` floor
   and the compound-blend. Fall back to the old denominator when `valueSeconds` is null
   (pre-reindex rows) so the API degrades gracefully mid-reindex.

## Validation plan (before trusting the reindex)

- **Unit/logic**: extend the Postgres harness used for the guard
  (`scratchpad/validate_sql.js` pattern) with `valueSeconds` rows covering: steady holder,
  mid-day partial withdraw, withdraw-to-dust, churn-through-zero, multi-flow day. Assert `d`
  equals the hand-computed value-days rate and that no case explodes.
- **On-chain reconciliation**: for a sample of real holders per product, reconstruct
  value-days from raw transfer/rebase history independently and confirm `Σyield/Σvalue-days`
  matches the resolver to tolerance. Reuse the live-data scripts from the guard validation.
- **Regression**: confirm healthy holders' APY is materially unchanged vs today (the guard
  showed the filter dropped 0 legit rows; value-days should move healthy numbers by < a few
  bps).
- **Spot-check the known-bad wallets** (`0xfdbb…35c9`, `0x6b3b…5f09`, the 6231%/371% ones):
  each should now yield a sane realized APY *without* any filtering.

## Rollout / reindex

- Per-address yield is derived; the change touches only the four yield templates + resolver,
  so a targeted reindex of those processors is sufficient (no full-squid green-field).
- Ship behind the null-fallback so a new squid version can index alongside the current one;
  cut the frontend over once the reindex is caught up and validated.
- Retire the guard (`dailyRateFilter` + clamp) in the same change that turns on the
  value-days denominator, once reconciliation passes.

## Open questions

- Field type/units: `valueSeconds` (BigInt, exact) vs a `valueDays` numeric. BigInt is exact
  and avoids float drift in the accumulator; `/86400.0` happens once in SQL.
- OToken cadence: is the rebase-driven checkpoint frequent enough for a tight integral, or do
  we add a daily forced snapshot for active holders (memory cost on large holder sets)?
- Whether to factor the three identical `checkpoint()` copies into one shared engine now
  (reduces future drift) or keep them separate to minimize blast radius for this change.
