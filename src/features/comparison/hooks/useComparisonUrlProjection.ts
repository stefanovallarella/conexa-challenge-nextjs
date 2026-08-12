"use client";

import { useEffect } from "react";
import { useComparisonStoreApi } from "../store/ComparisonStoreProvider";
import { buildComparisonUrl } from "../utils/comparisonUrl";

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

      window.history.replaceState(
        null,
        "",
        buildComparisonUrl(window.location.href, state.slots),
      );
    });
  }, [comparisonStore]);
}
