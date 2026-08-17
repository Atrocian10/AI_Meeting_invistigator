/**
 * MeetingMind AI — Web3 + AI Agents Comprehensive Mock Data
 * Synthetic data for staging UI, demo flows, and agent integration tests.
 * All identities, addresses, and CIDs are synthetic. No real PII.
 */

// ─── Naming Helpers ───────────────────────────────────────────────────────────
export const deterministicId = (prefix: string, ...parts: string[]) =>
  `${prefix}_${parts.join("_")}`;

// ─── Test Wallets ─────────────────────────────────────────────────────────────
export interface TestWallet {
  name: string;
  address: string;
  role: string;
  balance: { eth: string; mmt: string };
}

export const testWallets: TestWallet[] = [
  { name: "orgRelayer", address: "0xMMrelayer00000000000000000000000000000000", role: "relayer", balance: { eth: "4.25", mmt: "50000" } },
  { name: "alice", address: "0xMMa1b2c3d4e5f678901234567890abcdef1234567", role: "approver", balance: { eth: "1.82", mmt: "12500" } },
  { name: "bob", address: "0xMMb0b000000000000000000000000000000000000", role: "assignee", balance: { eth: "0.95", mmt: "7800" } },
  { name: "carol", address: "0xMMcar01000000000000000000000000000000000", role: "assignee", balance: { eth: "0.62", mmt: "4200" } },
  { name: "treasury", address: "0xMMtreasuryfffffffffffffffffffffffffffffff", role: "multisig", balance: { eth: "120.0", mmt: "500000" } },
  { name: "marketplaceSeller", address: "0xMMseller00000000000000000000000000000000", role: "seller", balance: { eth: "2.10", mmt: "25000" } },
];

// ─── Transcript Types & Data ──────────────────────────────────────────────────
export interface TranscriptSegment {
  start_ms: number;
  end_ms: number;
  speaker: string;
  text: string;
  confidence: number;
}

export interface Transcript {
  transcript_id: string;
  meeting_id: string;
  source_audio_cid: string;
  segments: TranscriptSegment[];
  created_at: string;
}

