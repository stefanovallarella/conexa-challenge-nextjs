import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/core/lib/cn";

const dotStyles = cva("size-2 shrink-0 rounded-full", {
  variants: {
    tone: {
      positive: "bg-tone-positive",
      negative: "bg-tone-negative",
      neutral: "bg-tone-neutral",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export interface BadgeProps extends VariantProps<typeof dotStyles> {
  children: ReactNode;
  className?: string;
}

export function Badge({ tone, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "type-body-sm inline-flex items-center gap-1.5 text-text-muted",
        className,
      )}
    >
      <span className={dotStyles({ tone })} aria-hidden />
      {children}
    </span>
  );
}
