/**
 * Procedural sound + haptics for Maya-Duels.
 * Short, crisp, tactile game hardware — never a casino slot machine.
 * Everything is synthesized with WebAudio so there are no asset downloads.
 */

type SoundName =
  | 'tap'
  | 'focus'
  | 'lock'
  | 'correct'
  | 'incorrect'
  | 'opponentLocked'
  | 'streak'
  | 'overdrive'
  | 'win'
  | 'loss'
  | 'draw'
  | 'promote'
  | 'whoosh'
  | 'tick';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;
let volume = 0.7;

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

interface ToneOptions {
  freq: number;
  to?: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  sweepType?: 'exp' | 'linear';
}

function tone({
  freq,
  to,
  duration,
  type = 'sine',
  gain = 0.2,
  delay = 0,
  sweepType = 'exp',
}: ToneOptions) {
  const context = ensureContext();
  if (!context || !master) return;
  const t0 = context.currentTime + delay;
  const osc = context.createOscillator();
  const g = context.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to !== undefined) {
    if (sweepType === 'exp') {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + duration);
    } else {
      osc.frequency.linearRampToValueAtTime(Math.max(1, to), t0 + duration);
    }
  }
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function noiseBurst(duration = 0.08, gain = 0.12, delay = 0, hp = 900) {
  const context = ensureContext();
  if (!context || !master) return;
  const t0 = context.currentTime + delay;
  const frames = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, frames, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 2;
  }
  const src = context.createBufferSource();
  src.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = hp;
  const g = context.createGain();
  g.gain.value = gain;
  src.connect(filter);
  filter.connect(g);
  g.connect(master);
  src.start(t0);
}

export const sfx = {
  setEnabled(v: boolean) {
    enabled = v;
  },
  setVolume(v: number) {
    volume = Math.max(0, Math.min(1, v));
    if (master) master.gain.value = volume;
  },
  unlock() {
    ensureContext();
  },
  play(name: SoundName) {
    if (!enabled) return;
    switch (name) {
      case 'tap':
        tone({ freq: 520, to: 420, duration: 0.06, type: 'triangle', gain: 0.1 });
        break;
      case 'focus':
        tone({ freq: 880, duration: 0.04, type: 'sine', gain: 0.05 });
        break;
      case 'tick':
        tone({ freq: 1400, duration: 0.03, type: 'square', gain: 0.03 });
        break;
      case 'whoosh':
        noiseBurst(0.16, 0.05, 0, 1400);
        break;
      case 'lock':
        tone({ freq: 300, to: 180, duration: 0.09, type: 'square', gain: 0.12 });
        tone({ freq: 720, duration: 0.05, type: 'sine', gain: 0.08, delay: 0.02 });
        break;
      case 'correct':
        tone({ freq: 660, duration: 0.1, type: 'sine', gain: 0.16 });
        tone({ freq: 990, duration: 0.14, type: 'sine', gain: 0.13, delay: 0.07 });
        tone({ freq: 1320, duration: 0.16, type: 'sine', gain: 0.09, delay: 0.14 });
        break;
      case 'incorrect':
        tone({ freq: 220, to: 130, duration: 0.22, type: 'sawtooth', gain: 0.12 });
        tone({ freq: 160, to: 110, duration: 0.24, type: 'sine', gain: 0.08, delay: 0.02 });
        break;
      case 'opponentLocked':
        tone({ freq: 420, duration: 0.05, type: 'triangle', gain: 0.07 });
        tone({ freq: 560, duration: 0.05, type: 'triangle', gain: 0.05, delay: 0.06 });
        break;
      case 'streak':
        tone({ freq: 784, duration: 0.08, type: 'sine', gain: 0.12 });
        tone({ freq: 1175, duration: 0.12, type: 'sine', gain: 0.1, delay: 0.06 });
        break;
      case 'overdrive':
        tone({ freq: 180, to: 520, duration: 0.34, type: 'sawtooth', gain: 0.1 });
        tone({ freq: 90, to: 260, duration: 0.4, type: 'sine', gain: 0.12 });
        noiseBurst(0.3, 0.05, 0.05, 600);
        break;
      case 'win':
        [523, 659, 784, 1046].forEach((f, i) =>
          tone({ freq: f, duration: 0.24, type: 'sine', gain: 0.13, delay: i * 0.09 }),
        );
        break;
      case 'loss':
        [392, 330, 262].forEach((f, i) =>
          tone({ freq: f, duration: 0.26, type: 'sine', gain: 0.11, delay: i * 0.11 }),
        );
        break;
      case 'draw':
        [440, 440].forEach((f, i) =>
          tone({ freq: f, duration: 0.18, type: 'sine', gain: 0.1, delay: i * 0.14 }),
        );
        break;
      case 'promote':
        [523, 784, 1046, 1568].forEach((f, i) =>
          tone({ freq: f, duration: 0.3, type: 'triangle', gain: 0.12, delay: i * 0.08 }),
        );
        noiseBurst(0.4, 0.04, 0.1, 2000);
        break;
    }
  },
};

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

let hapticsEnabled = true;

export const haptics = {
  setEnabled(v: boolean) {
    hapticsEnabled = v;
  },
  fire(style: HapticStyle = 'light') {
    if (!hapticsEnabled) return;
    if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
    const patterns: Record<HapticStyle, number | number[]> = {
      light: 8,
      medium: 16,
      heavy: 30,
      success: [12, 40, 18],
      warning: [10, 30, 10],
      error: [22, 50, 22],
    };
    try {
      navigator.vibrate(patterns[style]);
    } catch {
      /* haptics are optional */
    }
  },
};

export type { SoundName, HapticStyle };