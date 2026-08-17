import { motion } from "framer-motion";
import { Play, Github, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const TERMINAL_LINES = [
  '> meetingmind --join "Q3 Budget Call"',
  "✓ Connected to Google Meet",
  "✓ Transcription started (GLM‑4)",
  "✓ 3 participants detected",
  "",
  "[00:12] Alice: Let's finalize the Q3 budget",
  "[00:45] Bob: I'd allocate $20k to LinkedIn",
  "[01:23] Carol: Events needs money by Aug 10",
];

const Hero = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < TERMINAL_LINES.length + 2) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), 400);
      return () => clearTimeout(t);
    }
  }, [visibleLines]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full bg-primary/6 blur-[150px]" />
      <div className="absolute top-20 right-20 w-[300px] h-[300px] rounded-full bg-glow-secondary/5 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse-glow" />
              <span className="text-xs font-mono text-primary tracking-wide">
                Powered by Z.AI · GLM series models
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Never miss a{" "}
              <span className="text-gradient-primary relative">
                decision
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  style={{ originX: 0 }}
                />
              </span>{" "}
              again
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mb-10">
              MeetingMind AI automatically joins, transcribes, and summarizes your meetings.
              Action items land in your tools — powered by Z.AI's production‑ready GLM models.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <motion.a
                href="#demo"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:brightness-110 transition glow-primary"
              >
                <Play className="w-4 h-4" />
                See live demo
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition"
              >
                <Github className="w-4 h-4" />
                GitHub
              </motion.a>
            </div>

            <p className="text-sm text-dim flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary/60" />
              No credit card · 100% private by design
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="terminal-bg rounded-2xl p-6 glow-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full" />
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <span className="ml-3 text-xs text-dim font-mono">meetingmind-cli</span>
              </div>
              <div className="font-mono text-sm leading-relaxed min-h-[260px]">
                {TERMINAL_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={i < visibleLines ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3 }}
                    className={`${line.startsWith("✓") ? "text-primary" : "text-muted-foreground"} ${
                      line === "" ? "h-3" : ""
                    }`}
                  >
                    {line}
                  </motion.div>
                ))}
                {visibleLines > TERMINAL_LINES.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-primary font-semibold"
                  >
                    → 3 action items extracted
                  </motion.div>
                )}
                {visibleLines > TERMINAL_LINES.length + 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-primary font-semibold"
                  >
                    → Summary generated (847 tokens)
                  </motion.div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-dim font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                live processing...
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
