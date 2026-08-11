import { type QueryClient, queryOptions } from "@tanstack/react-query";
import type { SlotId } from "@/core/config/constants";
import {
  type CharacterPageQuery,
  fetchCharacterPage,
  fetchCharactersByIds,
} from "./services/characters.service";
import type { Character, CharacterPage } from "./types/character.types";

export const characterKeys = {
  all: ["characters"] as const,
  pages: () => [...characterKeys.all, "page"] as const,
  page: (query: Omit<CharacterPageQuery, "signal">) =>
    [...characterKeys.pages(), query] as const,
  detail: (characterId: Character["id"]) =>
    [...characterKeys.all, "detail", characterId] as const,
  emptySlot: (slotId: SlotId) =>
    [...characterKeys.all, "detail", "empty", slotId] as const,
};

export function characterPageQuery(query: Omit<CharacterPageQuery, "signal">) {
  return queryOptions({
    queryKey: characterKeys.page(query),
    queryFn: ({ signal }) => fetchCharacterPage({ ...query, signal }),
  });
}

export function characterDetailQuery(characterId: Character["id"]) {
  return queryOptions({
    queryKey: characterKeys.detail(characterId),
    queryFn: async ({ signal }) => {
      const [character] = await fetchCharactersByIds([characterId], signal);
      return character ?? null;
    },
  });
}

export function findCharacterInLoadedPages(
  queryClient: QueryClient,
  characterId: Character["id"],
): Character | undefined {
  const cachedPages = queryClient.getQueriesData<CharacterPage>({
    queryKey: characterKeys.pages(),
  });

  for (const [, page] of cachedPages) {
    const character = page?.characters.find(({ id }) => id === characterId);
    if (character) return character;
  }

  return undefined;
}

export async function prefetchSelectedCharacters(
  queryClient: QueryClient,
  characterIds: readonly number[],
): Promise<Character[]> {
  if (characterIds.length === 0) return [];

  const characters = await fetchCharactersByIds(characterIds);

  for (const character of characters) {
    queryClient.setQueryData(characterKeys.detail(character.id), character);
  }

  return characters;
}
