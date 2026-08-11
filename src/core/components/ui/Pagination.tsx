"use client";

import { Button } from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNextPageHover?: () => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNextPageHover,
}: PaginationProps) {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 border-t border-hairline px-3 py-2"
    >
      <Button
        variant="ghost"
        size="sm"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <span aria-hidden>◀</span> Prev
      </Button>

      <p
        className="type-mono-label min-w-32 text-center text-text-muted"
        aria-live="polite"
      >
        Page {currentPage} of {Math.max(totalPages, 1)}
      </p>

      <Button
        variant="ghost"
        size="sm"
        disabled={isLastPage}
        onMouseEnter={onNextPageHover}
        onFocus={onNextPageHover}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next <span aria-hidden>▶</span>
      </Button>
    </nav>
  );
}
