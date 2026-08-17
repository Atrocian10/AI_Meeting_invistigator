import React, { useState } from "react";
import { transcriptSample } from "../lib/mockData";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface ActionItem {
  title: string;
  owner?: string;
  deadline?: string;
  priority: "high" | "medium" | "low";
}

interface QAResponse {
  answer: string;
  confidence?: "high" | "medium" | "low";
}

export default function Demo() {
  const [transcript] = useState(transcriptSample);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [keyPoints, setKeyPoints] = useState<string[] | null>(null);
  const [actions, setActions] = useState<ActionItem[] | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<QAResponse | null>(null);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processTranscriptMutation = trpc.demo.processTranscript.useMutation();
  const answerQuestionMutation = trpc.demo.answerQuestion.useMutation();

  async function onProcess() {
    setLoading(true);
    setSummary(null);
    setKeyPoints(null);
    setActions(null);
    setError(null);
    try {
      const res = await processTranscriptMutation.mutateAsync({ transcript });
      setSummary(res.summary);
      setKeyPoints(res.keyPoints);
      setActions(res.actions);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to process transcript";
      setError(errorMsg);
      console.error("Error processing transcript:", err);
    } finally {
      setLoading(false);
    }
  }

  async function onAsk() {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }
    setAnswerLoading(true);
    setError(null);
    try {
      const res = await answerQuestionMutation.mutateAsync({ question });
      setAnswer(res);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to answer question";
      setError(errorMsg);
      console.error("Error answering question:", err);
    } finally {
      setAnswerLoading(false);
    }
  }

  function onReset() {
    setSummary(null);
    setKeyPoints(null);
    setActions(null);
    setAnswer(null);
    setQuestion("");
    setError(null);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !answerLoading) {
      onAsk();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500 bg-red-50";
      case "medium":
        return "border-l-4 border-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-4 border-green-500 bg-green-50";
      default:
        return "border-l-4 border-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-4 py-2 rounded-full mb-4">
            🔥 Live Interactive Demo with Z.AI GLM
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            See MeetingMind AI in action
          </h1>
          <p className="text-xl text-gray-600">
            Real transcript processing powered by Z.AI GLM-4 models
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Transcript Input */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Raw Meeting Transcript
            </h3>
            <textarea
              readOnly
              rows={12}
              value={transcript}
              className="w-full p-4 rounded-xl font-mono text-sm bg-gray-50 border border-gray-200 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Meeting transcript"
            />
            <div className="mt-6 flex gap-3">
              <Button
                onClick={onProcess}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all"
                aria-label={
                  loading ? "Processing transcript" : "Process with MeetingMind"
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    GLM processing...
                  </>
                ) : (
                  "Process with Z.AI GLM-4"
                )}
              </Button>
              <Button
                onClick={onReset}
                variant="outline"
                className="px-6 py-3 rounded-xl font-semibold transition-all"
                aria-label="Reset demo"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl shadow-lg border border-indigo-200"
              aria-live="polite"
              aria-label="AI generated summary"
            >
              <h4 className="text-lg font-bold text-indigo-900 mb-4">
                Summary
              </h4>
              <div className="text-gray-800 leading-relaxed">
                {summary ? (
                  <p>{summary}</p>
                ) : (
                  <p className="text-indigo-600 font-medium">
                    ⏳ Click "Process" to see the AI summary...
                  </p>
                )}
              </div>
            </div>

            {/* Key Points Card */}
            {keyPoints && keyPoints.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg border border-blue-200">
                <h4 className="text-lg font-bold text-blue-900 mb-4">
                  Key Discussion Points
                </h4>
                <ul className="space-y-2">
                  {keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold flex-shrink-0">
                        •
                      </span>
                      <span className="text-gray-800">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Items Card */}
            <div
              className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg border border-green-200"
              aria-live="polite"
              aria-label="Extracted action items"
            >
              <h4 className="text-lg font-bold text-green-900 mb-4">
                Action Items
              </h4>
              <div className="space-y-3">
                {actions && actions.length > 0 ? (
                  actions.map((action, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg ${getPriorityColor(action.priority)}`}
                    >
                      <p className="font-semibold text-gray-900">
                        {action.title}
                      </p>
                      {action.owner && (
                        <p className="text-sm text-gray-700">
                          Owner: {action.owner}
                        </p>
                      )}
                      {action.deadline && (
                        <p className="text-sm text-gray-700">
                          Deadline: {action.deadline}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-gray-600 mt-1">
                        Priority: {action.priority}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-green-600 font-medium">
                    ⏳ Click "Process" to see extracted action items...
                  </p>
                )}
              </div>
            </div>

            {/* Q&A Box */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Ask about this meeting
              </h4>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., What were the main decisions?"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  aria-label="Question about meeting"
                  disabled={answerLoading}
                />
                <Button
                  onClick={onAsk}
                  disabled={answerLoading}
                  className="px-6 py-3 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold transition-all"
                  aria-label={
                    answerLoading ? "Processing question" : "Ask question"
                  }
                >
                  {answerLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Ask"
                  )}
                </Button>
              </div>
              {answer && (
                <div
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800"
                  aria-live="polite"
                >
                  <p className="font-semibold text-gray-900 mb-2">Answer:</p>
                  <p>{answer.answer}</p>
                  {answer.confidence && (
                    <p className="text-xs text-gray-600 mt-2">
                      Confidence: {answer.confidence}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
