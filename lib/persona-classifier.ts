import type { WalletPersona, WalletAnalysis } from "@/types/wallet";

const PERSONAS: Record<string, WalletPersona> = {
  "DAO Governor": {
    type: "DAO Governor",
    emoji: "🏛️",
    description: "A governance maximalist who shapes protocols through votes and proposals.",
    rarity: "Epic",
    color: "#7c3aed",
  },
  "DeFi Degen": {
    type: "DeFi Degen",
    emoji: "🧬",
    description: "Deep in the DeFi trenches — swapping, farming, and LPing across every protocol.",
    rarity: "Rare",
    color: "#06b6d4",
  },
  "Diamond Hands": {
    type: "Diamond Hands",
    emoji: "💎",
    description: "HODLing through every market cycle. Patience is the strategy.",
    rarity: "Rare",
    color: "#3b82f6",
  },
  "NFT Collector": {
    type: "NFT Collector",
    emoji: "🎨",
    description: "Curating a digital art collection that tells a visual story.",
    rarity: "Rare",
    color: "#ec4899",
  },
  "Yield Farmer": {
    type: "Yield Farmer",
    emoji: "🌾",
    description: "Maximizing returns across DeFi protocols with calculated precision.",
    rarity: "Epic",
    color: "#10b981",
  },
  "Whale Watcher": {
    type: "Whale Watcher",
    emoji: "🐋",
    description: "A significant holder whose moves can ripple through markets.",
    rarity: "Legendary",
    color: "#f59e0b",
  },
  "Crypto Curious": {
    type: "Crypto Curious",
    emoji: "🔭",
    description: "Exploring the blockchain frontier — every transaction is a new discovery.",
    rarity: "Common",
    color: "#6b7280",
  },
  "On-Chain Native": {
    type: "On-Chain Native",
    emoji: "⛓️",
    description: "Living on-chain with a balanced portfolio of activity and assets.",
    rarity: "Common",
    color: "#8b5cf6",
  },
};

export function classifyPersona(data: WalletAnalysis): WalletPersona {
  // Whale Watcher: high ETH balance
  const balance = Number(data.balance) / 1e18;
  if (balance > 10) {
    return { ...PERSONAS["Whale Watcher"] };
  }

  // DAO Governor: governance activity
  if (data.governanceVotes > 5 && data.defiProtocolCount > 3) {
    return { ...PERSONAS["DAO Governor"] };
  }

  // DeFi Degen: many defi protocols and high tx count
  if (data.defiProtocolCount > 6 && data.txCount > 300) {
    return { ...PERSONAS["DeFi Degen"] };
  }

  // NFT Collector
  if (data.nftCount > 15) {
    return { ...PERSONAS["NFT Collector"] };
  }

  // Yield Farmer
  if (data.defiProtocolCount > 3 && data.txCount > 150) {
    return { ...PERSONAS["Yield Farmer"] };
  }

  // Diamond Hands: old wallet, few transactions
  if (data.walletAgeMonths > 24 && data.txCount < 80) {
    return { ...PERSONAS["Diamond Hands"] };
  }

  // Crypto Curious: new or low activity
  if (data.walletAgeMonths < 6 || data.txCount < 15) {
    return { ...PERSONAS["Crypto Curious"] };
  }

  // Default
  return { ...PERSONAS["On-Chain Native"] };
}

export function getPersonaByName(name: string): WalletPersona {
  return PERSONAS[name] || PERSONAS["On-Chain Native"];
}

export function getAllPersonas(): WalletPersona[] {
  return Object.values(PERSONAS);
}
