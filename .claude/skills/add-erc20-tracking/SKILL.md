---
name: add-erc20-tracking
description: Add tracking for a simple ERC20 token to the squid. Use when the user asks to "add", "track", or "index" a new ERC20 token by name or address on a supported chain (mainnet, base, arbitrum, sonic, plume, hyperevm).
---

# Add ERC20 Token Tracking

Adds an ERC20 token to the squid's per-chain `erc20s.ts` processor so its transfers are indexed.

## Step 1: Identify chain and gather token info

Confirm which chain the token is on. If unclear, ask. Then collect:
- **Address** (checksummed lowercase)
- **Symbol** (e.g., `rUSD`)
- **Deploy block number** — required as the `from` block. If unknown, fetch via Blockscout (or chain equivalent):
  ```bash
  curl -s "https://eth.blockscout.com/api/v2/addresses/<ADDRESS>"
  # then look up the creation_transaction_hash:
  curl -s "https://eth.blockscout.com/api/v2/transactions/<TX>" | python3 -c "import json,sys; print(json.load(sys.stdin)['block_number'])"
  ```
  Equivalent Blockscout hosts: `base.blockscout.com`, `arbitrum.blockscout.com`, `sonic.blockscout.com`, etc.

## Step 2: Add address constant and token map entry

For mainnet, edit `src/utils/addresses.ts`:
1. Add an `export const FOO_ADDRESS = '0x...'` near the other token address constants.
2. Add `Foo: FOO_ADDRESS,` to the `mainnetTokens` object.

For other chains, edit the corresponding `src/utils/addresses-<chain>.ts` and its `<chain>Tokens` map.

## Step 3: Register the tracker

Edit the chain's processors `erc20s.ts` (e.g., `src/mainnet/processors/erc20s.ts`) and add an entry to `simpleTracks`:

```ts
Foo: {
  from: <DEPLOY_BLOCK>,
  address: mainnetTokens.Foo, // or just the address string
},
```

`simpleTracks` use `createERC20EventTracker` — event-based, suitable for any token where you want to follow transfers without contract polling. Use `tracks` (with `createERC20PollingTracker`) only if interval/balance polling is needed (e.g., wOETH, WETH with `accountFilter`).

## Step 4: Verify

Run a typecheck:
```bash
npx tsc --noEmit
```

Do NOT run `pnpm run generate` or migrations — adding a tracker does not change the GraphQL schema.

## Notes

- Keep `from` accurate; using a too-early block wastes indexing time, too-late drops history.
- The `addERC20Processing` helper in `erc20s.ts` is for *other* code to register additional `accountFilter` addresses on existing polling tracks — not for adding new tokens.
- If the token is also needed in `symbols.ts` for symbol lookups, that happens automatically via the `<chain>Tokens` export.
