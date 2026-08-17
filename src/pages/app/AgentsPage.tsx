import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Activity } from "lucide-react";
import { mockAgents } from "@/lib/mockData";

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockAgents.length} AI agents — multi-agent orchestration fleet</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition">
          <Bot className="h-3.5 w-3.5" /> Create Agent
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockAgents.map((a) => (
          <Card key={a.name} className="bg-card border-border hover:border-primary/20 transition cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  {a.name}
                </CardTitle>
                <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                  a.status === "active" ? "bg-primary/15 text-primary" : a.status === "error" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"
                }`}>{a.status}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">{a.description}</p>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="bg-secondary/50 rounded px-1.5 py-0.5 text-muted-foreground font-mono">{a.model}</span>
                <span className="text-muted-foreground">{a.lastActivity}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {a.capabilities.map((c) => (
                  <span key={c} className="text-[9px] bg-primary/5 text-primary rounded px-1.5 py-0.5">{c}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-secondary/30 px-2.5 py-1.5">
                  <p className="text-[10px] text-muted-foreground">Processed</p>
                  <p className="text-sm font-semibold">{a.processed.toLocaleString()}</p>
                </div>
                <div className="rounded bg-secondary/30 px-2.5 py-1.5">
                  <p className="text-[10px] text-muted-foreground">Avg Latency</p>
                  <p className="text-sm font-semibold">{a.avgLatency}</p>
                </div>
                <div className="rounded bg-secondary/30 px-2.5 py-1.5">
                  <p className="text-[10px] text-muted-foreground">Uptime</p>
                  <p className="text-sm font-semibold">{a.uptime}</p>
                </div>
                <div className="rounded bg-secondary/30 px-2.5 py-1.5">
                  <p className="text-[10px] text-muted-foreground">Errors</p>
                  <p className={`text-sm font-semibold ${a.errors > 5 ? "text-yellow-400" : ""}`}>{a.errors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
