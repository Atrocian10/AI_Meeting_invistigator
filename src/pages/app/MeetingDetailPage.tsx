import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Users, Clock, Tag, CheckSquare, AlertTriangle, Shield, Coins, ExternalLink } from "lucide-react";
import { getMeetingById, formatAddress } from "@/lib/mockData";

export default function MeetingDetailPage() {
  const { id } = useParams();
  const meeting = getMeetingById(id || "");

  if (!meeting) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Meeting not found</p>
      </div>
    );
  }

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/meetings" className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary/50 transition">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">{meeting.title}</h1>
          <p className="text-xs text-muted-foreground">
            {new Date(meeting.date).toLocaleDateString()} · {meeting.duration} · {meeting.participant_count} participants · 
            <span className="capitalize ml-1">{meeting.status}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left — Metadata */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {meeting.duration}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" /> {meeting.participant_count} participants</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Tag className="h-3.5 w-3.5" /> {meeting.tags.join(", ")}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><CheckSquare className="h-3.5 w-3.5" /> {meeting.actions.length} actions</div>
              <div className="text-xs font-mono text-muted-foreground">Confidence: {Math.round(meeting.confidence * 100)}%</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="p-4 pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Participants</CardTitle></CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              {meeting.participants.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-semibold text-primary uppercase">{p[0]}</div>
                  <span className="text-xs capitalize">{p}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Anchor info */}
          {meeting.anchor && (
            <Card className="bg-card border-border">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" /> Anchor</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0 space-y-2 text-xs">
                <p><span className="text-muted-foreground">Network:</span> <span className="font-mono capitalize">{meeting.anchor.network}</span></p>
                <p><span className="text-muted-foreground">Root:</span> <span className="font-mono">{formatAddress(meeting.anchor.root_hash)}</span></p>
                <p><span className="text-muted-foreground">Tx:</span> <span className="font-mono">{formatAddress(meeting.anchor.tx_hash || "pending")}</span></p>
                <p><span className="text-muted-foreground">CID:</span> <span className="font-mono">{formatAddress(meeting.anchor.pinned_cid)}</span></p>
                <p><span className="text-muted-foreground">Confirmations:</span> {meeting.anchor.confirmations}</p>
                <div className={`inline-flex items-center text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                  meeting.anchor.status === "confirmed" ? "bg-emerald-500/15 text-emerald-400" : meeting.anchor.status === "pending" ? "bg-yellow-500/15 text-yellow-400" : "bg-destructive/15 text-destructive"
                }`}>{meeting.anchor.status}</div>
              </CardContent>
            </Card>
          )}

          {/* NFT info */}
          {meeting.nft && (
            <Card className="bg-card border-border">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Coins className="h-3 w-3" /> NFT</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0 space-y-2 text-xs">
                <p className="font-medium text-foreground">{meeting.nft.name}</p>
                <p><span className="text-muted-foreground">Token ID:</span> #{meeting.nft.token_id}</p>
                <p><span className="text-muted-foreground">Owner:</span> <span className="font-mono">{formatAddress(meeting.nft.owner)}</span></p>
                <p><span className="text-muted-foreground">License:</span> {meeting.nft.license}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {meeting.nft.attributes.map((attr, i) => (
                    <span key={i} className="bg-secondary/50 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {attr.trait_type}: {attr.value}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Middle — Transcript */}
        <div className="lg:col-span-5">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Transcript ({meeting.transcript.segments.length} segments)</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">CID: {formatAddress(meeting.transcript.source_audio_cid)}</span>
                <button className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center hover:bg-primary/25 transition">
                  <Play className="h-3 w-3 text-primary" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 max-h-[500px] overflow-y-auto">
              {meeting.transcript.segments.map((seg, i) => (
                <div key={i} className="group rounded-lg px-3 py-2 hover:bg-secondary/30 transition cursor-pointer">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-muted-foreground">{formatTime(seg.start_ms)}</span>
                    <span className="text-xs font-semibold text-primary capitalize">{seg.speaker}</span>
                    <span className="text-[9px] text-muted-foreground ml-auto">{Math.round(seg.confidence * 100)}%</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{seg.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right — Summary & Actions */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{meeting.summary.summary_text}</p>
              {meeting.summary.approved_by && (
                <p className="text-[10px] text-muted-foreground">
                  ✓ Approved by <span className="capitalize font-medium">{meeting.summary.approved_by}</span>
                </p>
              )}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Key Extracts</p>
                {meeting.summary.extracts.map((e, i) => (
                  <div key={i} className="rounded bg-primary/5 px-2.5 py-1 mb-1 text-xs text-foreground">• {e}</div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5"><CheckSquare className="h-3.5 w-3.5" /> Actions ({meeting.actions.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {meeting.actions.map((a) => (
                <div key={a.action_id} className="rounded-lg bg-secondary/30 px-3 py-2.5">
                  <p className="text-sm font-medium">{a.task}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-muted-foreground capitalize">{a.assignee}</span>
                    {a.due_date && <span className="text-xs text-muted-foreground">· Due {new Date(a.due_date).toLocaleDateString()}</span>}
                    <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                      a.priority === "High" ? "bg-destructive/15 text-destructive" : a.priority === "Medium" ? "bg-yellow-500/15 text-yellow-400" : "bg-muted text-muted-foreground"
                    }`}>{a.priority}</span>
                    <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                      a.status === "done" ? "bg-emerald-500/15 text-emerald-400" : a.status === "in_progress" ? "bg-blue-500/15 text-blue-400" : a.status === "in_review" ? "bg-yellow-500/15 text-yellow-400" : "bg-muted text-muted-foreground"
                    }`}>{a.status.replace("_", " ")}</span>
                    {a.confidence < 0.85 && (
                      <span className="flex items-center gap-0.5 text-[10px] text-yellow-400">
                        <AlertTriangle className="h-3 w-3" /> {Math.round(a.confidence * 100)}%
                      </span>
                    )}
                  </div>
                  {a.assignee_wallet && (
                    <p className="text-[9px] font-mono text-muted-foreground mt-1">{formatAddress(a.assignee_wallet)}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
