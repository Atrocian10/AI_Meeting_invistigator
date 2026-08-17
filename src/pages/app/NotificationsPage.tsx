import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle, Clock, Settings, Mail, Smartphone, MessageSquare } from "lucide-react";

const notifications = [
  { type: "urgent", title: "Escalation: Draft LinkedIn ad copy", message: "Action overdue — assigned to Sam — escalated to team_lead", time: "5 min ago", read: false },
  { type: "alert", title: "Model latency spike", message: "gemini-3-flash-preview avg latency increased to 2.8s", time: "20 min ago", read: false },
  { type: "activity", title: "Meeting processed", message: "Sprint Planning Q3 — 5 actions extracted, 92% confidence", time: "2h ago", read: true },
  { type: "activity", title: "Action completed", message: "Create sprint board — marked done by Alice", time: "3h ago", read: true },
  { type: "alert", title: "Integration error", message: "Jira sync failed for 2 action items — retry scheduled", time: "4h ago", read: true },
  { type: "activity", title: "New conversation", message: "Carol started a thread in Design Review", time: "Yesterday", read: true },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Inbox and notification preferences</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary/50 transition">
          <Settings className="h-3.5 w-3.5" /> Preferences
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-2">
          {notifications.map((n, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-lg px-4 py-3 transition cursor-pointer ${
              !n.read ? "bg-primary/5 border border-primary/20" : "bg-card border border-border hover:bg-secondary/30"
            }`}>
              <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center mt-0.5 ${
                n.type === "urgent" ? "bg-destructive/15" : n.type === "alert" ? "bg-yellow-500/15" : "bg-secondary/50"
              }`}>
                {n.type === "urgent" ? <AlertTriangle className="h-4 w-4 text-destructive" /> :
                 n.type === "alert" ? <AlertTriangle className="h-4 w-4 text-yellow-400" /> :
                 <CheckCircle className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-foreground/80"}`}>{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
            </div>
          ))}
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Channel Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { channel: "Email", icon: Mail, enabled: true },
              { channel: "Push", icon: Smartphone, enabled: true },
              { channel: "SMS", icon: MessageSquare, enabled: false },
            ].map((c) => (
              <div key={c.channel} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <c.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{c.channel}</span>
                </div>
                <div className={`h-5 w-9 rounded-full transition cursor-pointer ${c.enabled ? "bg-primary" : "bg-muted"}`}>
                  <div className={`h-4 w-4 rounded-full bg-white shadow-sm mt-0.5 transition-transform ${c.enabled ? "translate-x-4.5 ml-0.5" : "translate-x-0.5"}`} />
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">Quiet hours</p>
              <p className="text-sm font-medium mt-0.5">10:00 PM — 7:00 AM</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
