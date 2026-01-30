#!/usr/bin/env bash
set -euo pipefail

# send_test_push.sh
# Usage examples:
#   API_BASE=https://localhost:4000 API_TOKEN=<token> WORKORDER_ID=<wo-id> ./send_test_push.sh
#   API_BASE=https://localhost:4000 NIPP=1960324618 PASS=secret WORKORDER_ID=<wo-id> DEVICE_TOKEN=<fcm-token> ./send_test_push.sh

API_BASE=${API_BASE:-http://localhost:4000}
API_TOKEN=${API_TOKEN:-}
NIPP=${NIPP:-}
PASS=${PASS:-}
WORKORDER_ID=${WORKORDER_ID:-}
DEVICE_TOKEN=${DEVICE_TOKEN:-}

if [[ -z "$WORKORDER_ID" ]]; then
  echo "WORKORDER_ID is required"
  echo "Set WORKORDER_ID env var and try again"
  exit 1
fi

if [[ -z "$API_TOKEN" ]]; then
  if [[ -n "$NIPP" && -n "$PASS" ]]; then
    echo "Logging in with NIPP to obtain API token..."
    resp=$(curl -sS -X POST "$API_BASE/api/auth/login" -H 'Content-Type: application/json' -d "{\"nipp\":\"$NIPP\",\"password\":\"$PASS\"}")
    API_TOKEN=$(echo "$resp" | sed -n 's/.*"accessToken"\s*:\s*"\([^"]\+\)".*/\1/p' || true)
    if [[ -z "$API_TOKEN" ]]; then
      API_TOKEN=$(echo "$resp" | sed -n 's/.*"token"\s*:\s*"\([^"]\+\)".*/\1/p' || true)
    fi
    if [[ -z "$API_TOKEN" ]]; then
      echo "Failed to login or extract token. Response: $resp"
      exit 1
    fi
    echo "Got API token"
  else
    echo "Provide API_TOKEN or NIPP+PASS to login. Aborting."
    exit 1
  fi
fi

AUTH_HEADER="Authorization: Bearer $API_TOKEN"

if [[ -n "$DEVICE_TOKEN" ]]; then
  echo "Registering device token to backend..."
  curl -sS -X POST "$API_BASE/api/device-tokens" -H "$AUTH_HEADER" -H 'Content-Type: application/json' -d "{\"token\":\"$DEVICE_TOKEN\",\"platform\":\"android\"}" | jq . || true
  echo
fi

echo "Triggering deploy for work order $WORKORDER_ID..."
curl -sS -X POST "$API_BASE/api/work-orders/$WORKORDER_ID/deploy" -H "$AUTH_HEADER" -H 'Content-Type: application/json' -d '{}' | jq . || true

echo "Done. Check backend logs for pushNotify output and device for notifications."
