import { Card, CardContent } from "@/components/ui/card";
import { Plug, CheckCircle, Plus, ExternalLink } from "lucide-react";

const integrations = [
  { name: "Slack", status: "connected", description: "Send action items and notifications to Slack channels", icon: "💬" },
  { name: "Jira", status: "connected", description: "Auto-create tickets from extracted action items", icon: "🎫" },
  { name: "Google Calendar", status: "connected", description: "Sync meeting schedules and auto-record", icon: "📅" },
  { name: "Linear", status: "available", description: "Create and track issues in Linear workspaces", icon: "📐" },
  { name: "Notion", status: "available", description: "Export summaries and notes to Notion pages", icon: "📝" },
  { name: "Microsoft Teams", status: "available", description: "Integration with Teams meetings and channels", icon: "👥" },
  { name: "GitHub", status: "available", description: "Link actions to PRs and issues", icon: "🐙" },
  { name: "PagerDuty", status: "available", description: "Route urgent escalations to on-call teams", icon: "🚨" },
  { name: "Webhooks", status: "available", description: "Custom webhook endpoints for any service", icon: "🔗" },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-sm text-muted-foreground mt-1">Connect your tools — route actions where they need to go</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((int) => (
          <Card key={int.name} className="bg-card border-border hover:border-primary/20 transition cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{int.icon}</span>
                  <span className="text-sm font-semibold">{int.name}</span>
                </div>
                {int.status === "connected" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary"><CheckCircle className="h-3 w-3" /> Connected</span>
                ) : (
                  <button className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[10px] font-medium hover:bg-secondary/50 transition">
                    <Plus className="h-3 w-3" /> Connect
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{int.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
