// Procedural horror ambient + sfx via Web Audio API
let ctx: AudioContext | null = null;
let ambientNodes: { stop: () => void } | null = null;
let masterGain: GainNode | null = null;

function ensureCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noiseBuffer(c: AudioContext, seconds = 2) {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

export function startAmbient() {
  const c = ensureCtx();
  if (ambientNodes) return;

  // Wind: filtered pink-ish noise
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c, 4);
  noise.loop = true;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 380;
  const windGain = c.createGain();
  windGain.gain.value = 0.18;
  // LFO on wind volume
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.12;
  lfoGain.gain.value = 0.12;
  lfo.connect(lfoGain).connect(windGain.gain);
  noise.connect(lp).connect(windGain).connect(masterGain!);
  noise.start();
  lfo.start();

  // Heartbeat
  let hbTimer: number | null = null;
  const beat = () => {
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 55;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g).connect(masterGain!);
    o.start(t); o.stop(t + 0.2);

    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.frequency.value = 48;
    g2.gain.setValueAtTime(0.0001, t + 0.22);
    g2.gain.exponentialRampToValueAtTime(0.35, t + 0.23);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    o2.connect(g2).connect(masterGain!);
    o2.start(t + 0.22); o2.stop(t + 0.44);
  };
  beat();
  hbTimer = window.setInterval(beat, 1400);

  ambientNodes = {
    stop: () => {
      try { noise.stop(); } catch {}
      try { lfo.stop(); } catch {}
      if (hbTimer) clearInterval(hbTimer);
    },
  };
}

export function stopAmbient() {
  ambientNodes?.stop();
  ambientNodes = null;
}

export function jumpScare() {
  const c = ensureCtx();
  const t = c.currentTime;
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c, 0.5);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1200;
  bp.Q.value = 0.5;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.7, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
  noise.connect(bp).connect(g).connect(masterGain!);
  noise.start(t); noise.stop(t + 0.5);

  const o = c.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(220, t);
  o.frequency.exponentialRampToValueAtTime(50, t + 0.4);
  const og = c.createGain();
  og.gain.setValueAtTime(0.0001, t);
  og.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
  o.connect(og).connect(masterGain!);
  o.start(t); o.stop(t + 0.5);
}

export function glitchSfx() {
  const c = ensureCtx();
  const t = c.currentTime;
  for (let i = 0; i < 5; i++) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "square";
    o.frequency.value = 200 + Math.random() * 1200;
    g.gain.setValueAtTime(0.0001, t + i * 0.05);
    g.gain.exponentialRampToValueAtTime(0.25, t + i * 0.05 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.05 + 0.04);
    o.connect(g).connect(masterGain!);
    o.start(t + i * 0.05); o.stop(t + i * 0.05 + 0.05);
  }
}

export function typeSfx() {
  const c = ensureCtx();
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "square";
  o.frequency.value = 80 + Math.random() * 40;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.08, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
  o.connect(g).connect(masterGain!);
  o.start(t); o.stop(t + 0.05);
}

export function setMuted(muted: boolean) {
  if (!masterGain || !ctx) return;
  masterGain.gain.cancelScheduledValues(ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.5, ctx.currentTime + 0.1);
}
