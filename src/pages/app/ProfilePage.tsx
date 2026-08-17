import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Key, CreditCard, Globe } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Account settings and billing</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">U</div>
            <div>
              <p className="text-sm font-semibold">User</p>
              <p className="text-xs text-muted-foreground">Admin · Member since Aug 2025</p>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              { label: "Email", value: "user@company.com", icon: Mail },
              { label: "Timezone", value: "UTC-5 (Eastern)", icon: Globe },
              { label: "API Key", value: "mm_live_•••••••••k8x", icon: Key },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-3">
                <div className="flex items-center gap-2">
                  <f.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{f.label}</span>
                </div>
                <span className="text-sm font-mono text-muted-foreground">{f.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-1.5"><CreditCard className="h-4 w-4" /> Billing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Pro Plan</p>
              <p className="text-xs text-muted-foreground">Unlimited meetings · 10 agents · Priority support</p>
            </div>
            <span className="text-sm font-semibold text-primary">$49/mo</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Next billing date: Sep 1, 2025</span>
            <button className="text-primary font-medium hover:underline">Manage subscription</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
