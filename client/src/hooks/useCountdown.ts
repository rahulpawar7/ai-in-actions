import { useEffect, useState } from 'react';

export function useCountdown(targetIso: string | null | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetIso) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  if (!targetIso) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };

  const diff = Math.max(0, new Date(targetIso).getTime() - now);
  const expired = diff <= 0;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { expired, days, hours, minutes, seconds };
}
