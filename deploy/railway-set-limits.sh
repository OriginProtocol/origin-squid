#!/usr/bin/env bash
# Set per-service CPU/memory caps via the Railway GraphQL API.
#
# The Railway CLI doesn't expose resource-limit settings — only the public API
# does (mutation: serviceInstanceLimitsUpdate). So this script is separate from
# the bootstrap and uses a personal access token.
#
# Prerequisites:
#   1. railway status   must show your project linked (so we can read its IDs)
#   2. Create a personal token: https://railway.com/account/tokens
#      export RAILWAY_API_TOKEN=<token>     (or put in a sourced file)
#
# Usage:
#   bash deploy/railway-set-limits.sh
#   PROCESSOR_VCPU=2 PROCESSOR_MEMORY=4 bash deploy/railway-set-limits.sh
#
# Tunables (defaults shown):
#   PROCESSOR_VCPU=4
#   PROCESSOR_MEMORY=8        (GB)
#   API_VCPU=2
#   API_MEMORY=4              (GB)
#   ENVIRONMENT_NAME=production

set -euo pipefail

PROCESSORS=(mainnet oeth ogv ousd arbitrum base oethb sonic os hyperevm)

PROCESSOR_VCPU=${PROCESSOR_VCPU:-4}
PROCESSOR_MEMORY=${PROCESSOR_MEMORY:-8}
API_VCPU=${API_VCPU:-2}
API_MEMORY=${API_MEMORY:-4}
ENVIRONMENT_NAME=${ENVIRONMENT_NAME:-production}

GQL_URL=https://backboard.railway.com/graphql/v2

c_blue=$'\033[1;34m'; c_red=$'\033[1;31m'; c_off=$'\033[0m'
log() { printf '%s==>%s %s\n' "$c_blue" "$c_off" "$*"; }
err() { printf '%sERR%s %s\n' "$c_red" "$c_off" "$*" >&2; }

# ---- preconditions ----
for c in railway jq curl; do
  command -v "$c" >/dev/null || { err "$c is required"; exit 1; }
done

if [ -z "${RAILWAY_API_TOKEN:-}" ]; then
  err "RAILWAY_API_TOKEN is required."
  err "  1. Visit https://railway.com/account/tokens"
  err "  2. Create a personal token (workspace-scoped tokens also work)"
  err "  3. export RAILWAY_API_TOKEN=<token>"
  exit 1
fi

status=$(railway status --json 2>/dev/null) || {
  err "railway status failed — is a project linked? Run from the repo root."
  exit 1
}

env_id=$(printf '%s' "$status" | jq -r --arg n "$ENVIRONMENT_NAME" \
  '.environments.edges[] | select(.node.name == $n) | .node.id')
if [ -z "$env_id" ] || [ "$env_id" = "null" ]; then
  err "couldn't find environment '$ENVIRONMENT_NAME' in linked project"
  exit 1
fi

# Build a name -> id map of services in this environment.
declare -A service_ids
while IFS=$'\t' read -r name id; do
  [ -n "$name" ] && service_ids[$name]=$id
done < <(printf '%s' "$status" | jq -r --arg n "$ENVIRONMENT_NAME" \
  '.environments.edges[]
   | select(.node.name == $n)
   | .node.serviceInstances.edges[].node
   | "\(.serviceName)\t\(.serviceId)"')

# ---- mutation ----
gql_set_limits() {
  local svc=$1 vcpu=$2 mem=$3
  local svc_id=${service_ids[$svc]:-}
  if [ -z "$svc_id" ]; then
    err "service '$svc' not found in $ENVIRONMENT_NAME — skipping"
    return 1
  fi

  local payload
  payload=$(jq -n \
    --arg s "$svc_id" --arg e "$env_id" \
    --argjson v "$vcpu" --argjson m "$mem" \
    '{
      query: "mutation($input: ServiceInstanceLimitsUpdateInput!) { serviceInstanceLimitsUpdate(input: $input) }",
      variables: { input: { serviceId: $s, environmentId: $e, vCPUs: $v, memoryGB: $m } }
    }')

  local resp
  resp=$(curl -fsS "$GQL_URL" \
    -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
    -H 'Content-Type: application/json' \
    -d "$payload") || {
    err "HTTP error setting limits on $svc"
    return 1
  }

  if printf '%s' "$resp" | jq -e '.errors' >/dev/null 2>&1; then
    err "GraphQL error setting limits on $svc:"
    printf '%s\n' "$resp" | jq '.errors' >&2
    return 1
  fi

  log "$svc: ${vcpu} vCPU / ${mem} GB"
}

# ---- apply ----
log "Environment: $ENVIRONMENT_NAME"
log "Processors: ${PROCESSOR_VCPU} vCPU / ${PROCESSOR_MEMORY} GB"
log "API:        ${API_VCPU} vCPU / ${API_MEMORY} GB"
echo

failures=0
for p in "${PROCESSORS[@]}"; do
  gql_set_limits "${p}-processor" "$PROCESSOR_VCPU" "$PROCESSOR_MEMORY" || failures=$((failures + 1))
done
gql_set_limits api "$API_VCPU" "$API_MEMORY" || failures=$((failures + 1))

echo
if [ "$failures" -gt 0 ]; then
  err "$failures service(s) failed; see errors above"
  exit 1
fi
log "Done. Limits take effect on the next deploy."
