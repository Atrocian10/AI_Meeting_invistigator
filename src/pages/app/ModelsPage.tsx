import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Play, BarChart3, AlertTriangle, CheckCircle, ToggleLeft } from "lucide-react";

const models = [
  { name: "gemini-3-flash-preview", provider: "Google", type: "General", status: "primary", accuracy: "94.2%", hallucination: "2.1%", latency: "0.8s", cost: "$0.003/call" },
  { name: "gemini-2.5-pro", provider: "Google", type: "Reasoning", status: "fallback", accuracy: "96.8%", hallucination: "1.4%", latency: "2.1s", cost: "$0.012/call" },
  { name: "gpt-5-mini", provider: "OpenAI", type: "General", status: "available", accuracy: "93.5%", hallucination: "2.8%", latency: "1.1s", cost: "$0.008/call" },
  { name: "gpt-5", provider: "OpenAI", type: "Complex", status: "available", accuracy: "97.1%", hallucination: "1.2%", latency: "3.2s", cost: "$0.025/call" },
];

const testCases = [
  { input: "Extract actions from sprint planning transcript", expected: "3+ actions with assignees", lastResult: "pass" },
  { input: "Summarize 45-min board meeting", expected: "< 200 words, key decisions highlighted", lastResult: "pass" },
  { input: "Q&A: 'Who is responsible for the API?'", expected: "Correct assignee with timestamp", lastResult: "warning" },
];

export default function ModelsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Models</h1>
        <p className="text-sm text-muted-foreground mt-1">Model mapping, evaluation suite, and test harness</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Model Registry</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {models.map((m) => (
            <Card key={m.name} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold font-mono">{m.name}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                    m.status === "primary" ? "bg-primary/15 text-primary" : m.status === "fallback" ? "bg-yellow-500/15 text-yellow-400" : "bg-muted text-muted-foreground"
                  }`}>{m.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{m.provider} · {m.type}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-secondary/30 rounded px-2 py-1"><span className="text-muted-foreground">Accuracy: </span><span className="font-semibold">{m.accuracy}</span></div>
                  <div className="bg-secondary/30 rounded px-2 py-1"><span className="text-muted-foreground">Halluc: </span><span className="font-semibold">{m.hallucination}</span></div>
                  <div className="bg-secondary/30 rounded px-2 py-1"><span className="text-muted-foreground">Latency: </span><span className="font-semibold">{m.latency}</span></div>
                  <div className="bg-secondary/30 rounded px-2 py-1"><span className="text-muted-foreground">Cost: </span><span className="font-semibold">{m.cost}</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Test Harness</h2>
        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-3">
            {testCases.map((t, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{t.input}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Expected: {t.expected}</p>
                </div>
                <div className="flex items-center gap-2">
                  {t.lastResult === "pass" ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  )}
                  <button className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center hover:bg-primary/25 transition">
                    <Play className="h-3 w-3 text-primary" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
