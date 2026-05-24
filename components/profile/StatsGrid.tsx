"use client";

import type { WalletStat } from "@/types/wallet";
import { Card, CardContent } from "@/components/ui/card";
import {
  Coins,
  Activity,
  Wallet,
  Image,
  Layers,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface StatsGridProps {
  stats: WalletStat[];
}

const iconMap: Record<string, React.ComponentType<any>> = {
  coins: Coins,
  activity: Activity,
  wallet: Wallet,
  image: Image,
  layers: Layers,
  clock: Clock,
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] || Activity;
        const TrendIcon = stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : null;

        return (
          <Card key={stat.label} className="group hover:border-violet-500/20 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                  <Icon className="h-4 w-4 text-violet-400" />
                </div>
                {TrendIcon && (
                  <TrendIcon className={`h-3 w-3 ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`} />
                )}
              </div>
              <p className="text-xl font-bold font-mono">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              {stat.sub && (
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{stat.sub}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
