/**
 * UI sound effects, synthesized with the Web Audio API — no audio files.
 *
 * Off by default. The AudioContext is only created after the visitor turns
 * sound on (a user gesture), so it never trips autoplay policies.
 */

export type SfxName =
  | "tick"
  | "select"
  | "click"
  | "on"
  | "off"
  | "open"
  | "close"
  | "type"
  | "error"
  | "success";

type Blip = {
  freq: number;
  to?: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let enabled = false;
let lastSoftSound = 0;

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) return null;
    ctx = new AudioCtor();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip({ freq, to, dur, type = "sine", gain = 0.04, delay = 0 }: Blip) {
  const c = ensureContext();
  if (!c || !master) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const env = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(env).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

function noise(dur: number, from: number, to: number, gain = 0.03) {
  const c = ensureContext();
  if (!c || !master) return;
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, Math.floor(c.sampleRate * 0.25), c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const t0 = c.currentTime;
  const src = c.createBufferSource();
  const filter = c.createBiquadFilter();
  const env = c.createGain();
  src.buffer = noiseBuffer;
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(from, t0);
  filter.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter).connect(env).connect(master);
  src.start(t0);
  src.stop(t0 + dur + 0.03);
}

const recipes: Record<SfxName, () => void> = {
  tick: () => blip({ freq: 2300, to: 1750, dur: 0.022, type: "triangle", gain: 0.018 }),
  select: () => blip({ freq: 660, to: 990, dur: 0.06, gain: 0.028 }),
  click: () => {
    blip({ freq: 190, to: 120, dur: 0.03, type: "square", gain: 0.014 });
    noise(0.018, 3000, 5000, 0.018);
  },
  on: () => {
    blip({ freq: 520, dur: 0.05, gain: 0.03 });
    blip({ freq: 780, dur: 0.07, gain: 0.03, delay: 0.055 });
  },
  off: () => {
    blip({ freq: 780, dur: 0.05, gain: 0.025 });
    blip({ freq: 460, dur: 0.08, gain: 0.025, delay: 0.055 });
  },
  open: () => {
    noise(0.12, 600, 2600, 0.025);
    blip({ freq: 880, dur: 0.04, gain: 0.015, delay: 0.03 });
  },
  close: () => noise(0.1, 2400, 600, 0.02),
  type: () =>
    blip({
      freq: 1400 + Math.random() * 500,
      dur: 0.012,
      type: "triangle",
      gain: 0.01,
    }),
  error: () => blip({ freq: 220, to: 170, dur: 0.1, type: "square", gain: 0.016 }),
  success: () => {
    blip({ freq: 880, dur: 0.05, gain: 0.025 });
    blip({ freq: 1320, dur: 0.08, gain: 0.025, delay: 0.06 });
  },
};

// Major pentatonic across ~1.5 octaves: one note per weekday (Sun → Sat).
const WEEKDAY_SEMITONES = [0, 2, 4, 7, 9, 12, 14];
let lastNote = 0;

export const sfx = {
  setEnabled(value: boolean) {
    enabled = value;
  },
  get enabled() {
    return enabled;
  },
  /**
   * Heatmap instrument: pitch follows the weekday, brightness and volume
   * follow the contribution level, and stereo pan follows the week.
   */
  note(row: number, level: number, pan = 0) {
    if (!enabled) return;
    const now = typeof performance !== "undefined" ? performance.now() : 0;
    if (now - lastNote < 26) return;
    lastNote = now;
    try {
      const c = ensureContext();
      if (!c || !master) return;
      const t0 = c.currentTime;
      const lvl = Math.max(0, Math.min(4, level));
      const semis = WEEKDAY_SEMITONES[Math.max(0, Math.min(6, row))] ?? 0;
      const freq = 329.63 * 2 ** (semis / 12); // E4 root
      const peak = lvl === 0 ? 0.006 : 0.014 + lvl * 0.006;
      const dur = 0.16 + lvl * 0.05;

      const osc = c.createOscillator();
      osc.type = lvl >= 3 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, t0);
      const filter = c.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(700 + lvl * 1100, t0);
      const env = c.createGain();
      env.gain.setValueAtTime(0.0001, t0);
      env.gain.exponentialRampToValueAtTime(peak, t0 + 0.005);
      env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(filter).connect(env);

      let out: AudioNode = env;
      if (typeof c.createStereoPanner === "function") {
        const panner = c.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t0);
        env.connect(panner);
        out = panner;
      }
      out.connect(master);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    } catch {
      /* audio is decoration — never let it throw */
    }
  },
  /** Create/resume the AudioContext. Call from a user gesture. */
  unlock() {
    ensureContext();
  },
  play(name: SfxName, opts?: { force?: boolean }) {
    if (!enabled && !opts?.force) return;
    if (name === "tick" || name === "type") {
      const now = typeof performance !== "undefined" ? performance.now() : 0;
      if (now - lastSoftSound < 40) return; // throttle hover chatter
      lastSoftSound = now;
    }
    try {
      recipes[name]();
    } catch {
      /* audio is decoration — never let it throw */
    }
  },
};
