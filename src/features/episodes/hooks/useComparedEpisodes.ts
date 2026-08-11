"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  type SelectedCharacters,
  useSelectedCharacters,
} from "@/features/characters/hooks/useSelectedCharacters";
import { episodeBatchQuery } from "../queries";
import type { Episode } from "../types/episode.types";
import { compareEpisodeIds, unionOfEpisodeIds } from "../utils/episodeSets";

export interface ComparedEpisodeCounts {
  onlyInFirst: number;
  sharedByBoth: number;
  onlyInSecond: number;
}

export interface ComparedEpisodes {
  /** False until both slots are filled — the three sections stay empty until then. */
  isComparisonReady: boolean;
  selectedCharacters: SelectedCharacters;
  counts: ComparedEpisodeCounts;
  onlyInFirst: Episode[];
  sharedByBoth: Episode[];
  onlyInSecond: Episode[];
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

const NO_EPISODES: Episode[] = [];
const NO_COUNTS: ComparedEpisodeCounts = {
  onlyInFirst: 0,
  sharedByBoth: 0,
  onlyInSecond: 0,
};

export function useComparedEpisodes(): ComparedEpisodes {
  const selectedCharacters = useSelectedCharacters();
  const firstCharacter = selectedCharacters["1"];
  const secondCharacter = selectedCharacters["2"];
  const isComparisonReady = firstCharacter !== null && secondCharacter !== null;

  const comparedIds = useMemo(
    () =>
      isComparisonReady
        ? compareEpisodeIds(
            firstCharacter.episodeIds,
            secondCharacter.episodeIds,
          )
        : null,
    [isComparisonReady, firstCharacter, secondCharacter],
  );

  const unionIds = useMemo(
    () =>
      isComparisonReady
        ? unionOfEpisodeIds(
            firstCharacter.episodeIds,
            secondCharacter.episodeIds,
          )
        : [],
    [isComparisonReady, firstCharacter, secondCharacter],
  );

  const { data, isPending, isError, refetch } = useQuery({
    ...episodeBatchQuery(unionIds),
    enabled: isComparisonReady,
  });

  const episodesById = useMemo(
    () => new Map((data ?? []).map((episode) => [episode.id, episode])),
    [data],
  );

  const sections = useMemo(() => {
    if (comparedIds === null) {
      return {
        counts: NO_COUNTS,
        onlyInFirst: NO_EPISODES,
        sharedByBoth: NO_EPISODES,
        onlyInSecond: NO_EPISODES,
      };
    }

    const resolve = (episodeIds: number[]) =>
      episodeIds.flatMap((episodeId) => {
        const episode = episodesById.get(episodeId);
        return episode ? [episode] : [];
      });

    return {
      counts: {
        onlyInFirst: comparedIds.onlyInFirst.length,
        sharedByBoth: comparedIds.sharedByBoth.length,
        onlyInSecond: comparedIds.onlyInSecond.length,
      },
      onlyInFirst: resolve(comparedIds.onlyInFirst),
      sharedByBoth: resolve(comparedIds.sharedByBoth),
      onlyInSecond: resolve(comparedIds.onlyInSecond),
    };
  }, [comparedIds, episodesById]);

  return {
    isComparisonReady,
    selectedCharacters,
    ...sections,
    isLoading: isComparisonReady && isPending,
    isError,
    retry: refetch,
  };
}
