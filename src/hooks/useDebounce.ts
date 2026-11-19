// src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

/**
 * Custom hook to debounce high-frequency state changes (e.g. search inputs).
 * Prevents redundant network requests and eliminates UI jank.
 *
 * @param value The raw input value
 * @param delay Milliseconds to wait after last change before updating debounced value (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
