#!/usr/bin/env bash
# Restart every service in a Railway environment stopped by
# deploy/railway-hibernate.sh. Redeploys each service's latest deployment;
# volumes and variables were never touched, so processors resume from their
# committed height.
#
# `railway redeploy` has no --environment flag, so the script links the target
# environment for its duration and relinks the previous one on exit.
#
# Usage:
#   bash deploy/railway-wake.sh <environment>      # e.g. railway-v164
#
# Tunables (defaults shown):
#   POSTGRES_WAIT_TIMEOUT=300   seconds to wait for Postgres before starting processors
#   POSTGRES_WAIT_INTERVAL=10

set -euo pipefail

PROCESSORS=(mainnet oeth ogv ousd arbitrum base oethb sonic os hyperevm)
POSTGRES_SERVICE=Postgres
POSTGRES_WAIT_TIMEOUT=${POSTGRES_WAIT_TIMEOUT:-300}
POSTGRES_WAIT_INTERVAL=${POSTGRES_WAIT_INTERVAL:-10}

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)

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
  err "usage: bash deploy/railway-wake.sh <environment>"
  exit 1
fi
# Version environments are named after their branch (railway-vNN). Anything
# else — production, the default environment, a typo — is refused outright.
if ! printf '%s' "$ENVIRONMENT_NAME" | grep -qE '^railway-v[0-9]+$'; then
  err "refusing to wake '$ENVIRONMENT_NAME': only version environments (railway-v<N>) are handled here"
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
  printf '%s\n' "$POSTGRES_SERVICE"
  for p in "${PROCESSORS[@]}"; do printf '%s-processor\n' "$p"; done
  printf '%s\n' api
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

# ---- environment link ----
strip_ansi() { sed -E "s/$(printf '\033')\[[0-9;]*m//g"; }

previous_env=$(railway status 2>/dev/null | strip_ansi \
  | sed -nE 's/^Environment:[[:space:]]*//p' | head -n 1)

link_environment() {
  railway environment "$1" >/dev/null 2>&1 || railway environment link "$1" >/dev/null 2>&1
}

restore_environment_link() {
  [ -n "$previous_env" ] || { warn "could not read the previously linked environment; run 'railway environment <name>' to relink"; return 0; }
  [ "$previous_env" = "$ENVIRONMENT_NAME" ] && return 0
  link_environment "$previous_env" || warn "could not relink environment '$previous_env'; run 'railway environment $previous_env'"
}

if ! link_environment "$ENVIRONMENT_NAME"; then
  err "couldn't link environment '$ENVIRONMENT_NAME'"
  exit 1
fi
trap restore_environment_link EXIT

# ---- start ----
started=()
rebuilt=()
failed=()

redeploy() {
  railway redeploy --service "$1" --yes 2>&1
}

# Latest deployment status for a service, or empty if the CLI output has no
# recognisable status field.
deployment_status() {
  railway deployment list --service "$1" --environment "$ENVIRONMENT_NAME" --json --limit 1 2>/dev/null \
    | jq -r 'first(.. | objects | select(has("status")) | .status) // empty' 2>/dev/null
}

wait_for_postgres() {
  local waited=0 s
  log "Waiting for $POSTGRES_SERVICE (timeout ${POSTGRES_WAIT_TIMEOUT}s)"
  while [ "$waited" -lt "$POSTGRES_WAIT_TIMEOUT" ]; do
    s=$(deployment_status "$POSTGRES_SERVICE")
    case "$s" in
      SUCCESS)
        printf '    %sup after %ss%s\n' "$c_dim" "$waited" "$c_off"
        return 0 ;;
      FAILED|CRASHED)
        err "$POSTGRES_SERVICE deployment is $s; check: railway logs --service $POSTGRES_SERVICE --environment $ENVIRONMENT_NAME"
        return 1 ;;
      "")
        # No status field in this CLI version's output, so a fixed wait is the
        # only signal left; an image redeploy normally settles in well under it.
        warn "couldn't read deployment status; waiting ${POSTGRES_WAIT_INTERVAL}s x 3 instead"
        sleep $((POSTGRES_WAIT_INTERVAL * 3))
        return 0 ;;
    esac
    printf '    %s%s, %ss elapsed%s\n' "$c_dim" "$s" "$waited" "$c_off"
    sleep "$POSTGRES_WAIT_INTERVAL"
    waited=$((waited + POSTGRES_WAIT_INTERVAL))
  done
  err "$POSTGRES_SERVICE not up after ${POSTGRES_WAIT_TIMEOUT}s"
  return 1
}

# Postgres is an image service with no source in this repo, so `railway up`
# can never rebuild it; if the removed deployment cannot be redeployed, the
# only remaining path is the dashboard's deployment history.
start_postgres() {
  local out
  log "Starting $POSTGRES_SERVICE"
  if out=$(redeploy "$POSTGRES_SERVICE"); then
    printf '%s\n' "$out" | sed "s/^/${c_dim}    /; s/$/${c_off}/"
    started+=("$POSTGRES_SERVICE")
    return 0
  fi
  warn "redeploy failed ($out); retrying from the configured image"
  if out=$(railway redeploy --service "$POSTGRES_SERVICE" --yes --from-source 2>&1); then
    printf '%s\n' "$out" | sed "s/^/${c_dim}    /; s/$/${c_off}/"
    started+=("$POSTGRES_SERVICE")
    return 0
  fi
  err "could not start $POSTGRES_SERVICE:"
  printf '%s\n' "$out" >&2
  err "redeploy it from the deployment history in the Railway dashboard, then re-run this script"
  return 1
}

# The `railway up` fallback builds from the working tree, so it is only a
# faithful restart when the checkout is the version this environment runs.
require_matching_checkout() {
  local branch
  branch=$(git -C "$REPO_ROOT" symbolic-ref --quiet --short HEAD 2>/dev/null || echo unknown)
  if [ "$branch" != "$ENVIRONMENT_NAME" ]; then
    err "refusing to rebuild from branch '$branch' into environment '$ENVIRONMENT_NAME'"
    err "check out '$ENVIRONMENT_NAME' and re-run"
    return 1
  fi
}

start_service() {
  local svc=$1 out
  log "Starting $svc"
  if out=$(redeploy "$svc"); then
    printf '%s\n' "$out" | sed "s/^/${c_dim}    /; s/$/${c_off}/"
    started+=("$svc")
    return 0
  fi
  warn "redeploy failed ($out); rebuilding with 'railway up' instead"
  require_matching_checkout || { failed+=("$svc"); return 0; }
  if out=$( cd "$REPO_ROOT" && railway up --detach --service "$svc" --environment "$ENVIRONMENT_NAME" 2>&1 ); then
    printf '%s\n' "$out" | sed "s/^/${c_dim}    /; s/$/${c_off}/"
    rebuilt+=("$svc")
  else
    err "failed to start $svc:"
    printf '%s\n' "$out" >&2
    failed+=("$svc")
  fi
}

log "Environment: $ENVIRONMENT_NAME"

# Postgres goes first and must be up before anything else: every other
# service runs migrations at container start and needs the database.
start_postgres
wait_for_postgres
for p in "${PROCESSORS[@]}"; do
  start_service "${p}-processor"
done
start_service api

echo
log "Summary: started ${#started[@]} (${started[*]:-none}); rebuilt ${#rebuilt[@]} (${rebuilt[*]:-none}); failed ${#failed[@]} (${failed[*]:-none})"
if [ "${#failed[@]}" -gt 0 ]; then
  err "some services could not be started; see errors above"
  exit 1
fi
