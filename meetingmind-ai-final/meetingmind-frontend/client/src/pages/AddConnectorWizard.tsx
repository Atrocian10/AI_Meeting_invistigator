import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  KeyRound,
  Lock,
  Plug,
  Shield,
  SlidersHorizontal,
  TestTube2,
} from "lucide-react";
import { useState } from "react";

type WizardStepId =
  | "type"
  | "auth"
  | "frequency"
  | "mapping"
  | "privacy"
  | "preview"
  | "finish";

const STEPS: { id: WizardStepId; label: string }[] = [
  { id: "type", label: "Choose source type" },
  { id: "auth", label: "Auth & permissions" },
  { id: "frequency", label: "Ingest frequency" },
  { id: "mapping", label: "Mapping template" },
  { id: "privacy", label: "Privacy & PII" },
  { id: "preview", label: "Test & preview" },
  { id: "finish", label: "Finish & enable" },
];

export default function AddConnectorWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStepId>("type");
  const [hasTested, setHasTested] = useState(false);
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  const goNext = () => {
    setCurrentStep(STEPS[Math.min(currentIndex + 1, STEPS.length - 1)].id);
  };

  const goPrev = () => {
    setCurrentStep(STEPS[Math.max(currentIndex - 1, 0)].id);
  };

  return (
    <AppShell>
      <section className="space-y-6" aria-label="Add connector wizard">
        <header className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80">
            Data Sources
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Add connector
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Guided setup for a new data source. You can safely test mapping
                and privacy settings before enabling ingest for agents.
              </p>
            </div>
            <Badge variant="outline" className="gap-1.5">
              <Plug className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">
                Wizard is keyboard-first
              </span>
            </Badge>
          </div>
        </header>

        <Card className="border-primary/10">
          <CardHeader className="space-y-4 border-b bg-muted/40">
            <CardTitle className="text-sm font-semibold tracking-tight">
              Connector setup
            </CardTitle>
            <ol
              className="grid gap-2 text-xs md:grid-cols-7"
              aria-label="Connector wizard steps"
            >
              {STEPS.map((step, index) => {
                const isActive = step.id === currentStep;
                const isDone = index < currentIndex;
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(step.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-full border px-2 py-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : isDone
                          ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-600"
                          : "border-border/60 bg-background/40 text-muted-foreground"
                      )}
                      aria-current={isActive ? "step" : undefined}
                    >
                      <span
                        className={cn(
                          "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-medium",
                          isActive
                            ? "border-primary bg-primary/10"
                            : isDone
                            ? "border-emerald-500 bg-emerald-500 text-background"
                            : "border-border/60 bg-background"
                        )}
                      >
                        {isDone ? <Check className="h-3 w-3" /> : index + 1}
                      </span>
                      <span className="truncate">{step.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {currentStep === "type" && <StepType />}
            {currentStep === "auth" && (
              <StepAuth hasTested={hasTested} onTest={() => setHasTested(true)} />
            )}
            {currentStep === "frequency" && <StepFrequency />}
            {currentStep === "mapping" && <StepMapping />}
            {currentStep === "privacy" && <StepPrivacy />}
            {currentStep === "preview" && <StepPreview />}
            {currentStep === "finish" && <StepFinish />}

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>
                  Changes are saved as draft until you enable the connector.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span className="text-xs">Back</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={goNext}
                  className="gap-1.5"
                >
                  <span className="text-xs">
                    {currentIndex === STEPS.length - 1 ? "Close" : "Continue"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

function StepType() {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight">
          Choose a source type
        </h2>
        <p className="text-xs text-muted-foreground">
          This determines how MeetingMind connects, what schema is expected, and
          which mapping templates are available.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Meetings & audio", hint: "Zoom-like, Teams-like" },
            { label: "Calendar", hint: "Google Calendar-like" },
            { label: "Chat & collaboration", hint: "Slack-like channels" },
            { label: "Docs & knowledge", hint: "Drive/SharePoint/KB" },
            { label: "CRM", hint: "Sales CRM-like" },
            { label: "Ticketing", hint: "Helpdesk exports" },
          ].map(option => (
            <button
              key={option.label}
              type="button"
              className="flex flex-col items-start gap-1 rounded-lg border bg-card/40 p-3 text-left text-xs hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="font-medium">{option.label}</span>
              <span className="text-[11px] text-muted-foreground">
                {option.hint}
              </span>
            </button>
          ))}
        </div>
      </div>
      <aside className="space-y-2 rounded-lg border bg-muted/40 p-3 text-[11px]">
        <p className="font-medium text-muted-foreground">
          Tailored flows per source
        </p>
        <p className="text-muted-foreground/90">
          Each connector type has its own auth and mapping expectations. Start
          with the closest match; you can refine schema and privacy in later
          steps.
        </p>
      </aside>
    </div>
  );
}

function StepAuth({
  hasTested,
  onTest,
}: {
  hasTested: boolean;
  onTest: () => void;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold tracking-tight">
            Auth &amp; permissions
          </h2>
          <p className="text-xs text-muted-foreground">
            Use the narrowest scopes that still allow read access to the data
            you need. MeetingMind never writes back unless explicitly enabled.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="auth-type">Auth method</Label>
            <Select defaultValue="oauth">
              <SelectTrigger id="auth-type" className="h-9 text-xs">
                <SelectValue placeholder="Select auth method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oauth">OAuth (recommended)</SelectItem>
                <SelectItem value="api_key">API key</SelectItem>
                <SelectItem value="file">
                  Upload credential file (JSON / config)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scopes">Requested scopes</Label>
            <Input
              id="scopes"
              className="h-9 text-xs"
              placeholder="e.g. read:meetings, read:transcripts"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={hasTested ? "outline" : "default"}
            className="gap-1.5"
            onClick={onTest}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span className="text-xs">
              {hasTested ? "Re-test connection" : "Test connection"}
            </span>
          </Button>
          {hasTested && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
              <Check className="h-3 w-3" />
              Test succeeded with sample credentials
            </span>
          )}
        </div>
      </div>
      <aside className="space-y-2 rounded-lg border bg-amber-50/80 p-3 text-[11px] text-amber-900">
        <p className="inline-flex items-center gap-1 font-medium">
          <Shield className="h-3.5 w-3.5" />
          Scope guidance
        </p>
        <p>
          MeetingMind requires read-only access for ingest. Avoid granting
          write/delete scopes unless absolutely necessary for your workflows.
        </p>
      </aside>
    </div>
  );
}

function StepFrequency() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-sm font-semibold tracking-tight">
          Ingest frequency &amp; mode
        </h2>
        <p className="text-xs text-muted-foreground">
          Choose how often MeetingMind should pull data from this source. You
          can mix real-time webhooks and scheduled batch ingest.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Real-time", hint: "Webhook / streaming" },
          { label: "Every 5 min", hint: "High-signal sources" },
          { label: "Every 15 min", hint: "Balanced" },
          { label: "Every hour", hint: "Lower priority" },
          { label: "Manual only", hint: "On-demand ingest" },
          { label: "Custom", hint: "Cron-style schedule" },
        ].map(option => (
          <button
            key={option.label}
            type="button"
            className="flex flex-col items-start gap-1 rounded-lg border bg-card/40 p-3 text-left text-xs hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-medium">{option.label}</span>
            <span className="text-[11px] text-muted-foreground">
              {option.hint}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepMapping() {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold tracking-tight">
            Mapping template
          </h2>
          <p className="text-xs text-muted-foreground">
            Start from a recommended mapping for this source type, or jump into
            the full Schema &amp; Mapping Editor for fine-grained control.
          </p>
        </div>
        <div className="space-y-3">
          <Select defaultValue="zoom_audio_default">
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Choose mapping template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zoom_audio_default">
                Meeting audio – default transcript mapping
              </SelectItem>
              <SelectItem value="calendar_default">
                Calendar – meeting metadata mapping
              </SelectItem>
              <SelectItem value="chat_threads_default">
                Chat – threaded conversation mapping
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="rounded-lg border bg-muted/40 p-3 text-[11px]">
            <p className="font-medium text-muted-foreground">
              What this template does
            </p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-muted-foreground/90">
              <li>Maps speaker ids to canonical speaker names.</li>
              <li>Normalizes timestamps into ISO-8601.</li>
              <li>Applies basic text cleanup transforms.</li>
            </ul>
          </div>
        </div>
      </div>
      <aside className="space-y-2 rounded-lg border bg-muted/40 p-3 text-[11px]">
        <p className="inline-flex items-center gap-1 font-medium text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Advanced mapping
        </p>
        <p className="text-muted-foreground/90">
          Open the full editor to adjust field-level transforms, confidence
          thresholds, and required fields for downstream agents.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 w-full justify-between"
        >
          <span className="text-xs">Open Schema &amp; Mapping Editor</span>
          <TestTube2 className="h-3.5 w-3.5" />
        </Button>
      </aside>
    </div>
  );
}

function StepPrivacy() {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold tracking-tight">
            Privacy &amp; PII defaults
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure PII detection, redaction modes, and retention before any
            new records reach agents.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pii-template">PII template</Label>
            <Select defaultValue="strict">
              <SelectTrigger id="pii-template" className="h-9 text-xs">
                <SelectValue placeholder="Select PII policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strict">Strict masking (default)</SelectItem>
                <SelectItem value="balanced">
                  Balanced redaction &amp; utility
                </SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="retention">Retention window</Label>
            <Select defaultValue="90">
              <SelectTrigger id="retention" className="h-9 text-xs">
                <SelectValue placeholder="Select retention" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">365 days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <aside className="space-y-2 rounded-lg border bg-muted/40 p-3 text-[11px]">
        <p className="inline-flex items-center gap-1 font-medium text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          Safety note
        </p>
        <p className="text-muted-foreground/90">
          Redaction is irreversible for exported data. Use the preview step to
          validate behavior before enabling ingest into production workspaces.
        </p>
      </aside>
    </div>
  );
}

