"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { useStore } from "zustand";
import type { ComparisonSlots } from "../utils/comparisonUrl";
import {
  type ComparisonState,
  type ComparisonStore,
  createComparisonStore,
} from "./comparisonStore";

const ComparisonStoreContext = createContext<ComparisonStore | null>(null);

interface ComparisonStoreProviderProps {
  initialSlots: ComparisonSlots;
  children: ReactNode;
}

export function ComparisonStoreProvider({
  initialSlots,
  children,
}: ComparisonStoreProviderProps) {
  const [store] = useState(() => createComparisonStore(initialSlots));

  return (
    <ComparisonStoreContext.Provider value={store}>
      {children}
    </ComparisonStoreContext.Provider>
  );
}

export function useComparisonStoreApi(): ComparisonStore {
  const store = useContext(ComparisonStoreContext);

  if (store === null) {
    throw new Error(
      "useComparisonStore must be used inside a ComparisonStoreProvider",
    );
  }

  return store;
}

export function useComparisonStore<TSelected>(
  selector: (state: ComparisonState) => TSelected,
): TSelected {
  return useStore(useComparisonStoreApi(), selector);
}
