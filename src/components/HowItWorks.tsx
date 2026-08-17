import { motion } from "framer-motion";
import { Calendar, Cpu, Rocket } from "lucide-react";

const steps = [
  { icon: Calendar, title: "Connect calendar", desc: "OAuth with Google / Outlook — agent joins automatically." },
  { icon: Cpu, title: "GLM processes live", desc: "Real‑time transcription + reasoning, enhanced by GLM‑4." },
  { icon: Rocket, title: "Summaries delivered", desc: "Slack, email, and project tools get action items instantly." },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Simple setup
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">How it works</h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[52px] left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40" />

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center relative"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="w-[72px] h-[72px] rounded-2xl bg-card border-2 border-primary/30 flex items-center justify-center mx-auto mb-6 relative z-10"
                >
                  <s.icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm max-w-[240px] mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
