import { cn } from "@/core/lib/cn";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-input bg-hairline", className)}
      aria-hidden
    />
  );
}
