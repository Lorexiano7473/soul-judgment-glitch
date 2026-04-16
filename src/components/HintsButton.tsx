import { useState } from "react";
import { Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HINTS = [
  "Cerca colui che è stato chiamato come un animale per errore materno...",
  "Trova il fondatore rattesco tra Capocchia e Capoziello.",
  "Cerca il mangiatore di hamburger egiziano, il rivale scarso in lotta.",
  "Chi teme la finanza e dà sempre la colpa al Matchup?",
  "Cerca chi parla troppo, mangia troppo e non avrà mai una moglie sopra gli 80kg.",
  "Il codice è nascosto nel brainrot di un piccolo numero... 67, centra con i counter della Antonella.",
];

const SPIN_COST = 30;

export default function HintsButton({
  coins,
  onSpend,
}: {
  coins: number;
  onSpend: (amount: number) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<string | null>(null);

  const slice = 360 / HINTS.length;
  const canAfford = coins >= SPIN_COST;

  const spin = () => {
    if (spinning) return;
    if (!canAfford) return;
    if (!onSpend(SPIN_COST)) return;
    setRevealed(null);
    setSpinning(true);
    const idx = Math.floor(Math.random() * HINTS.length);
    // 6 full turns + land so that the slice idx is at the top pointer
    const target = 360 * 6 + (360 - (idx * slice + slice / 2));
    setRotation((prev) => prev + target);
    setSelected(idx);
    setTimeout(() => {
      setSpinning(false);
      setRevealed(HINTS[idx]);
    }, 4200);
  };

  return (
    <>
      <div className="fixed bottom-3 right-3 z-[60] flex items-center gap-2">
        <AnimatePresence>
          {hover && !open && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="font-typewriter text-xs text-blood glitch-intense bg-black/70 px-2 py-1 border border-blood/60 whitespace-nowrap"
            >
              Vuoi sapere troppo?
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label="Indizi"
          className="w-11 h-11 flex items-center justify-center border border-ash/60 bg-black/70 backdrop-blur-sm hover:border-blood hover:text-blood transition-colors flicker"
        >
          <Eye size={20} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md border border-blood bg-black/40 backdrop-blur-xl p-6 sm:p-8"
              style={{
                boxShadow:
                  "0 0 40px hsl(var(--blood-glow) / 0.5), inset 0 0 30px hsl(0 0% 0% / 0.6)",
              }}
            >
              <h3 className="font-display text-2xl sm:text-3xl text-blood mb-2 glitch-intense text-center">
                RUOTA DEGLI INDIZI
              </h3>
              <p className="font-mono-h text-xs text-muted-foreground mb-5 text-center">
                &gt; gira. il sistema sceglierà cosa dirti.
              </p>

              {/* Wheel */}
              <div className="relative mx-auto" style={{ width: 260, height: 260 }}>
                {/* Pointer */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-1 z-10"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "12px solid transparent",
                    borderRight: "12px solid transparent",
                    borderTop: "20px solid hsl(var(--blood))",
                    filter: "drop-shadow(0 0 6px hsl(var(--blood-glow)))",
                  }}
                />
                <motion.div
                  animate={{ rotate: rotation }}
                  transition={{ duration: 4, ease: [0.17, 0.67, 0.2, 1] }}
                  className="w-full h-full rounded-full border-2 border-blood relative overflow-hidden"
                  style={{
                    background: `conic-gradient(${HINTS.map((_, i) => {
                      const c = i % 2 === 0 ? "hsl(0 0% 8%)" : "hsl(0 60% 18%)";
                      return `${c} ${i * slice}deg ${(i + 1) * slice}deg`;
                    }).join(", ")})`,
                    boxShadow:
                      "0 0 30px hsl(var(--blood-glow) / 0.4), inset 0 0 20px hsl(0 0% 0% / 0.8)",
                  }}
                >
                  {HINTS.map((_, i) => {
                    const angle = i * slice + slice / 2;
                    return (
                      <div
                        key={i}
                        className="absolute left-1/2 top-1/2 font-display text-blood text-lg"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-95px)`,
                          textShadow: "0 0 6px hsl(var(--blood-glow))",
                        }}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </motion.div>
                {/* Center hub */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blood border-2 border-black z-10" />
              </div>

              <button
                onClick={spin}
                disabled={spinning || !canAfford}
                className="btn-horror w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {spinning
                  ? "il sistema sceglie..."
                  : !canAfford
                  ? `PAGARE IN SANGUE (${SPIN_COST} COIN)`
                  : `Gira la Ruota (${SPIN_COST} coin)`}
              </button>
              <p className="font-mono-h text-[10px] text-muted-foreground text-center mt-2">
                saldo: <span className="text-blood">{coins}</span> coin corrotti
              </p>

              <div className="mt-5 min-h-[80px] border border-ash/40 bg-black/60 p-4">
                <AnimatePresence mode="wait">
                  {revealed ? (
                    <motion.p
                      key={selected}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-typewriter text-sm leading-relaxed text-foreground glitch-intense"
                    >
                      › {revealed}
                    </motion.p>
                  ) : (
                    <p className="font-mono-h text-xs text-muted-foreground italic">
                      &gt; nessun indizio rivelato...
                    </p>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-4 text-right">
                <button
                  onClick={() => setOpen(false)}
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
