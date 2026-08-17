import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Download, Calendar } from "lucide-react";

const metrics = [
  { label: "Total Meetings", value: "347", trend: "+18% vs last month" },
  { label: "Actions Extracted", value: "1,284", trend: "+22% vs last month" },
  { label: "Avg Confidence", value: "91.3%", trend: "+1.2% vs last month" },
  { label: "Auto-Routed", value: "78%", trend: "+5% vs last month" },
];

const weeklyData = [
  { week: "W1", meetings: 42, actions: 168 },
  { week: "W2", meetings: 38, actions: 145 },
  { week: "W3", meetings: 51, actions: 210 },
  { week: "W4", meetings: 45, actions: 192 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Meeting intelligence metrics and reports</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary/50 transition">
            <Calendar className="h-3.5 w-3.5" /> Last 30 days
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary/50 transition">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="bg-card border-border">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-2xl font-bold mt-1">{m.value}</p>
              <p className="text-xs text-primary mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />{m.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyData.map((w) => (
              <div key={w.week} className="flex items-center gap-4">
                <span className="text-xs font-mono text-muted-foreground w-8">{w.week}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-5 rounded-full bg-primary/20" style={{ width: `${(w.meetings / 55) * 100}%` }}>
                    <div className="h-full rounded-full bg-primary" style={{ width: "100%" }} />
                  </div>
                  <span className="text-xs font-semibold w-8">{w.meetings}</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-5 rounded-full bg-glow-secondary/20" style={{ width: `${(w.actions / 220) * 100}%` }}>
                    <div className="h-full rounded-full bg-glow-secondary" style={{ width: "100%" }} />
                  </div>
                  <span className="text-xs font-semibold w-8">{w.actions}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 pt-2 border-t border-border text-[10px] text-muted-foreground">
              <span className="w-8" />
              <span className="flex-1 flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Meetings</span>
              <span className="flex-1 flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-glow-secondary" /> Actions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
