import { Check, Zap } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Automated Meeting Joining",
      description:
        "Securely joins scheduled meetings via calendar integration. OAuth with Google, Outlook, and Microsoft Teams.",
      benefits: ["Calendar sync", "Automatic joining", "Secure authentication"],
    },
    {
      title: "Real-Time Transcription & Enhancement",
      description:
        "Uses GLM to clean and structure raw speech-to-text output with speaker labels and timestamps.",
      benefits: [
        "Live transcription",
        "Speaker identification",
        "Error correction",
      ],
    },
    {
      title: "Smart Summarization",
      description:
        "Generates concise, topic-based summaries with key decisions and context using GLM-4.",
      benefits: [
        "Key decisions extracted",
        "Topic-based organization",
        "Context preservation",
      ],
    },
    {
      title: "Action Item Extraction",
      description:
        "Identifies tasks, owners, and deadlines, then creates tickets in connected tools.",
      benefits: [
        "Task identification",
        "Owner assignment",
        "Deadline tracking",
      ],
    },
    {
      title: "Q&A on Past Meetings",
      description:
        'Ask natural language questions like "What did we decide about the budget?" and get instant answers.',
      benefits: ["RAG pipeline", "GLM embeddings", "Instant retrieval"],
    },
    {
      title: "Multi-Channel Notifications",
      description:
        "Sends summaries and action items to Slack, Email, and project management tools immediately after meetings.",
      benefits: ["Slack integration", "Email notifications", "Tool sync"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to automate, summarize, and act on your
            meetings.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <ul className="space-y-3">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built on Production-Ready Stack
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Backend</h3>
              <p className="text-gray-400">Python, FastAPI, Celery, Redis</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Database</h3>
              <p className="text-gray-400">
                PostgreSQL, Vector DB (Pinecone/Chroma)
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">AI Engine</h3>
              <p className="text-gray-400">Z.AI GLM series models</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
