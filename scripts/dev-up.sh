#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

if [ ! -f ".env" ]; then
  echo ".env not found. Copying from .env.example..."
  cp .env.example .env
  echo "Remember to update secrets in .env before deploying to any shared environment."
fi

echo "Starting Docker Compose stack (nginx + meetingmind-backend + mysql)..."
docker-compose up --build

