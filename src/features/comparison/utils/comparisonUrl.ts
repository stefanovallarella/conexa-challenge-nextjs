import { z } from "zod";
import { SLOT_IDS, type SlotId } from "@/core/config/constants";

export type ComparisonSlots = Record<SlotId, number | null>;

export function emptyComparisonSlots(): ComparisonSlots {
  return { "1": null, "2": null };
}

function paramNameForSlot(slotId: SlotId): string {
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

/**
 * Edits the given url rather than rebuilding it, so campaign params and the
 * fragment survive a selection.
 */
export function buildComparisonUrl(
  currentUrl: string,
  slots: ComparisonSlots,
): string {
  const url = new URL(currentUrl);

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

export function selectedCharacterIds(slots: ComparisonSlots): number[] {
  return SLOT_IDS.map((slotId) => slots[slotId]).filter(
    (characterId) => characterId !== null,
  );
}
