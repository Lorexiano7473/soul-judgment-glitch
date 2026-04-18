// Sistema trofei persistito in localStorage.
export type TrophyId =
  | "rattesco"
  | "occhio_glitch"
  | "eterno_ritorno"
  | "sale_cazzo_di_cane";

export interface TrophyDef {
  id: TrophyId;
  name: string;
  description: string;
}

export const TROPHIES: TrophyDef[] = [
  {
    id: "rattesco",
    name: "Trofeo Rattesco",
    description:
      "Hai pronunciato il nome proibito e superato il muro della password. Capoziello è stato counterato dalla Antonella.",
  },
  {
    id: "occhio_glitch",
    name: "Occhio del Glitch",
    description:
      "Hai trovato la crepa nella realtà cliccando sette volte il titolo proibito. Ora il sistema ti vede.",
  },
  {
    id: "eterno_ritorno",
    name: "Eterno Ritorno",
    description:
      "Sei tornato al menu più di cinque volte. Non puoi staccarti. La stanza ti ha già adottato.",
  },
  {
    id: "sale_cazzo_di_cane",
    name: "Sale alla cazzo di cane",
    description:
      "Hai svuotato l'intera scatola dentro la pentola senza pietà. La pasta non si riprenderà mai.",
  },
];

const STORAGE_KEY = "trofei_v1";
const RETURN_COUNT_KEY = "menu_return_count";
const TITLE_CLICKS_KEY = "title_secret_clicks";

function readMap(): Record<string, 1> {
  // Migrazione legacy: trofeo_rattesco
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (localStorage.getItem("trofeo_rattesco") === "1") {
      raw["rattesco"] = 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    }
    return raw;
  } catch {
    return {};
  }
}

export function getUnlocked(): Set<TrophyId> {
  const map = readMap();
  return new Set(Object.keys(map) as TrophyId[]);
}

export function isUnlocked(id: TrophyId): boolean {
  return !!readMap()[id];
}

/** Sblocca un trofeo. Ritorna true se è la prima volta. */
export function unlockTrophy(id: TrophyId): boolean {
  const map = readMap();
  if (map[id]) return false;
  map[id] = 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  return true;
}

// === Eterno Ritorno: contatore ritorni al menu ===
export const ETERNAL_THRESHOLD = 5;
export function bumpMenuReturn(): number {
  const cur = parseInt(localStorage.getItem(RETURN_COUNT_KEY) || "0", 10) + 1;
  localStorage.setItem(RETURN_COUNT_KEY, String(cur));
  return cur;
}
export function getMenuReturns(): number {
  return parseInt(localStorage.getItem(RETURN_COUNT_KEY) || "0", 10);
}

// === Occhio del Glitch: click nascosti sul titolo ===
export const TITLE_CLICKS_THRESHOLD = 7;
export function bumpTitleClicks(): number {
  const cur = parseInt(localStorage.getItem(TITLE_CLICKS_KEY) || "0", 10) + 1;
  localStorage.setItem(TITLE_CLICKS_KEY, String(cur));
  return cur;
}
export function resetTitleClicks() {
  localStorage.setItem(TITLE_CLICKS_KEY, "0");
}
