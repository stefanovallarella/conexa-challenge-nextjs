import { http, HttpResponse } from "msw";
import { API_BASE_URL } from "@/core/config/constants";
import {
  buildCharacterResponse,
  buildEpisodeResponse,
  buildEpisodeUrl,
} from "../fixtures/apiFixtures";

function episodeUrlsForCharacter(characterId: number): string[] {
  return [characterId, characterId + 1, characterId + 2].map(buildEpisodeUrl);
}

/**
 * These handlers deliberately reproduce two quirks of the real API, because the
 * code under test exists to absorb them:
 *   - a search with no matches answers 404, not an empty list;
 *   - a batch endpoint given a single id answers with a bare object.
 */
export const handlers = [
  http.get(`${API_BASE_URL}/character`, ({ request }) => {
    const searchParams = new URL(request.url).searchParams;

    if (searchParams.get("name") === "nobody") {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({
      info: { count: 826, pages: 42, next: null, prev: null },
      results: [
        buildCharacterResponse({ episode: episodeUrlsForCharacter(1) }),
        buildCharacterResponse({
          id: 2,
          name: "Morty Smith",
          episode: episodeUrlsForCharacter(2),
        }),
      ],
    });
  }),

  http.get(`${API_BASE_URL}/character/:ids`, ({ params }) => {
    const requestedIds = String(params.ids).split(",").map(Number);

    if (requestedIds.includes(9999)) {
      return new HttpResponse(null, { status: 404 });
    }

    const characters = requestedIds.map((id) =>
      buildCharacterResponse({
        id,
        name: `Character ${id}`,
        episode: episodeUrlsForCharacter(id),
      }),
    );

    return HttpResponse.json(
      characters.length === 1 ? characters[0] : characters,
    );
  }),

  http.get(`${API_BASE_URL}/episode/:ids`, ({ params }) => {
    const requestedIds = String(params.ids).split(",").map(Number);

    const episodes = requestedIds.map((id) =>
      buildEpisodeResponse({ id, name: `Episode ${id}` }),
    );

    return HttpResponse.json(episodes.length === 1 ? episodes[0] : episodes);
  }),
];
