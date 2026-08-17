import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Automated Meeting Joining",
    description: "Securely joins scheduled meetings via calendar integration. OAuth with Google, Outlook, and Microsoft Teams.",
    benefits: ["Calendar sync", "Automatic joining", "Secure authentication"],
  },
  {
    title: "Real-Time Transcription & Enhancement",
    description: "Uses AI to clean and structure raw speech-to-text output with speaker labels and timestamps.",
    benefits: ["Live transcription", "Speaker identification", "Error correction"],
  },
  {
    title: "Smart Summarization",
    description: "Generates concise, topic-based summaries with key decisions and context.",
    benefits: ["Key decisions extracted", "Topic-based organization", "Context preservation"],
  },
  {
    title: "Action Item Extraction",
    description: "Identifies tasks, owners, and deadlines, then creates tickets in connected tools.",
    benefits: ["Task identification", "Owner assignment", "Deadline tracking"],
  },
  {
    title: "Q&A on Past Meetings",
    description: 'Ask natural language questions like "What did we decide about the budget?" and get instant answers.',
    benefits: ["RAG pipeline", "AI embeddings", "Instant retrieval"],
  },
  {
    title: "Multi-Channel Notifications",
    description: "Sends summaries and action items to Slack, Email, and project management tools immediately after meetings.",
    benefits: ["Slack integration", "Email notifications", "Tool sync"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="mb-4">
          <Link to="/" className="text-sm text-primary hover:underline">← Back to home</Link>
        </div>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-foreground mb-4">Powerful Features</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to automate, summarize, and act on your meetings.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">{feature.description}</p>
              <ul className="space-y-3">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card border-t border-b border-border py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Built on Production-Ready Stack</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Backend</h3>
              <p className="text-muted-foreground">Edge Functions, OpenClaw</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Database</h3>
              <p className="text-muted-foreground">PostgreSQL via OpenClaw</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">AI Engine</h3>
              <p className="text-muted-foreground">Z.AI GLM Models (GLM-4, GLM-3-turbo)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
