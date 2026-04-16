import { useState } from "react";
import { Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HINTS = [
  { title: "Per l'Abominio", text: "Cerca colui che è stato chiamato come un animale per errore materno..." },
  { title: "Per il Leader", text: "Trova il fondatore rattesco tra Capocchia e Capoziello." },
  { title: "Per la Sartoria", text: "Cerca il mangiatore di hamburger egiziano, il rivale scarso in lotta." },
  { title: "Per l'Ultras", text: "Chi teme la finanza e dà sempre la colpa al Matchup?" },
  { title: "Per il Balboso", text: "Cerca chi parla troppo, mangia troppo e non avrà mai una moglie sopra gli 80kg." },
  { title: "Per il Segreto", text: "Il codice è nascosto nel brainrot di un piccolo numero... 67, centra con i counter della Antonella." },
];

export default function HintsButton() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

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
              className="relative w-full max-w-lg border border-blood bg-black/40 backdrop-blur-xl p-6 sm:p-8"
              style={{
                boxShadow: "0 0 40px hsl(var(--blood-glow) / 0.5), inset 0 0 30px hsl(0 0% 0% / 0.6)",
              }}
            >
              <h3 className="font-display text-2xl sm:text-3xl text-blood mb-4 glitch-intense">
                INDIZI
              </h3>
              <p className="font-mono-h text-xs text-muted-foreground mb-5 border-b border-ash/40 pb-3">
                &gt; il sistema sussurra. ascolta bene.
              </p>
              <ul className="space-y-3">
                {HINTS.map((h, i) => (
                  <li key={i} className="font-typewriter text-sm leading-relaxed">
                    <span className="text-blood">› {h.title}:</span>{" "}
                    <span className="text-foreground/90">{h.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-right">
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
