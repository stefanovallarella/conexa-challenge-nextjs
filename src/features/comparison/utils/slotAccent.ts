import type { SlotId } from "@/core/config/constants";

export type SlotAccent = "primary" | "secondary";

const SLOT_ACCENTS: Record<SlotId, SlotAccent> = {
  "1": "primary",
  "2": "secondary",
};

export function accentForSlot(slotId: SlotId): SlotAccent {
  return SLOT_ACCENTS[slotId];
}

interface AccentClasses {
  text: string;
  border: string;
  background: string;
  stroke: string;
  fill: string;
}

/**
 * Written as whole class names because Tailwind scans for literals and would
 * not find them if they were assembled from pieces.
 */
const ACCENT_CLASSES: Record<SlotAccent, AccentClasses> = {
  primary: {
    text: "text-slot-1-text",
    border: "border-slot-1",
    background: "bg-slot-1",
    stroke: "stroke-slot-1",
    fill: "fill-slot-1",
  },
  secondary: {
    text: "text-slot-2-text",
    border: "border-slot-2",
    background: "bg-slot-2",
    stroke: "stroke-slot-2",
    fill: "fill-slot-2",
  },
};

export function accentClasses(accent: SlotAccent): AccentClasses {
  return ACCENT_CLASSES[accent];
}
