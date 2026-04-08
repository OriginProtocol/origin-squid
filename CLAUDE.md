# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Origin Squid is a Subsquid-based blockchain indexing system for Origin Protocol. It processes EVM events from multiple networks (Ethereum Mainnet, Arbitrum, Base, Sonic, Plume) and serves aggregated DeFi analytics via GraphQL.

## Common Commands

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Run tests
pnpm test
pnpm run test:watch              # Watch mode

# Linting
pnpm run lint
pnpm run lint:fix
pnpm run prettier-check
pnpm run prettier-fix

# Database setup (resets DB, applies migrations)
pnpm run setup

# Code generation
pnpm run generate                 # Full codegen + migration
pnpm run typegen                  # Generate ABI TypeScript interfaces

# Run processors (choose one)
pnpm run process:oeth             # OETH processor
pnpm run process:ousd             # OUSD processor
pnpm run process:mainnet          # Mainnet misc processor
pnpm run process:arbitrum         # Arbitrum processor
pnpm run process:base             # Base processor
pnpm run process:sonic            # Sonic processor
pnpm run process:plume            # Plume processor
pnpm run process                  # Combined processor

# Start GraphQL server (localhost:4350/graphql)
pnpm run serve
```

**Environment variables for processing:**
- `DEBUG_PERF=true` - Enable performance logging
- `BLOCK_FROM=<number>` - Start processing at specific block
- `BLOCK_TO=<number>` - Process up to specific block

## Architecture

### Processor Pattern
Each chain/product has a processor that:
1. Defines event filters (logs/traces) for specific contract events
2. Decodes events using generated ABI interfaces
3. Updates TypeORM entities in batches
4. Runs post-processors for derived data (e.g., exchange rates)

Entry points: `src/main-*.ts` files (e.g., `main-oeth.ts`, `main-ousd.ts`)

### Key Directories
- `src/templates/` - Reusable processor templates (otoken, erc20, strategy, pools)
- `src/utils/` - Shared utilities including chain-specific addresses (`addresses-*.ts`)
- `src/shared/` - Shared modules (ERC20 state, post-processors)
- `src/model/` - TypeORM entities (generated from GraphQL)
- `abi/` - Raw ABI JSON files
- `src/abi/` - Generated TypeScript ABI interfaces

### Path Aliases (tsconfig.json)
- `@abi/*` → `src/abi/*`
- `@model` → `src/model`
- `@shared/*` → `src/shared/*`
- `@templates/*` → `src/templates/*`
- `@utils/*` → `src/utils/*`
- `@test-utils/*` → `src/test-utils/*`

### Data Flow
1. Processor filters blockchain events by contract address and topic
2. Events decoded using `@abi/*` generated interfaces
3. Entities collected in maps during batch processing
4. Entities upserted to database at end of batch
5. Post-processors calculate derived data
6. GraphQL server serves TypeORM models

## Development Workflow

### Adding New Events/Contracts
1. Add ABI JSON to `abi/`
2. Run `pnpm run typegen` to generate TypeScript interfaces
3. Create processor in `src/[network]/processors/` or use existing template
4. Update `squid.yaml` if adding new processor

### Modifying Schema
1. Edit GraphQL files in `src/**/*.graphql`
2. Run `pnpm run generate` (generates TypeORM entities + migration)
3. Generated files are auto-staged in git

## Code Conventions

### Database Operations
- Use `.insert()` or `.upsert()` for entity saves
- Batch operations by collecting entities in maps
- Save at end of context processing, not per-event

### Event Processing
- Create separate filter per event type with descriptive names
- Handle each event in its own conditional block
- Use maps for entity tracking (`Map<string, Entity>`)

### GraphQL Schema
- Order fields with indexed fields first
- Use `@index` directive only for queried fields
- Prefix entities with context (e.g., `PoolBooster*`)

## Project Layout (Subsquid conventions)
- TypeScript sources in `src/`, compiled JS in `lib/`
- All TypeORM classes exported by `src/model/index.ts`
- Database migrations in `db/migrations/` (plain JS files)
- Schema generated from `src/**/*.graphql` files
