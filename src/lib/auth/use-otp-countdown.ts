import { createEffect, onCleanup, type Accessor } from "solid-js";
import { createSignal } from "solid-js";

export function useOtpCountdown(
  expiresAt: Accessor<Date | null>,
  expiredLabel: Accessor<string>,
) {
  const [timeLeft, setTimeLeft] = createSignal("");
  const [isExpired, setIsExpired] = createSignal(false);

  const updateTimer = () => {
    const expiry = expiresAt();
    if (!expiry) return;

    const diff = expiry.getTime() - Date.now();

    if (diff <= 0) {
      setTimeLeft(expiredLabel());
      setIsExpired(true);
      return;
    }

    setIsExpired(false);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };

  createEffect(() => {
    if (expiresAt()) {
      const timer = setInterval(updateTimer, 1000);
      onCleanup(() => clearInterval(timer));
      updateTimer();
    }
  });

  return { timeLeft, isExpired };
}
