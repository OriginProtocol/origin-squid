# Origin Subsquid

### [Design Decisions Notion Document](https://www.notion.so/originprotocol/Subsquid-Design-Decisions-04ef82ae0d6848d1b14de893e9929ce4#d8e8d367069c4a619809e926f72db074)

#### See [docs/](./docs/) for specific tasks.

## Release Checklist

Ensure we don't miss anything on a release by following this checklist.

- [ ] Go to github repository and create a release
- [ ] Create a new tag following the format `v<VERSION_NUMBER>` where `VERSION_NUMBER` is the squid version of the processor (i.e. `v54`)
- [ ] Generate the release notes automatically or fill them manually
- [ ] Publish the release
- [ ] Wait for processing to complete
- [ ] Set to production at https://app.subsquid.io/squids
- [ ] Check functionality of front-ends
- [ ] Update Grafana Subsquid datasource: https://origindefi.grafana.net/connections/datasources
- [ ] Notify in #defi-data if important
- [ ] Hibernate previous version(s)
- [ ] Delete old versions (keep recently hibernated version as a backup)

## Env Options

```shell
DEBUG_PERF=true sqd process:oeth     # Run with performance numbers
BLOCK_FROM=18421105 sqd process:oeth # Start processing at block 18421105
BLOCK_TO=18421105 sqd process:oeth   # Process up to block 18421105
```

## Useful Commands

```shell
# Code Generation
yarn generate          # Generate new migration
yarn typegen           # Generate ABI code

yarn setup             # Reset database - run prior to starting processing for a fresh start

# Processing Commands
yarn process:arbitrum  # Run Arbitrum processor
yarn process:base      # Run Base processor
yarn process:sonic     # Run Sonic processor
yarn process:oeth      # Run OETH processor
yarn process:ousd      # Run OUSD processor
yarn process:ogv       # Run OGV processor
yarn process:mainnet   # Run misc mainnet processor
yarn process:test      # Run test processor
yarn process           # Run combined processor

# Local GraphQL Server
yarn serve             # You'll have to rebuild and rerun to see updates here.

# Deployment Tools
yarn postdeploy v81    # Run post-deployment tasks (processing times log and validations)
```

## Quickstart

```bash
# 0. Install @subsquid/cli a.k.a. the sqd command globally
npm i -g @subsquid/cli

# 1. Install dependencies
npm ci

# 2. Start a Postgres database container and setup
yarn setup

# 3. Build and start the processor (choose one)
yarn process:oeth
yarn process:ousd
yarn process:mainnet
# ... or other available processors

# 4. In a separate terminal, start the GraphQL server
yarn serve
```

A GraphiQL playground will be available at [localhost:4350/graphql](http://localhost:4350/graphql).

## Dev Flow

### 1. Make Schema Changes

- Add or modify GraphQL schema files in `src/**/*.graphql`
- Run `yarn generate` to:
  - Combine GraphQL files into schema.graphql
  - Generate TypeORM entities
  - Create new database migration
  - Add new files to git

### 2. Add New Events/Contracts

- Add ABI JSON files to `./abi/`
- Run `yarn typegen` to generate TypeScript interfaces
- Create new processor in `src/processors/` or add to existing one
- Update `squid.yaml` if adding new processor

### 3. Local Development

```bash
# Start fresh
yarn setup

# Run processor (choose one)
yarn process:oeth
yarn process:ousd
# ... etc

# In another terminal
yarn serve
```

### 4. Testing Changes

- Use GraphiQL playground at [localhost:4350/graphql](http://localhost:4350/graphql)
- Check processing times with `yarn log:processing-times`
- Validate data integrity with generated validation queries

### 5. Deployment

#### Development (v999)

```bash
# Reset dev environment (v999)
# Only use when you need to reset schema or reload data
sqd deploy . --update --hard-reset
```

#### Production Deployment

1. Create and push a new version branch

```bash
git checkout -b v80  # Replace 80 with your version number
# Make any final changes if needed
git push origin v80
```

2. Wait for the deployment to complete and validate the data

3. Tag for production

```bash
# Once validated, tag the latest commit for production
git tag prod-v80  # Replace 80 with your version number
git push origin prod-v80
```

4. Monitor deployment

- Check processing at https://app.subsquid.io/squids
- Follow release checklist at the top of this README
- Keep the version branch for reference, DO NOT DELETE

Note: Local deployment via `sqd deploy .` is possible but not recommended for production releases.

## Project conventions

Squid tools assume a certain [project layout](https://docs.subsquid.io/basics/squid-structure):

- All compiled js files must reside in `lib` and all TypeScript sources in `src`
- The layout of `lib` must reflect `src`
- All TypeORM classes must be exported by `src/model/index.ts`
- Database schema is generated from GraphQL files in `src`
- Database migrations must reside in `db/migrations` and must be plain js files
