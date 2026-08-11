import { QueryClient } from "@tanstack/react-query";

/** One per request: a module-level client would serve one visitor's cache to another. */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // The dataset never changes, so a refetch cannot return anything new.
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}
