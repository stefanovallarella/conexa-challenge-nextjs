export const API_BASE_URL = "https://rickandmortyapi.com/api";

/** The dataset is immutable; this only bounds how long a deployment stays pinned. */
export const API_REVALIDATE_SECONDS = 3600;

export const SEARCH_DEBOUNCE_MS = 300;

export const SLOT_IDS = ["1", "2"] as const;
export type SlotId = (typeof SLOT_IDS)[number];

/**
 * The only filter the API documents as a closed enum. There is no species filter
 * on purpose: `?species=` matches by substring, so "Human" also returns the
 * "Humanoid" characters.
 */
export const CHARACTER_STATUSES = ["alive", "dead", "unknown"] as const;
export type CharacterStatusFilter = (typeof CHARACTER_STATUSES)[number];
