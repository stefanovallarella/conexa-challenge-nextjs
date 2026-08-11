import { describe, expect, it } from "vitest";
import { createComparisonStore } from "./comparisonStore";

describe("comparison store", () => {
  it("keeps the slots independent of each other", () => {
    const store = createComparisonStore({ "1": 1, "2": 2 });

    store.getState().selectCharacterForSlot("1", 99);

    expect(store.getState().slots).toEqual({ "1": 99, "2": 2 });
  });

  it("clears the slot when the selected character is chosen again", () => {
    const store = createComparisonStore({ "1": 1, "2": 2 });

    store.getState().selectCharacterForSlot("1", 1);

    expect(store.getState().slots["1"]).toBeNull();
  });

  /**
   * On the server one instance per request is what keeps a visitor's selection
   * out of another visitor's render.
   */
  it("keeps instances independent of each other", () => {
    const firstStore = createComparisonStore();
    const secondStore = createComparisonStore();

    firstStore.getState().selectCharacterForSlot("1", 7);

    expect(secondStore.getState().slots["1"]).toBeNull();
  });
});
