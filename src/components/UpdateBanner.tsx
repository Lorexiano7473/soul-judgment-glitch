import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import { checkForUpdate, GITHUB_RELEASES_URL } from "@/lib/version";

export default function UpdateBanner() {
  const [open, setOpen] = useState(false);
  const [remote, setRemote] = useState<string | undefined>();
  const [url, setUrl] = useState<string>(GITHUB_RELEASES_URL);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      const res = await checkForUpdate();
      if (cancelled) return;
      if (res.hasUpdate) {
        setRemote(res.remoteVersion);
        setUrl(res.url || GITHUB_RELEASES_URL);
        setOpen(true);
      }
    }, 1500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[85] bg-black/95 border-b border-blood px-4 py-2 flex items-center justify-between gap-3 glitch-intense"
        >
          <div className="font-mono-h text-xs sm:text-sm text-blood truncate">
            ⚠ NUOVA BUILD DISPONIBILE {remote ? `v${remote}` : ""}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-h text-xs border border-blood text-blood px-3 py-1 hover:bg-blood/20 inline-flex items-center gap-1"
            >
              <Download size={12} /> SCARICA
            </a>
            <button
              onClick={() => setOpen(false)}
              aria-label="Chiudi"
              className="text-muted-foreground hover:text-blood"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
