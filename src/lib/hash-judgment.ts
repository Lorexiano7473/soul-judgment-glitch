// Algoritmo deterministico: stesso nome → stesso voto e commento serio.
function normalizeLocal(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Hash stringa → uint32 (FNV-1a)
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

// Commenti seri/cupi per fascia di voto. Ognuno ha più varianti, scelte deterministicamente.
const COMMENTS_BY_BAND: Record<string, string[]> = {
  // 0-2 — abominio
  abisso: [
    "L'anima è marcia oltre ogni redenzione. Nessuna luce filtra più dalle crepe.",
    "Anche le ombre si ritraggono al tuo passaggio. Hai consumato tutto ciò che era buono.",
    "Sei un peso morto per chiunque ti porti in cuore. La stanza ti registra come perduto.",
  ],
  // 3-4 — pesante
  pesante: [
    "Porti dentro una colpa che non hai mai nominato. Si vede dal modo in cui taci.",
    "Hai imparato a sorridere mentre fai del male. Funziona quasi sempre.",
    "Sei abituato a deludere. È diventato il tuo unico talento stabile.",
  ],
  // 5-6 — neutro grigio
  grigio: [
    "Esisti senza lasciare traccia. Né male né bene: rumore di fondo.",
    "Né colpevole né innocente. Solo presente, e questo a volte basta a fare danni.",
    "La tua anima ha la consistenza di una stanza in attesa.",
  ],
  // 7-8 — lucido
  lucido: [
    "C'è un'integrità rara in te, anche se la nascondi sotto strati di sarcasmo.",
    "Hai fatto cose discutibili, ma ne porti il peso. È più di quanto facciano in molti.",
    "Sei capace di amare qualcuno meglio di quanto ami te stesso. Lavoraci.",
  ],
  // 9-10 — quasi puro
  raro: [
    "Una rarità. La tua presenza migliora le stanze in cui entri, anche quando non parli.",
    "Hai il tipo di silenzio che cura. Non sprecarlo con chi non lo merita.",
    "Sei una di quelle anime che la stanza fatica a giudicare. Bene così.",
  ],
};

function bandFor(score: number): keyof typeof COMMENTS_BY_BAND {
  if (score <= 2) return "abisso";
  if (score <= 4) return "pesante";
  if (score <= 6) return "grigio";
  if (score <= 8) return "lucido";
  return "raro";
}

export interface DeterministicVerdict {
  rating: string;
  comment: string;
  intense: boolean;
  score: number;
}

export function deterministicVerdict(rawName: string): DeterministicVerdict {
  const key = normalize(rawName);
  const h = hashString(key || "anonimo");
  const score = h % 11; // 0-10
  const band = bandFor(score);
  const variants = COMMENTS_BY_BAND[band];
  const comment = variants[(h >>> 8) % variants.length];
  return {
    rating: `${score}/10`,
    comment,
    intense: score <= 2 || score >= 9,
    score,
  };
}
