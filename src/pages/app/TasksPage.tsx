import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare, Clock, Filter, Download } from "lucide-react";
import { mockAllActions, type ActionItemWeb3 } from "@/lib/mockData";

const statusConfig: Record<string, { title: string; color: string }> = {
  todo: { title: "To Do", color: "text-muted-foreground" },
  in_progress: { title: "In Progress", color: "text-blue-400" },
  in_review: { title: "In Review", color: "text-yellow-400" },
  done: { title: "Done", color: "text-primary" },
};

const groupByStatus = (actions: ActionItemWeb3[]) => {
  const groups: Record<string, ActionItemWeb3[]> = { todo: [], in_progress: [], in_review: [], done: [] };
  actions.forEach((a) => { (groups[a.status] ||= []).push(a); });
  return groups;
};

export default function TasksPage() {
  const grouped = groupByStatus(mockAllActions);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockAllActions.length} action items extracted from {new Set(mockAllActions.map(a => a.meeting_id)).size} meetings</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary/50 transition"><Filter className="h-3.5 w-3.5" /> Filter</button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary/50 transition"><Download className="h-3.5 w-3.5" /> Export</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(statusConfig).map(([status, cfg]) => {
          const tasks = grouped[status] || [];
          return (
            <div key={status}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold uppercase tracking-wider ${cfg.color}`}>{cfg.title}</span>
                <span className="text-[10px] bg-secondary rounded-full px-1.5 py-0.5 text-muted-foreground">{tasks.length}</span>
              </div>
              <div className="space-y-2">
                {tasks.map((t) => (
                  <Card key={t.action_id} className="bg-card border-border cursor-pointer hover:border-primary/30 transition">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium">{t.task}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] bg-secondary/50 rounded px-1.5 py-0.5 text-muted-foreground capitalize">{t.assignee}</span>
                        {t.due_date && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{new Date(t.due_date).toLocaleDateString()}</span>
                        )}
                        <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                          t.priority === "High" ? "bg-destructive/15 text-destructive" : t.priority === "Medium" ? "bg-yellow-500/15 text-yellow-400" : "bg-muted text-muted-foreground"
                        }`}>{t.priority}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1.5 truncate">From: {t.meeting_id.replace(/meeting_\d+_MM_/, "Meeting #")}</p>
                      <p className="text-[9px] font-mono text-muted-foreground mt-0.5">{Math.round(t.confidence * 100)}% confidence</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
