import {
  getAddressInfo,
  getTransactions,
  getTokenBalances,
  getNFTs,
  detectProtocol,
} from "./blockscout";
import { classifyPersona } from "./persona-classifier";
import { generateNarrative } from "./ai-narrative";
import type {
  WalletProfile,
  WalletAnalysis,
  WalletStat,
  ActivityEvent,
  ScoreBreakdown,
  BlockscoutTransaction,
} from "@/types/wallet";
import { formatDate, formatRelativeTime, getExplorerUrl } from "./utils";

export async function analyzeWallet(address: string): Promise<WalletProfile> {
  // 1. Fetch all data from Blockscout in parallel
  const [addressInfo, transactions, tokenBalances, nfts] = await Promise.allSettled([
    getAddressInfo(address),
    getTransactions(address, 50),
    getTokenBalances(address),
    getNFTs(address),
  ]);

  const addr = addressInfo.status === "fulfilled" ? addressInfo.value : null;
  const txs = transactions.status === "fulfilled" ? transactions.value : [];
  const tokens = tokenBalances.status === "fulfilled" ? tokenBalances.value : [];
  const nftList = nfts.status === "fulfilled" ? nfts.value : [];

  // 2. Process transactions
  const protocols = new Set<string>();
  let governanceVotes = 0;

  for (const tx of txs) {
    const protocol = detectProtocol(tx);
    if (protocol) {
      if (protocol === "Governance") governanceVotes++;
      else protocols.add(protocol);
    }
    // Detect from tx_types
    if (tx.tx_types?.includes("token_transfer")) protocols.add("Token Transfer");
    if (tx.tx_types?.includes("contract_call")) protocols.add("Smart Contract");
  }

  // 3. Calculate wallet age
  const firstTx = txs.length > 0 ? txs[txs.length - 1] : null;
  const lastTx = txs.length > 0 ? txs[0] : null;
  const firstDate = firstTx ? new Date(firstTx.timestamp) : new Date();
  const lastDate = lastTx ? new Date(lastTx.timestamp) : new Date();
  const walletAgeMonths = Math.max(1, Math.floor(
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  ));

  // 4. Calculate active months
  const activeMonthSet = new Set<string>();
  for (const tx of txs) {
    const d = new Date(tx.timestamp);
    activeMonthSet.add(`${d.getFullYear()}-${d.getMonth()}`);
  }

  // 5. Build analysis object
  const analysis: WalletAnalysis = {
    address: addr?.hash || address,
    ens: addr?.ens_domain_name || undefined,
    balance: addr?.coin_balance || "0",
    isContract: addr?.is_contract || false,
    txCount: txs.length,
    firstTxDate: firstDate.toISOString(),
    lastTxDate: lastDate.toISOString(),
    uniqueProtocols: Array.from(protocols),
    defiProtocolCount: Array.from(protocols).filter(p =>
      ["Uniswap V2", "Uniswap V3", "Aave V2", "Aave V3", "Compound", "Compound V3",
       "0x Exchange", "1inch", "1inch v5", "DEX", "DeFi", "Yield Farming"].includes(p)
    ).length,
    governanceVotes,
    tokenCount: tokens.length,
    nftCount: nftList.length,
    walletAgeMonths,
    activeMonths: activeMonthSet.size,
    recentTransactions: txs,
    tokenBalances: tokens,
    nfts: nftList,
  };

  // 6. Classify persona
  const persona = classifyPersona(analysis);

  // 7. Calculate reputation score
  const consistency = Math.min(25, Math.round((activeMonthSet.size / Math.max(1, walletAgeMonths)) * 25));
  const diversity = Math.min(25, Math.round((protocols.size / 8) * 25));
  const holdDuration = Math.min(25, Math.round((walletAgeMonths / 36) * 25));
  const governance = Math.min(25, Math.round((governanceVotes / 10) * 25));
  const reputationScore = consistency + diversity + holdDuration + governance;

  const breakdown: ScoreBreakdown = { consistency, diversity, holdDuration, governance };

  // 8. Build traits
  const traits: string[] = [];
  if (walletAgeMonths > 24) traits.push("Veteran");
  if (protocols.size > 5) traits.push("Multi-Protocol");
  if (nftList.length > 10) traits.push("NFT Enthusiast");
  if (governanceVotes > 0) traits.push("Governance Participant");
  if (Number(analysis.balance) / 1e18 > 5) traits.push("Significant Holder");
  if (activeMonthSet.size > 12) traits.push("Consistently Active");
  if (txs.length > 500) traits.push("Power User");
  if (tokens.length > 20) traits.push("Token Diversified");
  if (traits.length === 0) traits.push("Explorer");

  // 9. Build stats
  const ethBalance = (Number(analysis.balance) / 1e18).toFixed(4);
  const stats: WalletStat[] = [
    { label: "ETH Balance", value: ethBalance, sub: "Ethereum", icon: "coins", trend: "neutral" },
    { label: "Transactions", value: txs.length.toString(), sub: `Last 50 shown`, icon: "activity", trend: "neutral" },
    { label: "Tokens", value: tokens.length.toString(), sub: "Unique tokens", icon: "wallet", trend: "neutral" },
    { label: "NFTs", value: nftList.length.toString(), sub: "Collected", icon: "image", trend: "neutral" },
    { label: "Protocols", value: protocols.size.toString(), sub: "Unique interacted", icon: "layers", trend: "up" },
    { label: "Wallet Age", value: `${walletAgeMonths}mo`, sub: `Since ${formatDate(firstDate.toISOString())}`, icon: "clock", trend: "neutral" },
  ];

  // 10. Build activity timeline
  const recentActivity: ActivityEvent[] = txs.slice(0, 20).map((tx) => {
    const protocol = detectProtocol(tx);
    let type: ActivityEvent["type"] = "transfer";
    if (protocol === "Governance") type = "governance";
    else if (["NFT"].includes(protocol || "")) type = "nft";
    else if (protocol && !["Transfer", "Token Transfer"].includes(protocol)) type = "defi";

    const value = tx.value && tx.value !== "0"
      ? `${(Number(tx.value) / 1e18).toFixed(4)} ETH`
      : undefined;

    return {
      date: tx.timestamp,
      type,
      description: getTxDescription(tx, protocol),
      protocol: protocol || undefined,
      value,
      hash: tx.hash,
      chain: "Ethereum",
    };
  });

  // 11. Generate narrative
  const narrative = await generateNarrative(analysis, persona, breakdown);

  // 12. Build profile
  return {
    address: analysis.address,
    ens: analysis.ens,
    firstActivity: firstDate.toISOString(),
    lastActivity: lastDate.toISOString(),
    totalTxCount: txs.length,
    persona,
    traits,
    reputationScore,
    scoreBreakdown: breakdown,
    stats,
    recentActivity,
    narrative,
    tokenCount: tokens.length,
    nftCount: nftList.length,
    analyzedAt: new Date().toISOString(),
  };
}

function getTxDescription(tx: BlockscoutTransaction, protocol: string | null): string {
  const method = tx.method || "Unknown";
  const from = tx.from?.ens_domain_name || `${tx.from?.hash?.slice(0, 8)}...`;

  if (protocol === "Governance") return `Governance vote by ${from}`;
  if (method.toLowerCase().includes("swap")) return `Token swap${protocol ? ` on ${protocol}` : ""}`;
  if (method.toLowerCase().includes("transfer")) return `Token transfer${tx.to ? ` to ${tx.to.ens_domain_name || tx.to.hash?.slice(0, 8) + "..."}` : ""}`;
  if (method.toLowerCase().includes("deposit")) return `Deposit${protocol ? ` to ${protocol}` : ""}`;
  if (method.toLowerCase().includes("withdraw")) return `Withdrawal${protocol ? ` from ${protocol}` : ""}`;
  if (method.toLowerCase().includes("mint")) return `NFT minted`;
  if (method !== "Unknown") return `Called ${method}`;

  const value = Number(tx.value) / 1e18;
  if (value > 0) return `Sent ${value.toFixed(4)} ETH`;

  return `Transaction${protocol ? ` via ${protocol}` : ""}`;
}
