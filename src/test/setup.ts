import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { mockApiServer } from "./msw/server";

// An unhandled request means the code called an endpoint the test never
// intended: fail loudly rather than let it reach the network.
beforeAll(() => mockApiServer.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  mockApiServer.resetHandlers();
  cleanup();
});

afterAll(() => mockApiServer.close());
