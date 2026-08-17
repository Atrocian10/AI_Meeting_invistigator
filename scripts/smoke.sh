#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[smoke] Ensuring build artifacts exist..."
if [ ! -d "$ROOT_DIR/dist" ] || [ ! -d "$ROOT_DIR/meetingmind-ai-final/meetingmind-frontend/dist/public" ]; then
  echo "[smoke] Builds missing, running ./scripts/build-all.sh"
  ./scripts/build-all.sh
fi

echo "[smoke] Bringing up docker-compose stack..."
docker-compose up -d --build

API_HEALTH_URL="http://localhost:8080/api/health"
MAX_RETRIES=20
SLEEP_SECONDS=3

echo "[smoke] Waiting for backend health at ${API_HEALTH_URL}..."
for i in $(seq 1 "$MAX_RETRIES"); do
  if curl -fsS "$API_HEALTH_URL" >/dev/null 2>&1; then
    echo "[smoke] Health check passed."
    break
  fi
  echo "[smoke] Health not ready yet (attempt ${i}/${MAX_RETRIES}), sleeping ${SLEEP_SECONDS}s..."
  sleep "$SLEEP_SECONDS"
  if [ "$i" -eq "$MAX_RETRIES" ]; then
    echo "[smoke] ERROR: Backend health check failed after ${MAX_RETRIES} attempts."
    ./scripts/collect-logs.sh || true
    exit 1
  fi
done

echo "[smoke] Creating demo meeting..."
CREATE_RESPONSE_JSON="$(mktemp)"
curl -fsS -X POST \
  -H "Content-Type: application/json" \
  -d '{"title":"Demo meeting","transcript":"This is a demo transcript for smoke testing."}' \
  "http://localhost:8080/api/v1/meetings" \
  | tee "$CREATE_RESPONSE_JSON"

MEETING_ID="$(jq -r '.meeting_id // empty' "$CREATE_RESPONSE_JSON" || echo "")"
rm -f "$CREATE_RESPONSE_JSON"

if [ -z "$MEETING_ID" ]; then
  echo "[smoke] WARNING: Could not parse meeting_id from response, falling back to demo-meeting-1"
  MEETING_ID="demo-meeting-1"
fi

SUMMARY_URL="http://localhost:8080/api/v1/meetings/${MEETING_ID}/summary"
echo "[smoke] Polling for summary at ${SUMMARY_URL}..."

for i in $(seq 1 "$MAX_RETRIES"); do
  if curl -fsS "$SUMMARY_URL" >/dev/null 2>&1; then
    echo "[smoke] Summary endpoint responded successfully."
    echo "[smoke] PASS"
    exit 0
  fi
  echo "[smoke] Summary not ready yet (attempt ${i}/${MAX_RETRIES}), sleeping ${SLEEP_SECONDS}s..."
  sleep "$SLEEP_SECONDS"
done

echo "[smoke] ERROR: Summary endpoint did not respond successfully."
./scripts/collect-logs.sh || true
exit 1

