import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { APP_VERSION, CHANGELOG } from "@/lib/version";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ChangelogModal({ open, onClose }: Props) {
  const current = CHANGELOG.find((c) => c.version === APP_VERSION) ?? CHANGELOG[0];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md border border-blood bg-black/95 p-6"
            style={{ boxShadow: "0 0 40px hsl(var(--blood-glow) / 0.5)" }}
          >
            <button
              onClick={onClose}
              aria-label="Chiudi"
              className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-blood"
            >
              <X size={18} />
            </button>
            <h2 className="font-creepster text-3xl text-blood mb-1 text-center glitch-intense">
              NOVITÀ v{APP_VERSION}
            </h2>
            <p className="font-mono-h text-[10px] text-muted-foreground text-center mb-5">
              &gt; build {current.date}
            </p>
            <ul className="space-y-2 mb-6">
              {current.items.map((it, i) => (
                <li
                  key={i}
                  className="font-typewriter text-sm text-foreground border-l-2 border-blood/60 pl-3"
                >
                  {it}
                </li>
              ))}
            </ul>
            <button onClick={onClose} className="btn-horror w-full text-base">
              Entra nella Stanza
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
