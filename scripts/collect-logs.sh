#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

OUT_DIR="${1:-./logs}"
mkdir -p "$OUT_DIR"

echo "[logs] Collecting docker-compose logs into ${OUT_DIR}..."
if command -v docker-compose >/dev/null 2>&1; then
  docker-compose ps || true
  docker-compose logs --no-color > "${OUT_DIR}/docker-compose.log" 2>&1 || true
else
  echo "[logs] docker-compose not found, skipping container logs" | tee "${OUT_DIR}/docker-compose.log"
fi

echo "[logs] Capturing nginx and backend specific logs (if running)..."
{
  echo "===== nginx ====="
  docker-compose logs --no-color nginx 2>&1 || echo "nginx logs unavailable"
  echo
  echo "===== meetingmind-backend ====="
  docker-compose logs --no-color meetingmind-backend 2>&1 || echo "meetingmind-backend logs unavailable"
} > "${OUT_DIR}/services.log" 2>&1 || true

echo "[logs] Done."

