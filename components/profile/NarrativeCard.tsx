"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface NarrativeCardProps {
  narrative: string;
  isAiGenerated?: boolean;
}

export function NarrativeCard({ narrative, isAiGenerated = true }: NarrativeCardProps) {
  return (
    <Card className="relative overflow-hidden">
      {/* Subtle gradient border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

      <CardContent className="relative p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
            <Sparkles className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <p className="text-base leading-relaxed">{narrative}</p>
            {isAiGenerated && (
              <Badge variant="violet" className="mt-3">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
