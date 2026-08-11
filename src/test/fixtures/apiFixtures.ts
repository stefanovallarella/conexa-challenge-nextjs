import type { CharacterResponse } from "@/features/characters/types/character.types";
import type { EpisodeResponse } from "@/features/episodes/types/episode.types";

export function buildEpisodeUrl(episodeId: number): string {
  return `https://rickandmortyapi.com/api/episode/${episodeId}`;
}

export function buildCharacterResponse(
  overrides: Partial<CharacterResponse> = {},
): CharacterResponse {
  return {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: {
      name: "Earth (C-137)",
      url: "https://rickandmortyapi.com/api/location/1",
    },
    location: {
      name: "Citadel of Ricks",
      url: "https://rickandmortyapi.com/api/location/3",
    },
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    episode: [1, 2, 3].map(buildEpisodeUrl),
    url: "https://rickandmortyapi.com/api/character/1",
    created: "2017-11-04T18:48:46.250Z",
    ...overrides,
  };
}

export function buildEpisodeResponse(
  overrides: Partial<EpisodeResponse> = {},
): EpisodeResponse {
  return {
    id: 1,
    name: "Pilot",
    air_date: "December 2, 2013",
    episode: "S01E01",
    characters: ["https://rickandmortyapi.com/api/character/1"],
    url: "https://rickandmortyapi.com/api/episode/1",
    created: "2017-11-10T12:56:33.798Z",
    ...overrides,
  };
}
