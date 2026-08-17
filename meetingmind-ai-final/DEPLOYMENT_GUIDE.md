# MeetingMind AI - Deployment Guide

## Quick Start

### Prerequisites
- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL/TiDB database
- Z.AI API credentials

### Installation

1. **Extract and install dependencies**
```bash
unzip meetingmind-ai-final.zip
cd meetingmind-frontend
pnpm install
```

2. **Set up environment variables**
```bash
# Create .env file with:
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=your-secret-key
BUILT_IN_FORGE_API_KEY=your-z-ai-key
BUILT_IN_FORGE_API_URL=https://api.z-ai.com
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://oauth.example.com
VITE_OAUTH_PORTAL_URL=https://portal.example.com
```

3. **Initialize database**
```bash
pnpm db:push
```

4. **Start development server**
```bash
pnpm dev
```

Server runs on http://localhost:3000

### Production Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
meetingmind-frontend/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and API client
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── agents/            # AI agents
│   │   ├── summarizer.ts
│   │   ├── actionExtractor.ts
│   │   ├── qaAgent.ts
│   │   ├── sentimentAnalyzer.ts
│   │   ├── orchestrator.ts
│   │   ├── cache.ts
│   │   ├── logger.ts
│   │   └── utils.ts
│   ├── routers.ts         # tRPC routes
│   ├── db.ts              # Database helpers
│   └── _core/             # Framework internals
├── drizzle/               # Database schema
├── tests/                 # Test files
└── package.json
```

## Key Features

### AI Agents
- **Summarizer**: Executive summaries and key points
- **Action Extractor**: Tasks with owners and deadlines
- **Q&A Agent**: Answer questions about meetings
- **Sentiment Analyzer**: Emotional tone and concerns

### Backend
- tRPC API with full type safety
- MySQL database with Drizzle ORM
- Manus OAuth authentication
- Response caching (60-120 min TTL)
- Retry logic with exponential backoff
- Comprehensive logging

### Frontend
- React 19 with TypeScript
- Tailwind CSS 4 styling
- Responsive design
- Meeting history tracking
- Interactive demo

## API Endpoints

### Demo Processing
```typescript
POST /api/trpc/demo.processTranscript
{
  "transcript": "meeting transcript text"
}
```

Response:
```json
{
  "summary": "...",
  "keyPoints": ["..."],
  "actionItems": [
    {
      "title": "...",
      "owner": "...",
      "deadline": "2026-03-10",
      "priority": "high"
    }
  ],
  "sentiment": {
    "overallSentiment": "positive",
    "score": 0.75
  }
}
```

### Q&A
```typescript
POST /api/trpc/demo.answerQuestion
{
  "question": "What was discussed?"
}
```

Response:
```json
{
  "answer": "...",
  "confidence": "high"
}
```

## Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/agents/agents.test.ts

# Type check
pnpm check

# Format code
pnpm format
```

## Performance

Typical response times:
- Summarization: 2-5 seconds
- Action extraction: 2-4 seconds
- Sentiment analysis: 2-3 seconds
- Q&A: 1-3 seconds
- Full analysis: 5-8 seconds (parallel)

With caching: < 100ms

## Troubleshooting

### Database Connection Error
- Check DATABASE_URL is correct
- Verify MySQL server is running
- Ensure database exists

### API Errors
- Verify Z.AI credentials
- Check API endpoint URLs
- Review server logs

### Build Issues
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Clear cache: `pnpm store prune`
- Check Node version: `node --version` (should be 22.13.0+)

## Deployment

### Docker
```bash
docker build -t meetingmind-ai .
docker run -p 3000:3000 \
  -e DATABASE_URL=... \
  -e JWT_SECRET=... \
  meetingmind-ai
```

### Vercel
```bash
vercel deploy
```

### Railway/Render
Push to GitHub and connect repository to platform.

## Monitoring

### Agent Logs
```typescript
import { agentLogger } from "./server/agents/logger";

const stats = agentLogger.getStats();
console.log(`Total logs: ${stats.totalLogs}`);
console.log(`Average duration: ${stats.averageDuration}ms`);
```

### Cache Statistics
```typescript
import { summaryCache } from "./server/agents/cache";

const stats = summaryCache.getStats();
console.log(`Cache hits: ${stats.totalHits}`);
console.log(`Cache size: ${stats.size}`);
```

## Support

For issues or questions:
1. Check logs in `.manus-logs/`
2. Review agent documentation in `server/agents/README.md`
3. Check TypeScript types for API contracts

## License

MIT
