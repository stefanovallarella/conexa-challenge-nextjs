"use client";

import { useState } from "react";
import { SLOT_IDS, type SlotId } from "@/core/config/constants";
import { cn } from "@/core/lib/cn";
import { useComparisonStore } from "@/features/comparison/store/ComparisonStoreProvider";
import {
  accentClasses,
  accentForSlot,
} from "@/features/comparison/utils/slotAccent";
import { CharacterSection } from "./CharacterSection";

export function CharacterSections() {
  const [visibleSlotId, setVisibleSlotId] = useState<SlotId>(SLOT_IDS[0]);
  const slots = useComparisonStore((state) => state.slots);

  return (
    <>
      <div
        role="group"
        aria-label="Choose which character panel to show"
        className="flex border-b border-hairline md:hidden"
      >
        {SLOT_IDS.map((slotId) => {
          const isVisible = slotId === visibleSlotId;
          const accent = accentClasses(accentForSlot(slotId));

          return (
            <button
              key={slotId}
              type="button"
              aria-pressed={isVisible}
              onClick={() => setVisibleSlotId(slotId)}
              className={cn(
                "type-mono-label flex flex-1 items-center justify-center gap-2 border-b-2 py-3 transition-colors",
                isVisible
                  ? `${accent.border} ${accent.text}`
                  : "border-transparent text-text-muted",
              )}
            >
              Character #{slotId}
              {slots[slotId] !== null && (
                <span
                  aria-hidden
                  className={cn("size-1.5 rounded-full", accent.background)}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SLOT_IDS.map((slotId) => (
          <div
            key={slotId}
            className={cn(slotId === visibleSlotId ? "" : "hidden md:block")}
          >
            <CharacterSection slotId={slotId} />
          </div>
        ))}
      </div>
    </>
  );
}
