import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Play, Pause, Clock, CheckCircle, AlertTriangle, Plus } from "lucide-react";

const workflows = [
  { name: "Daily Standup Summary", trigger: "Every weekday 10:00 AM", status: "active", lastRun: "Today 10:00 AM", result: "success", runs: 45 },
  { name: "Weekly Action Digest", trigger: "Every Monday 9:00 AM", status: "active", lastRun: "Aug 4, 9:00 AM", result: "success", runs: 12 },
  { name: "Escalation Watchdog", trigger: "Continuous — every 5 min", status: "active", lastRun: "2 min ago", result: "success", runs: 1840 },
  { name: "Stale Action Cleanup", trigger: "Every Sunday 6:00 PM", status: "paused", lastRun: "Jul 28, 6:00 PM", result: "warning", runs: 8 },
  { name: "Model Health Check", trigger: "Every 30 min", status: "active", lastRun: "15 min ago", result: "success", runs: 520 },
];

export default function AutomationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Automation</h1>
          <p className="text-sm text-muted-foreground mt-1">Scheduled workflows and batch pipelines</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition">
          <Plus className="h-3.5 w-3.5" /> New Workflow
        </button>
      </div>

      <div className="space-y-3">
        {workflows.map((w) => (
          <Card key={w.name} className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${w.status === "active" ? "bg-primary/15" : "bg-muted"}`}>
                  <Zap className={`h-4 w-4 ${w.status === "active" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{w.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{w.trigger}</span>
                    <span className="text-xs text-muted-foreground">· {w.runs} runs</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{w.lastRun}</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    {w.result === "success" ? <CheckCircle className="h-3 w-3 text-primary" /> : <AlertTriangle className="h-3 w-3 text-yellow-400" />}
                    <span className="text-[10px] text-muted-foreground">{w.result}</span>
                  </div>
                </div>
                <button className={`h-8 w-8 rounded-lg flex items-center justify-center border transition ${w.status === "active" ? "border-border hover:bg-secondary/50" : "border-primary/30 hover:bg-primary/10"}`}>
                  {w.status === "active" ? <Pause className="h-3.5 w-3.5 text-muted-foreground" /> : <Play className="h-3.5 w-3.5 text-primary" />}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
