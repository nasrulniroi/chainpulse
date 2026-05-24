import type { WalletAnalysis, WalletPersona, ScoreBreakdown } from "@/types/wallet";

const AI_ENABLED = process.env.AI_ENABLED !== "false";
const AI_BASE_URL = process.env.AI_BASE_URL || "https://api.groq.com/openai/v1";
const AI_API_KEY = process.env.AI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are a blockchain analyst. Write concise, insightful wallet profiles. Never mention wallet addresses directly. Write in third person. Keep responses to 2-3 sentences max. Plain text only, no markdown.`;

export async function generateNarrative(data: WalletAnalysis, persona: WalletPersona, breakdown: ScoreBreakdown): Promise<string> {
if (!AI_ENABLED || !AI_API_KEY || AI_API_KEY === "your_key_here") {
    return getFallbackNarrative(data, persona);
  }

  try {
    const prompt = `Analyze this wallet profile and write a 2-3 sentence narrative:

Persona: ${persona.type} ${persona.emoji}
Wallet Age: ${data.walletAgeMonths} months
Total Transactions: ${data.txCount}
DeFi Protocols Used: ${data.defiProtocolCount}
NFTs Owned: ${data.nftCount}
Tokens Held: ${data.tokenCount}
Governance Votes: ${data.governanceVotes}
ETH Balance: ${(Number(data.balance) / 1e18).toFixed(4)}
Active Months: ${data.activeMonths}
Top Protocols: ${data.uniqueProtocols.slice(0, 5).join(", ") || "None detected"}

Score Breakdown:
- Consistency: ${breakdown.consistency}/25
- Diversity: ${breakdown.diversity}/25
- Hold Duration: ${breakdown.holdDuration}/25
- Governance: ${breakdown.governance}/25`;

    const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return getFallbackNarrative(data, persona);

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    return content?.trim() || getFallbackNarrative(data, persona);
  } catch {
    return getFallbackNarrative(data, persona);
  }
}

function getFallbackNarrative(data: WalletAnalysis, persona: WalletPersona): string {
  const balance = (Number(data.balance) / 1e18).toFixed(2);
  const age = data.walletAgeMonths;
  const protos = data.uniqueProtocols.length;

  const templates = [
    `This ${persona.type.toLowerCase()} has been active for ${age} months with ${data.txCount} transactions across ${protos} protocols. Holding ${balance} ETH, they demonstrate ${age > 12 ? "seasoned" : "growing"} on-chain engagement.`,
    `A ${persona.rarity.toLowerCase()} ${persona.type.toLowerCase()} with ${data.txCount} transactions and ${data.nftCount} NFTs. Their ${age}-month journey shows ${data.defiProtocolCount > 3 ? "deep DeFi expertise" : "steady exploration"} of the Ethereum ecosystem.`,
    `${persona.emoji} ${persona.type} profile: ${data.txCount} transactions over ${age} months, spanning ${protos} unique protocols. ${data.governanceVotes > 0 ? `Active governance participant with ${data.governanceVotes} votes.` : "Focused on transactions over governance."}`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

export async function generatePersonaDescription(persona: WalletPersona, stats: { txCount: number; nftCount: number; defiCount: number }): Promise<string> {
if (!AI_ENABLED || !AI_API_KEY || AI_API_KEY === "your_key_here") {
    return persona.description;
  }

  try {
    const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: "Write a single sentence persona description. Be creative but accurate. No markdown." },
          { role: "user", content: `Persona: ${persona.type}, ${stats.txCount} txs, ${stats.nftCount} NFTs, ${stats.defiCount} DeFi protocols` },
        ],
        max_tokens: 60,
        temperature: 0.8,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return persona.description;
    const json = await res.json();
    return json.choices?.[0]?.message?.content?.trim() || persona.description;
  } catch {
    return persona.description;
  }
}
