// Easter egg fissi e logica giudizi
export type Verdict = {
  rating: string;
  comment: string;
  intense?: boolean; // glitch rosso intenso
};

// Mappa nome normalizzato -> verdetto
export const FIXED_JUDGMENTS: Record<string, Verdict> = {
  "aniello": {
    rating: "ABOMINIO",
    comment:
      "Un errore della natura che non dovrebbe calpestare questo suolo. Cosa pensava tua madre quando ti ha chiamato così? Agli animali?",
    intense: true,
  },
  "ratto": {
    rating: "8/10",
    comment:
      "Nome generico per identificare le persone rattesche e tutti quelli brutti. Il padre fondatore è Gabriele Capocchia o Capoziello, il leader dei ratti.",
    intense: true,
  },
  "elia": {
    rating: "6/10",
    comment:
      "Nome basico per i mangia merda o hamburger. Deriva da Elia Sartori o Sartoria Egiziana. È il rivale di Julian Lualdi ed è scarso in lotta.",
    intense: true,
  },
  "elia de merda": {
    rating: "6/10",
    comment:
      "Nome basico per i mangia merda o hamburger. Deriva da Elia Sartori o Sartoria Egiziana. È il rivale di Julian Lualdi ed è scarso in lotta.",
    intense: true,
  },
  "milan": {
    rating: "7/10",
    comment:
      "Nome derivante da Julian Lualdi. Il rivale è Elia Sartori, lo ha già battuto diverse volte rischiando la kill e l'arresto dalla finanza. Tifa Milan quando vince e quando perde è colpa del Matchup e non gli interessa.",
    intense: true,
  },
  "lualdi": {
    rating: "7/10",
    comment:
      "Nome derivante da Julian Lualdi. Il rivale è Elia Sartori, lo ha già battuto diverse volte rischiando la kill e l'arresto dalla finanza. Tifa Milan quando vince e quando perde è colpa del Matchup e non gli interessa.",
    intense: true,
  },
  "cazzone": {
    rating: "7/10",
    comment:
      "Nome derivante da Julian Lualdi. Il rivale è Elia Sartori, lo ha già battuto diverse volte rischiando la kill e l'arresto dalla finanza. Tifa Milan quando vince e quando perde è colpa del Matchup e non gli interessa.",
    intense: true,
  },
  "capo ultras": {
    rating: "7/10",
    comment:
      "Nome derivante da Julian Lualdi. Il rivale è Elia Sartori, lo ha già battuto diverse volte rischiando la kill e l'arresto dalla finanza. Tifa Milan quando vince e quando perde è colpa del Matchup e non gli interessa.",
    intense: true,
  },
  "babbo": {
    rating: "10/10 — top del top, non flop ma top",
    comment:
      "Nome preciso per indicare i balbosi, quelli che mangiano e parlano troppo. Rivale eterno della Sartoria Egizia. Balboso lo ha già battuto molte volte rischiando il ban da parte della Antonella e dall'Uovo. Inoltre ricordiamo che gli over 80 kg non hanno moglie.",
    intense: true,
  },
  "balboso": {
    rating: "10/10 — top del top, non flop ma top",
    comment:
      "Nome preciso per indicare i balbosi, quelli che mangiano e parlano troppo. Rivale eterno della Sartoria Egizia. Balboso lo ha già battuto molte volte rischiando il ban da parte della Antonella e dall'Uovo. Inoltre ricordiamo che gli over 80 kg non hanno moglie.",
    intense: true,
  },
  "schifoso": {
    rating: "10/10 — top del top, non flop ma top",
    comment:
      "Nome preciso per indicare i balbosi, quelli che mangiano e parlano troppo. Rivale eterno della Sartoria Egizia. Balboso lo ha già battuto molte volte rischiando il ban da parte della Antonella e dall'Uovo. Inoltre ricordiamo che gli over 80 kg non hanno moglie.",
    intense: true,
  },
  "polpettoso": {
    rating: "10/10 — top del top, non flop ma top",
    comment:
      "Nome preciso per indicare i balbosi, quelli che mangiano e parlano troppo. Rivale eterno della Sartoria Egizia. Balboso lo ha già battuto molte volte rischiando il ban da parte della Antonella e dall'Uovo. Inoltre ricordiamo che gli over 80 kg non hanno moglie.",
    intense: true,
  },
  "de merda": {
    rating: "10/10 — top del top, non flop ma top",
    comment:
      "Nome preciso per indicare i balbosi, quelli che mangiano e parlano troppo. Rivale eterno della Sartoria Egizia. Balboso lo ha già battuto molte volte rischiando il ban da parte della Antonella e dall'Uovo. Inoltre ricordiamo che gli over 80 kg non hanno moglie.",
    intense: true,
  },

  // === PLACEHOLDER COMPAGNI DI CLASSE ===
  // Aggiungi qui altri nomi: "nomenormalizzato": { rating: "x/10", comment: "..." , intense: true },
  "compagno1": {
    rating: "?/10",
    comment: "PLACEHOLDER — sostituisci con valutazione personalizzata.",
  },
  "compagno2": {
    rating: "?/10",
    comment: "PLACEHOLDER — sostituisci con valutazione personalizzata.",
  },
  "compagno3": {
    rating: "?/10",
    comment: "PLACEHOLDER — sostituisci con valutazione personalizzata.",
  },
};

