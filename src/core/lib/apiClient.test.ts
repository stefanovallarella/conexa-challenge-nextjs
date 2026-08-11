import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { API_BASE_URL } from "@/core/config/constants";
import { mockApiServer } from "@/test/msw/server";
import {
  ApiContractError,
  apiRequest,
  collectionResponseSchema,
} from "./apiClient";

const probeSchema = z.object({ id: z.number() });

describe("apiClient", () => {
  /** Batch endpoints answer with a bare object when asked for a single id. */
  it("reads a single-item batch response as a collection", () => {
    expect(collectionResponseSchema(probeSchema).parse({ id: 7 })).toEqual([
      { id: 7 },
    ]);
  });

  /**
   * If this guard regresses, every unfiltered request goes out as
   * `?name=undefined`, the API answers 404, and the service reports it as "no
   * characters found" — the whole app empties out with no error anywhere.
   */
  it("omits empty query params instead of sending them as blanks", async () => {
    let requestedUrl = "";
    mockApiServer.use(
      http.get(`${API_BASE_URL}/character`, ({ request }) => {
        requestedUrl = request.url;
        return HttpResponse.json({ id: 1 });
      }),
    );

    await apiRequest("/character", {
      schema: probeSchema,
      searchParams: { page: 2, name: "", status: undefined },
    });

    expect(requestedUrl).toContain("page=2");
    expect(requestedUrl).not.toContain("name=");
    expect(requestedUrl).not.toContain("status=");
  });

  it("rejects a response that breaks the contract, naming the field", async () => {
    mockApiServer.use(
      http.get(`${API_BASE_URL}/character`, () =>
        HttpResponse.json({ id: "not-a-number" }),
      ),
    );

    const request = apiRequest("/character", { schema: probeSchema });

    await expect(request).rejects.toBeInstanceOf(ApiContractError);
    await expect(request).rejects.toThrowError(/id/);
  });
});
