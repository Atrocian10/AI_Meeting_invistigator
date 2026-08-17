#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"

echo "Verifying health endpoints at ${BASE_URL}..."

curl -fsSL "${BASE_URL}/lovable/" >/dev/null
echo "✓ Lovable landing page reachable at ${BASE_URL}/lovable/"

curl -fsSL "${BASE_URL}/meetingmind/" >/dev/null
echo "✓ MeetingMind landing page reachable at ${BASE_URL}/meetingmind/"

if curl -fsSL "${BASE_URL}/api/health" >/dev/null 2>&1; then
  echo "✓ Backend health endpoint reachable at ${BASE_URL}/api/health"
else
  echo "⚠ Backend /api/health not responding successfully (optional, not fatal for initial integration)."
fi

