import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { setMuted, startAmbient } from "@/lib/audio";

export default function MuteButton() {
  const [muted, setMutedState] = useState(true);

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  const toggle = () => {
    if (muted) {
      startAmbient();
      setMuted(false);
      setMutedState(false);
    } else {
      setMuted(true);
      setMutedState(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Attiva audio" : "Disattiva audio"}
      className="fixed top-3 right-3 z-[60] w-11 h-11 flex items-center justify-center border border-ash/60 bg-black/70 backdrop-blur-sm hover:border-blood hover:text-blood transition-colors"
    >
      {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