// Nome che attiva il prompt password segreto
export const SECRET_TRIGGER = "capoziello counterato dalla antonella";
export const SECRET_PASSWORD = "Bimbo brainrot 67";

const CRYPTIC_COMMENTS = [
  "La tua ombra ti teme.",
  "Osservato dall'angolo.",
  "Qualcosa respira dietro di te.",
  "Hai chiuso la porta a chiave? Sei sicuro?",
  "Il riflesso non ti segue più.",
  "Ti chiamano nel sonno.",
  "Le pareti hanno memorizzato il tuo nome.",
  "Non sei l'unico in questa stanza.",
  "Il pavimento ricorda i tuoi passi.",
  "Continua a non guardarti indietro.",
  "Il tuo respiro non è solo tuo.",
  "Hanno trovato i tuoi denti nel muro.",
];

export function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getVerdict(rawName: string): Verdict {
  const key = normalize(rawName);
  const fixed = FIXED_JUDGMENTS[key];
  if (fixed) return fixed;
  const rating = Math.floor(Math.random() * 10) + 1;
  const comment = CRYPTIC_COMMENTS[Math.floor(Math.random() * CRYPTIC_COMMENTS.length)];
  return { rating: `${rating}/10`, comment };
}

// Validazione: solo lettere, spazi, apostrofi; non sequenze di tasti casuali (es. "asdfgh")
export function isValidName(name: string): { ok: boolean; reason?: string } {
  const trimmed = name.trim();
  if (trimmed.length < 2) return { ok: false, reason: "INPUT TROPPO BREVE" };
  if (trimmed.length > 60) return { ok: false, reason: "INPUT TROPPO LUNGO" };
  if (!/^[a-zA-ZàèéìòùÀÈÉÌÒÙ' ]+$/.test(trimmed))
    return { ok: false, reason: "CARATTERI NON AMMESSI" };
  // detect mash: 4+ consonanti consecutive senza vocali
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(trimmed))
    return { ok: false, reason: "SEQUENZA NON UMANA RILEVATA" };
  // detect alternanza tipo asdf
  const mashPatterns = ["asdf","qwer","zxcv","jkl","hjkl","wasd","yuio"];
  const lower = trimmed.toLowerCase();
  if (mashPatterns.some((p) => lower.includes(p)))
    return { ok: false, reason: "PATTERN DI TASTIERA RICONOSCIUTO" };
  return { ok: true };
}
