import { LayoutDashboard, Mic, CheckSquare, Bot, TrendingUp, Clock, AlertTriangle, ArrowUpRight, Shield, Coins, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMeetings, mockDashboardStats, mockAgentEvents, mockAllActions, mockAnchors, mockNFTs } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Meetings This Week", value: mockDashboardStats.meetingsThisWeek, change: mockDashboardStats.meetingsChange, icon: Mic },
  { label: "Actions Created", value: mockDashboardStats.actionsCreated, change: mockDashboardStats.actionsChange, icon: CheckSquare },
  { label: "Agents Active", value: mockDashboardStats.agentsActive, change: mockDashboardStats.agentsChange, icon: Bot },
  { label: "Avg Processing", value: mockDashboardStats.avgProcessing, change: mockDashboardStats.processingChange, icon: Clock },
  { label: "Anchors This Week", value: mockDashboardStats.anchorsThisWeek, change: mockDashboardStats.anchorsChange, icon: Shield },
  { label: "NFTs Minted", value: mockDashboardStats.nftsMinted, change: mockDashboardStats.nftsChange, icon: Coins },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const recentMeetings = mockMeetings.slice(0, 5);
  const pendingActions = mockAllActions.filter((a) => a.status === "todo").slice(0, 4);
  const recentEvents = mockAgentEvents.filter((e) => e.status === "success").slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Meeting intelligence + Web3 anchoring overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <s.icon className="h-5 w-5 text-muted-foreground" />
                <span className={`text-xs font-medium ${s.change.startsWith("+") ? "text-primary" : s.change.startsWith("-") ? "text-emerald-400" : "text-muted-foreground"}`}>
                  {s.change}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Meetings */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Meetings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMeetings.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(`/meetings/${m.id}`)}
                className="flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-3 transition hover:bg-secondary/50 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium">{m.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground">{m.duration} · {m.actions.length} actions</p>
                    {m.anchor && <Shield className="h-3 w-3 text-blue-400" />}
                    {m.nft && <Coins className="h-3 w-3 text-emerald-400" />}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${m.confidence >= 0.9 ? "bg-primary/15 text-primary" : "bg-yellow-500/15 text-yellow-400"}`}>
                    {Math.round(m.confidence * 100)}%
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingActions.map((a) => (
              <div key={a.action_id} className="rounded-lg bg-secondary/30 px-4 py-3">
                <p className="text-sm font-medium">{a.task}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-muted-foreground capitalize">{a.assignee}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  {a.due_date && <span className="text-xs text-muted-foreground">Due {new Date(a.due_date).toLocaleDateString()}</span>}
                  <span className={`ml-auto text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                    a.priority === "High" ? "bg-destructive/15 text-destructive" : a.priority === "Medium" ? "bg-yellow-500/15 text-yellow-400" : "bg-muted text-muted-foreground"
                  }`}>{a.priority}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Agent Event Feed */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Recent Agent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentEvents.map((evt) => (
              <div key={evt.id} className="flex items-center gap-3 rounded-lg bg-secondary/20 px-4 py-2.5 text-xs">
                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${evt.status === "success" ? "bg-emerald-400" : evt.status === "error" ? "bg-destructive" : "bg-yellow-400"}`} />
                <span className="font-mono text-muted-foreground w-32 flex-shrink-0">{new Date(evt.time).toLocaleTimeString()}</span>
                <span className="font-semibold text-foreground w-44 flex-shrink-0">{evt.agent}</span>
                <span className="text-muted-foreground">{evt.type.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
