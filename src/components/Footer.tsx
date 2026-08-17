import { Brain } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8 mb-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-bold text-lg mb-3">
            <Brain className="w-5 h-5 text-primary" />
            MeetingMind<span className="text-primary">.AI</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            AI-powered meeting intelligence that turns conversations into clarity. Built with Z.AI GLM models.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Product</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
            <a href="#demo" className="hover:text-foreground transition">Live Demo</a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Legal</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition">Terms</a>
            <a href="#" className="hover:text-foreground transition">Privacy</a>
            <a href="#" className="hover:text-foreground transition">Contact</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-dim">© 2026 MeetingMind AI · Built for UK AI Agent Hackathon</p>
        <a href="#" className="text-xs text-dim hover:text-foreground transition">GitHub</a>
      </div>
    </div>
  </footer>
);

export default Footer;
