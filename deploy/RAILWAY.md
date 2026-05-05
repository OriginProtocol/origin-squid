# Running origin-squid on Railway

Prototype recipe for self-hosting on [Railway](https://railway.com/) instead of Subsquid Cloud. Mirrors `squid.yaml`: one Postgres, 10 processor services, one public API.

All services build from the **same Dockerfile**; they differ only by the `SERVICE_ROLE` env var (and `PROCESSOR_NAME` for processors). `scripts/entrypoint.sh` dispatches at container start.

## TL;DR

```bash
# one-time, interactive
railway login
cp deploy/.env.railway.example deploy/.env.railway
$EDITOR deploy/.env.railway                    # paste in RPC URLs + any secrets

# bootstrap everything (creates the project if not already linked)
bash deploy/railway-bootstrap.sh               # add -y to skip the prompt
```

The script is idempotent — re-running it adjusts variables and triggers fresh deploys without duplicating services.

## Project naming

If no Railway project is linked when you run the script, it creates one named **`origin-squid-<git-branch>`** (e.g. `origin-squid-rw-proto` on the current branch). Override by setting `RAILWAY_PROJECT_NAME=...` in `deploy/.env.railway`, or by running `railway init --name <whatever>` yourself before invoking the script.

To deploy a second copy (e.g. to test a branch alongside main), check out that branch in a separate clone and run the script — it'll create a new project.

---

## What the script does

1. Verifies you're logged in and a project is linked to this repo.
2. Loads `deploy/.env.railway` (gitignored).
3. Adds the **Postgres** plugin if it doesn't exist.
4. For each of 10 processors (mainnet, oeth, ogv, ousd, arbitrum, base, oethb, sonic, os, hyperevm):
   - Creates a service named `<chain>-processor`.
   - Sets shared variables (`DB_*` referencing `${{Postgres.PG*}}`, RPC URLs, common config) plus per-service `SERVICE_ROLE=processor` and `PROCESSOR_NAME=<chain>`.
   - Triggers a deploy with `railway up --service ... --detach`.
5. Creates the `api` service, sets variables (with `SERVICE_ROLE=api`), generates a public `*.up.railway.app` domain, and deploys.

## Service roles (handled by `scripts/entrypoint.sh`)

| `SERVICE_ROLE` | Extra env | What runs |
|---|---|---|
| `api` | – | applies migrations, then `scripts/serve.sh` (squid-graphql-server) |
| `processor` | `PROCESSOR_NAME` | applies migrations, then `scripts/run-with-backoff.sh $PROCESSOR_NAME` |
| `migrate` | – | applies migrations, then sleeps (use only if you want a dedicated migrate service) |

Migrations are idempotent and run on every container start. TypeORM serializes concurrent migration runs via advisory locks, so parallel service starts are safe.

## Backoff behavior

`scripts/run-with-backoff.sh` keeps the container up across processor crashes:

- 5 s → 10 s → 20 s → … capped at **300 s**
- Resets to 5 s after any run that lasted ≥ 60 s
- Forwards SIGTERM so Railway redeploys drain cleanly

Override per service via `MIN_DELAY`, `MAX_DELAY`, `HEALTHY_AFTER` env vars.

The Railway-level restart policy (set in `railway.json` to `ALWAYS` with 100 retries) catches crashes of the wrapper itself or container-level failures.

---

## How Docker images are built and stored

**Default (what the bootstrap script does today):** `railway up --service <name>` tarballs the working directory, uploads it to Railway's builder, builds the image, and stores it in Railway's *internal* registry. Each service has its own build pipeline.

- **You don't push to a registry.** No GHCR / Docker Hub / ECR involved.
- **Layer caching is per-builder, project-wide.** Once the first service builds your image, the other 10 services reuse cached layers. First deploy is slow (~5-10 min); subsequent deploys are fast (~30-90 s, depending on what changed).
- **Image storage is on Railway.** You don't manage it; Railway garbage-collects old deployments according to their retention rules.
- **Wasted work:** all 11 services build the *same image* from the *same source*. With caching, the cost is mostly bandwidth (uploading the tarball 11 times). For a prototype this is fine.

**Alternative — pre-build and push to a registry:** if the duplication bothers you, build the image in CI (GitHub Actions), push to GHCR, and point each Railway service at the image URL instead of the repo. One image, no per-service build, fast deploys, but it adds a CI workflow and you have to bump the image tag on each deploy. Not worth it for the prototype; revisit once Railway proves out economically.

**Alternative — build locally and push:** for one-off deploys, `docker buildx build --platform linux/amd64 -t ghcr.io/<you>/origin-squid:dev --push .` then change each service's source to that image. Useful when iterating on the Dockerfile without burning Railway build minutes.

---

## Verification

```sql
-- per-processor progress; expect height to advance
SELECT 'mainnet-processor' AS p, height, finalized_height
  FROM "mainnet-processor".squid_processor
UNION ALL SELECT 'base-processor',     height, finalized_height FROM "base-processor".squid_processor
UNION ALL SELECT 'hyperevm-processor', height, finalized_height FROM "hyperevm-processor".squid_processor;
```

Backoff smoke-test — set a bogus RPC URL on one service:

```bash
railway service hyperevm-processor
railway variables --set RPC_HYPEREVM_ENDPOINT=https://invalid.example
railway logs
# look for: "main-hyperevm exited code=1 ... sleeping Ns before restart" with N doubling
```

Restore the real URL; after a 60 s healthy run the delay resets to 5 s.

API:
```bash
railway service api
railway domain   # prints the public URL
# open https://<domain>/graphql in a browser
```

---

## Avoiding a multi-week catch-up

A fresh Postgres makes every processor re-index from its start block. For mainnet that's nontrivial RPC + days of clock time. Before promoting Railway to production, dump from Subsquid Cloud and restore into Railway's Postgres:

```bash
pg_dump --no-owner --no-acl --format=custom \
  -d "$SQD_CLOUD_DATABASE_URL" -f squid.dump

pg_restore --no-owner --no-acl --jobs 4 \
  -d "$RAILWAY_DATABASE_URL" squid.dump
```

`scripts/dump-db.ts` and `scripts/restore-db.ts` may already do this — check before reinventing.

## Cost expectation

Rough order of magnitude:

- Postgres (≈100 GB): $50–150/mo
- 10 processors × medium: $50–150/mo total
- API: $10–20/mo
- **Total: ~$150–350/mo** vs $2,400 today

If Postgres dominates, try Neon/Supabase/RDS — only the `DB_*` variables need to change.

---

## Manual operations

Common things you'll do without re-running the bootstrap:

```bash
# Tail logs for a service
railway logs --service mainnet-processor

# Redeploy one service after a code change
railway up --service base-processor --detach

# Update one variable
railway service oeth-processor
railway variables --set RPC_ENDPOINT=https://new-url

# Run a one-off command in any service's environment
railway run --service api node -e 'console.log(process.env.DB_HOST)'

# Open Postgres shell (if external proxy is enabled on the plugin)
railway connect Postgres
```

## Adding a new processor later

1. Add `src/main-foo.ts` and corresponding `process:foo:prod` command (you'd do this for the squid regardless).
2. Append `foo` to the `PROCESSORS=( ... )` array in `deploy/railway-bootstrap.sh`.
3. Re-run `bash deploy/railway-bootstrap.sh -y`.
