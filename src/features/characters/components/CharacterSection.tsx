"use client";

import { Pagination, Panel } from "@/core/components/ui";
import type { SlotId } from "@/core/config/constants";
import { cn } from "@/core/lib/cn";
import {
  accentClasses,
  accentForSlot,
} from "@/features/comparison/utils/slotAccent";
import { CharacterSectionProvider } from "../context/CharacterSectionContext";
import { useCharacterPanel } from "../hooks/useCharacterPanel";
import { CharacterFilters } from "./CharacterFilters";
import { CharacterGrid } from "./CharacterGrid";

interface CharacterSectionProps {
  slotId: SlotId;
}

function CharacterSectionContent({ slotId }: CharacterSectionProps) {
  const panel = useCharacterPanel();

  return (
    <Panel aria-labelledby={`section-${slotId}`}>
      <header className="px-3 pt-3">
        <h2
          id={`section-${slotId}`}
          className={cn("type-mono-label", accentClasses(accentForSlot(slotId)).text)}
        >
          Character #{slotId}
        </h2>
      </header>

      <CharacterFilters
        searchTerm={panel.searchTerm}
        status={panel.status}
        onSearch={panel.search}
        onStatusChange={panel.filterByStatus}
      />

      <div
        className={cn(
          "max-h-[45vh] min-h-0 flex-1 overflow-y-auto transition-opacity lg:max-h-[30rem]",
          // keepPreviousData holds the old page on screen; without this the
          // reader clicks Next and nothing seems to happen.
          panel.isChangingPage && "opacity-60",
        )}
      >
        <CharacterGrid
          characters={panel.characters}
          isLoading={panel.isLoading}
          isError={panel.isError}
          searchTerm={panel.searchTerm}
          onRetry={panel.retry}
          onClearSearch={() => panel.search("")}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {panel.totalCount} characters found
      </p>

      <Pagination
        currentPage={panel.currentPage}
        totalPages={panel.totalPages}
        onPageChange={panel.goToPage}
        onNextPageHover={panel.prefetchNextPage}
      />
    </Panel>
  );
}

export function CharacterSection({ slotId }: CharacterSectionProps) {
  return (
    <CharacterSectionProvider slotId={slotId}>
      <CharacterSectionContent slotId={slotId} />
    </CharacterSectionProvider>
  );
}
