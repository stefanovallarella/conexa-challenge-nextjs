import {
  ApiError,
  apiRequest,
  collectionResponseSchema,
} from "@/core/lib/apiClient";
import {
  type Episode,
  episodeResponseSchema,
  mapEpisode,
} from "../types/episode.types";

const episodeCollectionResponseSchema =
  collectionResponseSchema(episodeResponseSchema);

export async function fetchEpisodesByIds(
  episodeIds: readonly number[],
  signal?: AbortSignal,
): Promise<Episode[]> {
  if (episodeIds.length === 0) return [];

  try {
    const episodes = await apiRequest(`/episode/${episodeIds.join(",")}`, {
      schema: episodeCollectionResponseSchema,
      signal,
    });

    return episodes.map(mapEpisode);
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) return [];
    throw error;
  }
}
