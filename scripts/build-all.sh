#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

echo "Building lovable landing page (root Vite app)..."
npm install
npm run build

echo "Building MeetingMind frontend + backend..."
cd "$ROOT_DIR/meetingmind-ai-final/meetingmind-frontend"
if ! command -v pnpm >/dev/null 2>&1; then
  npm install -g pnpm
fi
pnpm install
pnpm build

echo "All builds completed. Artifacts:"
echo "- lovable: $ROOT_DIR/dist"
echo "- meetingmind: $ROOT_DIR/meetingmind-ai-final/meetingmind-frontend/dist/public"

