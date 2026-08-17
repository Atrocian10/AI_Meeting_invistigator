import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "For individuals and small teams",
    features: ["5 meetings/month", "Basic summaries", "Email delivery", "1 integration"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/user/mo",
    desc: "For growing teams that need more",
    features: ["Unlimited meetings", "Advanced GLM‑4 summaries", "Q&A on past meetings", "Unlimited integrations", "Priority support"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For organizations at scale",
    features: ["Everything in Pro", "Self-hosted option", "SSO & SCIM", "Dedicated support", "Custom SLAs"],
    cta: "Contact sales",
    highlighted: false,
  },
];

const Pricing = () => (
  <section id="pricing" className="py-28 relative">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
          Pricing
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Start free. Upgrade when you're ready.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-7 flex flex-col relative overflow-hidden ${
              p.highlighted
                ? "border-2 border-primary bg-card glow-primary"
                : "surface-glass"
            }`}
          >
            {p.highlighted && (
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                Popular
              </span>
            )}
            <h3 className="text-lg font-bold mb-1">{p.name}</h3>
            <p className="text-sm text-muted-foreground mb-5">{p.desc}</p>
            <div className="mb-6">
              <span className="text-4xl font-black">{p.price}</span>
              {p.period && <span className="text-sm text-muted-foreground">{p.period}</span>}
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
                p.highlighted
                  ? "bg-primary text-primary-foreground hover:brightness-110"
                  : "border border-border hover:bg-secondary"
              }`}
            >
              {p.cta}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
