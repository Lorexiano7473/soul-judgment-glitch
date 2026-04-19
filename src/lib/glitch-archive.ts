// Archivio degli Easter Egg testuali scoperti
import { findFixedVerdict } from "./judgments";

const KEY = "glitch_archive_v1";

export interface GlitchEntry {
  id: string;
  name: string; // nome leggibile
  hint: string; // indizio criptico se non scoperto
}

// Catalogo completo degli easter egg testuali rilevanti (storico progetto)
export const GLITCH_CATALOG: GlitchEntry[] = [
  { id: "molteni", name: "MOLTENI", hint: "Il Chad delle trattorie sbatte tutto..." },
  { id: "maria", name: "MARIA PRIZEPOOL", hint: "Settembre 2025, ballerine disoneste..." },
  { id: "aniello", name: "ANIELLO", hint: "Un nome scelto come per un animale..." },
  { id: "ratto", name: "RATTO", hint: "Il padre fondatore dei rattesi..." },
  { id: "elia", name: "ELIA", hint: "Mangia hamburger ed è scarso in lotta..." },
  { id: "milan", name: "JULIAN LUALDI", hint: "Tifa, perde, dà la colpa al Matchup..." },
  { id: "babbo", name: "BALBOSO", hint: "Over 80kg, no moglie, parla troppo..." },
  { id: "capoziello", name: "CAPOZIELLO", hint: "Counterato dalla Antonella..." },
  { id: "sale", name: "SALE A CASCATA", hint: "La pasta non si riprenderà mai..." },
];

// Mappa id → keyword di matching
const TRIGGERS: Record<string, string[]> = {
  molteni: ["molteni", "sbattere", "trattoria", "chad"],
  maria: ["maria", "prizepool", "moltrasio", "puttana"],
  aniello: ["aniello"],
  ratto: ["ratto"],
  elia: ["elia"],
  milan: ["milan", "lualdi", "cazzone", "capo ultras"],
  babbo: ["babbo", "balboso", "schifoso", "polpettoso"],
  capoziello: ["capoziello"],
  sale: ["sale a cascata", "sale a cascate"],
};

function readSet(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return new Set(Array.isArray(raw) ? raw : []);
  } catch {
    return new Set();
  }
}

export function getDiscovered(): Set<string> {
  return readSet();
}

/** Registra un nome come scoperto. Ritorna l'id se nuovo. */
export function recordDiscovery(rawName: string): string | null {
  const lower = rawName.toLowerCase();
  let foundId: string | null = null;
  for (const [id, words] of Object.entries(TRIGGERS)) {
    if (words.some((w) => lower.includes(w))) {
      foundId = id;
      break;
    }
  }
  // fallback: se è un easter egg fisso ma non in mappa, prova a derivare
  if (!foundId && findFixedVerdict(rawName)) foundId = "altro";
  if (!foundId) return null;
  const set = readSet();
  if (set.has(foundId)) return null;
  set.add(foundId);
  localStorage.setItem(KEY, JSON.stringify([...set]));
  return foundId;
}
