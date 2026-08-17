import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "MeetingMind saved us 10+ hours a week on manual note‑taking. The GLM summaries are eerily accurate.",
    name: "Alex Rivera",
    role: "Product Lead, FinTechly",
    initials: "AR",
  },
  {
    quote: "The Q&A feature is a game-changer. Instead of rewatching recordings, we just ask and get instant answers.",
    name: "Sarah Chen",
    role: "Engineering Manager, CloudScale",
    initials: "SC",
  },
  {
    quote: "We deployed it across 12 teams in a week. The Jira integration alone justified the investment.",
    name: "Marcus Webb",
    role: "CTO, DataBridge",
    initials: "MW",
  },
];

const Testimonial = () => (
  <section className="py-28 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.015] to-transparent" />
    <div className="container relative mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
          Testimonials
        </span>
        <h2 className="text-4xl md:text-5xl font-bold">
          Loved by <span className="text-gradient-primary">teams</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="surface-glass rounded-2xl p-7 flex flex-col"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="text-foreground leading-relaxed mb-6 flex-1">
              "{t.quote}"
            </blockquote>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                {t.initials}
              </div>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonial;
