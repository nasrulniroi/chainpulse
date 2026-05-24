import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        violet: "border-violet-500/20 bg-violet-500/10 text-violet-400",
        cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
        emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        legendary: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        epic: "border-purple-500/30 bg-purple-500/10 text-purple-300",
        rare: "border-blue-500/30 bg-blue-500/10 text-blue-300",
        common: "border-gray-500/30 bg-gray-500/10 text-gray-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
export { Badge, badgeVariants };
