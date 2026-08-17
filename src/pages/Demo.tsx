import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Send, Brain } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const TRANSCRIPT = `Alice: Let's finalize the Q3 marketing budget. We have $50k left.
Bob: I'd allocate $20k to LinkedIn ads, $15k to content, and $15k to events.
Carol: Events team needs the money by August 10th to book venues.
Alice: Agreed. Bob, can you draft the ad copy by next Friday?
Bob: Sure, I'll have it ready by August 5th.
Carol: I'll coordinate with events and send the requirements.
Alice: Great. Let's also decide on the new landing page.
Bob: We'll need developer time. I can ask DevOps.
Alice: Perfect. Please open a ticket in Jira and tag me.`;

interface ActionItem {
  title: string;
  owner?: string;
  deadline?: string;
  priority: "high" | "medium" | "low";
}

interface ProcessResult {
  summary: string;
  keyPoints: string[];
  participants: string[];
  actions: ActionItem[];
}

interface SentimentHighlight {
  speaker: string;
  sentiment: "positive" | "neutral" | "negative";
  quote: string;
  reason: string;
}

interface SentimentTopic {
  topic: string;
  sentiment: "positive" | "neutral" | "negative";
  intensity: number;
}

interface SentimentResult {
  overall: "positive" | "neutral" | "negative" | "mixed";
  score: number;
  highlights: SentimentHighlight[];
  topics: SentimentTopic[];
  recommendations: string[];
}

