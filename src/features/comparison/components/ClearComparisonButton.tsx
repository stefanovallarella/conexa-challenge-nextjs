"use client";

import { Button } from "@/core/components/ui";
import { SLOT_IDS } from "@/core/config/constants";
import { useComparisonStore } from "../store/ComparisonStoreProvider";

export function ClearComparisonButton() {
  const hasAnySelection = useComparisonStore((state) =>
    SLOT_IDS.some((slotId) => state.slots[slotId] !== null),
  );
  const clearAllSlots = useComparisonStore((state) => state.clearAllSlots);

  if (!hasAnySelection) return null;

  return (
    <Button variant="ghost" size="sm" onClick={clearAllSlots}>
      Clear comparison
    </Button>
  );
}
