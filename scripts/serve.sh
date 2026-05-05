#!/usr/bin/env bash
# Entrypoint for the GraphQL API service.
#
# Railway injects $PORT for HTTP services; squid-graphql-server reads $GQL_PORT.
# Bridge them so the same image works on Railway, Fly, Render, or local.
set -eu

export GQL_PORT="${PORT:-${GQL_PORT:-4350}}"

# Forward signals to the child so redeploys drain cleanly.
exec npx squid-graphql-server \
  --dumb-cache in-memory \
  --dumb-cache-ttl 1000 \
  --dumb-cache-size 100 \
  --dumb-cache-max-age 1000 \
  --max-response-size 1000000
