import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/core/lib/cn";

export const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-input font-medium transition-colors disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        solid: "bg-text text-canvas hover:opacity-90",
        outline: "border border-hairline text-text hover:bg-panel-sunken",
        ghost: "text-text-muted hover:bg-panel-sunken hover:text-text",
      },
      size: {
        sm: "type-body-sm h-8 px-3",
        md: "type-body h-10 px-4",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

export interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonStyles> {}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
}
