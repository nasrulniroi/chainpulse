"use client";

import type { ScoreBreakdown } from "@/types/wallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getScoreColor, getScoreLabel } from "@/lib/utils";

interface ReputationScoreProps {
  score: number;
  breakdown: ScoreBreakdown;
}

export function ReputationScore({ score, breakdown }: ReputationScoreProps) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const categories = [
    { name: "Consistency", value: breakdown.consistency, max: 25 },
    { name: "Diversity", value: breakdown.diversity, max: 25 },
    { name: "Hold Duration", value: breakdown.holdDuration, max: 25 },
    { name: "Governance", value: breakdown.governance, max: 25 },
  ];

  return (
    <Card className="relative overflow-hidden">
      <div
        className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-[60px] opacity-10"
        style={{ background: color }}
      />

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Reputation Score
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Score Circle */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-secondary"
              />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 327} 327`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color }}>{score}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
        </div>

        {/* Label */}
        <p className="text-center text-sm font-medium mb-6" style={{ color }}>{label}</p>

        {/* Breakdown */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{cat.name}</span>
                <span className="text-xs font-mono">{cat.value}/{cat.max}</span>
              </div>
              <Progress
                value={(cat.value / cat.max) * 100}
                indicatorClassName=""
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
