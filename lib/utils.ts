import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 6): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isEnsName(input: string): boolean {
  return /^[a-zA-Z0-9-]+\.eth$/.test(input);
}

export function formatEthBalance(wei: string, decimals = 18): string {
  const balance = Number(wei) / Math.pow(10, decimals);
  if (balance >= 1000) return `${(balance / 1000).toFixed(1)}k`;
  if (balance >= 1) return `${balance.toFixed(4)}`;
  if (balance > 0) return `${balance.toFixed(6)}`;
  return "0";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function getExplorerUrl(hash: string, type: "tx" | "address" = "tx"): string {
  return `https://etherscan.io/${type}/${hash}`;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#06b6d4";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "Legendary": return "#f59e0b";
    case "Epic": return "#a855f7";
    case "Rare": return "#3b82f6";
    default: return "#6b7280";
  }
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Exceptional";
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  if (score >= 20) return "Beginner";
  return "Newcomer";
}
