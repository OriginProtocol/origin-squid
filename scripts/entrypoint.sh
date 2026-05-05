#!/usr/bin/env bash
# Container entrypoint. Dispatches on $SERVICE_ROLE so a single image can run
# every Railway service (api / processor / migrate). The role is set per-service
# in the Railway env; nothing about the image needs to change between roles.
set -eu

apply_migrations() {
  # Idempotent. Subsquid's typeorm-migration uses TypeORM's migration table to
  # skip already-applied migrations, and TypeORM serializes concurrent runs via
  # advisory locks — so it's safe even when multiple services start in parallel.
  echo "[$(date -u +%FT%TZ)] applying database migrations"
  npx --no-install squid-typeorm-migration apply
}

case "${SERVICE_ROLE:-}" in
  api)
    apply_migrations
    exec ./scripts/serve.sh
    ;;
  processor)
    if [ -z "${PROCESSOR_NAME:-}" ]; then
      echo "PROCESSOR_NAME is required when SERVICE_ROLE=processor" >&2
      exit 2
    fi
    apply_migrations
    exec ./scripts/run-with-backoff.sh "$PROCESSOR_NAME"
    ;;
  migrate)
    apply_migrations
    echo "[$(date -u +%FT%TZ)] migrations done"
    # Sleep instead of exiting so Railway's auto-restart doesn't loop us.
    # Stop this service from the UI when you want it shut down.
    exec sleep infinity
    ;;
  *)
    echo "Unknown SERVICE_ROLE: '${SERVICE_ROLE:-}' — expected api|processor|migrate" >&2
    exit 2
    ;;
esac
