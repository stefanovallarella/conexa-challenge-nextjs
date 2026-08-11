"use client";

import { useEffect, useState } from "react";

export function useDebounce<TValue>(value: TValue, delayMs: number): TValue {
  const [settledValue, setSettledValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setSettledValue(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return settledValue;
}
