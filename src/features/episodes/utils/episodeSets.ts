export interface ComparedEpisodeIds {
  onlyInFirst: number[];
  sharedByBoth: number[];
  onlyInSecond: number[];
}

export function compareEpisodeIds(
  firstCharacterEpisodeIds: readonly number[],
  secondCharacterEpisodeIds: readonly number[],
): ComparedEpisodeIds {
  const secondCharacterLookup = new Set(secondCharacterEpisodeIds);
  const firstCharacterLookup = new Set(firstCharacterEpisodeIds);

  return {
    onlyInFirst: firstCharacterEpisodeIds.filter(
      (episodeId) => !secondCharacterLookup.has(episodeId),
    ),
    sharedByBoth: firstCharacterEpisodeIds.filter((episodeId) =>
      secondCharacterLookup.has(episodeId),
    ),
    onlyInSecond: secondCharacterEpisodeIds.filter(
      (episodeId) => !firstCharacterLookup.has(episodeId),
    ),
  };
}

export function unionOfEpisodeIds(
  firstCharacterEpisodeIds: readonly number[],
  secondCharacterEpisodeIds: readonly number[],
): number[] {
  return [
    ...new Set([...firstCharacterEpisodeIds, ...secondCharacterEpisodeIds]),
  ].sort((firstId, secondId) => firstId - secondId);
}
