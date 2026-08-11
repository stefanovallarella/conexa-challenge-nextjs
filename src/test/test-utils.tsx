import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ComparisonStoreProvider } from "@/features/comparison/store/ComparisonStoreProvider";
import {
  type ComparisonSlots,
  emptyComparisonSlots,
} from "@/features/comparison/utils/comparisonUrl";

interface AppWrapperOptions {
  initialSlots?: ComparisonSlots;
}

export function createAppWrapper({
  initialSlots = emptyComparisonSlots(),
}: AppWrapperOptions = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
    },
  });

  function AppWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ComparisonStoreProvider initialSlots={initialSlots}>
          {children}
        </ComparisonStoreProvider>
      </QueryClientProvider>
    );
  }

  return { wrapper: AppWrapper, queryClient };
}
