"use client";

import { useEffect } from "react";
import { SLOT_IDS } from "@/core/config/constants";
import { useComparisonStoreApi } from "../store/ComparisonStoreProvider";
import {
  type ComparisonSlots,
  paramNameForSlot,
} from "../utils/comparisonUrl";

/**
 * One direction only: nothing reads the url back, so the two cannot disagree.
 * `replaceState` and not the router, which would re-run the server render for a
 * change that is purely client state.
 */
export function useComparisonUrlProjection(): void {
  const comparisonStore = useComparisonStoreApi();

  useEffect(() => {
    return comparisonStore.subscribe((state, previousState) => {
      if (state.slots === previousState.slots) return;

      window.history.replaceState(null, "", buildNextUrl(state.slots));
    });
  }, [comparisonStore]);
}

function buildNextUrl(slots: ComparisonSlots): string {
  const url = new URL(window.location.href);

  for (const slotId of SLOT_IDS) {
    const characterId = slots[slotId];
    if (characterId === null) {
      url.searchParams.delete(paramNameForSlot(slotId));
    } else {
      url.searchParams.set(paramNameForSlot(slotId), String(characterId));
    }
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