function StepPreview() {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <h2 className="text-sm font-semibold tracking-tight">
          Test &amp; preview
        </h2>
        <p className="text-xs text-muted-foreground">
          Preview how a sample record flows through mapping and privacy rules.
          Toggle redaction to compare raw vs. processed views.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border bg-card/60 p-3 text-[11px]">
          <p className="mb-1 font-medium text-muted-foreground">
            Raw payload (sample)
          </p>
          <pre className="max-h-56 overflow-auto rounded-md bg-muted/60 p-2 text-[10px] leading-snug">
{`{
  "source": "meeting_platform",
  "recordId": "rec_001",
  "speaker": "u1",
  "text": "alice lets finalize q3 budget we have 50k left",
  "start_time": "2026-07-20T16:00:00Z"
}`}
          </pre>
        </div>
        <div className="space-y-2 rounded-lg border bg-card/60 p-3 text-[11px]">
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="font-medium text-muted-foreground">
              Mapped &amp; redacted preview
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1 rounded-full px-2"
            >
              <Shield className="h-3 w-3" />
              <span>Toggle redaction</span>
            </Button>
          </div>
          <pre className="max-h-56 overflow-auto rounded-md bg-muted/60 p-2 text-[10px] leading-snug">
{`{
  "meeting_id": "meeting_123",
  "timestamp": "2026-07-20T16:00:00Z",
  "speaker_name": "Alice",
  "text": "Alice: Let's finalize the Q3 marketing budget. We have $50,000 left.",
  "asr_confidence": 0.88
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

function StepFinish() {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <h2 className="text-sm font-semibold tracking-tight">
          Review &amp; enable
        </h2>
        <p className="text-xs text-muted-foreground">
          Confirm connection details, mapping, privacy defaults, and ingest
          schedule before enabling this connector for agents.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Connection"
          items={[
            "Auth: OAuth",
            "Scopes: read:meetings, read:transcripts",
            "Test: Passed just now",
          ]}
        />
        <SummaryCard
          title="Mapping"
          items={[
            "Template: Meeting audio – default",
            "Required fields: timestamp, speaker_id, text_content",
            "Transforms: whitespace, smart quotes",
          ]}
        />
        <SummaryCard
          title="Privacy &amp; ingest"
          items={[
            "PII: Strict masking",
            "Retention: 90 days",
            "Mode: Real-time webhooks",
          ]}
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-2 rounded-lg border bg-muted/40 p-3 text-[11px]">
      <p className="font-medium text-muted-foreground">{title}</p>
      <ul className="space-y-0.5 text-muted-foreground/90">
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

