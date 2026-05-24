"use client";

import { Badge } from "@/components/ui/badge";

interface TraitsBarProps {
  traits: string[];
}

const traitColors = [
  "violet", "cyan", "emerald", "amber",
  "violet", "cyan", "emerald", "amber",
] as const;

export function TraitsBar({ traits }: TraitsBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {traits.map((trait, i) => (
        <Badge key={trait} variant={traitColors[i % traitColors.length]}>
          {trait}
        </Badge>
      ))}
    </div>
  );
}
