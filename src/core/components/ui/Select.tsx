"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useId } from "react";
import { cn } from "@/core/lib/cn";

const selectStyles = cva(
  "type-body h-10 rounded-input border bg-panel-sunken px-3 text-text",
  {
    variants: {
      accent: { primary: "", secondary: "" },
      isFiltering: { true: "", false: "border-hairline" },
    },
    compoundVariants: [
      { accent: "primary", isFiltering: true, class: "border-slot-1" },
      { accent: "secondary", isFiltering: true, class: "border-slot-2" },
    ],
    defaultVariants: { accent: "primary", isFiltering: false },
  },
);

export interface SelectOption<TValue extends string> {
  value: TValue;
  label: string;
}

export interface SelectProps<TValue extends string>
  extends Pick<VariantProps<typeof selectStyles>, "accent"> {
  label: string;
  value: TValue | null;
  options: readonly SelectOption<TValue>[];
  onValueChange: (value: TValue | null) => void;
  allOptionLabel?: string;
  className?: string;
}

const ALL_OPTION_VALUE = "";

export function Select<TValue extends string>({
  label,
  value,
  options,
  onValueChange,
  accent,
  allOptionLabel = "All",
  className,
}: SelectProps<TValue>) {
  const selectId = useId();

  return (
    <>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>

      <select
        id={selectId}
        value={value ?? ALL_OPTION_VALUE}
        onChange={(event) =>
          onValueChange(
            options.find((option) => option.value === event.target.value)
              ?.value ?? null,
          )
        }
        className={cn(
          selectStyles({ accent, isFiltering: value !== null }),
          className,
        )}
      >
        <option value={ALL_OPTION_VALUE}>
          {label}: {allOptionLabel}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
