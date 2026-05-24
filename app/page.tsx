"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Wallet,
  BarChart3,
  Sparkles,
  Github,
  ArrowRight,
  ExternalLink,
  Zap,
} from "lucide-react";
import { isValidAddress } from "@/lib/utils";

const EXAMPLE_ADDRESSES = [
  { label: "vitalik.eth", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" },
  { label: "hayden.eth (Uniswap)", address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" },
  { label: "OpenSea Seaport", address: "0x00000000006c3852cbEf3e08e8dF289169EdE581" },
];

export default function LandingPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = (addr?: string) => {
    const target = (addr || address).trim();
    setError("");

    if (!target) {
      setError("Please enter a wallet address");
      return;
    }

    if (!isValidAddress(target.toLowerCase())) {
      setError("Invalid Ethereum address (must be 0x + 40 hex characters)");
      return;
    }

    router.push(`/profile/${target}`);
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <Zap className="h-4 w-4 text-violet-400" />
          </div>
          <span className="text-lg font-bold">ChainPulse</span>
        </div>
        <a
          href="https://github.com/nasrulniroi/chainpulse"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <Badge variant="violet" className="mb-6">
            <Zap className="h-3 w-3 mr-1" />
            Live on Ethereum
          </Badge>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Your wallet tells a{" "}
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              story
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Discover your on-chain persona, reputation score, and activity profile.
            Powered by AI. Built on Ethereum. Free to use.
          </p>

          {/* Search Bar */}
          <div className="mt-10 mx-auto max-w-xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter wallet address or ENS name..."
                  className="pl-10 h-12 text-base"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>
              <Button size="xl" onClick={() => handleAnalyze()}>
                Analyze
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          {/* Example Addresses */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {EXAMPLE_ADDRESSES.map((ex) => (
              <button
                key={ex.address}
                onClick={() => {
                  setAddress(ex.address);
                  handleAnalyze(ex.address);
                }}
                className="flex items-center gap-1.5 rounded-full border border-border/50 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-violet-500/30 transition-colors"
              >
                <Wallet className="h-3 w-3" />
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Wallet Persona",
              desc: "DeFi Degen, Diamond Hands, NFT Collector — discover your on-chain archetype based on real behavior.",
              color: "violet",
            },
            {
              icon: BarChart3,
              title: "Reputation Score",
              desc: "0-100 score based on consistency, diversity, hold duration, and governance participation.",
              color: "cyan",
            },
            {
              icon: Wallet,
              title: "On-Chain Resume",
              desc: "Complete activity timeline, protocol interactions, token holdings, and AI-generated narrative.",
              color: "emerald",
            },
          ].map((feature) => (
            <Card key={feature.title} className="border-border/50 hover:border-violet-500/20 transition-colors">
              <CardContent className="p-6">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${feature.color}-500/10 mb-4`}>
                  <feature.icon className={`h-5 w-5 text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-8">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium">ChainPulse</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with Next.js · Blockscout · AI · Free to use
          </p>
        </div>
      </footer>
    </div>
  );
}
