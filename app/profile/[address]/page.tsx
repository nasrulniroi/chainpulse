"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Zap, RefreshCw, AlertCircle, ExternalLink } from "lucide-react";
import type { WalletProfile } from "@/types/wallet";
import { shortenAddress, getExplorerUrl, formatDate } from "@/lib/utils";
import { PersonaCard } from "@/components/profile/PersonaCard";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { ReputationScore } from "@/components/profile/ReputationScore";
import { TraitsBar } from "@/components/profile/TraitsBar";
import { NarrativeCard } from "@/components/profile/NarrativeCard";
import { ActivityTimeline } from "@/components/profile/ActivityTimeline";
import { ShareButton } from "@/components/profile/ShareButton";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const address = (params.address as string)?.toLowerCase();

  const [profile, setProfile] = useState<WalletProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromCache, setFromCache] = useState(false);

  const fetchProfile = async (forceRefresh = false) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/analyze?address=${address}${forceRefresh ? "&refresh=true" : ""}`);
      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Failed to analyze wallet");
        return;
      }

      setProfile(json.data);
      setFromCache(json.cached || false);
    } catch (err: any) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) fetchProfile();
  }, [address]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
            <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="h-6 w-6 text-violet-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Analyzing Wallet</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fetching on-chain data from Blockscout...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-red-500/10">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold">Analysis Failed</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back
              </Button>
              <Button variant="violet" onClick={() => fetchProfile()}>
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/50 bg-background/80">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/10">
                <Zap className="h-3 w-3 text-violet-400" />
              </div>
              <span className="text-sm font-semibold">ChainPulse</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {fromCache && (
              <Badge variant="secondary" className="text-xs">
                Cached
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={() => fetchProfile(true)}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">
                {profile.ens || shortenAddress(profile.address)}
              </h1>
              <a
                href={getExplorerUrl(profile.address, "address")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              {profile.address}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              First active: {formatDate(profile.firstActivity)} · Last active: {formatDate(profile.lastActivity)}
            </p>
          </div>
          <ShareButton address={profile.address} />
        </div>

        {/* Persona + Reputation Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PersonaCard persona={profile.persona} />
          <ReputationScore score={profile.reputationScore} breakdown={profile.scoreBreakdown} />
        </div>

        {/* Traits */}
        {profile.traits.length > 0 && <TraitsBar traits={profile.traits} />}

        {/* Stats Grid */}
        <StatsGrid stats={profile.stats} />

        {/* Narrative */}
        <NarrativeCard narrative={profile.narrative} />

        {/* Activity Timeline */}
        <ActivityTimeline events={profile.recentActivity} address={profile.address} />

        {/* Footer */}
        <footer className="text-center py-8 text-xs text-muted-foreground space-y-1">
          <p>
            Powered by{" "}
            <a href="https://eth.blockscout.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
              Blockscout
            </a>{" "}
            · Data refreshed every 24h
          </p>
          <p>ChainPulse — Your wallet tells a story.</p>
        </footer>
      </main>
    </div>
  );
}
