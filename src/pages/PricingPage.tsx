import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small teams",
    features: ["Up to 50 meetings/month", "Basic summarization", "Email notifications", "Community support"],
    cta: "Get started",
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "For growing teams",
    features: ["Unlimited meetings", "Advanced AI summarization", "Slack + Email + Tool integrations", "Priority support", "Custom action item templates", "Q&A on meeting history"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: ["Everything in Professional", "On-premise deployment", "SSO & advanced security", "Dedicated support", "Custom integrations", "SLA guarantee"],
    cta: "Contact sales",
  },
];

const faqs = [
  { q: "Can I change plans anytime?", a: "Yes, you can upgrade or downgrade at any time. Changes take effect at the next billing cycle." },
  { q: "Is there a free trial?", a: "Yes, all plans come with a 14-day free trial. No credit card required." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and wire transfers for Enterprise plans." },
  { q: "Do you offer discounts for annual billing?", a: "Yes, annual plans include a 20% discount compared to monthly billing." },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="mb-4">
          <Link to="/" className="text-sm text-primary hover:underline">← Back to home</Link>
        </div>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-foreground mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-muted-foreground">Choose the plan that fits your team.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 transition-all ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground shadow-2xl scale-105"
                  : "bg-card border border-border shadow-lg hover:shadow-xl"
              }`}
            >
              <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? "" : "text-foreground"}`}>{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.highlighted ? "opacity-80" : "text-muted-foreground"}`}>{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className={`text-sm ${plan.highlighted ? "opacity-80" : "text-muted-foreground"}`}>{plan.period}</span>}
              </div>
              <Button
                className={`w-full py-3 rounded-xl font-semibold mb-8 ${
                  plan.highlighted ? "bg-background text-foreground hover:bg-muted" : ""
                }`}
                variant={plan.highlighted ? "secondary" : "default"}
              >
                {plan.cta}
              </Button>
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? "opacity-70" : "text-emerald-500"}`} />
                    <span className={`text-sm ${plan.highlighted ? "opacity-90" : "text-muted-foreground"}`}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
