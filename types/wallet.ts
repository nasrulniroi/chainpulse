// ─── Wallet Persona ───

export interface WalletPersona {
  type: string;
  emoji: string;
  description: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  color: string;
}

// ─── Score Breakdown ───

export interface ScoreBreakdown {
  consistency: number;
  diversity: number;
  holdDuration: number;
  governance: number;
}

// ─── Wallet Stat ───

export interface WalletStat {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
}

// ─── Activity Event ───

export interface ActivityEvent {
  date: string;
  type: "defi" | "nft" | "transfer" | "governance" | "contract" | "token";
  description: string;
  protocol?: string;
  value?: string;
  hash: string;
  chain: string;
}

// ─── Wallet Profile (main output) ───

export interface WalletProfile {
  address: string;
  ens?: string;
  firstActivity: string;
  lastActivity: string;
  totalTxCount: number;
  persona: WalletPersona;
  traits: string[];
  reputationScore: number;
  scoreBreakdown: ScoreBreakdown;
  stats: WalletStat[];
  recentActivity: ActivityEvent[];
  narrative: string;
  tokenCount: number;
  nftCount: number;
  analyzedAt: string;
}

// ─── Blockscout Raw Types ───

export interface BlockscoutAddressInfo {
  hash: string;
  ens_domain_name?: string;
  is_contract: boolean;
  coin_balance: string;
  implementation_name?: string;
  block_number_balance_updated_at?: string;
}

export interface BlockscoutTransaction {
  hash: string;
  block: number;
  timestamp: string;
  from: { hash: string; ens_domain_name?: string; is_contract: boolean };
  to: { hash: string; ens_domain_name?: string; is_contract: string } | null;
  value: string;
  method?: string;
  status: string;
  tx_types?: string[];
  token_transfers?: any[];
}

export interface BlockscoutTokenBalance {
  token: {
    address: string;
    name: string;
    symbol: string;
    type: string;
    decimals: string;
  };
  value: string;
  token_id?: string;
}

export interface BlockscoutNFT {
  id: string;
  token_type: string;
  name?: string;
  description?: string;
  image_url?: string;
  collection?: {
    name: string;
    symbol?: string;
  };
  token?: {
    address: string;
    name: string;
    symbol: string;
  };
}

// ─── Wallet Analysis (intermediate) ───

export interface WalletAnalysis {
  address: string;
  ens?: string;
  balance: string;
  isContract: boolean;
  txCount: number;
  firstTxDate: string;
  lastTxDate: string;
  uniqueProtocols: string[];
  defiProtocolCount: number;
  governanceVotes: number;
  tokenCount: number;
  nftCount: number;
  walletAgeMonths: number;
  activeMonths: number;
  recentTransactions: BlockscoutTransaction[];
  tokenBalances: BlockscoutTokenBalance[];
  nfts: BlockscoutNFT[];
}

// ─── Persona Type Enum ───

export type PersonaType =
  | "DAO Governor"
  | "DeFi Degen"
  | "Diamond Hands"
  | "NFT Collector"
  | "Yield Farmer"
  | "Whale Watcher"
  | "Crypto Curious"
  | "On-Chain Native";

// ─── API Response ───

export interface AnalyzeResponse {
  success: boolean;
  data?: WalletProfile;
  error?: string;
  cached?: boolean;
}
