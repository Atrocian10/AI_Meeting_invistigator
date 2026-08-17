import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, FileText } from "lucide-react";

// Mock meetings data for display
const MOCK_MEETINGS = [
  {
    id: 1,
    title: "Q3 Marketing Budget Planning",
    date: "2026-07-20",
    summary: "Budget Allocation: $50k total for Q3 marketing: $20k LinkedIn ads, $15k content, $15k events. Events budget needed by Aug 10; Bob's ad copy due Aug 5.",
    actions: [
      { title: "Draft LinkedIn ad copy", owner: "Bob", deadline: "Aug 5" },
      { title: "Coordinate events requirements", owner: "Carol", deadline: "Aug 10" },
      { title: "Open Jira ticket for landing page", owner: "Bob", deadline: "ASAP" },
    ],
  },
  {
    id: 2,
    title: "Customer Feedback Sync",
    date: "2026-07-18",
    summary: "Reviewed top customer pain points from Q2 surveys. NPS improved to 72. Key ask: faster onboarding flow.",
    actions: [
      { title: "Revamp onboarding wizard", owner: "Design team", deadline: "Aug 15" },
      { title: "Schedule follow-up with top 5 accounts", owner: "Sarah", deadline: "Jul 25" },
    ],
  },
  {
    id: 3,
    title: "Product Launch Retrospective",
    date: "2026-07-15",
    summary: "V2.0 launch went smoothly. 12% increase in sign-ups vs projection. Post-launch hotfix needed for SSO.",
    actions: [
      { title: "Fix SSO callback bug", owner: "Engineering", deadline: "Jul 20" },
      { title: "Write launch blog post", owner: "Marketing", deadline: "Jul 22" },
    ],
  },
];

export default function MeetingsPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = MOCK_MEETINGS.find((m) => m.id === selectedId);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Link to="/" className="text-sm text-primary hover:underline">← Back to home</Link>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Meeting History</h1>
          <p className="text-xl text-muted-foreground">View and manage your processed meetings</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* List */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">Your Meetings</h2>
              <div className="space-y-2">
                {MOCK_MEETINGS.map((meeting) => (
                  <button
                    key={meeting.id}
                    onClick={() => setSelectedId(meeting.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedId === meeting.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{meeting.title}</p>
                        <p className="text-xs text-muted-foreground">{meeting.date}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="space-y-6">
                <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">{selected.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{selected.summary}</p>
                </div>

                <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">Action Items</h3>
                  <div className="space-y-3">
                    {selected.actions.map((action, i) => (
                      <div key={i} className="p-4 bg-muted/30 rounded-lg border border-border">
                        <p className="font-semibold text-foreground">{action.title}</p>
                        <p className="text-sm text-muted-foreground">Owner: {action.owner}</p>
                        <p className="text-sm text-muted-foreground">Deadline: {action.deadline}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card p-8 rounded-2xl shadow-lg border border-border flex items-center justify-center h-96">
                <div className="text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Select a meeting to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
