import { createStore } from "zustand/vanilla";
import type { SlotId } from "@/core/config/constants";
import {
  type ComparisonSlots,
  emptyComparisonSlots,
} from "../utils/comparisonUrl";

export interface ComparisonState {
  slots: ComparisonSlots;
  selectCharacterForSlot: (slotId: SlotId, characterId: number) => void;
  clearSlot: (slotId: SlotId) => void;
  clearAllSlots: () => void;
}

export type ComparisonStore = ReturnType<typeof createComparisonStore>;

/**
 * A factory because the store is seeded from the request. A module-level store
 * is created once per process, so writing this visitor's selection into it would
 * leak into the next visitor's render.
 */
export function createComparisonStore(
  initialSlots: ComparisonSlots = emptyComparisonSlots(),
) {
  return createStore<ComparisonState>()((set) => ({
    slots: initialSlots,

    selectCharacterForSlot: (slotId, characterId) =>
      set((state) => ({
        slots: {
          ...state.slots,
          [slotId]: state.slots[slotId] === characterId ? null : characterId,
        },
      })),

    clearSlot: (slotId) =>
      set((state) => ({ slots: { ...state.slots, [slotId]: null } })),

    clearAllSlots: () => set({ slots: emptyComparisonSlots() }),
  }));
}
