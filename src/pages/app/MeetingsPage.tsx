import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Download, Clock, Users, CheckSquare, Shield, Coins, Link as LinkIcon } from "lucide-react";
import { mockMeetings, formatAddress, type Meeting } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

const statusColors: Record<string, string> = {
  processed: "bg-primary/15 text-primary",
  review: "bg-yellow-500/15 text-yellow-400",
  anchored: "bg-blue-500/15 text-blue-400",
  minted: "bg-emerald-500/15 text-emerald-400",
};

export default function MeetingsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const active = mockMeetings.find((m) => m.id === selected);

  const filtered = mockMeetings.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some((t) => t.includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mockMeetings.length} meetings · {mockMeetings.filter((m) => m.anchor).length} anchored · {mockMeetings.filter((m) => m.nft).length} minted
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-secondary/50 transition">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <input
            className="h-9 w-full rounded-lg border border-border bg-secondary/30 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
            placeholder="Search meetings…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary/50 transition">
          <Filter className="h-3.5 w-3.5" /> Filter
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-2">
          {filtered.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelected(m.id)}
              onDoubleClick={() => navigate(`/meetings/${m.id}`)}
              className={`flex items-center justify-between rounded-lg px-4 py-3.5 cursor-pointer transition ${
                selected === m.id ? "bg-primary/10 border border-primary/30" : "bg-card border border-border hover:bg-secondary/40"
              }`}
            >
              <div>
                <p className="text-sm font-medium">{m.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{m.duration}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />{m.participant_count}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><CheckSquare className="h-3 w-3" />{m.actions.length}</span>
                  {m.anchor && <span className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" />anchored</span>}
                  {m.nft && <span className="text-xs text-muted-foreground flex items-center gap-1"><Coins className="h-3 w-3" />#{m.nft.token_id}</span>}
                </div>
                <div className="flex gap-1.5 mt-1.5">
                  {m.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-secondary/50 rounded px-1.5 py-0.5 text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">{new Date(m.date).toLocaleDateString()}</span>
                <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${statusColors[m.status] || ""}`}>
                  {m.status}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">{Math.round(m.confidence * 100)}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {active ? (
            <Card className="bg-card border-border sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{active.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {new Date(active.date).toLocaleDateString()} · {active.duration} · {active.participant_count} participants
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Summary</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{active.summary.summary_text}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Key Extracts</p>
                  {active.summary.extracts.map((e, i) => (
                    <div key={i} className="rounded bg-primary/5 px-3 py-1.5 mb-1 text-xs text-foreground">
                      • {e}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Actions ({active.actions.length})</p>
                  {active.actions.map((a) => (
                    <div key={a.action_id} className="rounded bg-secondary/30 px-3 py-2 mb-1.5 text-xs">
                      <p className="font-medium text-foreground">{a.task}</p>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <span>{a.assignee}</span>
                        {a.due_date && <span>· Due {new Date(a.due_date).toLocaleDateString()}</span>}
                        <span className={`uppercase font-semibold px-1 py-0.5 rounded text-[9px] ${
                          a.priority === "High" ? "bg-destructive/15 text-destructive" : a.priority === "Medium" ? "bg-yellow-500/15 text-yellow-400" : "bg-muted text-muted-foreground"
                        }`}>{a.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {active.anchor && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Anchor</p>
                    <div className="rounded bg-blue-500/5 border border-blue-500/20 px-3 py-2 text-xs space-y-1">
                      <p><span className="text-muted-foreground">Network:</span> <span className="font-mono capitalize">{active.anchor.network}</span></p>
                      <p><span className="text-muted-foreground">Root:</span> <span className="font-mono">{formatAddress(active.anchor.root_hash)}</span></p>
                      <p><span className="text-muted-foreground">Tx:</span> <span className="font-mono">{formatAddress(active.anchor.tx_hash || "pending")}</span></p>
                      <p><span className="text-muted-foreground">Confirmations:</span> {active.anchor.confirmations}</p>
                    </div>
                  </div>
                )}
                {active.nft && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">NFT</p>
                    <div className="rounded bg-emerald-500/5 border border-emerald-500/20 px-3 py-2 text-xs space-y-1">
                      <p><span className="text-muted-foreground">Token:</span> #{active.nft.token_id}</p>
                      <p><span className="text-muted-foreground">Owner:</span> <span className="font-mono">{formatAddress(active.nft.owner)}</span></p>
                      <p><span className="text-muted-foreground">License:</span> {active.nft.license}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">Select a meeting to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
