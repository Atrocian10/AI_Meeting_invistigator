import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Key, FileText, Settings } from "lucide-react";

const teamMembers = [
  { name: "Alice Chen", role: "Admin", email: "alice@company.com", lastActive: "Now" },
  { name: "Bob Smith", role: "Editor", email: "bob@company.com", lastActive: "2h ago" },
  { name: "Carol Davis", role: "Editor", email: "carol@company.com", lastActive: "1h ago" },
  { name: "Dave Wilson", role: "Viewer", email: "dave@company.com", lastActive: "Yesterday" },
  { name: "Eve Martinez", role: "Admin", email: "eve@company.com", lastActive: "3h ago" },
];

const auditLog = [
  { action: "Rule deployed", user: "Alice", target: "High priority routing", time: "10 min ago" },
  { action: "Agent created", user: "Eve", target: "Custom QA Agent", time: "1h ago" },
  { action: "Integration connected", user: "Bob", target: "Linear", time: "3h ago" },
  { action: "Template modified", user: "Carol", target: "Sprint Retrospective", time: "Yesterday" },
  { action: "User invited", user: "Alice", target: "frank@company.com", time: "Yesterday" },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Team management, roles, SSO, and audit logs</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-1.5"><Users className="h-4 w-4" /> Team Members</CardTitle>
            <button className="text-xs text-primary font-medium hover:underline">Invite</button>
          </CardHeader>
          <CardContent className="space-y-2">
            {teamMembers.map((m) => (
              <div key={m.email} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-semibold text-primary">{m.name[0]}</div>
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground">{m.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                    m.role === "Admin" ? "bg-primary/15 text-primary" : m.role === "Editor" ? "bg-glow-secondary/15 text-glow-secondary" : "bg-muted text-muted-foreground"
                  }`}>{m.role}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{m.lastActive}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-1.5"><FileText className="h-4 w-4" /> Audit Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {auditLog.map((a, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.user} → {a.target}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card border-border cursor-pointer hover:border-primary/20 transition">
          <CardContent className="p-4 flex items-center gap-3">
            <Key className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">SSO Configuration</p>
              <p className="text-xs text-muted-foreground">SAML / OAuth setup</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border cursor-pointer hover:border-primary/20 transition">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Security Policies</p>
              <p className="text-xs text-muted-foreground">Data retention & access</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border cursor-pointer hover:border-primary/20 transition">
          <CardContent className="p-4 flex items-center gap-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">General Settings</p>
              <p className="text-xs text-muted-foreground">Workspace configuration</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
