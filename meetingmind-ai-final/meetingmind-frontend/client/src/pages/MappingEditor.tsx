import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Brackets,
  ChevronRight,
  GripVertical,
  Search,
  Shield,
  TestTube2,
} from "lucide-react";

type Mapping = {
  source: string;
  target: string;
  transforms: string[];
};

const SAMPLE_MAPPINGS: Mapping[] = [
  {
    source: "speaker",
    target: "speaker_name",
    transforms: [],
  },
  {
    source: "start_time",
    target: "timestamp",
    transforms: ["parse_iso"],
  },
  {
    source: "audio_text",
    target: "transcript.text",
    transforms: ["normalize_whitespace", "fix_smart_quotes"],
  },
];

export default function MappingEditor() {
  return (
    <AppShell>
      <section className="space-y-6">
        <header className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80">
            Schema &amp; Mapping
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Mapping editor
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Map source fields to the MeetingMind canonical schema so agents
                receive consistent, well-structured inputs.
              </p>
            </div>
            <Badge variant="outline" className="gap-1.5">
              <TestTube2 className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">
                Preview-safe sandbox
              </span>
            </Badge>
          </div>
        </header>

        <Card className="border-primary/10">
          <CardHeader className="space-y-3 border-b bg-muted/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-sm font-semibold tracking-tight">
                zoom_audio_default
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Privacy overlay</span>
                </Button>
                <Button size="sm" className="gap-1.5">
                  <Brackets className="h-3.5 w-3.5" />
                  <span>Save mapping JSON</span>
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Drag a source field to a target, or click to edit transforms. Use
              preview to validate required fields and redaction before
              enabling.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
            <SchemaColumn
              title="Source schema"
              description="Fields discovered from the connected source."
            />
            <SchemaColumn
              title="Canonical schema"
              description="MeetingMind standard schema used by agents."
            />
            <PreviewPanel />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold tracking-tight">
              Current mappings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-hidden rounded-xl border bg-card/60">
              <ScrollArea className="max-h-64">
                <ul className="divide-y text-xs">
                  {SAMPLE_MAPPINGS.map(mapping => (
                    <li
                      key={mapping.source + mapping.target}
                      className="flex items-center gap-3 px-3 py-2.5"
                    >
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <div className="flex-1 space-y-0.5">
                        <p className="flex items-center gap-1.5">
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {mapping.source}
                          </span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                            {mapping.target}
                          </span>
                        </p>
                        {mapping.transforms.length > 0 && (
                          <p className="text-[11px] text-muted-foreground">
                            Transforms: {mapping.transforms.join(" → ")}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-[11px]"
                      >
                        Edit
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

function SchemaColumn({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card/60 p-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold">{title}</p>
          <p className="text-[11px] text-muted-foreground">{description}</p>
        </div>
        <div className="relative w-32 text-[11px]">
          <Search className="pointer-events-none absolute left-2 top-1.5 h-3 w-3 text-muted-foreground" />
          <Input
            className="h-6 rounded-full border-border/60 pl-7 pr-2 text-[11px]"
            placeholder="Search"
          />
        </div>
      </div>
      <ScrollArea className="h-64 rounded-md border bg-background/60">
        <ul className="space-y-0.5 p-2">
          {[
            "speaker",
            "speaker_id",
            "start_time",
            "end_time",
            "audio_text",
            "language",
            "asr_confidence",
            "meeting_id",
          ].map(field => (
            <li
              key={field}
              className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1 hover:bg-muted/70"
            >
              <span>{field}</span>
              <span className="text-[10px] text-muted-foreground">
                string
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}

function PreviewPanel() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card/60 p-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold">Preview</p>
          <p className="text-[11px] text-muted-foreground">
            Sample record after mapping &amp; redaction.
          </p>
        </div>
        <Badge variant="outline" className="h-6 rounded-full px-2 text-[10px]">
          Sandbox only
        </Badge>
      </div>
      <div className="rounded-md border bg-muted/60 p-2 text-[10px] leading-snug">
        <pre className="max-h-64 overflow-auto">
{`{
  "mappingName": "zoom_audio_default",
  "mappings": [
    { "source": "speaker", "target": "speaker_name", "transforms": [] },
    {
      "source": "start_time",
      "target": "timestamp",
      "transforms": ["parse_iso"]
    },
    {
      "source": "audio_text",
      "target": "transcript.text",
      "transforms": ["normalize_whitespace", "fix_smart_quotes"]
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
}

