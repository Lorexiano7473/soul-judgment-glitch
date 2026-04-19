import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hapticTap, hapticTrophy } from "@/lib/haptics";
import { glitchSfx } from "@/lib/audio";

const TOTAL_CLICKS = 25;
const PARTICLES_PER_CLICK = 80;

interface Particle {
  id: number;
  dx: number;
  dy: number;
  dur: number;
  left: number;
}

interface Props {
  onClose: () => void;
  onWin: () => void; // sblocca trofeo "sale_cazzo_di_cane"
}

export default function SaltGame({ onClose, onWin }: Props) {
  const [clicks, setClicks] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [won, setWon] = useState(false);
  const idRef = useRef(0);

  const ratio = clicks / TOTAL_CLICKS;
  const shakeClass = ratio < 0.33 ? "salt-shake-1" : ratio < 0.66 ? "salt-shake-2" : "salt-shake-3";
  const whiteOverlay = Math.min(0.85, ratio * 0.9);

  const handleClick = () => {
    if (won) return;
    hapticTap();
    glitchSfx();
    const baseId = idRef.current;
    const fresh: Particle[] = Array.from({ length: PARTICLES_PER_CLICK }, (_, i) => ({
      id: baseId + i,
      dx: (Math.random() - 0.5) * 60,
      dy: 280 + Math.random() * 180,
      dur: 0.7 + Math.random() * 0.7,
      left: 50 + (Math.random() - 0.5) * 90, // % entro la box
    }));
    idRef.current = baseId + PARTICLES_PER_CLICK;
    setParticles((p) => [...p, ...fresh].slice(-600));
    setClicks((c) => {
      const next = c + 1;
      if (next >= TOTAL_CLICKS) {
        setWon(true);
        hapticTrophy();
        onWin();
      }
      return next;
    });
  };

  // Pulizia particelle vecchie
  useEffect(() => {
    if (particles.length === 0) return;
    const t = setTimeout(() => {
      setParticles((p) => p.slice(-200));
    }, 1600);
    return () => clearTimeout(t);
  }, [particles.length]);

  const remaining = Math.max(0, TOTAL_CLICKS - clicks);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black overflow-hidden"
    >
      {/* white invading overlay */}
      <div
        className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-200"
        style={{ opacity: whiteOverlay }}
      />

      {/* shake wrapper */}
      <div className={`relative w-full h-full ${shakeClass}`}>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center font-creepster text-3xl sm:text-4xl text-blood">
          SALE A CASCATA
        </div>
        <div className="absolute top-16 left-1/2 -translate-x-1/2 font-mono-h text-xs text-muted-foreground">
          &gt; sale rimasto: <span className="text-blood">{remaining}</span>
        </div>

        {/* Salt box (top) */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2" style={{ width: 200 }}>
          <button
            onClick={handleClick}
            disabled={won}
            aria-label="Versa il sale"
            className="relative w-full h-32 border-2 border-ash bg-black active:scale-95 transition-transform select-none"
            style={{ touchAction: "manipulation" }}
          >
            <div className="absolute inset-2 border border-blood/60 flex items-center justify-center font-creepster text-2xl text-blood">
              SALE
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-ash" />
          </button>

          {/* Particle layer below the box */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-[260px] h-[60vh] pointer-events-none">
            {particles.map((p) => (
              <span
                key={p.id}
                className="salt-particle"
                style={
                  {
                    left: `${p.left}%`,
                    top: 0,
                    "--dx": `${p.dx}px`,
                    "--dy": `${p.dy}px`,
                    "--dur": `${p.dur}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>

        {/* Pot (bottom) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <svg width="180" height="120" viewBox="0 0 180 120" aria-hidden>
            <ellipse cx="90" cy="20" rx="70" ry="10" fill="hsl(0 0% 8%)" stroke="hsl(var(--ash))" strokeWidth="2" />
            <path
              d="M 20 20 Q 20 110 90 110 Q 160 110 160 20 Z"
              fill="hsl(0 0% 6%)"
              stroke="hsl(var(--ash))"
              strokeWidth="2"
            />
            <rect x="0" y="35" width="20" height="6" fill="hsl(var(--ash))" />
            <rect x="160" y="35" width="20" height="6" fill="hsl(var(--ash))" />
            <ellipse cx="90" cy="20" rx="60" ry="6" fill="rgba(255,255,255,0.85)" />
          </svg>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-2 left-4 right-4 h-1 bg-ash/40">
          <div
            className="h-full bg-blood transition-all duration-150"
            style={{ width: `${(ratio * 100).toFixed(0)}%` }}
          />
        </div>

        {/* Close (X grande mobile-friendly) */}
        {!won && (
          <button
            onClick={onClose}
            aria-label="Chiudi minigioco"
            className="absolute top-2 right-2 w-11 h-11 flex items-center justify-center border border-ash/60 bg-black/80 text-muted-foreground hover:text-blood hover:border-blood"
          >
            ✕
          </button>
        )}
      </div>

      {/* Win overlay */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 bg-black/95 flex flex-col items-center justify-center p-6 text-center"
          >
            <p className="font-mono-h text-xs text-blood mb-3 glitch-intense">
              &gt; TROFEO SBLOCCATO
            </p>
            <motion.h2
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="font-creepster text-5xl sm:text-7xl text-blood glitch-intense mb-6"
              style={{ textShadow: "0 0 30px hsl(var(--blood-glow))" }}
            >
              SALE ALLA CAZZO DI CANE
            </motion.h2>
            <p className="font-typewriter text-sm text-muted-foreground max-w-md mb-8">
              Hai svuotato l'intera scatola dentro la pentola senza pietà. La pasta non si riprenderà mai.
            </p>
            <button onClick={onClose} className="btn-horror">
              Torna alla Stanza
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
