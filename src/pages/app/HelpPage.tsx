import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Book, Video, MessageCircle, ExternalLink, Search, Rocket } from "lucide-react";

const guides = [
  { title: "Getting Started", description: "Set up your first meeting pipeline in 5 minutes", icon: Rocket, tag: "Beginner" },
  { title: "Create Routing Rules", description: "Learn to build conditional action routing", icon: Book, tag: "Intermediate" },
  { title: "Agent Configuration", description: "Configure and fine-tune AI agents", icon: Book, tag: "Advanced" },
  { title: "Integrations Setup", description: "Connect Slack, Jira, and other tools", icon: Book, tag: "Beginner" },
  { title: "Model Evaluation", description: "Run test cases and compare model performance", icon: Book, tag: "Advanced" },
  { title: "Team Management", description: "Invite members, set roles, configure SSO", icon: Book, tag: "Admin" },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help & Docs</h1>
        <p className="text-sm text-muted-foreground mt-1">Guides, tutorials, and support</p>
      </div>

      <div className="relative max-w-lg">
        <input className="h-10 w-full rounded-lg border border-border bg-secondary/30 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40" placeholder="Search docs and knowledge base…" />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <Card key={g.title} className="bg-card border-border hover:border-primary/20 transition cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <g.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{g.title}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{g.description}</p>
              <span className="text-[10px] bg-secondary/50 rounded px-1.5 py-0.5 text-muted-foreground">{g.tag}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card border-border cursor-pointer hover:border-primary/20 transition">
          <CardContent className="p-4 flex items-center gap-3">
            <Video className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Video Tutorials</p>
              <p className="text-xs text-muted-foreground">Step-by-step walkthroughs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border cursor-pointer hover:border-primary/20 transition">
          <CardContent className="p-4 flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Report an Issue</p>
              <p className="text-xs text-muted-foreground">Auto-attaches current context</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border cursor-pointer hover:border-primary/20 transition">
          <CardContent className="p-4 flex items-center gap-3">
            <ExternalLink className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">API Documentation</p>
              <p className="text-xs text-muted-foreground">Developer portal & endpoints</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
