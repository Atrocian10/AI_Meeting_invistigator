# Debugging Guide — MeetingMind AI

## Quick Diagnostics

### Collect logs on failure

```bash
./scripts/collect-logs.sh
# Creates artifacts/logs.tgz with backend, nginx, and database logs
```

### Check setup

```bash
./scripts/check-setup.sh
# Validates .env, nginx config, build artifacts, mock data
```

## Common Errors & Fixes

### 404 on `/lovable/` or `/meetingmind/`

**Cause:** Build artifacts missing or nginx `try_files` incorrect.

**Fix:**
1. Ensure builds exist: `ls dist/` and `ls meetingmind-ai-final/meetingmind-frontend/dist/public/`
2. If missing, run `./scripts/build-all.sh`
3. Verify `vite.config.ts` has `base: '/lovable/'` for production
4. Verify nginx `try_files` falls back to `/lovable/index.html` (not `/index.html`)

### 502 Bad Gateway on `/api/`

**Cause:** Backend container not running or binding to wrong address.

**Fix:**
1. `docker-compose logs meetingmind-backend` — check for startup errors
2. Ensure backend binds to `0.0.0.0` (not `127.0.0.1`)
3. Check `DATABASE_URL` is set in `.env`
4. Verify port matches nginx upstream (default: 3000)

### CORS errors in browser console

**Cause:** Backend doesn't allow the frontend origin.

**Fix:**
1. Add `Access-Control-Allow-Origin: *` for dev (already in edge functions)
2. For production, whitelist specific origins
3. Ensure OPTIONS preflight handler exists

### Model API returns 401/Unknown Model

**Cause:** API key invalid or model ID incorrect.

**Fix:**
1. Set `MOCK_MODE=true` in `.env` to bypass external API calls
2. Or update `ZAI_API_KEY` with valid credentials
3. The Lovable AI gateway (Gemini) is used as fallback

### Database connection errors

**Cause:** MySQL/Postgres not ready or `DATABASE_URL` misconfigured.

**Fix:**
1. `docker-compose logs mysql` — check if DB is initialized
2. Verify `DATABASE_URL` format: `mysql://user:pass@mysql:3306/meetingmind`
3. Backend has retry logic but may timeout if DB takes >60s to start

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Database connection string |
| `JWT_SECRET` | Yes | Secret for JWT signing |
| `MOCK_MODE` | No | Set `true` to use mock model responses |
| `VITE_USE_MOCK` | No | Set `true` for frontend mock data |
| `ZAI_API_KEY` | No | Z.AI API key (format: `id.secret`) |
| `ZAI_BASE_URL` | No | Z.AI API base URL |

## Mock Mode

When `MOCK_MODE=true`:
- Transcription endpoint returns deterministic transcript from `mock-data/transcripts/`
- Summary endpoint returns pre-computed summary from `mock-data/summaries/`
- No external API calls are made
- Useful for CI, demos, and offline development

## Seed Mock Data

```bash
node scripts/seed-mock-data.js
# Outputs created meeting IDs for testing
```
