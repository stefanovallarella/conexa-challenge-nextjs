import { describe, expect, it } from "vitest";
import { buildCharacterResponse } from "@/test/fixtures/apiFixtures";
import { mapCharacter } from "./character.types";

describe("mapCharacter", () => {
  it("keeps what the UI needs and turns the episode urls into ids", () => {
    const character = mapCharacter(buildCharacterResponse());

    expect(character).toEqual({
      id: 1,
      name: "Rick Sanchez",
      status: "Alive",
      species: "Human",
      imageUrl: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      episodeIds: [1, 2, 3],
    });
  });

  // Number("") is 0, so a trailing slash would otherwise become episode zero.
  it("drops urls it cannot read an id from", () => {
    const response = buildCharacterResponse({
      episode: [
        "https://rickandmortyapi.com/api/episode/7",
        "https://rickandmortyapi.com/api/episode/",
        "not-a-url",
      ],
    });

    expect(mapCharacter(response).episodeIds).toEqual([7]);
  });
});
