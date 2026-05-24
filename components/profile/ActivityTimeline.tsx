"use client";

import type { ActivityEvent } from "@/types/wallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { formatRelativeTime, getExplorerUrl, shortenAddress } from "@/lib/utils";

interface ActivityTimelineProps {
  events: ActivityEvent[];
  address: string;
}

const typeConfig: Record<string, { label: string; variant: "violet" | "cyan" | "emerald" | "amber" | "secondary" }> = {
  defi: { label: "DeFi", variant: "violet" },
  nft: { label: "NFT", variant: "cyan" },
  transfer: { label: "Transfer", variant: "secondary" },
  governance: { label: "Governance", variant: "emerald" },
  contract: { label: "Contract", variant: "amber" },
  token: { label: "Token", variant: "secondary" },
};

export function ActivityTimeline({ events, address }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <a
            href={getExplorerUrl(address, "address")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View on Etherscan <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent transactions found
            </p>
          ) : (
            events.map((event, i) => {
              const config = typeConfig[event.type] || typeConfig.transfer;
              return (
                <div
                  key={event.hash + i}
                  className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent/50 transition-colors group"
                >
                  {/* Type Badge */}
                  <Badge variant={config.variant} className="shrink-0 w-20 justify-center">
                    {config.label}
                  </Badge>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{event.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {event.protocol && (
                        <span className="text-[10px] text-violet-400">{event.protocol}</span>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(event.date)}
                      </span>
                    </div>
                  </div>

                  {/* Value */}
                  {event.value && (
                    <span className="text-sm font-mono text-muted-foreground shrink-0">
                      {event.value}
                    </span>
                  )}

                  {/* Link */}
                  <a
                    href={getExplorerUrl(event.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </a>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
