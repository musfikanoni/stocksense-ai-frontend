// src/hooks/useResendCooldown.ts
import { useState, useCallback } from "react";

/**
 * Returns [cooldown (seconds), startCooldown(seconds)] for resend button throttling.
 */
export function useResendCooldown(seconds = 30): [number, () => void] {
  const [cooldown, setCooldown] = useState(0);

  const start = useCallback(() => {
    setCooldown(seconds);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  return [cooldown, start];
}
