// Versioning, changelog e update checker
export const APP_VERSION = "1.1.0";

// URL del manifest remoto (placeholder GitHub raw — l'utente lo sostituirà)
export const REMOTE_MANIFEST_URL =
  "https://raw.githubusercontent.com/lorexiano/giudizio-stanza/main/version.json";
// Link al GitHub di rilascio (placeholder)
export const GITHUB_RELEASES_URL = "https://github.com/lorexiano/giudizio-stanza/releases";

const VERSION_KEY = "app_version_seen";
const CHANGELOG_DISMISSED_KEY = "changelog_dismissed_for";

export interface ChangelogEntry {
  version: string;
  date: string;
  items: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.1.0",
    date: "2026-04",
    items: [
      "🧂 Minigioco del Sale — versa la pentola fino in fondo",
      "💀 Nuovi Font Horror (Creepster + VT323)",
      "🏆 Sistema Trofei con Bacheca dei Peccati",
      "🧠 Algoritmo dell'Anima migliorato (deterministico)",
      "📜 Archivio Glitch per gli Easter Egg scoperti",
      "🔄 Update Checker integrato",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-03",
    items: ["Prima release pubblica della Stanza"],
  },
];

/** Ritorna true se l'utente non ha mai visto questa versione (changelog da mostrare). */
export function shouldShowChangelog(): boolean {
  try {
    const seen = localStorage.getItem(VERSION_KEY);
    const dismissed = localStorage.getItem(CHANGELOG_DISMISSED_KEY);
    if (dismissed === APP_VERSION) return false;
    return seen !== APP_VERSION;
  } catch {
    return false;
  }
}

export function markChangelogSeen() {
  try {
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    localStorage.setItem(CHANGELOG_DISMISSED_KEY, APP_VERSION);
  } catch {}
}

// Compara due versioni semver semplici (a > b → 1, < → -1, = → 0)
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

/** Controlla update remoto. Fallisce silenziosamente se offline / file mancante. */
export async function checkForUpdate(): Promise<{
  hasUpdate: boolean;
  remoteVersion?: string;
  url?: string;
}> {
  try {
    const res = await fetch(REMOTE_MANIFEST_URL, { cache: "no-store" });
    if (!res.ok) return { hasUpdate: false };
    const data = (await res.json()) as { version?: string; url?: string };
    if (!data.version) return { hasUpdate: false };
    const cmp = compareVersions(data.version, APP_VERSION);
    return {
      hasUpdate: cmp > 0,
      remoteVersion: data.version,
      url: data.url || GITHUB_RELEASES_URL,
    };
  } catch {
    return { hasUpdate: false };
  }
}
