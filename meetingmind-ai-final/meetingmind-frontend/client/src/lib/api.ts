import {
  mockSummary,
  mockActionItems,
  mockQAAnswers,
  enhancedTranscript,
} from "./mockData";

export async function processTranscript(transcript: string) {
  // Simulate network + processing cost
  await new Promise(r => setTimeout(r, 900));

  // For the marketing/demo experience we ignore the user transcript and
  // always return the canonical Q3 budget planning example. This keeps
  // the front-end deterministic while clearly illustrating each agent.
  return {
    rawTranscript: transcript,
    enhancedTranscript,
    summary: mockSummary.text,
    reasoning: mockSummary.reasoning,
    actions: mockActionItems,
  };
}

export async function answerQuestion(question: string) {
  await new Promise(r => setTimeout(r, 200));
  const q = question.trim().toLowerCase();

  for (const key of Object.keys(mockQAAnswers)) {
    if (q.includes(key)) {
      const match = mockQAAnswers[key];
      return { answer: match.answer, sources: match.sources };
    }
  }

  const fallback = mockQAAnswers.default;
  return { answer: fallback.answer, sources: fallback.sources };
}
