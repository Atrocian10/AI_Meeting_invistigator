import { motion } from "framer-motion";
import { Brain, ListChecks, MessageSquareText, Shield, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart summarization",
    desc: "GLM‑4 distills hours of conversation into key decisions, topics, and action points — with speaker attribution.",
    gradient: "from-primary/20 to-glow-secondary/10",
  },
  {
    icon: ListChecks,
    title: "Auto‑action items",
    desc: "Extracts tasks, owners, and deadlines. Syncs directly to Jira, Asana, Trello, or Slack.",
    gradient: "from-glow-secondary/20 to-primary/10",
  },
  {
    icon: MessageSquareText,
    title: "Q&A on past meetings",
    desc: 'Ask "what was the budget deadline?" — our RAG pipeline retrieves the exact answer using GLM embeddings.',
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Shield,
    title: "Enterprise security",
    desc: "End-to-end encryption, SOC 2 compliant, and self-hosted options. Your conversations never leave your infrastructure.",
    gradient: "from-glow-secondary/20 to-primary/10",
  },
  {
    icon: Zap,
    title: "Real-time processing",
    desc: "Sub-second latency on live transcription. GLM‑3-turbo handles real-time streams with minimal compute overhead.",
    gradient: "from-primary/20 to-glow-secondary/10",
  },
  {
    icon: Globe,
    title: "40+ languages",
    desc: "Multilingual meetings? No problem. Automatic language detection and cross-language summarization built in.",
    gradient: "from-glow-secondary/15 to-primary/10",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-28 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/3 blur-[120px] rounded-full" />
      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why teams love <span className="text-gradient-primary">MeetingMind</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Z.AI's GLM models do the heavy lifting — from transcription enhancement to action extraction.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative surface-glass rounded-2xl p-7 hover:border-primary/40 transition-all duration-300 group cursor-default overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
