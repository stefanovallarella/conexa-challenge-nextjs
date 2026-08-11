import type { ComponentProps } from "react";
import { cn } from "@/core/lib/cn";

export type PanelProps = ComponentProps<"section">;

export function Panel({ className, ...props }: PanelProps) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-panel border border-hairline bg-panel",
        className,
      )}
      {...props}
    />
  );
}
