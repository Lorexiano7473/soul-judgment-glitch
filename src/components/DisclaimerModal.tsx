import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { glitchSfx, typeSfx } from "@/lib/audio";

interface Props {
  open: boolean;
  onAccept: () => void;
  onClose: () => void;
}

const SECTIONS = [
  {
    label: "[01] EFFETTI COLLATERALI",
    body:
      "Questo software contiene effetti visivi stroboscopici, glitch e atmosfere disturbanti. L'autore non si assume responsabilità per incubi, perdite di Coin Corrotti o sanità mentale.",
  },
  {
    label: "[02] PRIVACY & CERCHIA",
    body:
      "Gli Easter Egg e i riferimenti a persone reali sono puramente goliardici e destinati a un uso privato tra amici. Non diffondere il contenuto al di fuori della cerchia autorizzata.",
  },
  {
    label: "[03] RESPONSABILITÀ",
    body:
      "Procedendo, accetti che 'Il Giudizio della Stanza' analizzi il tuo profilo (ovviamente è finzione). Se il sistema ti definisce 'ABOMINIO' o 'RATTO', accettalo con dignità.",
  },
];

export default function DisclaimerModal({ open, onAccept, onClose }: Props) {
  const [revealed, setRevealed] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [cowardMsg, setCowardMsg] = useState(false);
  const [blackout, setBlackout] = useState(false);

  // Reset on open
  useEffect(() => {
    if (open) {
      setRevealed(0);
      setTypedChars(0);
      setCowardMsg(false);
      setBlackout(false);
    }
  }, [open]);

  // Type out current section
  useEffect(() => {
    if (!open || blackout) return;
    if (revealed >= SECTIONS.length) return;
    const fullLen = SECTIONS[revealed].body.length;
    if (typedChars >= fullLen) {
      const t = setTimeout(() => {
        setRevealed((r) => r + 1);
        setTypedChars(0);
      }, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setTypedChars((c) => c + 1);
      if (typedChars % 3 === 0) typeSfx();
    }, 18);
    return () => clearTimeout(t);
  }, [open, revealed, typedChars, blackout]);

  const handleClose = () => {
    glitchSfx();
    setCowardMsg(true);
    setTimeout(() => {
      setBlackout(true);
      setTimeout(() => {
        setCowardMsg(false);
        setBlackout(false);
        onClose();
      }, 1600);
    }, 1400);
  };

  const skip = () => {
    setRevealed(SECTIONS.length);
    setTypedChars(0);
  };

  const allRevealed = revealed >= SECTIONS.length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
        >
          {/* Blackout overlay (coward path) */}
          <AnimatePresence>
            {blackout && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[90] bg-black"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {cowardMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[95] flex items-center justify-center pointer-events-none"
              >
                <p
                  className="font-display text-3xl sm:text-5xl text-blood glitch-intense text-center px-6"
                  style={{ textShadow: "0 0 30px hsl(var(--blood-glow))" }}
                  data-text="LA STANZA NON DIMENTICA I CODARDI"
                >
                  LA STANZA NON DIMENTICA I CODARDI
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!blackout && !cowardMsg && (
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl border border-blood bg-black/70 backdrop-blur-md p-5 sm:p-7 shadow-[0_0_40px_hsl(var(--blood-glow)/0.4)]"
              style={{
                background:
                  "linear-gradient(135deg, hsl(0 0% 0% / 0.85), hsl(0 60% 8% / 0.55))",
              }}
            >
              {/* Close X */}
              <button
                onClick={handleClose}
                aria-label="Chiudi"
                className="absolute top-2 right-2 text-ash hover:text-blood transition-colors p-1"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="font-typewriter text-[10px] text-muted-foreground mb-3 flex justify-between border-b border-blood/40 pb-2">
                <span>STANZA-OS // PROTOCOLLO_LEGALE.exe</span>
                <span className="text-blood animate-pulse">● LIVE</span>
              </div>

              <h2
                className="font-display text-2xl sm:text-4xl text-blood mb-5 glitch-intense"
                data-text="ATTENZIONE: PROTOCOLLO DI ACCESSO"
                style={{ textShadow: "0 0 18px hsl(var(--blood-glow))" }}
              >
                ATTENZIONE: PROTOCOLLO DI ACCESSO
              </h2>

              <div className="font-mono-h text-sm text-foreground/90 space-y-4 min-h-[260px] max-h-[45vh] overflow-y-auto pr-2">
                {SECTIONS.map((s, i) => {
                  if (i > revealed) return null;
                  const isCurrent = i === revealed && !allRevealed;
                  const text = isCurrent ? s.body.slice(0, typedChars) : s.body;
                  return (
                    <div key={i}>
                      <p className="text-blood text-xs mb-1">&gt; {s.label}</p>
                      <p className="leading-relaxed">
                        {text}
                        {isCurrent && (
                          <span className="text-blood animate-pulse">█</span>
                        )}
                      </p>
                    </div>
                  );
                })}
                {allRevealed && (
                  <p className="text-blood text-xs terminal-cursor">
                    &gt; fine trasmissione
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-t border-blood/30 pt-4">
                {!allRevealed ? (
                  <button
                    onClick={skip}
                    className="font-typewriter text-xs text-muted-foreground hover:text-blood underline self-start"
                  >
                    [salta caricamento]
                  </button>
                ) : (
                  <span className="font-mono-h text-[10px] text-muted-foreground">
                    firma digitale richiesta
                  </span>
                )}
                <button
                  onClick={onAccept}
                  disabled={!allRevealed}
                  className="btn-horror disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ACCETTO IL MIO DESTINO
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
