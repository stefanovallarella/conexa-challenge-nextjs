import { queryOptions } from "@tanstack/react-query";
import { fetchEpisodesByIds } from "./services/episodes.service";

const episodeKeys = {
  all: ["episodes"] as const,
  batch: (episodeIds: readonly number[]) =>
    [...episodeKeys.all, "batch", episodeIds] as const,
};

export function episodeBatchQuery(episodeIds: readonly number[]) {
  return queryOptions({
    queryKey: episodeKeys.batch(episodeIds),
    queryFn: ({ signal }) => fetchEpisodesByIds(episodeIds, signal),
  });
}
