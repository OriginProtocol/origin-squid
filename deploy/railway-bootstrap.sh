#!/usr/bin/env bash
# Bootstrap the entire Origin Squid deployment on Railway.
#
# Idempotent: safe to re-run. Creates services / sets variables / triggers
# deploys that don't yet exist; leaves existing ones alone.
#
# Prerequisites (one-time, must be done by hand because they need a browser):
#   1. Install the Railway CLI:    https://docs.railway.com/develop/cli
#   2. railway login
#   3. From the repo root: railway init     (or: railway link <project-id>)
#   4. cp deploy/.env.railway.example deploy/.env.railway  and fill it in
#
# Then:
#   bash deploy/railway-bootstrap.sh        # interactive (asks before deploying)
#   bash deploy/railway-bootstrap.sh -y     # non-interactive
#
# To redeploy a single service later, use `railway up --service <name>` directly.

set -euo pipefail

PROCESSORS=(mainnet oeth ogv ousd arbitrum base oethb sonic os hyperevm)

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)
ENV_FILE="$SCRIPT_DIR/.env.railway"

YES=0
[[ "${1:-}" == "-y" || "${1:-}" == "--yes" ]] && YES=1

# ---------- helpers ----------
c_blue=$'\033[1;34m'; c_red=$'\033[1;31m'; c_dim=$'\033[2m'; c_off=$'\033[0m'
log() { printf '%s==>%s %s\n' "$c_blue" "$c_off" "$*"; }
warn() { printf '%sWARN%s %s\n' "$c_red" "$c_off" "$*" >&2; }
err()  { printf '%sERR%s %s\n' "$c_red" "$c_off" "$*" >&2; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { err "$1 is required (install: $2)"; exit 1; }
}

require_cli() {
  require_cmd railway "https://docs.railway.com/develop/cli"
}

default_project_name() {
  local branch
  branch=$(git -C "$REPO_ROOT" symbolic-ref --quiet --short HEAD 2>/dev/null || echo unknown)
  # Railway project names: keep it simple — alphanumerics, dash, underscore.
  branch=$(printf '%s' "$branch" | tr -c '[:alnum:]_-' '-' | sed 's/--*/-/g; s/-$//')
  printf 'origin-squid-%s' "$branch"
}

require_linked() {
  if railway status >/dev/null 2>&1; then
    log "Linked Railway project:"
    railway status 2>&1 | sed 's/^/    /'
    return 0
  fi

  local name="${RAILWAY_PROJECT_NAME:-$(default_project_name)}"
  log "No project linked; creating: $name"
  log "(override with RAILWAY_PROJECT_NAME in deploy/.env.railway)"
  if ! railway init --name "$name"; then
    err "railway init failed. Run it manually:"
    err "    railway init --name \"$name\""
    err "Then re-run this script."
    exit 1
  fi
}

require_env_file() {
  if [ ! -f "$ENV_FILE" ]; then
    err "Missing $ENV_FILE"
    err "Copy the template and fill in your secrets:"
    err "    cp deploy/.env.railway.example deploy/.env.railway"
    exit 1
  fi
  # shellcheck disable=SC1090
  set -a; . "$ENV_FILE"; set +a

  local missing=()
  for v in RPC_ENDPOINT RPC_BASE_ENDPOINT RPC_ARBITRUM_ENDPOINT RPC_SONIC_ENDPOINT RPC_HYPEREVM_ENDPOINT; do
    [ -n "${!v:-}" ] || missing+=("$v")
  done
  if [ "${#missing[@]}" -gt 0 ]; then
    err "Missing required values in $ENV_FILE: ${missing[*]}"
    exit 1
  fi
}

confirm() {
  [ "$YES" -eq 1 ] && return 0
  printf '\n%s\n' "About to bootstrap Railway with:"
  printf '  - Postgres plugin\n'
  printf '  - %d processor services (%s)\n' "${#PROCESSORS[@]}" "${PROCESSORS[*]}"
  printf '  - 1 API service (with public domain)\n\n'
  read -rp "Continue? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || { log "aborted"; exit 0; }
}

