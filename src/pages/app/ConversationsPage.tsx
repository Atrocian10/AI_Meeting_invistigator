import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Pin, AtSign, ArrowUpRight } from "lucide-react";

const threads = [
  { id: 1, title: "Sprint Planning Q3 — Action follow-up", messages: 12, lastActivity: "2h ago", pinned: true, meeting: "Sprint Planning Q3" },
  { id: 2, title: "Rate limiter issue discussion", messages: 8, lastActivity: "4h ago", pinned: false, meeting: "Sprint Planning Q3" },
  { id: 3, title: "Design system color tokens", messages: 5, lastActivity: "Yesterday", pinned: false, meeting: "Design Review" },
  { id: 4, title: "Stakeholder feedback — Q3 roadmap", messages: 15, lastActivity: "Yesterday", pinned: true, meeting: "Stakeholder Alignment" },
  { id: 5, title: "Incident retro follow-up actions", messages: 6, lastActivity: "2d ago", pinned: false, meeting: "Incident Retro #42" },
];

const messages = [
  { sender: "Alice", time: "2:15 PM", text: "I've updated the action items from the sprint planning. @Bob can you confirm the API timeline?" },
  { sender: "Bob", time: "2:22 PM", text: "Confirmed — token refresh endpoint will be ready by Thursday. Already on the sprint board." },
  { sender: "Carol", time: "2:30 PM", text: "Design tokens are updated. PR is up for review. Also linked the action item from the meeting." },
  { sender: "Alice", time: "2:45 PM", text: "Perfect. Let's mark those actions as in-progress. I'll update the routing rule to auto-notify on completion." },
];

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
        <p className="text-sm text-muted-foreground mt-1">Team discussions linked to meetings and actions</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-2">
          {threads.map((t) => (
            <div key={t.id} className={`rounded-lg border px-4 py-3 cursor-pointer transition ${
              t.id === 1 ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:bg-secondary/40"
            }`}>
              <div className="flex items-center gap-2">
                {t.pinned && <Pin className="h-3 w-3 text-primary" />}
                <p className="text-sm font-medium truncate">{t.title}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{t.messages} messages</span>
                <span className="text-xs text-muted-foreground">· {t.lastActivity}</span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 inline-flex items-center gap-1">
                <MessageSquare className="h-2.5 w-2.5" /> {t.meeting}
              </span>
            </div>
          ))}
        </div>

        <Card className="lg:col-span-3 bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Sprint Planning Q3 — Action follow-up</CardTitle>
            <p className="text-xs text-muted-foreground">12 messages · Linked to Sprint Planning Q3</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-7 w-7 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-semibold text-primary">{m.sender[0]}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{m.sender}</span>
                    <span className="text-[10px] text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="text-sm text-foreground/90 mt-0.5">{m.text}</p>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-border">
              <input className="w-full h-9 rounded-lg border border-border bg-secondary/30 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40" placeholder="Type a message… @mention to link actions" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
