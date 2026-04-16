import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";

export default function CoinCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const [bump, setBump] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    if (from === to) return;
    setBump(true);
    const duration = 600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        prev.current = to;
        setTimeout(() => setBump(false), 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const isLoss = value < prev.current;

  return (
    <div className="fixed top-3 left-3 z-[60] select-none">
      <motion.div
        animate={bump ? { scale: [1, 1.18, 1] } : { scale: 1 }}
        transition={{ duration: 0.45 }}
        className="flex items-center gap-2 border border-blood/70 bg-black/80 backdrop-blur-sm px-3 py-1.5"
        style={{ boxShadow: "0 0 14px hsl(var(--blood-glow) / 0.35)" }}
      >
        <Coins size={16} className="text-blood" />
        <span className="font-mono-h text-sm text-blood tracking-wider">
          {display}
        </span>
        <span className="font-typewriter text-[10px] text-muted-foreground hidden sm:inline">
          coin corrotti
        </span>
        <AnimatePresence>
          {bump && (
            <motion.span
              key={value}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -16 }}
              exit={{ opacity: 0 }}
              className={`absolute -top-1 right-2 font-mono-h text-xs ${
                isLoss ? "text-blood" : "text-terminal"
              }`}
              style={{ color: isLoss ? "hsl(var(--blood-glow))" : "hsl(var(--terminal))" }}
            >
              {value > prev.current ? `+${value - prev.current}` : `${value - prev.current}`}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
