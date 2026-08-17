import { Users, Target, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            About MeetingMind AI
          </h1>
          <p className="text-xl text-gray-600">
            Transforming how teams capture, understand, and act on their
            meetings.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Remote and hybrid teams spend countless hours in meetings, yet
              critical decisions and action items often get lost in the noise.
              MeetingMind AI solves this by automatically capturing,
              understanding, and distributing the outcomes of every meeting.
            </p>
            <p className="text-lg text-gray-600">
              We believe that AI should enhance human collaboration, not replace
              it. Our platform uses Z.AI's advanced GLM models to understand
              context, extract meaning, and drive action — so teams can focus on
              what matters most.
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-12 h-96 flex items-center justify-center">
            <div className="text-center">
              <Target className="w-20 h-20 text-indigo-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-700 font-medium">
                Never miss a decision again
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                User-Centric
              </h3>
              <p className="text-gray-600">
                We design every feature with the end user in mind, prioritizing
                simplicity and impact.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Precision
              </h3>
              <p className="text-gray-600">
                Accuracy matters. We leverage advanced AI to ensure summaries
                and extractions are reliable.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Privacy First
              </h3>
              <p className="text-gray-600">
                Your data is yours. We encrypt, secure, and never sell meeting
                transcripts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powered by Z.AI
          </h2>
          <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-200">
            <p className="text-lg text-gray-700 mb-6">
              MeetingMind AI is built on Z.AI's GLM series models, a
              state-of-the-art language model family designed for reasoning,
              generation, and orchestration. GLM powers every core capability:
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Reasoning & Summarization:</strong> GLM-4 processes
                  full transcripts to produce coherent, bulleted summaries while
                  preserving nuance.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Task Extraction:</strong> Fine-tuned prompts enable
                  GLM to identify actionable items, responsible persons, and
                  deadlines with high accuracy.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Natural Language Querying:</strong> GLM powers a
                  retrieval-augmented generation (RAG) pipeline over stored
                  meeting data for instant answers.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Transcription Enhancement:</strong> GLM corrects
                  errors and segments raw transcripts into speaker-labeled,
                  readable dialogue.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built by builders
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto text-lg">
            MeetingMind AI was created during the UK AI Agent Hackathon EP4,
            combining deep technical expertise in AI, full-stack development,
            and product design. We're passionate about solving real problems
            with intelligent automation.
          </p>
        </div>
      </section>
    </div>
  );
}
