import { motion } from "framer-motion";

/**
 * Negoziante stilizzato — un'ombra incappucciata fatta di pixel
 * con due occhi luminosi. Tutto in SVG + CSS animations.
 */
export default function ShopKeeper() {
  return (
    <div className="relative w-48 h-56 sm:w-64 sm:h-72 mx-auto select-none">
      {/* Aura */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-50"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, hsl(var(--blood-glow) / 0.5), transparent 65%)",
        }}
      />
      <motion.svg
        viewBox="0 0 200 240"
        className="relative w-full h-full glitch-intense"
        animate={{ y: [0, -3, 0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 12px hsl(var(--blood-glow) / 0.6))" }}
      >
        {/* Cappuccio (pixelato a mano) */}
        <g fill="hsl(0 0% 4%)" stroke="hsl(var(--blood))" strokeWidth="1.2">
          <polygon points="60,40 80,18 120,18 140,40 150,80 150,200 130,230 70,230 50,200 50,80" />
          {/* bordo interno cappuccio */}
          <polygon
            points="72,55 90,38 110,38 128,55 132,90 100,110 68,90"
            fill="hsl(0 0% 0%)"
          />
        </g>

        {/* Pixel disturb sul mantello */}
        <g fill="hsl(var(--blood) / 0.55)">
          <rect x="62" y="120" width="6" height="6" />
          <rect x="78" y="150" width="4" height="4" />
          <rect x="120" y="135" width="5" height="5" />
          <rect x="135" y="180" width="6" height="6" />
          <rect x="58" y="200" width="4" height="4" />
          <rect x="100" y="170" width="3" height="3" />
        </g>

        {/* Occhi luminosi */}
        <motion.g
          animate={{ opacity: [1, 0.3, 1, 0.85, 1] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <circle cx="86" cy="78" r="5" fill="hsl(var(--blood-glow))" />
          <circle cx="114" cy="78" r="5" fill="hsl(var(--blood-glow))" />
          <circle cx="86" cy="78" r="2" fill="#fff" />
          <circle cx="114" cy="78" r="2" fill="#fff" />
        </motion.g>

        {/* Linee tremolanti orizzontali */}
        <g stroke="hsl(var(--blood-glow) / 0.25)" strokeWidth="0.5">
          <line x1="50" y1="100" x2="150" y2="100" />
          <line x1="50" y1="160" x2="150" y2="160" />
          <line x1="50" y1="210" x2="150" y2="210" />
        </g>

        {/* Mani / artigli che escono dalle maniche */}
        <g fill="hsl(0 0% 6%)" stroke="hsl(var(--blood))" strokeWidth="1">
          <polygon points="55,170 40,195 50,210 65,195" />
          <polygon points="145,170 160,195 150,210 135,195" />
        </g>
      </motion.svg>
    </div>
  );
}