#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[check-setup] Verifying project structure..."

ERRORS=0

# 1. Check env file
if [ ! -f ".env" ]; then
  echo "❌ .env file missing. Run: cp .env.example .env"
  ERRORS=$((ERRORS+1))
else
  echo "✅ .env file exists"
fi

# 2. Check Vite base path (lovable)
if grep -q 'base:.*"/lovable/"' vite.config.ts 2>/dev/null; then
  echo "✅ Lovable vite.config.ts has correct production base path"
else
  echo "⚠️  Lovable vite.config.ts base path may need /lovable/ for production"
fi

# 3. Check nginx config
if [ -f "infra/nginx/nginx.conf" ]; then
  if grep -q '/lovable/index.html' infra/nginx/nginx.conf; then
    echo "✅ nginx try_files fallback correct for /lovable/"
  else
    echo "❌ nginx try_files should fallback to /lovable/index.html"
    ERRORS=$((ERRORS+1))
  fi
  if grep -q '/meetingmind/index.html' infra/nginx/nginx.conf; then
    echo "✅ nginx try_files fallback correct for /meetingmind/"
  else
    echo "❌ nginx try_files should fallback to /meetingmind/index.html"
    ERRORS=$((ERRORS+1))
  fi
else
  echo "❌ infra/nginx/nginx.conf not found"
  ERRORS=$((ERRORS+1))
fi

# 4. Check docker-compose
if [ -f "docker-compose.yml" ]; then
  echo "✅ docker-compose.yml exists"
else
  echo "❌ docker-compose.yml missing"
  ERRORS=$((ERRORS+1))
fi

# 5. Check mock data
if [ -d "mock-data/meetings" ] && [ -d "mock-data/transcripts" ] && [ -d "mock-data/actions" ]; then
  MEETING_COUNT=$(ls mock-data/meetings/*.json 2>/dev/null | wc -l)
  echo "✅ mock-data present: ${MEETING_COUNT} meeting files"
else
  echo "❌ mock-data directory incomplete"
  ERRORS=$((ERRORS+1))
fi

# 6. Check build artifacts
if [ -d "dist" ]; then
  echo "✅ Lovable build (dist/) exists"
else
  echo "⚠️  dist/ not found — run: npm run build"
fi

if [ -d "meetingmind-ai-final/meetingmind-frontend/dist/public" ]; then
  echo "✅ MeetingMind build exists"
else
  echo "⚠️  MeetingMind build not found — run scripts/build-all.sh"
fi

echo ""
if [ "$ERRORS" -gt 0 ]; then
  echo "❌ ${ERRORS} error(s) found. Fix before running dev-up.sh"
  exit 1
else
  echo "✅ All checks passed!"
fi
