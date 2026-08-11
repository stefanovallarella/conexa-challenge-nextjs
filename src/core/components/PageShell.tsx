import type { ComponentProps } from "react";
import { cn } from "@/core/lib/cn";

export type PageShellProps = ComponentProps<"main">;

/** The one place the page's width, gutters and rhythm are decided. */
export function PageShell({ className, ...props }: PageShellProps) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-[120rem] flex-col gap-4 px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}
