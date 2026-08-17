import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Circle, Plug, RefreshCw, Shield, TestTube2 } from "lucide-react";
import { Link } from "wouter";

type SourceStatus = "healthy" | "degraded" | "failed";

type DataSource = {
  id: string;
  name: string;
  type: string;
  status: SourceStatus;
  lastIngest: string;
  recordsPerDay: string;
  owner: string;
};

const MOCK_SOURCES: DataSource[] = [
  {
    id: "zoom_meetings",
    name: "Meeting platform – Zoom-like",
    type: "Meetings & audio",
    status: "healthy",
    lastIngest: "2 min ago",
    recordsPerDay: "128",
    owner: "RevOps",
  },
  {
    id: "calendar_primary",
    name: "Calendar – Primary workspace",
    type: "Calendar",
    status: "healthy",
    lastIngest: "5 min ago",
    recordsPerDay: "412",
    owner: "Ops",
  },
  {
    id: "chat_collab",
    name: "Chat – Collaboration hub",
    type: "Chat & collaboration",
    status: "degraded",
    lastIngest: "27 min ago",
    recordsPerDay: "2.1k",
    owner: "CS",
  },
  {
    id: "crm_core",
    name: "CRM – Core customer data",
    type: "CRM",
    status: "failed",
    lastIngest: "3 h ago",
    recordsPerDay: "980",
    owner: "Sales Ops",
  },
];

export default function DataSourcesIndex() {
  return (
    <AppShell>
      <section className="space-y-6">
        <header className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80">
            Data Sources
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Connected data sources
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Discover, test, and manage the systems that feed MeetingMind AI.
                Mapping, privacy, and monitoring are always one click away.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span className="text-xs">Privacy &amp; PII rules</span>
              </Button>
              <Link href="/data-sources/add">
                <Button size="sm" className="gap-1.5">
                  <Plug className="h-3.5 w-3.5" />
                  <span className="text-xs">Add connector</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-primary/10 bg-gradient-to-br from-primary/5 via-background to-background">
            <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold tracking-tight">
                  Source health overview
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Status, last ingest, and record volume across your workspace.
                </p>
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-hidden rounded-xl border bg-card/50">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="w-[36%]">Source</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Last ingest
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Records / day
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Owner
                      </TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_SOURCES.map(source => (
                      <TableRow
                        key={source.id}
                        className="cursor-pointer hover:bg-muted/40"
                      >
                        <TableCell className="font-medium">
                          <Link
                            href={`/data-sources/${source.id}`}
                            className="hover:underline"
                          >
                            {source.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {source.type}
                          </span>
                        </TableCell>
                        <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                          {source.lastIngest}
                        </TableCell>
                        <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                          {source.recordsPerDay}
                        </TableCell>
                        <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                          {source.owner}
                        </TableCell>
                        <TableCell className="text-right">
                          <SourceStatusPill status={source.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold tracking-tight">
                  Quick checks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <QuickCheckRow
                  label="All meeting audio sources healthy"
                  status="pass"
                />
                <QuickCheckRow
                  label="Schema mappings validated"
                  status="warn"
                  hint="1 source missing required timestamp"
                />
                <QuickCheckRow
                  label="Privacy &amp; PII rules applied"
                  status="pass"
                />
                <QuickCheckRow
                  label="Recent ingest failures"
                  status="fail"
                  hint="CRM connector auth expired"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold tracking-tight">
                  Mapping &amp; privacy shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <Link href="/data-sources/mapping">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                  >
                    <span>Open Schema &amp; Mapping Editor</span>
                    <TestTube2 className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <p className="text-[11px] text-muted-foreground">
                  Map heterogeneous fields into the MeetingMind canonical schema
                  and preview transforms before enabling for production agents.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function SourceStatusPill({ status }: { status: SourceStatus }) {
  const tone =
    status === "healthy"
      ? "text-emerald-500 bg-emerald-500/10"
      : status === "degraded"
      ? "text-amber-500 bg-amber-500/10"
      : "text-red-500 bg-red-500/10";

  const label =
    status === "healthy"
      ? "Healthy"
      : status === "degraded"
      ? "Degraded"
      : "Failed";

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-0 px-2 py-0.5 text-[11px] font-medium",
        tone
      )}
    >
      <Circle className="h-2 w-2 fill-current" />
      {label}
    </Badge>
  );
}

type QuickStatus = "pass" | "warn" | "fail";

function QuickCheckRow({
  label,
  status,
  hint,
}: {
  label: string;
  status: QuickStatus;
  hint?: string;
}) {
  const tone =
    status === "pass"
      ? "text-emerald-500"
      : status === "warn"
      ? "text-amber-500"
      : "text-red-500";

  return (
    <div className="flex items-start justify-between gap-2 rounded-md bg-muted/40 px-2.5 py-1.5">
      <div className="space-y-0.5">
        <p className="text-xs font-medium">{label}</p>
        {hint && (
          <p className="text-[11px] text-muted-foreground/90">{hint}</p>
        )}
      </div>
      <span className={cn("mt-0.5 text-[11px] font-medium", tone)}>
        {status === "pass" ? "OK" : status === "warn" ? "Check" : "Attention"}
      </span>
    </div>
  );
}

