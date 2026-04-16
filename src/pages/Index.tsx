import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MuteButton from "@/components/MuteButton";
import HintsButton from "@/components/HintsButton";
import GlitchTitle from "@/components/GlitchTitle";
import CoinCounter from "@/components/CoinCounter";
import SlotMachine from "@/components/SlotMachine";
import DisclaimerModal from "@/components/DisclaimerModal";
import { ScrollText } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import {
  FIXED_JUDGMENTS,
  getVerdict,
  isValidName,
  normalize,
  SECRET_PASSWORD,
  SECRET_TRIGGER,
  type Verdict,
} from "@/lib/judgments";
import { glitchSfx, jumpScare, typeSfx } from "@/lib/audio";
import { Trophy } from "lucide-react";

type Stage =
  | "home"
  | "escape"
  | "input"
  | "secret-pass"
  | "analyzing"
  | "result"
  | "trophies";

const ANALYSIS_LINES = [
  "> connessione al soggetto...",
  "> scansione strato cosciente...",
  "> lettura tracce di colpa...",
  "> incrocio con archivio peccati...",
  "> calcolo indice di abominio...",
  "> compilazione verdetto...",
];

export default function Index() {
  const [stage, setStage] = useState<Stage>("home");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [flashWhite, setFlashWhite] = useState(false);
  const [trophyUnlocked, setTrophyUnlocked] = useState<boolean>(() => {
    return localStorage.getItem("trofeo_rattesco") === "1";
  });
  const [logIndex, setLogIndex] = useState(0);
  const [earnNotice, setEarnNotice] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(
    () => localStorage.getItem("disclaimer_accepted") === "1"
  );
  const [pendingEnter, setPendingEnter] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { coins, earnFromName, spend, addCoins, setCoins } = useCoins();

  // SEO
  useEffect(() => {
    document.title = "Il Giudizio della Stanza — Verrai Valutato";
  }, []);

  useEffect(() => {
    if (!earnNotice) return;
    const t = setTimeout(() => setEarnNotice(null), 2200);
    return () => clearTimeout(t);
  }, [earnNotice]);

  useEffect(() => {
    if (stage === "input" || stage === "secret-pass") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [stage]);

  // Sporadic global glitch
  const [globalGlitch, setGlobalGlitch] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.15) {
        setGlobalGlitch(true);
        setTimeout(() => setGlobalGlitch(false), 120);
      }
    }, 2500);
    return () => clearInterval(id);
  }, []);

  // Analyzing animation
  useEffect(() => {
    if (stage !== "analyzing") return;
    setLogIndex(0);
    const lineTimer = setInterval(() => {
      setLogIndex((i) => Math.min(i + 1, ANALYSIS_LINES.length));
    }, 450);
    const done = setTimeout(() => {
      const v = getVerdict(name);
      setVerdict(v);
      // Assegna coin
      const key = normalize(name);
      const isEaster = !!FIXED_JUDGMENTS[key];
      const res = earnFromName(key, isEaster);
      if (res.ok) {
        setEarnNotice(
          res.reason === "easter"
            ? `+${res.amount} COIN — BONUS EASTER EGG`
            : `+${res.amount} COIN CORROTTI`
        );
      } else if (res.reason === "cooldown" || res.reason === "cap") {
        setEarnNotice("NON INGANNARE IL DESTINO");
      }
      if (v.intense) {
        glitchSfx();
        setFlashWhite(true);
        setTimeout(() => setFlashWhite(false), 90);
      }
      setStage("result");
    }, 3000);
    return () => {
      clearInterval(lineTimer);
      clearTimeout(done);
    };
  }, [stage, name, earnFromName]);

  const handleEnter = () => {
    if (!disclaimerAccepted) {
      setPendingEnter(true);
      setShowDisclaimer(true);
      return;
    }
    jumpScare();
    setFlashWhite(true);
    setTimeout(() => setFlashWhite(false), 80);
    setStage("input");
  };

  const handleDisclaimerAccept = () => {
    localStorage.setItem("disclaimer_accepted", "1");
    setDisclaimerAccepted(true);
    setShowDisclaimer(false);
    if (pendingEnter) {
      setPendingEnter(false);
      jumpScare();
      setFlashWhite(true);
      setTimeout(() => setFlashWhite(false), 80);
      setStage("input");
    }
  };

  const handleDisclaimerClose = () => {
    setShowDisclaimer(false);
    setPendingEnter(false);
  };

  const handleEscape = () => {
    setStage("escape");
    setTimeout(() => {
      setStage("home");
    }, 1800);
  };

  const handleAnalyze = () => {
    setError(null);
    const v = isValidName(name);
    if (!v.ok) {
      setError(v.reason || "INPUT NON VALIDO");
      glitchSfx();
      return;
    }
    // Trigger secret prompt
    if (normalize(name) === SECRET_TRIGGER) {
      glitchSfx();
      setPassword("");
      setStage("secret-pass");
      return;
    }
    setStage("analyzing");
  };

  const handleSecretSubmit = () => {
    if (password === SECRET_PASSWORD) {
      localStorage.setItem("trofeo_rattesco", "1");
      setTrophyUnlocked(true);
      // Bonus easter una tantum per il segreto
      const res = earnFromName("__secret_capoziello__", true);
      if (res.ok) setEarnNotice(`+${res.amount} COIN — BONUS SEGRETO`);
      glitchSfx();
      setFlashWhite(true);
      setTimeout(() => setFlashWhite(false), 100);
      setVerdict({
        rating: "★ EASTER EGG SBLOCCATO ★",
        comment:
          "Hai scoperto il segreto. La sezione TROFEI è ora disponibile nella schermata principale. Il Trofeo Rattesco è tuo.",
        intense: true,
      });
      setStage("result");
    } else {
      setError("PASSWORD ERRATA — IL SISTEMA TI OSSERVA");
      glitchSfx();
    }
  };

  const reset = () => {
    setName("");
    setPassword("");
    setError(null);
    setVerdict(null);
    setStage("home");
  };

  const containerCls = useMemo(
    () =>
      `relative min-h-screen w-full overflow-hidden grain scanlines vignette crt-screen ${
        globalGlitch ? "glitch-intense" : ""
      }`,
    [globalGlitch]
  );

  return (
    <main className={containerCls}>
      <MuteButton />
      <CoinCounter value={coins} />
      {stage === "home" && (
        <HintsButton coins={coins} onSpend={(amt) => spend(amt)} />
      )}

      <DisclaimerModal
        open={showDisclaimer}
        onAccept={handleDisclaimerAccept}
        onClose={handleDisclaimerClose}
      />

      {/* Earn notice */}
      <AnimatePresence>
        {earnNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[65] font-mono-h text-xs text-blood border border-blood/70 bg-black/80 px-3 py-1.5 glitch-intense"
          >
            {earnNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* White flash */}
      <AnimatePresence>
        {flashWhite && (
          <motion.div
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-[55] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>


      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <AnimatePresence mode="wait">
          {/* HOME */}
          {stage === "home" && (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl w-full"
            >
              <h1 className="text-5xl sm:text-7xl md:text-8xl mb-4 flicker">
                <GlitchTitle text="IL GIUDIZIO" />
              </h1>
              <h2 className="text-3xl sm:text-5xl md:text-6xl mb-10 text-ash">
                <span className="font-display tracking-widest text-tremor">DELLA STANZA</span>
              </h2>
              <p className="font-typewriter text-sm sm:text-base text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
                Entri da solo. Verrai pesato.
                <br />
                Nessuno è mai uscito senza un voto.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button onClick={handleEnter} className="btn-horror w-full sm:w-auto">
                  Entra nella Stanza
                </button>
                <button onClick={handleEscape} className="btn-horror w-full sm:w-auto">
                  Scappa
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 justify-center items-center">
                <SlotMachine
                  coins={coins}
                  onResult={(delta) => addCoins(delta)}
                  onCursed={() => {
                    setCoins(0);
                    setFlashWhite(true);
                    setTimeout(() => setFlashWhite(false), 120);
                  }}
                />
                {trophyUnlocked && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setStage("trophies")}
                    className="inline-flex items-center gap-2 font-typewriter text-sm border border-blood text-blood px-4 py-2 hover:bg-blood/20 transition-colors"
                  >
                    <Trophy size={16} /> TROFEI [1]
                  </motion.button>
                )}
              </div>

              <p className="mt-12 font-typewriter text-xs text-muted-foreground/60">
                v0.8.0 — sessione monitorata
                <br />
                Diritti riservati a Lorexiano
              </p>

              <button
                onClick={() => setShowDisclaimer(true)}
                className="mt-4 inline-flex items-center gap-2 font-typewriter text-[11px] text-muted-foreground/70 hover:text-blood underline-offset-4 hover:underline transition-colors"
              >
                <ScrollText size={12} /> Note Legali
              </button>
            </motion.section>
          )}

          {/* ESCAPE */}
          {stage === "escape" && (
            <motion.section
              key="escape"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            >
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="font-display text-4xl sm:text-7xl text-blood glitch-intense text-center px-4"
                style={{ textShadow: "0 0 30px hsl(var(--blood-glow))" }}
              >
                NON PUOI SCAPPARE
              </motion.h2>
            </motion.section>
          )}

          {/* INPUT TERMINAL */}
          {stage === "input" && (
            <motion.section
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl"
            >
              <div className="border border-ash/60 bg-black/80 p-5 sm:p-8">
                <div className="font-typewriter text-xs text-muted-foreground mb-4 flex justify-between border-b border-ash/40 pb-2">
                  <span>STANZA-OS v0.6.6</span>
                  <span className="text-blood">● REC</span>
                </div>
                <p className="font-mono-h text-sm text-blood mb-2">
                  &gt; identificazione richiesta
                </p>
                <p className="font-mono-h text-xs text-muted-foreground mb-6">
                  &gt; inserisci il tuo nome. la stanza ascolta.
                </p>

                <label className="block font-mono-h text-xs text-muted-foreground mb-2">
                  &gt; nome:
                </label>
                <div className="flex items-center border border-blood/50 bg-black px-3 py-2 mb-3">
                  <span className="text-blood mr-2">$</span>
                  <input
                    ref={inputRef}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError(null);
                      typeSfx();
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    maxLength={60}
                    className="flex-1 bg-transparent outline-none font-mono-h text-foreground caret-blood"
                    placeholder="________"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ x: -4 }}
                    animate={{ x: 0 }}
                    className="font-mono-h text-xs text-blood mb-3 glitch-intense"
                  >
                    !! {error}
                  </motion.p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button onClick={handleAnalyze} className="btn-horror text-base flex-1">
                    Analizza
                  </button>
                  <button
                    onClick={reset}
                    className="font-typewriter text-xs text-muted-foreground hover:text-blood underline transition-colors px-2"
                  >
                    indietro
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {/* SECRET PASSWORD */}
          {stage === "secret-pass" && (
            <motion.section
              key="secret"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl"
            >
              <div className="border border-blood bg-black/90 p-5 sm:p-8 glitch-intense">
                <p className="font-mono-h text-sm text-blood mb-4 terminal-cursor">
                  &gt; ACCESSO RISERVATO RILEVATO
                </p>
                <p className="font-mono-h text-xs text-muted-foreground mb-6">
                  &gt; il sistema riconosce la frase. inserire password.
                </p>
                <div className="flex items-center border border-blood bg-black px-3 py-2 mb-3">
                  <span className="text-blood mr-2">#</span>
                  <input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSecretSubmit()}
                    className="flex-1 bg-transparent outline-none font-mono-h text-blood caret-blood"
                    placeholder="••••••••"
                  />
                </div>
                {error && (
                  <p className="font-mono-h text-xs text-blood mb-3">!! {error}</p>
                )}
                <div className="flex gap-3 mt-4">
                  <button onClick={handleSecretSubmit} className="btn-horror flex-1">
                    Conferma
                  </button>
                  <button
                    onClick={reset}
                    className="font-typewriter text-xs text-muted-foreground hover:text-blood underline px-2"
                  >
                    annulla
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {/* ANALYZING */}
          {stage === "analyzing" && (
            <motion.section
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl text-center"
            >
              <h2 className="font-display text-3xl sm:text-5xl mb-6 text-blood glitch-intense">
                ANALISI DELL'ANIMA...
              </h2>
              <div className="font-mono-h text-left text-sm text-muted-foreground border border-ash/40 bg-black/80 p-4 min-h-[180px]">
                {ANALYSIS_LINES.slice(0, logIndex).map((l, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-1"
                  >
                    {l}
                  </motion.p>
                ))}
                <p className="text-blood terminal-cursor">&gt; </p>
              </div>
              <div className="mt-4 h-1 bg-ash/40 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="h-full bg-blood"
                />
              </div>
            </motion.section>
          )}

          {/* RESULT */}
          {stage === "result" && verdict && (
            <motion.section
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl text-center"
            >
              <p className="font-mono-h text-xs text-muted-foreground mb-2">
                &gt; soggetto: <span className="text-blood">{name || "anonimo"}</span>
              </p>
              <h2
                className={`font-display text-4xl sm:text-6xl mb-6 ${
                  verdict.intense ? "text-blood glitch-intense" : "text-foreground"
                }`}
                style={
                  verdict.intense
                    ? { textShadow: "0 0 25px hsl(var(--blood-glow))" }
                    : undefined
                }
              >
                {verdict.rating}
              </h2>
              <div
                className={`border p-5 sm:p-7 bg-black/80 text-left ${
                  verdict.intense ? "border-blood" : "border-ash/40"
                }`}
              >
                <p className="font-mono-h text-xs text-muted-foreground mb-2">
                  &gt; commento del sistema:
                </p>
                <p className="font-typewriter text-base sm:text-lg leading-relaxed text-foreground">
                  {verdict.comment}
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setName("");
                    setVerdict(null);
                    setStage("input");
                  }}
                  className="btn-horror"
                >
                  Altro Nome
                </button>
                <button onClick={reset} className="btn-horror">
                  Esci
                </button>
              </div>
            </motion.section>
          )}

          {/* TROPHIES */}
          {stage === "trophies" && (
            <motion.section
              key="trophies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <h2 className="font-display text-4xl sm:text-5xl text-blood mb-8 text-center">
                <GlitchTitle text="TROFEI" />
              </h2>
              <div className="border border-blood bg-black/80 p-6 flex items-start gap-4">
                <div className="text-blood">
                  <Trophy size={48} />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-blood mb-1">
                    Trofeo Rattesco
                  </h3>
                  <p className="font-typewriter text-sm text-muted-foreground">
                    Hai pronunciato il nome proibito e superato il muro della password.
                    Capoziello è stato ufficialmente counterato dalla Antonella.
                  </p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <button onClick={reset} className="btn-horror">
                  Indietro
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
