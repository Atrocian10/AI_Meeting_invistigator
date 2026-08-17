export interface MockActionItem {
  task: string;
  assignee: string;
  due_date: string | null;
  priority: "High" | "Medium" | "Low";
}

export interface MockSummary {
  text: string;
  reasoning: string;
}

export interface MockMeeting {
  id: string;
  title: string;
  date: string;
  raw_transcript: string;
  enhanced_transcript: string;
  summary: MockSummary;
  action_items: MockActionItem[];
}

export const transcriptSample = `Alice: Let's finalize the Q3 marketing budget. We have $50k left.
Bob: I'd allocate $20k to LinkedIn ads, $15k to content, and $15k to events.
Carol: Events team needs the money by August 10th to book venues.
Alice: Agreed. Bob, can you draft the ad copy by next Friday?
Bob: Sure, I'll have it ready by August 5th.
Carol: I'll coordinate with events and send the requirements.
Alice: Great. Let's also decide on the new landing page.
Bob: We'll need developer time. I can ask DevOps.
Alice: Perfect. Please open a ticket in Jira and tag me.`;

export const enhancedTranscript = `Alice: Let's finalize the Q3 marketing budget. We have $50,000 left.
Bob: I'd allocate $20,000 to LinkedIn ads, $15,000 to content marketing, and $15,000 to events.
Carol: Events team needs the money by August 10th to book venues.
Alice: Agreed. Bob, can you draft the ad copy by next Friday?
Bob: Sure, I'll have it ready by August 5th.
Carol: I'll coordinate with the events team and send the requirements.
Alice: Great. Let's also decide on the new landing page.
Bob: We'll need developer time. I can ask DevOps.
Alice: Perfect. Please open a ticket in Jira and tag me.`;

export const mockSummary: MockSummary = {
  text: "Budget Allocation: $50k total for Q3 marketing: $20k LinkedIn ads, $15k content, $15k events. Deadlines: Events budget needed by Aug 10; Bob's ad copy due Aug 5. Action Items: Bob to draft ad copy (due Aug 5). Carol to coordinate events requirements. Bob to create Jira ticket for landing page development.",
  reasoning:
    "The team discussed budget allocation, with Alice leading. Bob proposed specific amounts, Carol added a deadline for events. Alice confirmed and assigned tasks. The landing page discussion resulted in a Jira ticket creation. All decisions are clear.",
};

export const mockActionItems: MockActionItem[] = [
  {
    task: "Draft LinkedIn ad copy",
    assignee: "Bob",
    due_date: "2026-08-05",
    priority: "High",
  },
  {
    task: "Coordinate events requirements and venue booking",
    assignee: "Carol",
    due_date: "2026-08-10",
    priority: "Medium",
  },
  {
    task: "Open Jira ticket for landing page development",
    assignee: "Bob",
    due_date: null,
    priority: "Medium",
  },
];

export const mockQAAnswers: Record<string, { answer: string; sources: string[] }> =
  {
    "budget for linkedin": {
      answer: "The budget allocated for LinkedIn ads is $20,000.",
      sources: ["meeting_123 transcript"],
    },
    linkedin: {
      answer: "The budget allocated for LinkedIn ads is $20,000.",
      sources: ["meeting_123 transcript"],
    },
    "bob's ad copy due": {
      answer: "Bob's ad copy is due by August 5th.",
      sources: ["meeting_123 action item list"],
    },
    deadline: {
      answer:
        "Events budget is needed by August 10th and Bob's ad copy is due August 5th.",
      sources: ["meeting_123 transcript", "meeting_123 action item list"],
    },
    carol: {
      answer:
        "Carol was assigned to coordinate events requirements and venue booking by August 10th.",
      sources: ["meeting_123 action item list"],
    },
    default: {
      answer:
        "The team allocated the remaining $50,000 Q3 marketing budget across LinkedIn ads, content, and events, with key action items for Bob and Carol and deadlines in early August.",
      sources: ["meeting_123 transcript"],
    },
  };

export const mockMeetingDataset: { meetings: MockMeeting[] } = {
  meetings: [
    {
      id: "meeting_123",
      title: "Q3 Marketing Budget Planning",
      date: "2026-07-20T10:00:00Z",
      raw_transcript: transcriptSample,
      enhanced_transcript: enhancedTranscript,
      summary: mockSummary,
      action_items: mockActionItems,
    },
  ],
};
