#!/usr/bin/env bash
# Bootstrap one version of the Origin Squid on Railway.
#
# One Railway project (origin-squid) holds one environment per squid version,
# named after its branch (railway-v164). This script targets one environment:
# it creates it if missing, then creates services / sets variables / triggers
# deploys inside it. Idempotent: re-running adjusts variables and redeploys
# without duplicating services.
#
# Prerequisites (one-time, must be done by hand because they need a browser):
#   1. Install the Railway CLI:    https://docs.railway.com/develop/cli
#   2. railway login
#   3. From the repo root: railway link     (pick the origin-squid project)
#   4. cp deploy/.env.railway.example deploy/.env.railway  and fill it in
#
# Then, with the version branch checked out:
#   bash deploy/railway-bootstrap.sh        # interactive (asks before deploying)
#   bash deploy/railway-bootstrap.sh -y     # non-interactive
#
# Tunables:
#   ENVIRONMENT_NAME=railway-v164       target environment; defaults to the
#                                       current branch, must match railway-v<N>
#   RAILWAY_PROJECT_NAME=origin-squid   used only when no project is linked
#
# To redeploy a single service later:
#   railway up --service <name> --environment <env> --detach

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
  require_cmd jq "brew install jq"
}

current_branch() {
  git -C "$REPO_ROOT" symbolic-ref --quiet --short HEAD 2>/dev/null || echo unknown
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
  for v in RPC_ENDPOINT RPC_BASE_ENDPOINT RPC_ARBITRUM_ENDPOINT RPC_SONIC_ENDPOINT RPC_HYPEREVM_ENDPOINT SQD_API_KEY; do
    [ -n "${!v:-}" ] || missing+=("$v")
  done
  if [ "${#missing[@]}" -gt 0 ]; then
    err "Missing required values in $ENV_FILE: ${missing[*]}"
    exit 1
  fi
}

require_linked() {
  if railway status >/dev/null 2>&1; then
    log "Linked Railway project:"
    railway status 2>&1 | sed 's/^/    /'
    return 0
  fi

  local name="${RAILWAY_PROJECT_NAME:-origin-squid}"
  log "No project linked; creating: $name"
  log "(override with RAILWAY_PROJECT_NAME in deploy/.env.railway)"
  if ! railway init --name "$name"; then
    err "railway init failed. Run it manually:"
    err "    railway init --name \"$name\""
    err "Then re-run this script."
    exit 1
  fi
}

# ---------- environment ----------
ENVIRONMENT_NAME=${ENVIRONMENT_NAME:-$(current_branch)}

require_environment_name() {
  # Version environments are named after their branch (railway-vNN). Anything
  # else — production, the default environment, a typo — is refused outright.
  if ! printf '%s' "$ENVIRONMENT_NAME" | grep -qE '^railway-v[0-9]+$'; then
    err "refusing to bootstrap environment '$ENVIRONMENT_NAME': only version environments (railway-v<N>) are handled here"
    err "check out a railway-v<N> branch, or set ENVIRONMENT_NAME=railway-v<N>"
    exit 1
  fi
}

environment_exists() {
  railway status --json 2>/dev/null \
    | jq -e --arg n "$1" 'any(.environments.edges[]; .node.name == $n)' >/dev/null
}

strip_ansi() { sed -E "s/$(printf '\033')\[[0-9;]*m//g"; }

previous_env=""

link_environment() {
  railway environment "$1" >/dev/null 2>&1 || railway environment link "$1" >/dev/null 2>&1
}

restore_environment_link() {
  [ -n "$previous_env" ] || { warn "could not read the previously linked environment; run 'railway environment <name>' to relink"; return 0; }
  [ "$previous_env" = "$ENVIRONMENT_NAME" ] && return 0
  link_environment "$previous_env" || warn "could not relink environment '$previous_env'; run 'railway environment $previous_env'"
}

# `railway add` and `railway domain` have no --environment flag, so the target
# environment is linked for the whole run and the previous link restored on exit.
ensure_environment() {
  previous_env=$(railway status 2>/dev/null | strip_ansi \
    | sed -nE 's/^Environment:[[:space:]]*//p' | head -n 1)

  if environment_exists "$ENVIRONMENT_NAME"; then
    log "Environment exists: $ENVIRONMENT_NAME"
  else
    log "Creating environment: $ENVIRONMENT_NAME"
    railway environment new "$ENVIRONMENT_NAME" 2>&1 | sed "s/^/${c_dim}    /; s/$/${c_off}/"
    environment_exists "$ENVIRONMENT_NAME" || { err "environment '$ENVIRONMENT_NAME' not found after creation"; exit 1; }
  fi

  if ! link_environment "$ENVIRONMENT_NAME"; then
    err "couldn't link environment '$ENVIRONMENT_NAME'"
    exit 1
  fi
  trap restore_environment_link EXIT
}

