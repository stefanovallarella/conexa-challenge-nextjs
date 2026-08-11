import type { ReactNode } from "react";
import { cn } from "@/core/lib/cn";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className,
      )}
    >
      {icon && <span className="text-text-faint">{icon}</span>}
      <p className="type-body-lg text-text">{title}</p>
      {description && (
        <p className="type-body-sm max-w-xs text-text-muted">{description}</p>
      )}
      {action}
    </div>
  );
}
