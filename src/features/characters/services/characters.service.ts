import {
  ApiError,
  apiRequest,
  collectionResponseSchema,
  paginatedResponseSchema,
} from "@/core/lib/apiClient";
import type { CharacterStatusFilter } from "@/core/config/constants";
import {
  type Character,
  type CharacterPage,
  characterResponseSchema,
  EMPTY_CHARACTER_PAGE,
  mapCharacter,
} from "../types/character.types";

const characterPageResponseSchema = paginatedResponseSchema(
  characterResponseSchema,
);
const characterCollectionResponseSchema = collectionResponseSchema(
  characterResponseSchema,
);

export interface CharacterPageQuery {
  page: number;
  name?: string;
  status?: CharacterStatusFilter;
  signal?: AbortSignal;
}

export async function fetchCharacterPage({
  page,
  name,
  status,
  signal,
}: CharacterPageQuery): Promise<CharacterPage> {
  try {
    const response = await apiRequest("/character", {
      schema: characterPageResponseSchema,
      searchParams: { page, name, status },
      signal,
    });

    return {
      characters: response.results.map(mapCharacter),
      currentPage: page,
      totalPages: response.info.pages,
      totalCount: response.info.count,
    };
  } catch (error) {
    // A search with no matches answers 404, not an empty list. "Nobody is called
    // zzzz" is an ordinary result and the UI must not see it as a failure.
    if (error instanceof ApiError && error.isNotFound) {
      return { ...EMPTY_CHARACTER_PAGE, currentPage: page };
    }
    throw error;
  }
}

export async function fetchCharactersByIds(
  characterIds: readonly number[],
  signal?: AbortSignal,
): Promise<Character[]> {
  if (characterIds.length === 0) return [];

  try {
    const characters = await apiRequest(
      `/character/${characterIds.join(",")}`,
      { schema: characterCollectionResponseSchema, signal },
    );

    return characters.map(mapCharacter);
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return [];
    throw error;
  }
}
