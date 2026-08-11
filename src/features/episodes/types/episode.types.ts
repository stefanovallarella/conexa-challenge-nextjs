import { z } from "zod";

export const episodeResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  air_date: z.string(),
  /** Season and episode code, e.g. "S01E01". */
  episode: z.string(),
  characters: z.array(z.string()),
  url: z.string(),
  created: z.string(),
});

export type EpisodeResponse = z.infer<typeof episodeResponseSchema>;

export interface Episode {
  id: number;
  name: string;
  code: string;
  airDate: string;
}

export function mapEpisode(response: EpisodeResponse): Episode {
  return {
    id: response.id,
    name: response.name,
    code: response.episode,
    airDate: response.air_date,
  };
}
