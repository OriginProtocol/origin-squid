#!/usr/bin/env bash
# Runs lib/main-${NAME}.js in a supervisor loop with exponential backoff.
# Backoff resets to MIN_DELAY once a run stays up for at least HEALTHY_AFTER seconds.
#
# Usage:   scripts/run-with-backoff.sh <name>
# Example: scripts/run-with-backoff.sh mainnet  -> runs lib/main-mainnet.js
#
# Env tunables:
#   MIN_DELAY     (default 5)    seconds; first sleep after a failure
#   MAX_DELAY     (default 300)  seconds; cap for the exponential growth
#   HEALTHY_AFTER (default 60)   seconds; if the process ran at least this long, reset delay

set -u

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <main-name>" >&2
  exit 2
fi

NAME=$1
MIN=${MIN_DELAY:-5}
MAX=${MAX_DELAY:-300}
HEALTHY=${HEALTHY_AFTER:-60}
delay=$MIN

child=0
shutdown() {
  if [ "$child" -ne 0 ]; then
    kill -TERM "$child" 2>/dev/null || true
    wait "$child" 2>/dev/null || true
  fi
  exit 0
}
trap shutdown TERM INT

while true; do
  started=$(date +%s)
  node --require=tsconfig-paths/register "lib/main-${NAME}.js" &
  child=$!
  wait "$child"
  code=$?
  child=0

  ran=$(( $(date +%s) - started ))
  echo "[$(date -u +%FT%TZ)] main-${NAME} exited code=${code} after ${ran}s"

  if [ "$ran" -ge "$HEALTHY" ]; then
    delay=$MIN
  fi

  echo "[$(date -u +%FT%TZ)] sleeping ${delay}s before restart"
  sleep "$delay"

  delay=$(( delay * 2 ))
  if [ "$delay" -gt "$MAX" ]; then
    delay=$MAX
  fi
done
