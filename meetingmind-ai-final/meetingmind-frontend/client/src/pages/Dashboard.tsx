import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Activity, Clock, ListChecks, MessageSquare } from "lucide-react";

export default function Dashboard() {
  return (
    <AppShell>
      <section className="space-y-6">
        <header className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80">
            Overview
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                MeetingMind Control Center
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Calm, high-signal view of meetings, actions, and automations.
                Everything here is safe to explore.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Meetings processed (24h)"
            value="128"
            delta="+12%"
            tone="positive"
            icon={Activity}
          />
          <StatCard
            label="Actions created"
            value="342"
            delta="+4%"
            tone="neutral"
            icon={ListChecks}
          />
          <StatCard
            label="Median time-to-ACK"
            value="7m 32s"
            delta="-18%"
            tone="positive"
            icon={Clock}
          />
          <StatCard
            label="Conversations needing review"
            value="6"
            delta="+2"
            tone="warning"
            icon={MessageSquare}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="relative overflow-hidden border-primary/10 bg-gradient-to-br from-primary/5 via-background to-background">
            <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold tracking-tight">
                  Live meeting stream
                </h2>
                <p className="text-xs text-muted-foreground max-w-md">
                  Recently processed meetings with summaries and top actions.
                  Use this as a working queue during your day.
                </p>
              </div>
            </div>
            <div className="space-y-2 border-t bg-background/60 p-3 sm:p-4">
              {["Q3 Budget Planning", "Customer Feedback Sync", "Launch Retro"].map(
                (title, idx) => (
                  <div
                    key={title}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-lg border bg-card/60 px-3 py-2.5 text-xs",
                      idx === 0 && "border-primary/40 shadow-sm"
                    )}
                  >
                    <div className="space-y-1">
                      <p className="font-medium leading-tight">{title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        2–3 key actions, confidence &gt; 0.85. Tap into details from
                        the Meetings view.
                      </p>
                    </div>
                    <span className="mt-0.5 inline-flex h-5 items-center rounded-full bg-primary/10 px-2 text-[10px] font-medium text-primary">
                      Ready
                    </span>
                  </div>
                )
              )}
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
              <div>
                <h2 className="text-sm font-semibold tracking-tight">
                  Routing & automation health
                </h2>
                <p className="text-xs text-muted-foreground">
                  Snapshot of rule performance, delivery, and human review load.
                </p>
              </div>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-5">
              <MiniMetric label="Rule hit rate" value="92%" hint="Last 7 days" />
              <MiniMetric label="Delivery success" value="99.3%" hint="Across all integrations" />
              <MiniMetric label="Human review queue" value="14" hint="Across teams" />
            </div>
            <div className="space-y-2 border-t px-4 pb-4 pt-3 sm:px-5">
              <Skeleton className="h-24 w-full rounded-xl bg-muted/70" />
              <p className="text-[11px] text-muted-foreground">
                Placeholder sparkline. Wire this up to your analytics endpoint or BI source.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  delta: string;
  tone: "positive" | "neutral" | "warning";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function StatCard({ label, value, delta, tone, icon: Icon }: StatCardProps) {
  const deltaTone =
    tone === "positive"
      ? "text-emerald-500 bg-emerald-500/10"
      : tone === "warning"
      ? "text-amber-500 bg-amber-500/10"
      : "text-muted-foreground bg-muted/20";

  return (
    <Card className="relative overflow-hidden border border-border/70 bg-card/80 shadow-sm">
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
            {label}
          </p>
          <p className="text-xl font-semibold tracking-tight">{value}</p>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
              deltaTone
            )}
          >
            {delta} vs. last period
          </span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );
}

type MiniMetricProps = {
  label: string;
  value: string;
  hint?: string;
};

function MiniMetric({ label, value, hint }: MiniMetricProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tracking-tight">{value}</p>
      {hint && (
        <p className="text-[11px] text-muted-foreground/80">{hint}</p>
      )}
    </div>
  );
}

