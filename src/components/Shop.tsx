import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Coins, Lock, Check, X } from "lucide-react";
import GlitchTitle from "@/components/GlitchTitle";
import ShopKeeper from "@/components/ShopKeeper";
import { SHOP_ITEMS, useInventory, type ShopItemId } from "@/hooks/useInventory";
import { playShopMusic, stopShopMusic } from "@/lib/shop-music";
import { glitchSfx } from "@/lib/audio";
import { hapticTrophy } from "@/lib/haptics";

interface Props {
  coins: number;
  spend: (n: number) => boolean;
  onClose: () => void;
}

export default function Shop({ coins, spend, onClose }: Props) {
  const { isOwned, purchase } = useInventory();
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    playShopMusic();
    return () => stopShopMusic();
  }, []);

  const handleBuy = (id: ShopItemId, price: number, name: string) => {
    if (isOwned(id)) return;
    if (coins < price) {
      setNotice("FONDI INSUFFICIENTI");
      glitchSfx();
      setTimeout(() => setNotice(null), 1800);
      return;
    }
    if (spend(price)) {
      purchase(id);
      hapticTrophy();
      glitchSfx();
      setNotice(`ACQUISTATO: ${name.toUpperCase()}`);
      setTimeout(() => setNotice(null), 2200);
    }
  };

  const handleClose = () => {
    stopShopMusic();
    onClose();
  };

  return (
    <motion.section
      key="shop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] overflow-y-auto bg-black"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-black/90 backdrop-blur-sm border-b border-blood/40 px-4 py-3">
        <button
          onClick={handleClose}
          className="inline-flex items-center gap-1 font-mono-h text-xs text-muted-foreground hover:text-blood"
          aria-label="Indietro"
        >
          <ArrowLeft size={14} /> indietro
        </button>
        <div className="flex items-center gap-2 border border-blood/60 px-3 py-1">
          <Coins size={14} className="text-blood" />
          <span className="font-mono-h text-sm text-blood">{coins}</span>
          <span className="font-typewriter text-[10px] text-muted-foreground hidden sm:inline">
            soul coins
          </span>
        </div>
        <button
          onClick={handleClose}
          aria-label="Chiudi"
          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-blood border border-ash/40"
        >
          <X size={16} />
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        <h2 className="font-creepster text-4xl sm:text-6xl text-blood text-center mb-2">
          <GlitchTitle text="L'ANTIQUARIATO" />
        </h2>
        <p className="font-creepster text-2xl sm:text-3xl text-ash text-center mb-6">
          DELLE ANIME
        </p>

        <ShopKeeper />

        <p className="font-typewriter text-sm text-muted-foreground text-center max-w-md mx-auto my-6 italic">
          “Hai monete corrotte? Allora hai un'anima da spendere.”
        </p>

        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono-h text-xs text-blood border border-blood/70 bg-black/80 px-3 py-1.5 text-center mb-4 glitch-intense"
          >
            {notice}
          </motion.div>
        )}

        <div className="space-y-4">
          {SHOP_ITEMS.map((it) => {
            const owned = isOwned(it.id);
            const broke = coins < it.price;
            const disabled = owned || broke;
            return (
              <div
                key={it.id}
                className={`border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors ${
                  owned ? "border-blood/60 bg-blood/5" : "border-ash/40 bg-black/70"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-creepster text-2xl text-blood mb-1">{it.name}</h3>
                  <p className="font-typewriter text-sm text-foreground mb-1">
                    {it.description}
                  </p>
                  <p className="font-mono-h text-[11px] text-muted-foreground">
                    &gt; effetto: {it.effect}
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-1 font-mono-h text-blood">
                    <Coins size={14} />
                    <span>{it.price}</span>
                  </div>
                  <button
                    onClick={() => handleBuy(it.id, it.price, it.name)}
                    disabled={disabled}
                    className={`font-mono-h text-xs uppercase tracking-wider border px-4 py-2 inline-flex items-center gap-2 transition-colors flex-1 sm:flex-none justify-center ${
                      owned
                        ? "border-blood/60 text-blood/70 cursor-not-allowed"
                        : broke
                        ? "border-ash/40 text-ash cursor-not-allowed"
                        : "border-blood text-blood hover:bg-blood/20"
                    }`}
                  >
                    {owned ? (
                      <>
                        <Check size={12} /> Posseduto
                      </>
                    ) : broke ? (
                      <>
                        <Lock size={12} /> Insufficiente
                      </>
                    ) : (
                      <>Acquista</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button onClick={handleClose} className="btn-horror">
            Esci dal Negozio
          </button>
        </div>
      </div>
    </motion.section>
  );
}