// ─── Summary Types & Data ─────────────────────────────────────────────────────
export interface Summary {
  summary_id: string;
  meeting_id: string;
  summary_text: string;
  extracts: string[];
  confidence: number;
  summary_cid: string;
  anchor_hash: string;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

// ─── Action Item Types ────────────────────────────────────────────────────────
export interface ActionItemWeb3 {
  action_id: string;
  meeting_id: string;
  task: string;
  assignee: string | null;
  assignee_wallet: string | null;
  due_date: string | null;
  priority: "High" | "Medium" | "Low";
  confidence: number;
  created_by: string;
  created_at: string;
  status: "todo" | "in_progress" | "in_review" | "done";
}

// ─── Anchor Meta ──────────────────────────────────────────────────────────────
export interface AnchorMeta {
  anchor_id: string;
  root_hash: string;
  batch: string[];
  tx_hash: string | null;
  network: "polygon" | "optimism" | "arbitrum";
  pinned_cid: string;
  submitter: string;
  status: "pending" | "confirmed" | "failed";
  confirmations: number;
  created_at: string;
}

// ─── NFT Metadata ─────────────────────────────────────────────────────────────
export interface NFTMetadata {
  token_id: number;
  name: string;
  description: string;
  summary_cid: string;
  summary_hash: string;
  meeting_id: string;
  anchor: { root: string; tx_hash: string; network: string };
  license: string;
  attributes: { trait_type: string; value: string | number }[];
  created_at: string;
  owner: string;
}

// ─── Agent Event ──────────────────────────────────────────────────────────────
export interface AgentEvent {
  id: string;
  time: string;
  agent: string;
  type: string;
  payload: Record<string, unknown>;
  status: "success" | "pending" | "error";
}

// ─── On-Chain Event ───────────────────────────────────────────────────────────
export interface OnChainEvent {
  event: string;
  args: Record<string, unknown>;
  tx_hash: string;
  network: string;
  block_number: number;
  timestamp: string;
}

// ─── Meeting (combined) ───────────────────────────────────────────────────────
export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  participant_count: number;
  status: "processed" | "review" | "anchored" | "minted";
  confidence: number;
  tags: string[];
  transcript: Transcript;
  summary: Summary;
  actions: ActionItemWeb3[];
  anchor: AnchorMeta | null;
  nft: NFTMetadata | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA — 12 Meetings across different topics, dates, and networks
// ═══════════════════════════════════════════════════════════════════════════════

const meetingDefs: Array<{
  id: string; title: string; date: string; duration: string;
  participants: string[]; tags: string[]; network: "polygon" | "optimism" | "arbitrum";
  status: Meeting["status"]; confidence: number;
  segments: TranscriptSegment[];
  summaryText: string; extracts: string[];
  actions: Array<{ task: string; assignee: string; wallet: string; due: string | null; priority: "High" | "Medium" | "Low"; status: ActionItemWeb3["status"]; confidence: number }>;
}> = [
  {
    id: "meeting_20260721_MM_001", title: "Q3 Marketing Budget Planning", date: "2026-07-21T10:00:00Z", duration: "45 min",
    participants: ["alice", "bob", "carol"], tags: ["budget", "marketing", "q3"], network: "polygon", status: "minted", confidence: 0.92,
    segments: [
      { start_ms: 0, end_ms: 4500, speaker: "alice", text: "We need to finalize the Q3 marketing budget. We have $50,000 remaining.", confidence: 0.95 },
      { start_ms: 4500, end_ms: 12000, speaker: "bob", text: "I propose allocating $20k to LinkedIn ads, $15k to content marketing, and $15k to events.", confidence: 0.92 },
      { start_ms: 12000, end_ms: 18500, speaker: "carol", text: "Events team needs the budget by August 10th to lock down venue contracts.", confidence: 0.90 },
      { start_ms: 18500, end_ms: 25000, speaker: "alice", text: "Agreed. Bob, can you draft the ad copy by next Friday?", confidence: 0.94 },
      { start_ms: 25000, end_ms: 32000, speaker: "bob", text: "Sure, I'll have it ready by August 5th. I'll also coordinate with the design team.", confidence: 0.91 },
      { start_ms: 32000, end_ms: 40000, speaker: "carol", text: "I'll coordinate with the events team and send requirements by end of this week.", confidence: 0.93 },
      { start_ms: 40000, end_ms: 48000, speaker: "alice", text: "Perfect. Bob, please open a Jira ticket for the landing page redesign and tag me.", confidence: 0.89 },
    ],
    summaryText: "Budget: $50,000 allocated for Q3 — LinkedIn $20k, Content $15k, Events $15k. Deadlines: Ad copy by Aug 5, Events budget by Aug 10. Decision: Q3 marketing plan approved unanimously.",
    extracts: ["LinkedIn: $20,000", "Content: $15,000", "Events: $15,000", "Ad copy deadline: Aug 5", "Q3 plan approved"],
    actions: [
      { task: "Draft LinkedIn ad copy", assignee: "bob", wallet: "0xMMb0b000000000000000000000000000000000000", due: "2026-08-05", priority: "High", status: "in_progress", confidence: 0.91 },
      { task: "Coordinate events requirements and venue booking", assignee: "carol", wallet: "0xMMcar01000000000000000000000000000000000", due: "2026-08-10", priority: "Medium", status: "todo", confidence: 0.88 },
      { task: "Open Jira ticket for landing page redesign", assignee: "bob", wallet: "0xMMb0b000000000000000000000000000000000000", due: null, priority: "Medium", status: "done", confidence: 0.85 },
      { task: "Review and approve final ad copy", assignee: "alice", wallet: "0xMMa1b2c3d4e5f678901234567890abcdef1234567", due: "2026-08-07", priority: "High", status: "todo", confidence: 0.90 },
    ],
  },
  {
    id: "meeting_20260722_MM_002", title: "Sprint Planning — Mobile Redesign", date: "2026-07-22T09:00:00Z", duration: "32 min",
    participants: ["alice", "bob", "carol", "dave", "eve"], tags: ["sprint", "mobile", "engineering"], network: "polygon", status: "anchored", confidence: 0.94,
    segments: [
      { start_ms: 0, end_ms: 5000, speaker: "alice", text: "Let's kick off sprint planning. The mobile redesign is our primary focus this sprint.", confidence: 0.96 },
      { start_ms: 5000, end_ms: 11000, speaker: "bob", text: "I've got the API endpoints ready for the new auth flow. Token refresh is the remaining piece.", confidence: 0.93 },
      { start_ms: 11000, end_ms: 18000, speaker: "carol", text: "I'll handle the UI components. Design system updates should be done by Wednesday.", confidence: 0.91 },
      { start_ms: 18000, end_ms: 25000, speaker: "dave", text: "The rate limiter on staging is acting up. We need to investigate before the release.", confidence: 0.88 },
      { start_ms: 25000, end_ms: 32000, speaker: "alice", text: "Good catch. Let's flag that as a blocker. Carol, can you coordinate with DevOps?", confidence: 0.95 },
    ],
    summaryText: "Sprint focus: mobile redesign. Auth flow API ready; token refresh logic pending. Rate limiter issue on staging flagged as blocker. Design system updates targeted for mid-week.",
    extracts: ["Mobile redesign is sprint focus", "Auth flow API ready", "Rate limiter issue = blocker", "Design system updates by Wednesday"],
    actions: [
      { task: "Create ticket for token refresh logic", assignee: "bob", wallet: "0xMMb0b000000000000000000000000000000000000", due: "2026-07-25", priority: "High", status: "in_progress", confidence: 0.94 },
      { task: "Update design system components", assignee: "carol", wallet: "0xMMcar01000000000000000000000000000000000", due: "2026-07-24", priority: "Medium", status: "in_review", confidence: 0.91 },
      { task: "Investigate rate limiter on staging", assignee: "dave", wallet: "0xMMdave0000000000000000000000000000000000", due: "2026-07-23", priority: "High", status: "in_progress", confidence: 0.87 },
    ],
  },
  {
    id: "meeting_20260723_MM_003", title: "Stakeholder Alignment — Series B Update", date: "2026-07-23T14:00:00Z", duration: "60 min",
    participants: ["alice", "bob", "carol", "dave", "eve", "frank", "grace", "heidi", "ivan", "judy", "karl", "lena"], tags: ["stakeholder", "series-b", "investor"], network: "optimism", status: "minted", confidence: 0.95,
    segments: [
      { start_ms: 0, end_ms: 8000, speaker: "alice", text: "Thank you all for joining. We're here to align on the Series B progress and product roadmap.", confidence: 0.97 },
      { start_ms: 8000, end_ms: 18000, speaker: "frank", text: "Revenue is tracking at $2.4M ARR. We're ahead of plan by 15%. Customer retention is at 94%.", confidence: 0.93 },
      { start_ms: 18000, end_ms: 28000, speaker: "grace", text: "Engineering velocity has improved 30% since adopting the multi-agent architecture.", confidence: 0.91 },
      { start_ms: 28000, end_ms: 38000, speaker: "heidi", text: "Legal review of the token structure is complete. We're cleared for the utility token launch.", confidence: 0.89 },
      { start_ms: 38000, end_ms: 48000, speaker: "alice", text: "We need board approval by August 1st. Ivan, can you circulate the updated term sheet?", confidence: 0.96 },
      { start_ms: 48000, end_ms: 55000, speaker: "ivan", text: "I'll have it out by end of day Friday. Karl, please review the financial projections section.", confidence: 0.92 },
      { start_ms: 55000, end_ms: 60000, speaker: "alice", text: "Great. Let's reconvene next Tuesday for final review before the board meeting.", confidence: 0.94 },
    ],
    summaryText: "Series B update: $2.4M ARR (+15% vs plan), 94% retention. Engineering velocity up 30%. Token structure legal review complete. Board approval needed by Aug 1. Term sheet to be circulated Friday.",
    extracts: ["$2.4M ARR", "94% customer retention", "30% velocity improvement", "Token launch cleared", "Board approval by Aug 1"],
    actions: [
      { task: "Circulate updated term sheet", assignee: "ivan", wallet: "0xMMivan0000000000000000000000000000000000", due: "2026-07-25", priority: "High", status: "todo", confidence: 0.92 },
      { task: "Review financial projections section", assignee: "karl", wallet: "0xMMkarl0000000000000000000000000000000000", due: "2026-07-26", priority: "High", status: "todo", confidence: 0.89 },
      { task: "Schedule board meeting for final review", assignee: "alice", wallet: "0xMMa1b2c3d4e5f678901234567890abcdef1234567", due: "2026-07-29", priority: "Medium", status: "done", confidence: 0.95 },
      { task: "Prepare investor deck with updated metrics", assignee: "frank", wallet: "0xMMfrank000000000000000000000000000000000", due: "2026-07-28", priority: "High", status: "in_progress", confidence: 0.90 },
      { task: "Draft token utility documentation", assignee: "heidi", wallet: "0xMMheidi000000000000000000000000000000000", due: "2026-07-30", priority: "Medium", status: "todo", confidence: 0.86 },
      { task: "Update cap table with new round terms", assignee: "lena", wallet: "0xMMlena0000000000000000000000000000000000", due: "2026-07-27", priority: "Medium", status: "in_progress", confidence: 0.88 },
      { task: "Coordinate due diligence data room access", assignee: "grace", wallet: "0xMMgrace000000000000000000000000000000000", due: "2026-07-26", priority: "High", status: "in_review", confidence: 0.93 },
    ],
  },
  {
    id: "meeting_20260724_MM_004", title: "Incident Retro — Database Outage #42", date: "2026-07-24T11:00:00Z", duration: "28 min",
    participants: ["alice", "bob", "dave", "eve", "frank"], tags: ["incident", "retro", "database"], network: "polygon", status: "review", confidence: 0.79,
    segments: [
      { start_ms: 0, end_ms: 6000, speaker: "alice", text: "Let's walk through the timeline. The database connection pool exhaustion started at 2:14 AM UTC.", confidence: 0.82 },
      { start_ms: 6000, end_ms: 14000, speaker: "dave", text: "Root cause was a missing index on the meetings table. The query plan was doing a full table scan under load.", confidence: 0.85 },
      { start_ms: 14000, end_ms: 20000, speaker: "eve", text: "We need to add automated query plan analysis to our CI pipeline. This shouldn't have made it to prod.", confidence: 0.78 },
      { start_ms: 20000, end_ms: 28000, speaker: "bob", text: "I'll set up the monitoring alert threshold. We should also document the runbook for connection pool issues.", confidence: 0.80 },
    ],
    summaryText: "Incident #42: DB connection pool exhaustion caused by missing index → full table scan. Root cause identified. Action: add CI query plan analysis, set monitoring thresholds, document runbook.",
    extracts: ["Missing index caused full table scan", "Connection pool exhaustion at 2:14 AM", "CI pipeline needs query plan analysis"],
    actions: [
      { task: "Add missing index on meetings table", assignee: "dave", wallet: "0xMMdave0000000000000000000000000000000000", due: "2026-07-25", priority: "High", status: "done", confidence: 0.87 },
      { task: "Set up monitoring alert for connection pool", assignee: "bob", wallet: "0xMMb0b000000000000000000000000000000000000", due: "2026-07-26", priority: "High", status: "in_progress", confidence: 0.80 },
      { task: "Add query plan analysis to CI pipeline", assignee: "eve", wallet: "0xMMeve00000000000000000000000000000000000", due: "2026-07-30", priority: "Medium", status: "todo", confidence: 0.78 },
      { task: "Document connection pool runbook", assignee: "bob", wallet: "0xMMb0b000000000000000000000000000000000000", due: "2026-08-01", priority: "Low", status: "todo", confidence: 0.75 },
    ],
  },
  {
    id: "meeting_20260725_MM_005", title: "1:1 — Alice & Bob — Performance Review", date: "2026-07-25T15:00:00Z", duration: "22 min",
    participants: ["alice", "bob"], tags: ["1:1", "performance", "career"], network: "arbitrum", status: "processed", confidence: 0.91,
    segments: [
      { start_ms: 0, end_ms: 6000, speaker: "alice", text: "Bob, I want to discuss your growth trajectory. Your API work has been outstanding this quarter.", confidence: 0.94 },
      { start_ms: 6000, end_ms: 12000, speaker: "bob", text: "Thanks. I'd like to take on more architecture decisions. Maybe lead the Web3 integration project?", confidence: 0.90 },
      { start_ms: 12000, end_ms: 22000, speaker: "alice", text: "That's a great goal. Let's set up a mentorship plan with the principal engineer. I'll arrange it.", confidence: 0.92 },
    ],
    summaryText: "Performance review: Bob's API work recognized. Bob expressed interest in architecture leadership, specifically Web3 integration. Mentorship plan with principal engineer to be arranged.",
    extracts: ["API work outstanding", "Bob wants architecture role", "Web3 integration lead opportunity", "Mentorship plan to be set up"],
    actions: [
      { task: "Arrange mentorship sessions with principal engineer", assignee: "alice", wallet: "0xMMa1b2c3d4e5f678901234567890abcdef1234567", due: "2026-08-01", priority: "Medium", status: "todo", confidence: 0.92 },
      { task: "Draft Web3 integration project proposal", assignee: "bob", wallet: "0xMMb0b000000000000000000000000000000000000", due: "2026-08-05", priority: "Medium", status: "todo", confidence: 0.88 },
    ],
  },
  {
    id: "meeting_20260726_MM_006", title: "Board Update Prep — Deck Review", date: "2026-07-26T10:00:00Z", duration: "50 min",
    participants: ["alice", "frank", "grace", "karl"], tags: ["board", "investor", "deck"], network: "optimism", status: "anchored", confidence: 0.87,
    segments: [
      { start_ms: 0, end_ms: 10000, speaker: "alice", text: "Let's review the board deck slide by slide. Frank, start with the financial overview.", confidence: 0.90 },
      { start_ms: 10000, end_ms: 22000, speaker: "frank", text: "Slide 3 needs updated revenue numbers. We closed two enterprise deals last week — that's $180k additional ARR.", confidence: 0.88 },
      { start_ms: 22000, end_ms: 35000, speaker: "grace", text: "The product roadmap slide should highlight the multi-agent architecture. It's our key differentiator.", confidence: 0.86 },
      { start_ms: 35000, end_ms: 50000, speaker: "karl", text: "Financial projections need the updated burn rate. We reduced it by 12% this quarter.", confidence: 0.84 },
    ],
    summaryText: "Board deck review: revenue needs $180k additional ARR update, product roadmap should highlight multi-agent architecture, burn rate reduced 12%. Final deck due before board meeting.",
    extracts: ["$180k additional ARR from enterprise deals", "Multi-agent architecture = key differentiator", "Burn rate reduced 12%"],
    actions: [
      { task: "Update revenue slide with $180k ARR", assignee: "frank", wallet: "0xMMfrank000000000000000000000000000000000", due: "2026-07-27", priority: "High", status: "done", confidence: 0.88 },
      { task: "Add multi-agent architecture to roadmap slide", assignee: "grace", wallet: "0xMMgrace000000000000000000000000000000000", due: "2026-07-27", priority: "Medium", status: "done", confidence: 0.86 },
      { task: "Update burn rate projections", assignee: "karl", wallet: "0xMMkarl0000000000000000000000000000000000", due: "2026-07-27", priority: "High", status: "in_review", confidence: 0.84 },
    ],
  },
  {
    id: "meeting_20260727_MM_007", title: "DAO Governance — Proposal #7 Review", date: "2026-07-27T16:00:00Z", duration: "35 min",
    participants: ["alice", "bob", "carol", "heidi", "ivan"], tags: ["dao", "governance", "proposal"], network: "polygon", status: "minted", confidence: 0.93,
    segments: [
      { start_ms: 0, end_ms: 8000, speaker: "alice", text: "Proposal #7 is to allocate 5% of treasury tokens to fund the AI agent marketplace development.", confidence: 0.95 },
      { start_ms: 8000, end_ms: 16000, speaker: "heidi", text: "The legal framework supports this. We've structured it as a grant with milestone-based vesting.", confidence: 0.91 },
      { start_ms: 16000, end_ms: 24000, speaker: "ivan", text: "I've modeled the token dilution. At current prices, it's approximately $25,000 worth of MMT tokens.", confidence: 0.89 },
      { start_ms: 24000, end_ms: 35000, speaker: "bob", text: "I'll draft the smart contract for the vesting schedule. We can deploy on Polygon for lower gas costs.", confidence: 0.92 },
    ],
    summaryText: "DAO Proposal #7: Allocate 5% treasury (~$25k MMT) for AI agent marketplace via milestone-based vesting. Legal framework approved. Smart contract to be deployed on Polygon.",
    extracts: ["5% treasury allocation", "$25k MMT value", "Milestone-based vesting", "Polygon deployment for gas savings"],
    actions: [
      { task: "Draft vesting smart contract for marketplace grant", assignee: "bob", wallet: "0xMMb0b000000000000000000000000000000000000", due: "2026-08-01", priority: "High", status: "in_progress", confidence: 0.92 },
      { task: "Submit Proposal #7 to on-chain governance", assignee: "alice", wallet: "0xMMa1b2c3d4e5f678901234567890abcdef1234567", due: "2026-07-29", priority: "High", status: "todo", confidence: 0.93 },
      { task: "Prepare token dilution impact report", assignee: "ivan", wallet: "0xMMivan0000000000000000000000000000000000", due: "2026-07-28", priority: "Medium", status: "done", confidence: 0.89 },
    ],
  },
  {
    id: "meeting_20260728_MM_008", title: "Web3 Integration Architecture Review", date: "2026-07-28T09:30:00Z", duration: "55 min",
    participants: ["alice", "bob", "dave", "eve", "grace"], tags: ["web3", "architecture", "blockchain"], network: "arbitrum", status: "anchored", confidence: 0.90,
    segments: [
      { start_ms: 0, end_ms: 10000, speaker: "bob", text: "I've drafted the Web3 integration architecture. We're using a three-layer approach: anchor, NFT, and marketplace.", confidence: 0.92 },
      { start_ms: 10000, end_ms: 22000, speaker: "dave", text: "The Merkle tree batching for anchors is efficient. We can anchor 100 summaries per transaction on Polygon.", confidence: 0.89 },
      { start_ms: 22000, end_ms: 35000, speaker: "eve", text: "For the NFT layer, I recommend ERC-721 with on-chain metadata references pointing to IPFS CIDs.", confidence: 0.91 },
      { start_ms: 35000, end_ms: 45000, speaker: "grace", text: "The marketplace should support both fixed-price listings and auction mechanics for premium summaries.", confidence: 0.87 },
      { start_ms: 45000, end_ms: 55000, speaker: "alice", text: "This is solid. Let's proceed with Polygon as our primary chain and Arbitrum for the marketplace.", confidence: 0.94 },
    ],
    summaryText: "Three-layer Web3 architecture approved: Anchor layer (Merkle batching, 100/tx on Polygon), NFT layer (ERC-721 + IPFS), Marketplace (fixed-price + auctions on Arbitrum).",
    extracts: ["Three-layer architecture", "100 summaries per tx", "ERC-721 with IPFS", "Polygon primary, Arbitrum marketplace"],
    actions: [
      { task: "Implement Merkle tree batching service", assignee: "dave", wallet: "0xMMdave0000000000000000000000000000000000", due: "2026-08-05", priority: "High", status: "in_progress", confidence: 0.89 },
      { task: "Deploy SummaryNFT contract to Polygon testnet", assignee: "eve", wallet: "0xMMeve00000000000000000000000000000000000", due: "2026-08-03", priority: "High", status: "todo", confidence: 0.91 },
      { task: "Design marketplace smart contract architecture", assignee: "grace", wallet: "0xMMgrace000000000000000000000000000000000", due: "2026-08-07", priority: "Medium", status: "todo", confidence: 0.87 },
      { task: "Set up multi-chain RPC configuration", assignee: "bob", wallet: "0xMMb0b000000000000000000000000000000000000", due: "2026-08-02", priority: "Medium", status: "done", confidence: 0.92 },
    ],
  },
  {
    id: "meeting_20260729_MM_009", title: "AI Agent Marketplace — Feature Spec", date: "2026-07-29T13:00:00Z", duration: "40 min",
    participants: ["alice", "carol", "grace", "heidi"], tags: ["marketplace", "nft", "product"], network: "arbitrum", status: "processed", confidence: 0.88,
    segments: [
      { start_ms: 0, end_ms: 8000, speaker: "alice", text: "Let's define the MVP feature set for the AI agent marketplace. We need to ship by end of August.", confidence: 0.90 },
      { start_ms: 8000, end_ms: 18000, speaker: "grace", text: "Core features: list summaries as NFTs, search/filter, purchase with MMT tokens, and a reputation system.", confidence: 0.87 },
      { start_ms: 18000, end_ms: 28000, speaker: "carol", text: "The UI needs a gallery view, detail modal with proof verification, and a wallet connection flow.", confidence: 0.89 },
      { start_ms: 28000, end_ms: 40000, speaker: "heidi", text: "We need clear terms of service for the marketplace. Sellers must attest that summaries don't contain PII.", confidence: 0.86 },
    ],
    summaryText: "Marketplace MVP: NFT listings, search/filter, MMT purchases, reputation system. UI: gallery view, proof verification modal, wallet connect. ToS required with PII attestation. Ship by end of August.",
    extracts: ["NFT listings with search/filter", "MMT token purchases", "Reputation system", "PII attestation required", "Ship by end of August"],
    actions: [
      { task: "Design marketplace gallery UI", assignee: "carol", wallet: "0xMMcar01000000000000000000000000000000000", due: "2026-08-05", priority: "High", status: "in_progress", confidence: 0.89 },
      { task: "Implement MMT payment integration", assignee: "grace", wallet: "0xMMgrace000000000000000000000000000000000", due: "2026-08-10", priority: "High", status: "todo", confidence: 0.87 },
      { task: "Draft marketplace terms of service", assignee: "heidi", wallet: "0xMMheidi000000000000000000000000000000000", due: "2026-08-03", priority: "Medium", status: "in_progress", confidence: 0.86 },
      { task: "Build reputation scoring algorithm", assignee: "alice", wallet: "0xMMa1b2c3d4e5f678901234567890abcdef1234567", due: "2026-08-12", priority: "Medium", status: "todo", confidence: 0.84 },
    ],
  },
  {
    id: "meeting_20260730_MM_010", title: "Security Audit — Smart Contract Review", date: "2026-07-30T10:00:00Z", duration: "48 min",
    participants: ["bob", "dave", "eve", "frank"], tags: ["security", "audit", "smart-contract"], network: "polygon", status: "anchored", confidence: 0.96,
    segments: [
      { start_ms: 0, end_ms: 10000, speaker: "eve", text: "I've completed the initial audit of the SummaryNFT contract. No critical vulnerabilities found.", confidence: 0.97 },
      { start_ms: 10000, end_ms: 22000, speaker: "dave", text: "The Merkle proof verification is gas-efficient. Average verification costs 45,000 gas on Polygon.", confidence: 0.94 },
      { start_ms: 22000, end_ms: 35000, speaker: "bob", text: "One medium-severity finding: the anchor contract doesn't have a pause mechanism. We should add it.", confidence: 0.92 },
      { start_ms: 35000, end_ms: 48000, speaker: "frank", text: "Budget for the external audit is approved. Engage CertiK or Trail of Bits for the final review.", confidence: 0.90 },
    ],
    summaryText: "Security audit: No critical vulnerabilities in SummaryNFT. Merkle proof verification at 45k gas. Medium finding: add pause mechanism to anchor contract. External audit budget approved (CertiK/ToB).",
    extracts: ["No critical vulnerabilities", "45k gas for proof verification", "Add pause mechanism (medium)", "External audit budget approved"],
    actions: [
      { task: "Add pause mechanism to anchor contract", assignee: "bob", wallet: "0xMMb0b000000000000000000000000000000000000", due: "2026-08-02", priority: "High", status: "in_progress", confidence: 0.92 },
      { task: "Engage external audit firm (CertiK or ToB)", assignee: "frank", wallet: "0xMMfrank000000000000000000000000000000000", due: "2026-08-05", priority: "High", status: "todo", confidence: 0.90 },
      { task: "Document all audit findings in security report", assignee: "eve", wallet: "0xMMeve00000000000000000000000000000000000", due: "2026-08-01", priority: "Medium", status: "in_review", confidence: 0.94 },
    ],
  },
  {
    id: "meeting_20260731_MM_011", title: "Product Standup — Agent Performance Metrics", date: "2026-07-31T09:00:00Z", duration: "18 min",
    participants: ["alice", "bob", "carol", "dave"], tags: ["standup", "agents", "metrics"], network: "polygon", status: "processed", confidence: 0.89,
    segments: [
      { start_ms: 0, end_ms: 4000, speaker: "alice", text: "Quick standup. What's the agent performance looking like this week?", confidence: 0.92 },
      { start_ms: 4000, end_ms: 9000, speaker: "dave", text: "Transcription agent is at 99.8% uptime. Processed 1,240 meetings. Average latency 1.2 seconds.", confidence: 0.90 },
      { start_ms: 9000, end_ms: 14000, speaker: "bob", text: "Action extractor had a spike in errors yesterday — 5 failures due to malformed transcripts. I've added validation.", confidence: 0.87 },
      { start_ms: 14000, end_ms: 18000, speaker: "carol", text: "Sentiment analyzer needs model retraining. Accuracy dropped to 82% on multilingual inputs.", confidence: 0.85 },
    ],
    summaryText: "Agent status: Transcription 99.8% uptime (1,240 processed), Action extractor had 5 errors (validation added), Sentiment analyzer accuracy dropped to 82% on multilingual — needs retraining.",
    extracts: ["Transcription: 99.8% uptime", "1,240 meetings processed", "5 action extractor errors fixed", "Sentiment accuracy 82% multilingual"],
    actions: [
      { task: "Retrain sentiment model on multilingual dataset", assignee: "carol", wallet: "0xMMcar01000000000000000000000000000000000", due: "2026-08-05", priority: "High", status: "todo", confidence: 0.85 },
      { task: "Add input validation to action extractor", assignee: "bob", wallet: "0xMMb0b000000000000000000000000000000000000", due: "2026-08-01", priority: "Medium", status: "done", confidence: 0.87 },
    ],
  },
  {
    id: "meeting_20260801_MM_012", title: "Token Economics — MMT Utility Design", date: "2026-08-01T14:00:00Z", duration: "42 min",
    participants: ["alice", "heidi", "ivan", "karl", "lena"], tags: ["tokenomics", "mmt", "web3"], network: "optimism", status: "minted", confidence: 0.91,
    segments: [
      { start_ms: 0, end_ms: 10000, speaker: "alice", text: "Let's finalize the MMT token utility model. We need this for the whitepaper revision.", confidence: 0.93 },
      { start_ms: 10000, end_ms: 20000, speaker: "heidi", text: "Three utility pillars: governance voting, marketplace payments, and staking for premium agent access.", confidence: 0.90 },
      { start_ms: 20000, end_ms: 30000, speaker: "ivan", text: "Staking yields should be 5-8% APY to incentivize long-term holding without excessive inflation.", confidence: 0.88 },
      { start_ms: 30000, end_ms: 42000, speaker: "karl", text: "We should implement a buy-back-and-burn mechanism using 2% of marketplace fees to manage supply.", confidence: 0.87 },
    ],
    summaryText: "MMT token utility: governance, marketplace payments, staking (5-8% APY). Buy-back-and-burn at 2% of marketplace fees. Three-pillar model approved for whitepaper.",
    extracts: ["Three utility pillars", "5-8% APY staking", "2% marketplace fee burn", "Whitepaper revision needed"],
    actions: [
      { task: "Draft updated tokenomics section for whitepaper", assignee: "heidi", wallet: "0xMMheidi000000000000000000000000000000000", due: "2026-08-05", priority: "High", status: "in_progress", confidence: 0.90 },
      { task: "Model staking yield scenarios (5-8% APY)", assignee: "ivan", wallet: "0xMMivan0000000000000000000000000000000000", due: "2026-08-04", priority: "High", status: "todo", confidence: 0.88 },
      { task: "Design buy-back-and-burn smart contract", assignee: "karl", wallet: "0xMMkarl0000000000000000000000000000000000", due: "2026-08-08", priority: "Medium", status: "todo", confidence: 0.87 },
      { task: "Create token distribution visualization", assignee: "lena", wallet: "0xMMlena0000000000000000000000000000000000", due: "2026-08-06", priority: "Low", status: "todo", confidence: 0.85 },
    ],
  },
];

// ─── Build Full Meeting Objects ───────────────────────────────────────────────
function buildMeetings(): Meeting[] {
  return meetingDefs.map((def, idx) => {
    const transcript: Transcript = {
      transcript_id: `trans_${def.id}_v1`,
      meeting_id: def.id,
      source_audio_cid: `bafybeiexampleaudio${String(idx + 1).padStart(4, "0")}`,
      segments: def.segments,
      created_at: def.date,
    };

    const summary: Summary = {
      summary_id: `sum_${def.id}_v1`,
      meeting_id: def.id,
      summary_text: def.summaryText,
      extracts: def.extracts,
      confidence: def.confidence,
      summary_cid: `bafybeiexamplesummary${String(idx + 1).padStart(4, "0")}`,
      anchor_hash: `0xhash${def.id.replace(/[^a-z0-9]/g, "").slice(0, 16)}`,
      approved_by: def.status === "minted" || def.status === "anchored" ? "alice" : null,
      approved_at: def.status === "minted" || def.status === "anchored" ? def.date : null,
      created_at: def.date,
    };

    const actions: ActionItemWeb3[] = def.actions.map((a, ai) => ({
      action_id: `action_${def.id}_${String(ai + 1).padStart(2, "0")}`,
      meeting_id: def.id,
      task: a.task,
      assignee: a.assignee,
      assignee_wallet: a.wallet,
      due_date: a.due,
      priority: a.priority,
      confidence: a.confidence,
      created_by: "action_extraction_agent_v1",
      created_at: def.date,
      status: a.status,
    }));

    const anchor: AnchorMeta | null =
      def.status === "anchored" || def.status === "minted"
        ? {
            anchor_id: `root_${def.network}_${def.date.slice(0, 10).replace(/-/g, "")}_b${idx + 1}`,
            root_hash: `0xroot${def.id.replace(/[^a-z0-9]/g, "").slice(0, 20)}`,
            batch: actions.map((_, i) => `0xleaf${idx + 1}${i + 1}`),
            tx_hash: `0xtx${def.id.replace(/[^a-z0-9]/g, "").slice(0, 24)}`,
            network: def.network,
            pinned_cid: `bafybeibatchcid${String(idx + 1).padStart(3, "0")}`,
            submitter: "0xMMrelayer00000000000000000000000000000000",
            status: "confirmed",
            confirmations: 12,
            created_at: def.date,
          }
        : null;

    const nft: NFTMetadata | null =
      def.status === "minted"
        ? {
            token_id: 40 + idx + 1,
            name: `${def.title} — Verified Summary #${40 + idx + 1}`,
            description: "A verified meeting summary minted as NFT. Summary content referenced via IPFS CID.",
            summary_cid: summary.summary_cid,
            summary_hash: summary.anchor_hash,
            meeting_id: def.id,
            anchor: {
              root: anchor!.root_hash,
              tx_hash: anchor!.tx_hash!,
              network: def.network,
            },
            license: "CC-BY-NC-4.0",
            attributes: [
              { trait_type: "confidence", value: def.confidence },
              { trait_type: "approved_by", value: "alice" },
              { trait_type: "participant_count", value: def.participants.length },
              { trait_type: "action_count", value: actions.length },
              { trait_type: "network", value: def.network },
            ],
            created_at: def.date,
            owner: "0xMMa1b2c3d4e5f678901234567890abcdef1234567",
          }
        : null;

    return {
      id: def.id,
      title: def.title,
      date: def.date,
      duration: def.duration,
      participants: def.participants,
      participant_count: def.participants.length,
      status: def.status,
      confidence: def.confidence,
      tags: def.tags,
      transcript,
      summary,
      actions,
      anchor,
      nft,
    };
  });
}

export const mockMeetings: Meeting[] = buildMeetings();

// ─── All Actions (flattened) ──────────────────────────────────────────────────
export const mockAllActions: ActionItemWeb3[] = mockMeetings.flatMap((m) => m.actions);

// ─── All Anchors ──────────────────────────────────────────────────────────────
export const mockAnchors: AnchorMeta[] = mockMeetings
  .filter((m) => m.anchor !== null)
  .map((m) => m.anchor!);

// ─── All NFTs ─────────────────────────────────────────────────────────────────
export const mockNFTs: NFTMetadata[] = mockMeetings
  .filter((m) => m.nft !== null)
  .map((m) => m.nft!);

// ─── Agent Events Timeline ───────────────────────────────────────────────────
export const mockAgentEvents: AgentEvent[] = [
  { id: "evt_001", time: "2026-07-21T11:58:20Z", agent: "TranscriptionAgent", type: "transcript_ready", payload: { meeting_id: "meeting_20260721_MM_001", segments: 7, duration_ms: 48000 }, status: "success" },
  { id: "evt_002", time: "2026-07-21T11:59:40Z", agent: "SummarizationAgent", type: "summary_ready", payload: { meeting_id: "meeting_20260721_MM_001", confidence: 0.92, thinking_tokens: 1240 }, status: "success" },
  { id: "evt_003", time: "2026-07-21T12:00:10Z", agent: "ActionExtractionAgent", type: "action_created", payload: { action_id: "action_meeting_20260721_MM_001_01", task: "Draft LinkedIn ad copy", assignee: "bob" }, status: "success" },
  { id: "evt_004", time: "2026-07-21T12:00:15Z", agent: "ActionExtractionAgent", type: "action_created", payload: { action_id: "action_meeting_20260721_MM_001_02", task: "Coordinate events requirements", assignee: "carol" }, status: "success" },
  { id: "evt_005", time: "2026-07-21T12:01:00Z", agent: "IntegrationAgent", type: "jira_ticket_created", payload: { ticket_id: "MM-342", task: "Landing page redesign", project: "MeetingMind" }, status: "success" },
  { id: "evt_006", time: "2026-07-21T12:05:00Z", agent: "OrchestrationAgent", type: "anchor_submitted", payload: { anchor_id: "root_polygon_20260721_b1", tx_hash: "0xtxmeeting20260721MM001", network: "polygon" }, status: "success" },
  { id: "evt_007", time: "2026-07-21T12:05:30Z", agent: "OrchestrationAgent", type: "anchor_confirmed", payload: { anchor_id: "root_polygon_20260721_b1", confirmations: 12 }, status: "success" },
  { id: "evt_008", time: "2026-07-21T12:06:10Z", agent: "NFTAgent", type: "nft_minted", payload: { token_id: 41, tokenURI: "ipfs://bafybeiexamplesummary0001", network: "polygon" }, status: "success" },
  { id: "evt_009", time: "2026-07-22T09:35:00Z", agent: "TranscriptionAgent", type: "transcript_ready", payload: { meeting_id: "meeting_20260722_MM_002", segments: 5, duration_ms: 32000 }, status: "success" },
  { id: "evt_010", time: "2026-07-22T09:36:20Z", agent: "SummarizationAgent", type: "summary_ready", payload: { meeting_id: "meeting_20260722_MM_002", confidence: 0.94 }, status: "success" },
  { id: "evt_011", time: "2026-07-23T15:05:00Z", agent: "TranscriptionAgent", type: "transcript_ready", payload: { meeting_id: "meeting_20260723_MM_003", segments: 7 }, status: "success" },
  { id: "evt_012", time: "2026-07-23T15:07:00Z", agent: "SummarizationAgent", type: "summary_ready", payload: { meeting_id: "meeting_20260723_MM_003", confidence: 0.95 }, status: "success" },
  { id: "evt_013", time: "2026-07-23T15:08:00Z", agent: "ActionExtractionAgent", type: "batch_actions_created", payload: { meeting_id: "meeting_20260723_MM_003", count: 7 }, status: "success" },
  { id: "evt_014", time: "2026-07-23T15:10:00Z", agent: "OrchestrationAgent", type: "anchor_submitted", payload: { anchor_id: "root_optimism_20260723_b3", network: "optimism" }, status: "success" },
  { id: "evt_015", time: "2026-07-23T15:12:00Z", agent: "NFTAgent", type: "nft_minted", payload: { token_id: 43, network: "optimism" }, status: "success" },
  { id: "evt_016", time: "2026-07-24T11:30:00Z", agent: "TranscriptionAgent", type: "transcript_ready", payload: { meeting_id: "meeting_20260724_MM_004", segments: 4 }, status: "success" },
  { id: "evt_017", time: "2026-07-24T11:31:00Z", agent: "SummarizationAgent", type: "summary_ready", payload: { meeting_id: "meeting_20260724_MM_004", confidence: 0.79 }, status: "success" },
  { id: "evt_018", time: "2026-07-24T11:31:30Z", agent: "SummarizationAgent", type: "low_confidence_flag", payload: { meeting_id: "meeting_20260724_MM_004", reason: "Incident retro may need manual review" }, status: "pending" },
  { id: "evt_019", time: "2026-07-27T16:40:00Z", agent: "OrchestrationAgent", type: "dao_proposal_submitted", payload: { proposal_id: "prop_007", title: "5% treasury for marketplace", network: "polygon" }, status: "success" },
  { id: "evt_020", time: "2026-07-28T10:00:00Z", agent: "IntegrationAgent", type: "slack_notification_sent", payload: { channel: "#engineering", message: "Web3 architecture review complete — 4 action items created" }, status: "success" },
  { id: "evt_021", time: "2026-07-30T10:50:00Z", agent: "OrchestrationAgent", type: "anchor_submitted", payload: { anchor_id: "root_polygon_20260730_b10", network: "polygon" }, status: "success" },
  { id: "evt_022", time: "2026-07-31T09:20:00Z", agent: "SentimentAnalyzer", type: "sentiment_analyzed", payload: { meeting_id: "meeting_20260731_MM_011", overall: "neutral", score: 0.62 }, status: "success" },
  { id: "evt_023", time: "2026-08-01T14:45:00Z", agent: "NFTAgent", type: "nft_minted", payload: { token_id: 52, tokenURI: "ipfs://bafybeiexamplesummary0012", network: "optimism" }, status: "success" },
  // Error / failure events
  { id: "evt_err_01", time: "2026-07-25T03:14:00Z", agent: "OrchestrationAgent", type: "anchor_failed", payload: { anchor_id: "root_polygon_20260725_b5", error: "Relayer returned 503", retry_count: 1 }, status: "error" },
  { id: "evt_err_02", time: "2026-07-25T03:16:00Z", agent: "OrchestrationAgent", type: "anchor_retry", payload: { anchor_id: "root_polygon_20260725_b5", retry_count: 2 }, status: "pending" },
  { id: "evt_err_03", time: "2026-07-25T03:18:00Z", agent: "OrchestrationAgent", type: "anchor_confirmed", payload: { anchor_id: "root_polygon_20260725_b5", confirmations: 12 }, status: "success" },
  { id: "evt_err_04", time: "2026-07-26T08:00:00Z", agent: "NFTAgent", type: "pin_failed", payload: { summary_cid: "bafybeiexamplesummary0006", error: "IPFS gateway timeout" }, status: "error" },
  { id: "evt_err_05", time: "2026-07-26T08:02:00Z", agent: "NFTAgent", type: "pin_retry_success", payload: { summary_cid: "bafybeiexamplesummary0006" }, status: "success" },
  { id: "evt_err_06", time: "2026-07-29T14:00:00Z", agent: "NFTAgent", type: "mint_reverted", payload: { error: "insufficient funds", token_id: null, to: "0xMMseller00000000000000000000000000000000" }, status: "error" },
];

// ─── On-Chain Events ──────────────────────────────────────────────────────────
export const mockOnChainEvents: OnChainEvent[] = [
  {
    event: "RootAnchored",
    args: { root: "0xrootmeeting20260721MM", submitter: "0xMMrelayer00000000000000000000000000000000", blockTime: 1720000000, meta: '{"batch_id":"b1","pinned_cid":"bafybeibatchcid001"}' },
    tx_hash: "0xtxmeeting20260721MM001", network: "polygon", block_number: 58234521, timestamp: "2026-07-21T12:05:00Z",
  },
  {
    event: "Transfer",
    args: { from: "0x0000000000000000000000000000000000000000", to: "0xMMa1b2c3d4e5f678901234567890abcdef1234567", tokenId: "41" },
    tx_hash: "0xtxmint20260721001", network: "polygon", block_number: 58234530, timestamp: "2026-07-21T12:06:10Z",
  },
  {
    event: "RootAnchored",
    args: { root: "0xrootmeeting20260723MM", submitter: "0xMMrelayer00000000000000000000000000000000", blockTime: 1720200000, meta: '{"batch_id":"b3","pinned_cid":"bafybeibatchcid003"}' },
    tx_hash: "0xtxmeeting20260723MM003", network: "optimism", block_number: 112450021, timestamp: "2026-07-23T15:10:00Z",
  },
  {
    event: "Transfer",
    args: { from: "0x0000000000000000000000000000000000000000", to: "0xMMa1b2c3d4e5f678901234567890abcdef1234567", tokenId: "43" },
    tx_hash: "0xtxmint20260723003", network: "optimism", block_number: 112450030, timestamp: "2026-07-23T15:12:00Z",
  },
  {
    event: "ProposalCreated",
    args: { proposalId: "7", proposer: "0xMMa1b2c3d4e5f678901234567890abcdef1234567", description: "Allocate 5% treasury for AI marketplace" },
    tx_hash: "0xtxprop007", network: "polygon", block_number: 58300100, timestamp: "2026-07-27T16:40:00Z",
  },
  {
    event: "RootAnchored",
    args: { root: "0xrootmeeting20260730MM", submitter: "0xMMrelayer00000000000000000000000000000000", blockTime: 1720600000 },
    tx_hash: "0xtxmeeting20260730MM010", network: "polygon", block_number: 58401200, timestamp: "2026-07-30T10:50:00Z",
  },
  {
    event: "Transfer",
    args: { from: "0x0000000000000000000000000000000000000000", to: "0xMMa1b2c3d4e5f678901234567890abcdef1234567", tokenId: "52" },
    tx_hash: "0xtxmint20260801012", network: "optimism", block_number: 112550080, timestamp: "2026-08-01T14:45:00Z",
  },
];

// ─── Merkle Proof Test Vectors ────────────────────────────────────────────────
export interface MerkleProofVector {
  name: string;
  leaf: string;
  root: string;
  proof: string[];
  expected: boolean;
  description: string;
}

export const mockMerkleProofs: MerkleProofVector[] = [
  {
    name: "Single-leaf valid proof",
    leaf: "0xleaf_single_abc123def456",
    root: "0xroot_single_abc123def456",
    proof: [],
    expected: true,
    description: "Single leaf tree — root equals leaf hash. Proof is empty array.",
  },
  {
    name: "Three-leaf valid proof for L2",
    leaf: "0xleaf2_meeting_20260721_MM_001",
    root: "0xrootmeeting20260721MM",
    proof: ["0xproof_sibling_L1", "0xproof_parent_L3"],
    expected: true,
    description: "Standard 3-leaf Merkle tree. Proof for second leaf includes sibling and parent hashes.",
  },
  {
    name: "Tampered leaf — proof mismatch",
    leaf: "0xleaf_TAMPERED_invalid",
    root: "0xrootmeeting20260721MM",
    proof: ["0xproof_sibling_L1", "0xproof_parent_L3"],
    expected: false,
    description: "Modified summary text produces different leaf hash. Verification correctly returns false.",
  },
  {
    name: "Wrong root — different batch",
    leaf: "0xleaf2_meeting_20260721_MM_001",
    root: "0xroot_WRONG_BATCH",
    proof: ["0xproof_sibling_L1", "0xproof_parent_L3"],
    expected: false,
    description: "Correct leaf and proof but against wrong root. Verification fails.",
  },
];

// ─── Failure Mode Scenarios ───────────────────────────────────────────────────
export interface FailureScenario {
  id: string;
  type: "anchor_stuck" | "ipfs_pin_failed" | "insufficient_gas" | "duplicate_anchor" | "proof_mismatch";
  description: string;
  apiEndpoint: string;
  mockResponse: Record<string, unknown>;
  uiAction: string;
}

export const mockFailureScenarios: FailureScenario[] = [
  {
    id: "fail_001", type: "anchor_stuck",
    description: "Anchor meta present but tx_hash null for >10 minutes",
    apiEndpoint: "POST /api/anchors/:id/retry",
    mockResponse: { anchor_id: "root_polygon_stuck_001", tx_hash: null, status: "pending", retry_available: true },
    uiAction: "Show 'Retry Anchor' button with spinner. Display time elapsed since submission.",
  },
  {
    id: "fail_002", type: "ipfs_pin_failed",
    description: "IPFS pinning service returns 500, then succeeds on retry",
    apiEndpoint: "POST /api/nft/pin",
    mockResponse: { error: "IPFS gateway timeout", status: 500, retry_after_ms: 3000 },
    uiAction: "Show error toast, then auto-retry after 3s. Display retry CTA if auto-retry also fails.",
  },
  {
    id: "fail_003", type: "insufficient_gas",
    description: "NFT mint reverts due to insufficient funds in wallet",
    apiEndpoint: "POST /api/nft/mint",
    mockResponse: { error: "reverted", reason: "insufficient funds", receipt: { status: 0, gasUsed: "21000" } },
    uiAction: "Show error modal with 'Add Funds' link and estimated gas needed.",
  },
  {
    id: "fail_004", type: "duplicate_anchor",
    description: "Anchor root already exists on-chain — collision detected",
    apiEndpoint: "POST /api/anchors/batch",
    mockResponse: { error: "duplicate_root", message: "anchored[root] already true", existing_tx: "0xtxexisting..." },
    uiAction: "Display warning: 'This batch was already anchored.' Link to existing transaction.",
  },
  {
    id: "fail_005", type: "proof_mismatch",
    description: "Verification returns false — summary marked as suspicious",
    apiEndpoint: "POST /api/verify/proof",
    mockResponse: { verified: false, summary_status: "suspicious", mismatch_details: { expected_leaf: "0xabc...", computed_leaf: "0xdef..." } },
    uiAction: "Show red alert banner: 'Integrity check failed.' Flag for manual review.",
  },
];

// ─── Agent Definitions (extended) ─────────────────────────────────────────────
export interface AgentDefinition {
  name: string;
  status: "active" | "idle" | "error";
  uptime: string;
  processed: number;
  avgLatency: string;
  errors: number;
  description: string;
  model: string;
  capabilities: string[];
  lastActivity: string;
}

export const mockAgents: AgentDefinition[] = [
  { name: "Transcription Agent", status: "active", uptime: "99.8%", processed: 1240, avgLatency: "1.2s", errors: 2, description: "Converts audio to text with speaker diarization and timestamp alignment", model: "GLM-4.5-Air", capabilities: ["ASR", "diarization", "timestamp-sync"], lastActivity: "2 min ago" },
  { name: "Summarization Agent", status: "active", uptime: "99.9%", processed: 1100, avgLatency: "1.5s", errors: 1, description: "Generates concise summaries with thinking-mode reasoning chains", model: "GLM-4.7 Thinking", capabilities: ["summarize", "extract-decisions", "reasoning-chain"], lastActivity: "5 min ago" },
  { name: "Action Extraction Agent", status: "active", uptime: "99.5%", processed: 980, avgLatency: "0.8s", errors: 5, description: "Identifies action items, assignees, deadlines via function calling", model: "GLM-4.6 + FC", capabilities: ["function-calling", "entity-extraction", "priority-scoring"], lastActivity: "3 min ago" },
  { name: "Sentiment Analyzer", status: "active", uptime: "98.2%", processed: 870, avgLatency: "0.6s", errors: 8, description: "Detects tone, sentiment shifts, and emotional patterns in conversations", model: "GLM-4.5-Flash", capabilities: ["sentiment-scoring", "topic-sentiment", "highlight-extraction"], lastActivity: "8 min ago" },
  { name: "Integration Agent", status: "idle", uptime: "97.1%", processed: 650, avgLatency: "2.1s", errors: 12, description: "Routes actions to external tools (Jira, Slack, GitHub) via MCP protocol", model: "GLM-4.7-Flash + MCP", capabilities: ["jira-create", "slack-notify", "github-issue", "mcp-routing"], lastActivity: "15 min ago" },
  { name: "QA Agent", status: "active", uptime: "99.3%", processed: 420, avgLatency: "1.8s", errors: 3, description: "Answers natural language questions about meeting content with source citations", model: "GLM-4.7", capabilities: ["qa", "source-citation", "context-retrieval"], lastActivity: "1 min ago" },
  { name: "Orchestration Agent", status: "active", uptime: "99.7%", processed: 2100, avgLatency: "0.3s", errors: 4, description: "Coordinates agent pipeline, manages batching, and triggers blockchain operations", model: "GLM-4.7-Flash", capabilities: ["pipeline-management", "batch-anchor", "nft-mint", "event-routing"], lastActivity: "30s ago" },
  { name: "NFT Agent", status: "active", uptime: "98.9%", processed: 340, avgLatency: "3.2s", errors: 6, description: "Handles IPFS pinning, metadata creation, and NFT minting across chains", model: "Custom Pipeline", capabilities: ["ipfs-pin", "metadata-build", "erc721-mint", "multi-chain"], lastActivity: "12 min ago" },
  { name: "DAO Governance Agent", status: "idle", uptime: "99.1%", processed: 45, avgLatency: "4.5s", errors: 1, description: "Manages on-chain proposals, voting, and agent configuration updates via governance", model: "GLM-4.7", capabilities: ["proposal-submit", "vote-tally", "config-update", "treasury-ops"], lastActivity: "2h ago" },
];

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const mockDashboardStats = {
  meetingsThisWeek: 24,
  meetingsChange: "+12%",
  actionsCreated: 87,
  actionsChange: "+8%",
  agentsActive: 9,
  agentsChange: "+3",
  avgProcessing: "1.2s",
  processingChange: "-15%",
  anchorsThisWeek: 18,
  anchorsChange: "+22%",
  nftsMinted: 12,
  nftsChange: "+40%",
  totalTokensProcessed: "2.4M",
  gasSpentWei: "0.082 ETH",
};

// ─── Utility: Get meeting by ID ───────────────────────────────────────────────
export function getMeetingById(id: string): Meeting | undefined {
  return mockMeetings.find((m) => m.id === id);
}

// ─── Utility: Get actions by status ───────────────────────────────────────────
export function getActionsByStatus(status: ActionItemWeb3["status"]): ActionItemWeb3[] {
  return mockAllActions.filter((a) => a.status === status);
}

// ─── Utility: Format address for display ──────────────────────────────────────
export function formatAddress(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
