import { useCallback, useEffect, useState } from "react";

const COINS_KEY = "coin_corrotti";
const LAST_EARN_KEY = "last_earn_ts";
const FARM_TOTAL_KEY = "farm_total"; // totale guadagnato da nomi casuali (cap 40)
const EASTER_CLAIMED_KEY = "easter_claimed"; // mappa nomi -> 1

export const EARN_COOLDOWN_MS = 3 * 60 * 1000; // 3 minuti
export const FARM_CAP = 40;
export const NORMAL_REWARD = 4;
export const EASTER_REWARD = 50;

type EarnResult =
  | { ok: true; amount: number; reason: "normal" | "easter" }
  | { ok: false; reason: "cooldown" | "cap" | "already-claimed" };

function readClaimed(): Record<string, 1> {
  try {
    return JSON.parse(localStorage.getItem(EASTER_CLAIMED_KEY) || "{}");
  } catch {
    return {};
  }
}

export function useCoins() {
  const [coins, setCoins] = useState<number>(() =>
    parseInt(localStorage.getItem(COINS_KEY) || "0", 10)
  );

  useEffect(() => {
    localStorage.setItem(COINS_KEY, String(coins));
  }, [coins]);

  const setCoinsExplicit = useCallback((n: number) => {
    setCoins(Math.max(0, Math.floor(n)));
  }, []);

  const addCoins = useCallback((delta: number) => {
    setCoins((c) => Math.max(0, c + delta));
  }, []);

  const earnFromName = useCallback(
    (normalizedName: string, isEaster: boolean): EarnResult => {
      if (isEaster) {
        const claimed = readClaimed();
        if (claimed[normalizedName]) {
          return { ok: false, reason: "already-claimed" };
        }
        claimed[normalizedName] = 1;
        localStorage.setItem(EASTER_CLAIMED_KEY, JSON.stringify(claimed));
        setCoins((c) => c + EASTER_REWARD);
        return { ok: true, amount: EASTER_REWARD, reason: "easter" };
      }
      // Normal name
      const now = Date.now();
      const last = parseInt(localStorage.getItem(LAST_EARN_KEY) || "0", 10);
      if (now - last < EARN_COOLDOWN_MS) {
        return { ok: false, reason: "cooldown" };
      }
      const farmTotal = parseInt(localStorage.getItem(FARM_TOTAL_KEY) || "0", 10);
      if (farmTotal >= FARM_CAP) {
        return { ok: false, reason: "cap" };
      }
      localStorage.setItem(LAST_EARN_KEY, String(now));
      localStorage.setItem(FARM_TOTAL_KEY, String(farmTotal + NORMAL_REWARD));
      setCoins((c) => c + NORMAL_REWARD);
      return { ok: true, amount: NORMAL_REWARD, reason: "normal" };
    },
    []
  );

  const spend = useCallback((amount: number): boolean => {
    let ok = false;
    setCoins((c) => {
      if (c >= amount) {
        ok = true;
        return c - amount;
      }
      return c;
    });
    return ok;
  }, []);

  return { coins, addCoins, earnFromName, spend, setCoins: setCoinsExplicit };
}
