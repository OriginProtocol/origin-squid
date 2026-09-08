#!/usr/bin/env bash
# Stop every service in one Railway environment without touching its volume,
# so an old squid version stays available as a cold rollback target.
#
# `railway down` removes a service's latest deployment: the container stops,
# the service, its variables and its volume remain. Billing drops to volume
# storage. Undo with deploy/railway-wake.sh. Only `railway environment delete`
# or `railway service delete` lose data.
#
# Usage:
#   bash deploy/railway-hibernate.sh <environment>      # e.g. railway-v164

set -euo pipefail

PROCESSORS=(mainnet oeth ogv ousd arbitrum base oethb sonic os hyperevm)
POSTGRES_SERVICE=Postgres

c_blue=$'\033[1;34m'; c_red=$'\033[1;31m'; c_dim=$'\033[2m'; c_off=$'\033[0m'
log()  { printf '%s==>%s %s\n' "$c_blue" "$c_off" "$*"; }
warn() { printf '%sWARN%s %s\n' "$c_red" "$c_off" "$*" >&2; }
err()  { printf '%sERR%s %s\n' "$c_red" "$c_off" "$*" >&2; }

# ---- preconditions ----
for c in railway jq; do
  command -v "$c" >/dev/null || { err "$c is required"; exit 1; }
done

ENVIRONMENT_NAME=${1:-}
if [ -z "$ENVIRONMENT_NAME" ]; then
  err "usage: bash deploy/railway-hibernate.sh <environment>"
  exit 1
fi
# Version environments are named after their branch (railway-vNN). Anything
# else — production, the default environment, a typo — is refused outright.
if ! printf '%s' "$ENVIRONMENT_NAME" | grep -qE '^railway-v[0-9]+$'; then
  err "refusing to hibernate '$ENVIRONMENT_NAME': only version environments (railway-v<N>) may be hibernated"
  exit 1
fi

status=$(railway status --json 2>&1) || {
  err "railway status failed — is a project linked? Run from the repo root."
  err "details:"
  printf '%s\n' "$status" >&2
  exit 1
}

env_id=$(printf '%s' "$status" | jq -r --arg n "$ENVIRONMENT_NAME" \
  '.environments.edges[] | select(.node.name == $n) | .node.id')
if [ -z "$env_id" ] || [ "$env_id" = "null" ]; then
  err "couldn't find environment '$ENVIRONMENT_NAME' in linked project"
  exit 1
fi

env_service_names() {
  printf '%s' "$status" | jq -r --arg envname "$ENVIRONMENT_NAME" \
    '.environments.edges[]
     | select(.node.name == $envname)
     | .node.serviceInstances.edges[].node.serviceName'
}

expected_services() {
  printf '%s\n' api
  for p in "${PROCESSORS[@]}"; do printf '%s-processor\n' "$p"; done
  printf '%s\n' "$POSTGRES_SERVICE"
}

missing=()
for svc in $(expected_services); do
  env_service_names | grep -qFx "$svc" || missing+=("$svc")
done
if [ "${#missing[@]}" -gt 0 ]; then
  err "environment '$ENVIRONMENT_NAME' is missing services: ${missing[*]}"
  err "nothing was changed"
  exit 1
fi

# ---- stop ----
stopped=()
skipped=()
failed=()

stop_service() {
  local svc=$1 out
  log "Stopping $svc"
  if out=$(railway down --service "$svc" --environment "$ENVIRONMENT_NAME" --yes 2>&1); then
    printf '%s\n' "$out" | sed "s/^/${c_dim}    /; s/$/${c_off}/"
    stopped+=("$svc")
  elif printf '%s' "$out" | grep -qiE 'no (active |recent )?deployment'; then
    printf '    %s(no active deployment — skipped)%s\n' "$c_dim" "$c_off"
    skipped+=("$svc")
  else
    err "failed to stop $svc:"
    printf '%s\n' "$out" >&2
    failed+=("$svc")
  fi
}

log "Environment: $ENVIRONMENT_NAME"

# Postgres goes last: processors and the api crash-loop under the ALWAYS
# restart policy if the database disappears while they are still running.
stop_service api
for p in "${PROCESSORS[@]}"; do
  stop_service "${p}-processor"
done
stop_service "$POSTGRES_SERVICE"

echo
log "Summary: stopped ${#stopped[@]} (${stopped[*]:-none}); skipped ${#skipped[@]} (${skipped[*]:-none}); failed ${#failed[@]} (${failed[*]:-none})"
if [ "${#failed[@]}" -gt 0 ]; then
  err "some services could not be stopped; see errors above"
  exit 1
fi
log "Wake with: bash deploy/railway-wake.sh $ENVIRONMENT_NAME"
