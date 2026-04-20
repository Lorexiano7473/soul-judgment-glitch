import { useCallback, useEffect, useState } from "react";

const INVENTORY_KEY = "shop_inventory_v1";

export type ShopItemId = "tinta_abissale" | "eco_criptico" | "sussurro_vuoto";

export interface ShopItem {
  id: ShopItemId;
  name: string;
  description: string;
  effect: string;
  price: number;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "tinta_abissale",
    name: "Tinta Abissale",
    description: "Un pigmento estratto da glitch morti. Tinge le crepe della realtà di un rosso più cupo.",
    effect: "Cambia i glitch in rosso scuro",
    price: 500,
  },
  {
    id: "eco_criptico",
    name: "Eco Criptico",
    description: "Un sussurro inciso su nastro magnetico. Rivela un indizio su un nome dimenticato.",
    effect: "Indizio Easter Egg",
    price: 200,
  },
  {
    id: "sussurro_vuoto",
    name: "Sussurro del Vuoto",
    description: "Una frequenza che non dovrebbe esistere. Sblocca un suono dal lato sbagliato della stanza.",
    effect: "Sblocca suono speciale",
    price: 1000,
  },
];

function read(): Record<string, 1> {
  try {
    return JSON.parse(localStorage.getItem(INVENTORY_KEY) || "{}");
  } catch {
    return {};
  }
}

export function useInventory() {
  const [owned, setOwned] = useState<Set<ShopItemId>>(
    () => new Set(Object.keys(read()) as ShopItemId[])
  );

  useEffect(() => {
    const map: Record<string, 1> = {};
    owned.forEach((id) => (map[id] = 1));
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(map));
  }, [owned]);

  const purchase = useCallback((id: ShopItemId) => {
    setOwned((s) => {
      if (s.has(id)) return s;
      const next = new Set(s);
      next.add(id);
      return next;
    });
  }, []);

  const isOwned = useCallback((id: ShopItemId) => owned.has(id), [owned]);

  return { owned, isOwned, purchase };
}