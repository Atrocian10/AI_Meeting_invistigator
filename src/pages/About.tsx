import { Users, Target, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="mb-4">
          <Link to="/" className="text-sm text-primary hover:underline">← Back to home</Link>
        </div>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-foreground mb-4">About MeetingMind AI</h1>
          <p className="text-xl text-muted-foreground">
            Transforming how teams capture, understand, and act on their meetings.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Remote and hybrid teams spend countless hours in meetings, yet critical decisions and action items often get lost in the noise. MeetingMind AI solves this by automatically capturing, understanding, and distributing the outcomes of every meeting.
            </p>
            <p className="text-lg text-muted-foreground">
              We believe that AI should enhance human collaboration, not replace it. Our platform uses advanced AI models to understand context, extract meaning, and drive action — so teams can focus on what matters most.
            </p>
          </div>
          <div className="bg-primary/5 rounded-2xl p-12 h-96 flex items-center justify-center border border-primary/10">
            <div className="text-center">
              <Target className="w-20 h-20 text-primary mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground font-medium">Never miss a decision again</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card border-t border-b border-border py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "User-Centric", desc: "We design every feature with the end user in mind, prioritizing simplicity and impact." },
              { icon: Target, title: "Precision", desc: "Accuracy matters. We leverage advanced AI to ensure summaries and extractions are reliable." },
              { icon: Heart, title: "Privacy First", desc: "Your data is yours. We encrypt, secure, and never sell meeting transcripts." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Powered by AI</h2>
          <div className="bg-card p-12 rounded-2xl shadow-lg border border-border">
            <p className="text-lg text-muted-foreground mb-6">
              MeetingMind AI is built on advanced language models designed for reasoning, generation, and orchestration:
            </p>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3"><span className="text-primary font-bold">•</span><span><strong className="text-foreground">Reasoning & Summarization:</strong> Processes full transcripts to produce coherent summaries while preserving nuance.</span></li>
              <li className="flex gap-3"><span className="text-primary font-bold">•</span><span><strong className="text-foreground">Task Extraction:</strong> Identifies actionable items, responsible persons, and deadlines with high accuracy.</span></li>
              <li className="flex gap-3"><span className="text-primary font-bold">•</span><span><strong className="text-foreground">Natural Language Querying:</strong> Powers a RAG pipeline over stored meeting data for instant answers.</span></li>
              <li className="flex gap-3"><span className="text-primary font-bold">•</span><span><strong className="text-foreground">Transcription Enhancement:</strong> Corrects errors and segments raw transcripts into speaker-labeled dialogue.</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Built by builders</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto text-lg">
            MeetingMind AI was created during the UK AI Agent Hackathon EP4, combining deep technical expertise in AI, full-stack development, and product design.
          </p>
        </div>
      </section>
    </div>
  );
}
