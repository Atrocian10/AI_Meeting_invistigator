import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Play, Save, Eye, Code, Blocks, AlertTriangle, CheckCircle } from "lucide-react";

const rules = [
  { rule: 'IF priority == "high" THEN route -> team_lead AND notify -> sms/push AFTER 0m', status: "active" },
  { rule: 'IF assignee == "unknown" THEN route -> project_channel ELSE assign', status: "active" },
  { rule: 'IF confidence < 0.6 THEN flag -> human_review', status: "active" },
  { rule: 'IF type == "blocker" THEN escalate -> on_call AND notify -> pagerduty AFTER 5m', status: "draft" },
];

const simulationSteps = [
  { step: 1, node: "Condition: priority == high", result: "true", latency: "2ms" },
  { step: 2, node: "Action: route -> team_lead", result: "routed", latency: "15ms" },
  { step: 3, node: "Action: notify -> sms/push", result: "sent", latency: "120ms" },
];

export default function RoutingPage() {
  const [mode, setMode] = useState<"visual" | "text">("text");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Routing & Orchestration</h1>
          <p className="text-sm text-muted-foreground mt-1">Visual and textual rule editor with simulation</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode("visual")} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${mode === "visual" ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary/50"}`}>
            <Blocks className="h-3.5 w-3.5" /> Visual
          </button>
          <button onClick={() => setMode("text")} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${mode === "text" ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary/50"}`}>
            <Code className="h-3.5 w-3.5" /> Text
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Rules Editor</CardTitle>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[10px] font-medium hover:bg-secondary/50 transition">
                  <Save className="h-3 w-3" /> Save Draft
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[10px] font-semibold text-primary-foreground hover:bg-primary/90 transition">
                  Deploy
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {mode === "text" ? (
                <div className="rounded-lg bg-background border border-border p-4 font-mono text-sm space-y-2">
                  {rules.map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-muted-foreground text-xs w-4 shrink-0">{i + 1}</span>
                      <code className="text-foreground/90 leading-relaxed">{r.rule}</code>
                      <span className={`ml-auto text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                        r.status === "active" ? "bg-primary/15 text-primary" : "bg-yellow-500/15 text-yellow-400"
                      }`}>{r.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-background border border-border p-8 text-center">
                  <Blocks className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Drag & drop blocks: Condition, Action, Wait, Escalate, Human Review</p>
                  <p className="text-xs text-muted-foreground mt-1">Visual canvas editor — drag blocks to create routing flows</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-1.5"><Play className="h-3.5 w-3.5 text-primary" /> Simulation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-secondary/30 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Sample Input</p>
              <p className="text-xs font-mono text-foreground/90">{"{ priority: 'high', assignee: 'team_lead' }"}</p>
            </div>
            <button className="w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition">
              Run Simulation
            </button>
            <div className="space-y-2">
              {simulationSteps.map((s) => (
                <div key={s.step} className="flex items-center gap-2 rounded bg-secondary/20 px-3 py-2">
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{s.node}</p>
                    <p className="text-[10px] text-muted-foreground">{s.result} · {s.latency}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
