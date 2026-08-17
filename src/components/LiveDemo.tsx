import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Send, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TRANSCRIPT = `Alice: Let's finalize the Q3 marketing budget. We have $50k left.
Bob: I'd allocate $20k to LinkedIn ads, $15k to content, and $15k to events.
Carol: Events team needs the money by August 10th to book venues.
Alice: Agreed. Bob, can you draft the ad copy by next Friday?
Bob: Sure, I'll have it ready by August 5th.
Carol: I'll coordinate with events and send the requirements.
Alice: Great. Let's also decide on the new landing page.
Bob: We'll need developer time. I can ask DevOps.
Alice: Perfect. Please open a ticket in Jira and tag me.`;

const SUGGESTED_QUESTIONS = [
  "What's the budget breakdown?",
  "When is the deadline?",
  "Who is responsible for what?",
];

interface ActionItem {
  title: string;
  owner: string;
  deadline: string;
  priority: "high" | "medium" | "low";
}

interface MeetingResult {
  summary: string;
  keyPoints: string[];
  participants: string[];
  actions: ActionItem[];
}

const LiveDemo = () => {
  const [phase, setPhase] = useState<"idle" | "processing" | "done">("idle");
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [checkedActions, setCheckedActions] = useState<boolean[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerTyping, setAnswerTyping] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProcess = useCallback(async () => {
    setPhase("processing");
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("process-meeting", {
        body: { transcript: TRANSCRIPT },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setResult(data as MeetingResult);
      setCheckedActions(new Array(data.actions?.length || 0).fill(false));
      setPhase("done");
    } catch (e: any) {
      console.error("Process error:", e);
      const msg = e?.message || "Failed to process meeting";
      setError(msg);
      toast.error(msg);
      setPhase("idle");
    }
  }, []);

  // Type out answer character by character
  useEffect(() => {
    if (answerTyping && typedAnswer.length < answer.length) {
      const t = setTimeout(() => setTypedAnswer(answer.slice(0, typedAnswer.length + 1)), 12);
      return () => clearTimeout(t);
    }
    if (answerTyping && typedAnswer.length >= answer.length) {
      setAnswerTyping(false);
    }
  }, [answerTyping, typedAnswer, answer]);

  const handleReset = () => {
    setPhase("idle");
    setResult(null);
    setCheckedActions([]);
    setQuestion("");
    setAnswer("");
    setTypedAnswer("");
    setAnswerTyping(false);
    setError("");
  };

  const handleAsk = async (q?: string) => {
    const query = q || question;
    if (!query.trim()) return;
    if (q) setQuestion(q);
    setQaLoading(true);
    setAnswer("");
    setTypedAnswer("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("meeting-qa", {
        body: { transcript: TRANSCRIPT, question: query },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setAnswer(data.answer);
      setTypedAnswer("");
      setAnswerTyping(true);
    } catch (e: any) {
      const msg = e?.message || "Failed to get answer";
      toast.error(msg);
      setAnswer(msg);
      setTypedAnswer(msg);
    } finally {
      setQaLoading(false);
    }
  };

  const toggleAction = (i: number) => {
    setCheckedActions((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <section id="demo" className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            🔥 Interactive demo — Real AI
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            See MeetingMind in action
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Click "Process" to send the transcript to our AI agents. Real summarization, action extraction, and Q&A — powered by Z.AI GLM models &amp; OpenClaw.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left: Transcript */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="terminal-bg rounded-2xl p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Raw meeting transcript
              </h3>
              <span className="text-xs text-dim font-mono">sample data</span>
            </div>
            <pre className="font-mono text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed mb-6 max-h-64 overflow-y-auto flex-1 scrollbar-thin">
              {TRANSCRIPT}
            </pre>

            <div className="flex gap-3 items-center">
              <motion.button
                onClick={handleProcess}
                disabled={phase !== "idle"}
                whileHover={phase === "idle" ? { scale: 1.03 } : {}}
                whileTap={phase === "idle" ? { scale: 0.97 } : {}}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition disabled:opacity-40 glow-primary-sm"
              >
                {phase === "processing" ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : phase === "done" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Processed
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    Process with AI
                  </>
                )}
              </motion.button>
              {phase !== "idle" && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-secondary transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </motion.button>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 mt-3 text-xs text-destructive">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </div>
            )}

            <p className="text-xs text-dim mt-4">
              ⚡ Powered by real AI agents via Z.AI GLM models &amp; OpenClaw.
            </p>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {/* Summary */}
            <div className="terminal-bg rounded-2xl p-6">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-glow-secondary" />
                AI‑generated summary
              </h3>
              <AnimatePresence mode="wait">
                {phase === "idle" ? (
                  <p className="text-sm text-dim">⏳ Click "Process" to see the AI summary...</p>
                ) : phase === "processing" ? (
                  <div className="flex items-center gap-3 text-sm text-dim">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    AI is analyzing the transcript...
                  </div>
                ) : result ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground leading-relaxed space-y-2"
                  >
                    <p className="text-foreground font-medium">{result.summary}</p>
                    {result.keyPoints?.length > 0 && (
                      <div className="space-y-1 mt-3">
                        <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Key Points</p>
                        {result.keyPoints.map((point, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-2"
                          >
                            <span className="text-primary mt-0.5">•</span>
                            <span>{point}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {result.participants?.length > 0 && (
                      <p className="text-xs text-dim mt-2">
                        <span className="font-semibold text-foreground">Participants:</span>{" "}
                        {result.participants.join(", ")}
                      </p>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="terminal-bg rounded-2xl p-6">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Extracted action items
                {result?.actions && result.actions.length > 0 && (
                  <span className="ml-auto text-xs text-dim font-mono">
                    {checkedActions.filter(Boolean).length}/{result.actions.length} done
                  </span>
                )}
              </h3>
              {phase === "idle" ? (
                <p className="text-sm text-dim">⏳ Click "Process" to see extracted tasks...</p>
              ) : phase === "processing" ? (
                <div className="text-sm text-dim">Extracting tasks...</div>
              ) : result?.actions && result.actions.length > 0 ? (
                <div className="space-y-2">
                  {result.actions.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className={`flex items-start gap-3 text-sm p-2.5 rounded-lg hover:bg-background/50 transition cursor-pointer group ${
                        checkedActions[i] ? "opacity-60" : ""
                      }`}
                      onClick={() => toggleAction(i)}
                    >
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                          checkedActions[i]
                            ? "bg-primary border-primary"
                            : "border-primary/40 group-hover:border-primary"
                        }`}
                      >
                        {checkedActions[i] && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                        )}
                      </div>
                      <div className={checkedActions[i] ? "line-through" : ""}>
                        <span className="font-semibold text-foreground">{a.owner}:</span>{" "}
                        <span className="text-muted-foreground">{a.title}</span>
                        <span className="ml-2 text-xs text-dim">📅 {a.deadline}</span>
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                          a.priority === "high" ? "bg-destructive/20 text-destructive" :
                          a.priority === "medium" ? "bg-primary/20 text-primary" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {a.priority}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dim">No action items found.</p>
              )}
            </div>

            {/* Q&A */}
            <AnimatePresence>
              {phase === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="terminal-bg rounded-2xl p-6"
                >
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Ask about this meeting
                  </h3>

                  {/* Suggested questions */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleAsk(q)}
                        disabled={qaLoading}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition disabled:opacity-40"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !qaLoading && handleAsk()}
                      placeholder="Ask anything about the meeting..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-primary transition"
                    />
                    <motion.button
                      onClick={() => handleAsk()}
                      disabled={qaLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition disabled:opacity-40"
                    >
                      {qaLoading ? <Cpu className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </motion.button>
                  </div>

                  {(typedAnswer || answerTyping || qaLoading) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-muted-foreground bg-background/50 rounded-xl p-4 border border-border"
                    >
                      {qaLoading && !typedAnswer ? (
                        <div className="flex items-center gap-2 text-dim">
                          <Cpu className="w-3.5 h-3.5 animate-spin" />
                          Thinking...
                        </div>
                      ) : (
                        <>
                          {typedAnswer}
                          {answerTyping && (
                            <span className="inline-block w-1.5 h-4 bg-primary/60 animate-pulse ml-0.5 align-middle" />
                          )}
                        </>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default LiveDemo;