# Try to add; treat "already exists" as success.
ensure_postgres() {
  log "Ensuring Postgres plugin"
  local out
  if out=$(railway add --database postgres 2>&1); then
    printf '%s\n' "$out" | sed "s/^/${c_dim}    /; s/$/${c_off}/"
  elif printf '%s' "$out" | grep -qiE 'already|exists'; then
    printf '    %s(already provisioned)%s\n' "$c_dim" "$c_off"
  else
    err "failed to add Postgres plugin:"
    printf '%s\n' "$out" >&2
    return 1
  fi
}

ensure_service() {
  local name=$1
  local out
  if out=$(railway add --service "$name" 2>&1); then
    log "Created service: $name"
  elif printf '%s' "$out" | grep -qiE 'already|exists'; then
    log "Service exists: $name"
  else
    err "failed to create service '$name':"
    printf '%s\n' "$out" >&2
    return 1
  fi
}

# Switch the linked-service context. railway CLI v3+ accepts the name as an arg.
link_service() {
  railway service "$1" >/dev/null 2>&1 || {
    # Some CLI versions require --service:
    railway link --service "$1" >/dev/null 2>&1 || {
      err "couldn't switch to service '$1' — run 'railway service' manually to debug"
      return 1
    }
  }
}

# Common variables that every Subsquid service needs. The ${{Postgres.PG*}}
# refs are interpolated by Railway at deploy time — keep them single-quoted.
common_vars() {
  cat <<'EOV'
TS_NODE_BASEURL=./lib
IGNORE_VALIDATION=true
NODE_ENV=production
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASS=${{Postgres.PGPASSWORD}}
RPC_ENV=RPC_ENDPOINT
RPC_BASE_ENV=RPC_BASE_ENDPOINT
RPC_ARBITRUM_ENV=RPC_ARBITRUM_ENDPOINT
RPC_SONIC_ENV=RPC_SONIC_ENDPOINT
RPC_HYPEREVM_ENV=RPC_HYPEREVM_ENDPOINT
EOV
}

# Build a single `railway variables --set K=V --set K=V ...` invocation.
# Reads K=V pairs from stdin, one per line; ignores empty values.
apply_vars() {
  local svc=$1
  local args=()
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    args+=(--set "$line")
  done
  if [ "${#args[@]}" -eq 0 ]; then
    warn "no variables to set on $svc"
    return 0
  fi
  link_service "$svc"
  railway variables "${args[@]}" >/dev/null
}

# All processor + api services share the secrets block; emit it on stdout.
secrets_block() {
  cat <<EOV
RPC_ENDPOINT=${RPC_ENDPOINT}
RPC_BASE_ENDPOINT=${RPC_BASE_ENDPOINT}
RPC_ARBITRUM_ENDPOINT=${RPC_ARBITRUM_ENDPOINT}
RPC_SONIC_ENDPOINT=${RPC_SONIC_ENDPOINT}
RPC_HYPEREVM_ENDPOINT=${RPC_HYPEREVM_ENDPOINT}
NOTION_SECRET=${NOTION_SECRET:-}
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-}
EOV
}

deploy_service() {
  local svc=$1
  log "Deploying $svc"
  ( cd "$REPO_ROOT" && railway up --service "$svc" --detach )
}

# ---------- main ----------
require_cli
require_linked
require_env_file
confirm

ensure_postgres

for p in "${PROCESSORS[@]}"; do
  svc="${p}-processor"
  ensure_service "$svc"
  log "Setting variables on $svc"
  {
    common_vars
    secrets_block
    printf 'SERVICE_ROLE=processor\n'
    printf 'PROCESSOR_NAME=%s\n' "$p"
  } | apply_vars "$svc"
  deploy_service "$svc"
done

ensure_service api
log "Setting variables on api"
{
  common_vars
  secrets_block
  printf 'SERVICE_ROLE=api\n'
} | apply_vars api

log "Generating public domain for api"
link_service api
railway domain 2>&1 | sed "s/^/${c_dim}    /; s/$/${c_off}/" || \
  warn "could not create domain — run 'railway domain' manually under the api service"

deploy_service api

log "Done. Useful follow-ups:"
printf '  railway open                       # open the project in browser\n'
printf '  railway logs --service api         # tail API logs\n'
printf '  railway logs --service mainnet-processor\n'
printf '  railway run --service api psql     # connect to Postgres via the API service env\n'
