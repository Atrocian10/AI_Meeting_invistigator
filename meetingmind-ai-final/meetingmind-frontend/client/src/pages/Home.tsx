import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Brain, CheckCircle, Play, Github, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Powered by Z.AI · GLM series models
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Never miss a <span className="text-indigo-600">decision</span>{" "}
              again
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl">
              MeetingMind AI automatically joins, transcribes, and summarizes
              your meetings. Action items land in your tools — powered by Z.AI's
              production-ready GLM models.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/demo">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-xl flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  See live demo
                </Button>
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-300 text-gray-800 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-8 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              No credit card · 100% private by design
            </p>
          </div>

          {/* Hero Image Placeholder */}
          <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl h-80 flex items-center justify-center">
              <div className="text-center">
                <Zap className="w-16 h-16 text-indigo-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-600 font-medium">
                  Meeting Assistant Dashboard
                </p>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-indigo-600 text-white text-xs px-4 py-2 rounded-full font-semibold shadow-lg">
              Live in 3..2..
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase mb-2">
              Why teams love MeetingMind
            </h2>
            <p className="text-4xl font-extrabold text-gray-900 mb-4">
              Intelligent summaries, zero effort
            </p>
            <p className="text-xl text-gray-500">
              Z.AI's GLM models do the heavy lifting — from transcription
              enhancement to action extraction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Smart summarization
              </h3>
              <p className="text-gray-600">
                GLM-4 distills hours of conversation into key decisions, topics,
                and action points — with speaker attribution.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Auto-action items
              </h3>
              <p className="text-gray-600">
                Extracts tasks, owners, and deadlines. Syncs directly to Jira,
                Asana, Trello, or Slack.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Q&A on past meetings
              </h3>
              <p className="text-gray-600">
                Ask "what was the budget deadline?" — our RAG pipeline retrieves
                the exact answer using GLM embeddings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-16">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-20 h-20 bg-indigo-600 rounded-full text-white text-3xl flex items-center justify-center mx-auto mb-4 shadow-lg font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Connect calendar
              </h3>
              <p className="text-gray-600">
                OAuth with Google / Outlook — agent joins automatically.
              </p>
            </div>
            <div>
              <div className="w-20 h-20 bg-indigo-600 rounded-full text-white text-3xl flex items-center justify-center mx-auto mb-4 shadow-lg font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                GLM processes live
              </h3>
              <p className="text-gray-600">
                Real-time transcription + reasoning, enhanced by GLM-4.
              </p>
            </div>
            <div>
              <div className="w-20 h-20 bg-indigo-600 rounded-full text-white text-3xl flex items-center justify-center mx-auto mb-4 shadow-lg font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Summaries delivered
              </h3>
              <p className="text-gray-600">
                Slack, email, and project tools get action items instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform your meetings?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Try the interactive demo and see GLM in action.
          </p>
          <Link href="/demo">
            <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold shadow-lg">
              Start demo
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
