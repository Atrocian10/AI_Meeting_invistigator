import { Card, CardContent } from "@/components/ui/card";
import { FileText, Copy, Star, Plus } from "lucide-react";

const templates = [
  { name: "Sprint Retrospective", category: "Engineering", uses: 142, starred: true, description: "Standard retro format with wins, challenges, and action items" },
  { name: "Stakeholder Update", category: "Leadership", uses: 98, starred: true, description: "Executive summary with KPIs, decisions, and next steps" },
  { name: "1:1 Meeting", category: "People", uses: 234, starred: false, description: "Personal check-in with goals, blockers, and development" },
  { name: "Incident Post-Mortem", category: "Engineering", uses: 67, starred: false, description: "Root cause analysis with timeline and preventive actions" },
  { name: "Design Review", category: "Product", uses: 89, starred: false, description: "Design critique format with feedback categories and decisions" },
  { name: "Sales Call Debrief", category: "Sales", uses: 156, starred: true, description: "Prospect insights, objections, and follow-up actions" },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">Summary and action templates for different meeting types</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition">
          <Plus className="h-3.5 w-3.5" /> Create Template
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.name} className="bg-card border-border hover:border-primary/20 transition cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{t.name}</span>
                </div>
                <Star className={`h-3.5 w-3.5 ${t.starred ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
              </div>
              <p className="text-xs text-muted-foreground mb-3">{t.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-secondary/50 rounded px-1.5 py-0.5 text-muted-foreground">{t.category}</span>
                <span className="text-[10px] text-muted-foreground">{t.uses} uses</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
