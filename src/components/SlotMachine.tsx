import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices } from "lucide-react";
import { glitchSfx, jumpScare } from "@/lib/audio";

const SYMBOLS = ["☠", "👁", "🩸", "🕷", "✟", "⛧", "🦷"];
const COOLDOWN_MS = 30_000;

type Outcome = {
  reward: number;
  message: string;
  cursed?: boolean;
  jackpot?: boolean;
};

function rollOutcome(): Outcome {
  const r = Math.random() * 100;
  if (r < 0.1) return { reward: -1, message: "HAI PERSO TUTTO, ANCHE L'ANIMA", cursed: true };
  if (r < 5) return { reward: 80, message: "UNA FORTUNA MALEDETTA", jackpot: true }; // 0.1..5 = 4.9%
  if (r < 15) return { reward: 40, message: "Il sistema ti concede una briciola." };
  if (r < 40) return { reward: 15, message: "Una piccola elemosina dall'ombra." };
  return { reward: 0, message: "La stanza ride della tua sfortuna" };
}

export default function SlotMachine({
  coins,
  onResult,
  onCursed,
}: {
  coins: number;
  onResult: (delta: number) => void;
  onCursed: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [reels, setReels] = useState<string[]>(["?", "?", "?"]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number>(() =>
    parseInt(localStorage.getItem("slot_cooldown_until") || "0", 10)
  );
  const [now, setNow] = useState(Date.now());
  const [cursedFx, setCursedFx] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  const remaining = Math.max(0, cooldownUntil - now);
  const canSpin = !spinning && remaining === 0;

  const spin = () => {
    if (!canSpin) return;
    setMessage(null);
    setSpinning(true);
    const outcome = rollOutcome();
    const finalSymbols = outcome.jackpot
      ? [SYMBOLS[0], SYMBOLS[0], SYMBOLS[0]]
      : outcome.cursed
      ? ["☠", "☠", "☠"]
      : [
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        ];

    intervalRef.current = window.setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
    }, 70);

    const stops = [1100, 1500, 1900];
    stops.forEach((delay, i) => {
      setTimeout(() => {
        setReels((prev) => {
          const next = [...prev];
          next[i] = finalSymbols[i];
          return next;
        });
        if (i === 2 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, delay);
    });

    setTimeout(() => {
      setSpinning(false);
      const until = Date.now() + COOLDOWN_MS;
      localStorage.setItem("slot_cooldown_until", String(until));
      setCooldownUntil(until);
      setMessage(outcome.message);
      if (outcome.cursed) {
        setCursedFx(true);
        glitchSfx();
        jumpScare();
        setTimeout(() => setCursedFx(false), 900);
        onCursed();
      } else if (outcome.reward > 0) {
        onResult(outcome.reward);
        glitchSfx();
      }
    }, 2100);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-typewriter text-xs border border-blood/60 text-blood px-3 py-2 hover:bg-blood/10 transition-colors inline-flex items-center gap-2"
      >
        <Dices size={14} /> SLOT DELLA DISPERAZIONE
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => !spinning && setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-md border border-blood bg-black/60 backdrop-blur-xl p-6 ${
                cursedFx ? "glitch-intense" : ""
              }`}
              style={{
                boxShadow:
                  "0 0 40px hsl(var(--blood-glow) / 0.5), inset 0 0 30px hsl(0 0% 0% / 0.7)",
              }}
            >
              <h3 className="font-display text-2xl sm:text-3xl text-blood text-center mb-2 glitch-intense">
                SLOT DELLA DISPERAZIONE
              </h3>
              <p className="font-mono-h text-xs text-muted-foreground text-center mb-5">
                &gt; gratis. ogni 30 secondi. la stanza decide.
              </p>

              <div
                className={`grid grid-cols-3 gap-3 mb-5 ${cursedFx ? "animate-pulse" : ""}`}
              >
                {reels.map((s, i) => (
                  <div
                    key={i}
                    className="aspect-square border-2 border-blood bg-black flex items-center justify-center text-5xl sm:text-6xl"
                    style={{
                      textShadow: "0 0 14px hsl(var(--blood-glow))",
                      boxShadow: "inset 0 0 20px hsl(0 0% 0% / 0.9)",
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>

              <button
                onClick={spin}
                disabled={!canSpin}
                className="btn-horror w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {spinning
                  ? "I rulli girano..."
                  : remaining > 0
                  ? `Attendi ${Math.ceil(remaining / 1000)}s`
                  : "GIRA (gratis)"}
              </button>

              <div className="mt-4 min-h-[48px] border border-ash/40 bg-black/60 p-3 text-center">
                <AnimatePresence mode="wait">
                  {message ? (
                    <motion.p
                      key={message}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-typewriter text-sm text-blood glitch-intense"
                    >
                      {message}
                    </motion.p>
                  ) : (
                    <p className="font-mono-h text-xs text-muted-foreground italic">
                      &gt; tira la leva del destino...
                    </p>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className="font-mono-h text-xs text-muted-foreground">
                  saldo: <span className="text-blood">{coins}</span>
                </span>
                <button
                  onClick={() => !spinning && setOpen(false)}
                  className="font-typewriter text-xs text-muted-foreground hover:text-blood underline"
                >
                  chiudi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
