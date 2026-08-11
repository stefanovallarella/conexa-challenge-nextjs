import { z } from "zod";
import { SLOT_IDS, type SlotId } from "@/core/config/constants";

export type ComparisonSlots = Record<SlotId, number | null>;

export function emptyComparisonSlots(): ComparisonSlots {
  return { "1": null, "2": null };
}

export function paramNameForSlot(slotId: SlotId): string {
  return `c${slotId}`;
}

const characterIdSchema = z.coerce.number().int().positive();

/** A shared link is untrusted input: anything unusable degrades to no selection. */
function parseCharacterId(rawValue: unknown): number | null {
  const firstValue = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  if (typeof firstValue !== "string") return null;

  const parsed = characterIdSchema.safeParse(firstValue);
  return parsed.success ? parsed.data : null;
}

export function parseComparisonSlots(
  searchParams: Record<string, string | string[] | undefined>,
): ComparisonSlots {
  const slots = emptyComparisonSlots();

  for (const slotId of SLOT_IDS) {
    slots[slotId] = parseCharacterId(searchParams[paramNameForSlot(slotId)]);
  }

  return slots;
}

export function buildComparisonQueryString(slots: ComparisonSlots): string {
  const params = new URLSearchParams();

  for (const slotId of SLOT_IDS) {
    const characterId = slots[slotId];
    if (characterId !== null) {
      params.set(paramNameForSlot(slotId), String(characterId));
    }
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export function selectedCharacterIds(slots: ComparisonSlots): number[] {
  return SLOT_IDS.map((slotId) => slots[slotId]).filter(
    (characterId) => characterId !== null,
  );
}
