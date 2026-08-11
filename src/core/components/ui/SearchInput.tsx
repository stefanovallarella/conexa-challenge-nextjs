"use client";

import { useId } from "react";
import { CloseIcon, SearchIcon } from "@/core/components/icons/Icons";
import { cn } from "@/core/lib/cn";

export interface SearchInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  label,
  value,
  onValueChange,
  placeholder,
  className,
}: SearchInputProps) {
  const inputId = useId();

  return (
    <div className={cn("relative flex items-center", className)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>

      <SearchIcon className="pointer-events-none absolute left-3 size-4 text-text-faint" />

      <input
        id={inputId}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onValueChange(event.target.value)}
        className="type-body h-10 w-full rounded-input border border-hairline bg-panel-sunken pr-10 pl-9 text-text placeholder:text-text-faint"
      />

      {value && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          className="absolute right-2 rounded-input p-1.5 text-text-faint transition-colors hover:text-text"
        >
          <CloseIcon />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </div>
  );
}
