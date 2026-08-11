"use client";

import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}
