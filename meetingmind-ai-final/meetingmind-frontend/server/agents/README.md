# MeetingMind AI Agents

Production-ready AI agents for intelligent meeting analysis using Z.AI GLM-4 models.

## Architecture

### Core Agents

1. **Summarizer** (`summarizer.ts`)
   - Generates executive summaries
   - Extracts key discussion points
   - Identifies participants
   - Includes batch processing capability

2. **Action Extractor** (`actionExtractor.ts`)
   - Identifies action items
   - Extracts owners and deadlines
   - Prioritizes by urgency
   - Groups by owner

3. **Q&A Agent** (`qaAgent.ts`)
   - Answers questions about meetings
   - Provides confidence levels
   - Supports multi-turn conversations
   - Topic-based search

4. **Sentiment Analyzer** (`sentimentAnalyzer.ts`)
   - Analyzes overall sentiment
   - Topic-level sentiment breakdown
   - Identifies concerns and highlights
   - Emotional tone assessment

### Orchestrator

The `orchestrator.ts` module coordinates all agents:

```typescript
// Full analysis (all agents)
const analysis = await analyzeMeeting(transcript);

// Quick analysis (summary + actions only)
const quick = await quickAnalyzeMeeting(transcript);

// Generate formatted report
const report = generateMeetingReport(analysis);
```

## Features

### Error Handling & Retry Logic

All agents include:

- Automatic retry with exponential backoff (3 attempts by default)
- Input validation
- Timeout protection (30 seconds)
- Graceful error recovery

```typescript
import { withRetry, withTimeout } from "./utils";

const result = await withRetry(() => withTimeout(agentFunction(), 30000), {
  maxRetries: 3,
});
```

### Response Caching

Reduce API calls with built-in caching:

```typescript
import { summaryCache, qaCache } from "./cache";

// Check cache first
const cached = summaryCache.get(transcript);
if (cached) return cached;

// Process and cache result
const result = await summarizeTranscript(transcript);
summaryCache.set(transcript, result);
```

### Comprehensive Logging

Monitor agent performance:

```typescript
import { agentLogger } from "./logger";

agentLogger.info("Summarizer", "Processing transcript", { length: 5000 });
agentLogger.timing("Summarizer", "Completed", 2500);

// Get statistics
const stats = agentLogger.getStats();
```

## Usage Examples

### Basic Meeting Analysis

```typescript
import { analyzeMeeting } from "./agents/orchestrator";

const analysis = await analyzeMeeting(transcript);

console.log("Summary:", analysis.summary.summary);
console.log("Actions:", analysis.actionItems);
console.log("Sentiment:", analysis.sentiment.overallSentiment);
console.log("Processing time:", analysis.processingTime, "ms");
```

### Q&A on Meeting

```typescript
import { answerQuestionAboutMeeting } from "./agents/qaAgent";

const result = await answerQuestionAboutMeeting(
  transcript,
  "What were the main decisions?"
);

console.log("Answer:", result.answer);
console.log("Confidence:", result.confidence);
```

### Batch Processing

```typescript
import { summarizeTranscriptsBatch } from "./agents/summarizer";

const summaries = await summarizeTranscriptsBatch([
  transcript1,
  transcript2,
  transcript3,
]);
```

### Sentiment Comparison

```typescript
import { compareSentiments } from "./agents/sentimentAnalyzer";

const sentiments = await compareSentiments([transcript1, transcript2]);

sentiments.forEach((s, i) => {
  console.log(`Meeting ${i + 1}: ${s.overallSentiment}`);
});
```

## Configuration

Default configuration in `utils.ts`:

```typescript
export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  maxRetries: 3, // Number of retry attempts
  retryDelayMs: 1000, // Initial retry delay
  timeoutMs: 30000, // Operation timeout
  temperature: 0.7, // Model temperature (0.5 for Q&A)
};
```

Customize per agent:

```typescript
await withRetry(agentFn, {
  maxRetries: 5,
  retryDelayMs: 2000,
});
```

## Performance Optimization

### Cache TTL

```typescript
import { summaryCache } from "./cache";

summaryCache.setDefaultTTL(120); // 2 hours

// Cleanup expired entries
const removed = summaryCache.cleanup();
```

### Parallel Processing

All agents run in parallel via orchestrator:

```typescript
// All three agents run simultaneously
const [summary, actions, sentiment] = await Promise.all([
  summarizeTranscript(transcript),
  extractActionItems(transcript),
  analyzeSentiment(transcript),
]);
```

## Monitoring

### Agent Logs

```typescript
import { agentLogger } from "./logger";

// Get recent logs
const logs = agentLogger.getLogs({ limit: 100 });

// Filter by agent
const summarizerLogs = agentLogger.getLogs({ agent: "Summarizer" });

// Get statistics
const stats = agentLogger.getStats();
console.log(`Total logs: ${stats.totalLogs}`);
console.log(`Average duration: ${stats.averageDuration}ms`);
```

### Cache Statistics

```typescript
import { summaryCache, qaCache } from "./cache";

const stats = summaryCache.getStats();
console.log(`Cache size: ${stats.size}`);
console.log(`Total hits: ${stats.totalHits}`);
console.log(`Hit rate: ${((stats.totalHits / stats.size) * 100).toFixed(2)}%`);
```

## Error Handling

All agents throw descriptive errors:

```typescript
try {
  const result = await summarizeTranscript(transcript);
} catch (error) {
  console.error("Summarization failed:", error.message);
  // Error messages include:
  // - Validation errors (input too short/long)
  // - API errors (with retry context)
  // - Parsing errors (JSON extraction failed)
  // - Timeout errors
}
```

## Best Practices

1. **Always validate input** - Use provided validation functions
2. **Use caching** - Avoid redundant API calls
3. **Monitor performance** - Check logs and cache stats
4. **Handle errors gracefully** - Implement retry logic
5. **Batch when possible** - Process multiple items efficiently
6. **Clean up cache** - Periodically call `cleanup()`

## Integration with tRPC

```typescript
// server/routers.ts
import { analyzeMeeting } from "./agents/orchestrator";

export const appRouter = router({
  demo: router({
    processTranscript: protectedProcedure
      .input(z.object({ transcript: z.string() }))
      .mutation(async ({ input }) => {
        const analysis = await analyzeMeeting(input.transcript);
        return analysis;
      }),
  }),
});
```

## Troubleshooting

### Timeout Errors

Increase timeout for long transcripts:

```typescript
await withTimeout(agentFunction(), 60000); // 60 seconds
```

### API Errors

Check retry configuration:

```typescript
await withRetry(agentFunction, {
  maxRetries: 5,
  retryDelayMs: 2000,
});
```

### JSON Parsing Errors

Ensure response contains valid JSON:

```typescript
const jsonText = extractJson(response);
const parsed = safeJsonParse(jsonText, fallbackValue, schema);
```

## Performance Metrics

Typical performance on standard transcripts:

- **Summarization**: 2-5 seconds
- **Action Extraction**: 2-4 seconds
- **Sentiment Analysis**: 2-3 seconds
- **Q&A**: 1-3 seconds
- **Full Analysis**: 5-8 seconds (parallel)

With caching, subsequent requests: < 100ms

## Future Enhancements

- [ ] Streaming responses for long operations
- [ ] Multi-language support
- [ ] Custom model selection
- [ ] Advanced NLP features (NER, relation extraction)
- [ ] Real-time processing
- [ ] Webhook notifications
