// Effetti reali degli oggetti acquistati nello Shop (persistiti via useInventory/localStorage)
import type { ShopItemId } from "@/hooks/useInventory";

const INVENTORY_KEY = "shop_inventory_v1";

export function ownsItem(id: ShopItemId): boolean {
  try {
    const map = JSON.parse(localStorage.getItem(INVENTORY_KEY) || "{}");
    return !!map[id];
  } catch {
    return false;
  }
}

/** Applica/rimuove la Tinta Abissale: ridefinisce le CSS variables del rosso. */
export function applyTintaAbissale(active: boolean) {
  const root = document.documentElement;
  if (active) {
    // #8B0000 ≈ hsl(0, 100%, 27%)
    root.style.setProperty("--blood", "0 100% 27%");
    root.style.setProperty("--blood-glow", "0 100% 32%");
    root.style.setProperty("--primary", "0 100% 27%");
    root.style.setProperty("--accent", "0 100% 27%");
    root.style.setProperty("--ring", "0 100% 27%");
    root.setAttribute("data-tinta-abissale", "1");
  } else {
    root.style.removeProperty("--blood");
    root.style.removeProperty("--blood-glow");
    root.style.removeProperty("--primary");
    root.style.removeProperty("--accent");
    root.style.removeProperty("--ring");
    root.removeAttribute("data-tinta-abissale");
  }
}

/** Indizi criptici per Easter Egg ancora non scoperti. */
const CRYPTIC_HINTS = [
  "Il sale non è l'unico modo per purificare un nome...",
  "Una madre confuse il figlio con un roditore. Il cognome resta.",
  "Maria non è solo un nome: è una formula spezzata.",
  "Sbattere è un verbo, ma anche un cognome di trattoria.",
  "Settembre 2025 portò ballerine e un sito disonesto.",
  "Sette tocchi sul titolo aprono una crepa.",
  "Tornare al menu troppe volte ti fa notare.",
];

export function getCripticHint(): string {
  // Indice deterministico basato su data, così cambia ogni giorno ma resta stabile durante la sessione
  const seed = new Date().getDate() + new Date().getMonth() * 31;
  return CRYPTIC_HINTS[seed % CRYPTIC_HINTS.length];
}

/** Sussurro del Vuoto: jumpscare audio — sussurro distorto + sub-bass. */
export function voidWhisper() {
  try {
    const AC = (window.AudioContext || (window as any).webkitAudioContext);
    const c: AudioContext = new AC();
    const t = c.currentTime;

    // Sub-bass drone
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(70, t);
    o.frequency.exponentialRampToValueAtTime(28, t + 1.2);
    const og = c.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(0.55, t + 0.05);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
    o.connect(og).connect(c.destination);
    o.start(t); o.stop(t + 1.35);

    // Whisper noise
    const buf = c.createBuffer(1, c.sampleRate * 1.2, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
    const src = c.createBufferSource();
    src.buffer = buf;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 900;
    bp.Q.value = 4;
    const ng = c.createGain();
    ng.gain.setValueAtTime(0.0001, t);
    ng.gain.exponentialRampToValueAtTime(0.45, t + 0.1);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    src.connect(bp).connect(ng).connect(c.destination);
    src.start(t); src.stop(t + 1.2);

    setTimeout(() => { try { c.close(); } catch {} }, 1500);
  } catch {}
}

/** Probabilità di trigger del jumpscare ad ogni cambio "pagina". */
export const VOID_WHISPER_CHANCE = 0.05;

export function maybeVoidWhisper() {
  if (!ownsItem("sussurro_vuoto")) return;
  if (Math.random() < VOID_WHISPER_CHANCE) voidWhisper();
}
