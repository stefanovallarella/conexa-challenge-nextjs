import { z } from "zod";

export const characterResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(["Alive", "Dead", "unknown"]),
  species: z.string(),
  type: z.string(),
  gender: z.string(),
  origin: z.object({ name: z.string(), url: z.string() }),
  location: z.object({ name: z.string(), url: z.string() }),
  image: z.string(),
  episode: z.array(z.string()),
  url: z.string(),
  created: z.string(),
});

export type CharacterResponse = z.infer<typeof characterResponseSchema>;

export type CharacterStatus = CharacterResponse["status"];

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  imageUrl: string;
  episodeIds: number[];
}

export interface CharacterPage {
  characters: Character[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export const EMPTY_CHARACTER_PAGE: CharacterPage = {
  characters: [],
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
};

function parseTrailingIdFromUrl(resourceUrl: string): number | null {
  const trailingSegment = resourceUrl.split("/").pop();
  if (!trailingSegment) return null;

  // Number("") is 0, so an empty segment would otherwise pass as episode zero.
  const parsedId = Number(trailingSegment);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

export function mapCharacter(response: CharacterResponse): Character {
  return {
    id: response.id,
    name: response.name,
    status: response.status,
    species: response.species,
    imageUrl: response.image,
    episodeIds: response.episode.flatMap((episodeUrl) => {
      const episodeId = parseTrailingIdFromUrl(episodeUrl);
      return episodeId === null ? [] : [episodeId];
    }),
  };
}