confirm() {
  [ "$YES" -eq 1 ] && return 0
  printf '\n%s\n' "About to bootstrap Railway environment '$ENVIRONMENT_NAME' with:"
  printf '  - Postgres plugin\n'
  printf '  - %d processor services (%s)\n' "${#PROCESSORS[@]}" "${PROCESSORS[*]}"
  printf '  - 1 API service (with public domain)\n\n'
  read -rp "Continue? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || { log "aborted"; exit 0; }
}

# ---------- services ----------
list_service_names() {
  railway status --json 2>/dev/null \
    | jq -r --arg envname "$ENVIRONMENT_NAME" \
      '.environments.edges[]
       | select(.node.name == $envname)
       | .node.serviceInstances.edges[].node.serviceName' \
    | sort -u
}

service_exists() {
  list_service_names | grep -qFx "$1"
}

# `railway add --database postgres` does NOT fail when a Postgres already
# exists — it silently creates a duplicate (with an auto-suffix like
# "Postgres-abc1"). So check the service list first.
ensure_postgres() {
  log "Ensuring Postgres plugin"
  if list_service_names | grep -qE '^[Pp]ostgres'; then
    printf '    %s(already provisioned)%s\n' "$c_dim" "$c_off"
    return 0
  fi
  local out
  if out=$(railway add --database postgres 2>&1); then
    printf '%s\n' "$out" | sed "s/^/${c_dim}    /; s/$/${c_off}/"
  else
    err "failed to add Postgres plugin:"
    printf '%s\n' "$out" >&2
    return 1
  fi
}

ensure_service() {
  local name=$1
  if service_exists "$name"; then
    log "Service exists: $name"
    return 0
  fi
  local out
  if out=$(railway add --service "$name" 2>&1); then
    log "Created service: $name"
  else
    err "failed to create service '$name':"
    printf '%s\n' "$out" >&2
    return 1
  fi
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
# Reads K=V pairs from stdin, one per line. Skips blank lines and any pair with
# an empty value (the CLI rejects `KEY=` as invalid).
apply_vars() {
  local svc=$1
  local args=()
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    local value=${line#*=}
    [ -z "$value" ] && continue
    args+=(--set "$line")
  done
  if [ "${#args[@]}" -eq 0 ]; then
    warn "no variables to set on $svc"
    return 0
  fi
  railway variables --service "$svc" --environment "$ENVIRONMENT_NAME" "${args[@]}" >/dev/null
}

# All processor + api services share the secrets block; emit it on stdout.
# Blank optional values are dropped by apply_vars, so an unset PORTAL_URL_*
# leaves squid-utils on its default portal.
secrets_block() {
  cat <<EOV
RPC_ENDPOINT=${RPC_ENDPOINT}
RPC_BASE_ENDPOINT=${RPC_BASE_ENDPOINT}
RPC_ARBITRUM_ENDPOINT=${RPC_ARBITRUM_ENDPOINT}
RPC_SONIC_ENDPOINT=${RPC_SONIC_ENDPOINT}
RPC_HYPEREVM_ENDPOINT=${RPC_HYPEREVM_ENDPOINT}
SQD_API_KEY=${SQD_API_KEY}
PORTAL_URL_ETHEREUM=${PORTAL_URL_ETHEREUM:-}
PORTAL_URL_BASE=${PORTAL_URL_BASE:-}
PORTAL_URL_SONIC=${PORTAL_URL_SONIC:-}
PORTAL_URL_ARBITRUM=${PORTAL_URL_ARBITRUM:-}
PORTAL_URL_HYPEREVM=${PORTAL_URL_HYPEREVM:-}
NOTION_SECRET=${NOTION_SECRET:-}
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-}
EOV
}

deploy_service() {
  local svc=$1
  log "Deploying $svc"
  ( cd "$REPO_ROOT" && railway up --service "$svc" --environment "$ENVIRONMENT_NAME" --detach )
}

# ---------- main ----------
require_cli
require_env_file
require_environment_name
require_linked
ensure_environment
confirm

log "Environment: $ENVIRONMENT_NAME"

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
railway domain --service api 2>&1 | sed "s/^/${c_dim}    /; s/$/${c_off}/" || \
  warn "could not create domain — run 'railway domain --service api' with environment '$ENVIRONMENT_NAME' linked"

deploy_service api

log "Done. Useful follow-ups:"
printf '  railway open                                                 # open the project in browser\n'
printf '  railway logs --service api --environment %s\n' "$ENVIRONMENT_NAME"
printf '  railway logs --service mainnet-processor --environment %s\n' "$ENVIRONMENT_NAME"
printf '  railway run --service api --environment %s psql   # connect to Postgres via the API service env\n' "$ENVIRONMENT_NAME"