const SUGGESTED_QUESTIONS = [
  "What were the main decisions?",
  "What's the budget breakdown?",
  "Who is responsible for what?",
];

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);

  async function onProcess() {
    setLoading(true);
    setResult(null);
    setSentiment(null);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("process-meeting", {
        body: { transcript: TRANSCRIPT },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResult(data as ProcessResult);

      // Also run sentiment analysis in parallel
      setSentimentLoading(true);
      supabase.functions.invoke("analyze-sentiment", {
        body: { transcript: TRANSCRIPT },
      }).then(({ data: sData, error: sError }) => {
        if (!sError && sData && !sData.error) {
          setSentiment(sData as SentimentResult);
        }
      }).catch(() => {}).finally(() => setSentimentLoading(false));
    } catch (err: any) {
      const msg = err?.message || "Failed to process transcript";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onAsk(q?: string) {
    const query = q || question;
    if (!query.trim()) return;
    if (q) setQuestion(q);
    setAnswerLoading(true);
    setAnswer(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("meeting-qa", {
        body: { transcript: TRANSCRIPT, question: query },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setAnswer(data.answer);
    } catch (err: any) {
      const msg = err?.message || "Failed to answer question";
      toast.error(msg);
      setAnswer(msg);
    } finally {
      setAnswerLoading(false);
    }
  }

  function onReset() {
    setResult(null);
    setAnswer(null);
    setQuestion("");
    setError(null);
    setSentiment(null);
  }

  const getSentimentColor = (s: string) => {
    switch (s) {
      case "positive": return "text-green-500";
      case "negative": return "text-red-500";
      case "mixed": return "text-yellow-500";
      default: return "text-muted-foreground";
    }
  };

  const getSentimentBg = (s: string) => {
    switch (s) {
      case "positive": return "bg-green-500/10 border-green-500/30";
      case "negative": return "bg-red-500/10 border-red-500/30";
      default: return "bg-muted/30 border-border";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-4 border-destructive bg-destructive/5";
      case "medium": return "border-l-4 border-primary bg-primary/5";
      case "low": return "border-l-4 border-muted-foreground bg-muted/30";
      default: return "border-l-4 border-border bg-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="text-sm text-primary hover:underline">← Back to home</Link>
        </div>

        <div className="mb-12 text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-4">
            🔥 Live Interactive Demo
          </span>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            See MeetingMind AI in action
          </h1>
           <p className="text-xl text-muted-foreground">
            Real transcript processing powered by <span className="font-semibold text-primary">AI Agents</span>
          </p>
          <div className="mt-2 inline-flex items-center gap-2 bg-muted/50 border border-border rounded-full px-4 py-1.5 text-xs text-muted-foreground">
            <Brain className="w-3.5 h-3.5 text-primary" />
            Function Calling · Sentiment Analysis · Meeting Q&A
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Error</p>
              <p className="text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Transcript */}
          <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Raw Meeting Transcript</h3>
            <textarea
              readOnly
              rows={12}
              value={TRANSCRIPT}
              className="w-full p-4 rounded-xl font-mono text-sm bg-muted border border-border text-muted-foreground resize-none focus:outline-none"
            />
            <div className="mt-6 flex gap-3">
              <Button onClick={onProcess} disabled={loading} className="flex-1">
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  "Process with AI"
                )}
              </Button>
              <Button onClick={onReset} variant="outline">Reset</Button>
            </div>
          </div>

          {/* Right - Results */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-primary/5 p-8 rounded-2xl shadow-lg border border-primary/20">
              <h4 className="text-lg font-bold text-foreground mb-4">Summary</h4>
              {result ? (
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
                  {result.keyPoints?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold text-foreground text-sm mb-2">Key Points</p>
                      <ul className="space-y-1">
                        {result.keyPoints.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary">•</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.participants?.length > 0 && (
                    <p className="text-xs text-dim mt-2">
                      <span className="font-semibold text-foreground">Participants:</span> {result.participants.join(", ")}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-primary font-medium">⏳ Click "Process" to see the AI summary...</p>
              )}
            </div>

            {/* Actions */}
            <div className="bg-accent/30 p-8 rounded-2xl shadow-lg border border-accent/50">
              <h4 className="text-lg font-bold text-foreground mb-4">Action Items</h4>
              {result?.actions && result.actions.length > 0 ? (
                <div className="space-y-3">
                  {result.actions.map((action, i) => (
                    <div key={i} className={`p-4 rounded-lg ${getPriorityColor(action.priority)}`}>
                      <p className="font-semibold text-foreground">{action.title}</p>
                      {action.owner && <p className="text-sm text-muted-foreground">Owner: {action.owner}</p>}
                      {action.deadline && <p className="text-sm text-muted-foreground">Deadline: {action.deadline}</p>}
                      <p className="text-xs font-semibold text-dim mt-1">Priority: {action.priority}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-accent-foreground font-medium">⏳ Click "Process" to see extracted tasks...</p>
              )}
            </div>

            {/* Q&A */}
            {result && (
              <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
                <h4 className="text-lg font-bold text-foreground mb-4">Ask about this meeting</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => onAsk(q)}
                      disabled={answerLoading}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition disabled:opacity-40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !answerLoading && onAsk()}
                    placeholder="Ask anything about the meeting..."
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={answerLoading}
                  />
                  <Button onClick={() => onAsk()} disabled={answerLoading} size="icon">
                    {answerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
                {answer && (
                  <div className="p-4 bg-muted rounded-xl border border-border text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground mb-1">Answer:</p>
                    <p>{answer}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sentiment Analysis - Full width below */}
        {(sentiment || sentimentLoading) && (
          <div className="mt-8 bg-card p-8 rounded-2xl shadow-lg border border-border">
            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Sentiment Analysis
              <span className="text-xs font-normal text-muted-foreground ml-2">by Z.AI GLM</span>
            </h4>
            {sentimentLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing sentiment...
              </div>
            ) : sentiment ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold ${getSentimentColor(sentiment.overall)}`}>
                    {sentiment.overall.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Score: <span className="font-semibold text-foreground">{sentiment.score.toFixed(2)}</span> / 1.0
                  </div>
                </div>

                {sentiment.topics?.length > 0 && (
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-2">Topic Sentiment</p>
                    <div className="flex flex-wrap gap-2">
                      {sentiment.topics.map((t, i) => (
                        <span key={i} className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${getSentimentBg(t.sentiment)}`}>
                          {t.topic} <span className={getSentimentColor(t.sentiment)}>({t.sentiment})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {sentiment.highlights?.length > 0 && (
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-2">Key Moments</p>
                    <div className="space-y-2">
                      {sentiment.highlights.map((h, i) => (
                        <div key={i} className={`p-3 rounded-lg border ${getSentimentBg(h.sentiment)}`}>
                          <p className="text-sm font-semibold text-foreground">{h.speaker}</p>
                          <p className="text-xs text-muted-foreground italic">"{h.quote}"</p>
                          <p className="text-xs text-muted-foreground mt-1">{h.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sentiment.recommendations?.length > 0 && (
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-2">Recommendations</p>
                    <ul className="space-y-1">
                      {sentiment.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary">→</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
