/**
 * Forest sounds for "Spot the Tiger", synthesised with the Web Audio API —
 * no audio files, a few KB of code. Nothing plays until the visitor presses
 * Play (browsers require a user gesture), and the mute choice is remembered.
 */

const PREF_KEY = "tbh-game-sound";

export function readSoundPref(): boolean {
  try {
    return localStorage.getItem(PREF_KEY) !== "off";
  } catch {
    return true;
  }
}

export function saveSoundPref(on: boolean) {
  try {
    localStorage.setItem(PREF_KEY, on ? "on" : "off");
  } catch {
    // Storage blocked: the choice lasts for this visit only.
  }
}

type Ctx = AudioContext;

export class ForestAudio {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private ambience: { stop: () => void } | null = null;
  private birdTimer = 0;
  private noise: AudioBuffer | null = null;
  muted = false;

  /** Call from a user gesture (the Play button). */
  start() {
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.35;
      this.master.connect(this.ctx.destination);
      this.noise = this.makeNoise();
    }
    void this.ctx.resume();
    if (!this.muted) this.startAmbience();
  }

  /** Stop the forest but keep the audio graph for the next game. */
  pause() {
    this.stopAmbience();
    void this.ctx?.suspend();
  }

  resume() {
    if (!this.ctx || this.muted) return;
    void this.ctx.resume();
    this.startAmbience();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (!this.master || !this.ctx) return;
    this.master.gain.setTargetAtTime(muted ? 0 : 0.35, this.ctx.currentTime, 0.05);
    if (muted) this.stopAmbience();
    else this.startAmbience();
  }

  dispose() {
    this.stopAmbience();
    void this.ctx?.close();
    this.ctx = null;
  }

  // ─── Effects ─────────────────────────────────────────────────────────

  /** Hollow bamboo knock on every tap. */
  tok() {
    this.tone({ freq: 820, type: "triangle", attack: 0.002, decay: 0.09, gain: 0.5, slideTo: 620 });
    this.burst({ freq: 1600, q: 6, decay: 0.05, gain: 0.25 });
  }

  /** A tiger caught: a warm two-note rise, higher with each combo step. */
  caught(combo: number) {
    const lift = Math.min(combo, 8) * 0.5; // semitones
    const base = 523.25 * 2 ** (lift / 12); // C5 upwards
    this.tone({ freq: base, type: "sine", attack: 0.01, decay: 0.18, gain: 0.35 });
    this.tone({ freq: base * 1.5, type: "sine", attack: 0.01, decay: 0.28, gain: 0.3, delay: 0.07 });
  }

  /** The golden tiger: a quick sparkling arpeggio. */
  golden() {
    [659.25, 783.99, 987.77, 1318.51, 1567.98].forEach((f, i) =>
      this.tone({ freq: f, type: "sine", attack: 0.005, decay: 0.3, gain: 0.25, delay: i * 0.055 }),
    );
    this.burst({ freq: 6000, q: 1, decay: 0.4, gain: 0.08, delay: 0.1 });
  }

  /** Tapped a deer or peacock: a soft dull thud. */
  wrong() {
    this.tone({ freq: 150, type: "triangle", attack: 0.005, decay: 0.25, gain: 0.55, slideTo: 80 });
    this.burst({ freq: 300, q: 1, decay: 0.12, gain: 0.2 });
  }

  /** A tiger slipped away: leaves rustling. */
  missed() {
    this.burst({ freq: 3200, q: 0.8, decay: 0.35, gain: 0.22 });
    this.burst({ freq: 2400, q: 0.8, decay: 0.3, gain: 0.15, delay: 0.08 });
  }

  /** Night falls: a low swell. */
  nightfall() {
    this.tone({ freq: 110, type: "sine", attack: 0.6, decay: 1.6, gain: 0.25 });
    this.tone({ freq: 164.81, type: "sine", attack: 0.8, decay: 1.8, gain: 0.18, delay: 0.1 });
  }

  /** Game over: a gentle falling phrase. */
  over() {
    [587.33, 493.88, 392].forEach((f, i) => this.tone({ freq: f, type: "sine", attack: 0.01, decay: 0.35, gain: 0.3, delay: i * 0.16 }));
  }

  // ─── Ambience ────────────────────────────────────────────────────────

  private startAmbience() {
    if (!this.ctx || !this.master || !this.noise || this.ambience || this.muted) return;
    const ctx = this.ctx;
    // Breeze: looping noise through a low-pass filter whose cutoff drifts.
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain).connect(filter.frequency);
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(0.09, ctx.currentTime, 0.8);
    src.connect(filter).connect(gain).connect(this.master);
    src.start();
    lfo.start();

    const scheduleBird = () => {
      this.birdTimer = window.setTimeout(() => {
        this.bird();
        scheduleBird();
      }, 2500 + Math.random() * 5000);
    };
    scheduleBird();

    this.ambience = {
      stop: () => {
        window.clearTimeout(this.birdTimer);
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
        window.setTimeout(() => {
          src.stop();
          lfo.stop();
        }, 800);
      },
    };
  }

  private stopAmbience() {
    this.ambience?.stop();
    this.ambience = null;
  }

  /** A short two-part chirp somewhere in the canopy. */
  private bird() {
    if (!this.ctx) return;
    const base = 2200 + Math.random() * 1400;
    for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
      this.tone({ freq: base, type: "sine", attack: 0.005, decay: 0.07, gain: 0.07, slideTo: base * 1.35, delay: i * 0.11 });
    }
  }

  // ─── Building blocks ─────────────────────────────────────────────────

  private tone(o: { freq: number; type: OscillatorType; attack: number; decay: number; gain: number; slideTo?: number; delay?: number }) {
    if (!this.ctx || !this.master || this.muted) return;
    const t0 = this.ctx.currentTime + (o.delay ?? 0);
    const osc = this.ctx.createOscillator();
    osc.type = o.type;
    osc.frequency.setValueAtTime(o.freq, t0);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t0 + o.attack + o.decay);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(o.gain, t0 + o.attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.attack + o.decay);
    osc.connect(g).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + o.attack + o.decay + 0.05);
  }

  private burst(o: { freq: number; q: number; decay: number; gain: number; delay?: number }) {
    if (!this.ctx || !this.master || !this.noise || this.muted) return;
    const t0 = this.ctx.currentTime + (o.delay ?? 0);
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = o.freq;
    filter.Q.value = o.q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(o.gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.decay);
    src.connect(filter).connect(g).connect(this.master);
    src.start(t0, Math.random());
    src.stop(t0 + o.decay + 0.05);
  }

  private makeNoise(): AudioBuffer {
    const ctx = this.ctx as Ctx;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }
}

/** A short vibration on phones that support it (Android). Never for reduced motion. */
export function buzz(pattern: number | number[]) {
  try {
    if (typeof navigator.vibrate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    navigator.vibrate(pattern);
  } catch {
    // Vibration unavailable: nothing to do.
  }
}
