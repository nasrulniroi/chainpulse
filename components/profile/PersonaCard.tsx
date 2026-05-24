"use client";

import type { WalletPersona } from "@/types/wallet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRarityColor } from "@/lib/utils";

interface PersonaCardProps {
  persona: WalletPersona;
}

const rarityVariant = {
  Legendary: "legendary" as const,
  Epic: "epic" as const,
  Rare: "rare" as const,
  Common: "common" as const,
};

export function PersonaCard({ persona }: PersonaCardProps) {
  return (
    <Card className="relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-[80px] opacity-20"
        style={{ background: persona.color }}
      />

      <CardContent className="relative p-6">
        <div className="flex items-start gap-4">
          {/* Emoji */}
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
            style={{ background: `${persona.color}15`, border: `1px solid ${persona.color}30` }}
          >
            {persona.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold truncate">{persona.type}</h3>
              <Badge variant={rarityVariant[persona.rarity]}>
                {persona.rarity}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {persona.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
