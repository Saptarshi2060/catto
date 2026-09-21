// Pure Web Audio API cozy music & sound generator for Hrick's 9 Lives with BB

type MusicTheme = 'morning' | 'day' | 'rain' | 'cafe' | 'night' | 'none';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicEnabled: boolean = true;
  private isSoundEnabled: boolean = true;
  private currentTheme: MusicTheme = 'none';
  private loopTimer: number | null = null;
  private rainNode: AudioNode | null = null;
  private purrOsc: OscillatorNode | null = null;
  private purrGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.isMusicEnabled ? 0.35 : 0, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(this.isSoundEnabled ? 0.45 : 0, this.ctx.currentTime);
        this.musicGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(enabled ? 0.45 : 0, this.ctx.currentTime);
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.isMusicEnabled = enabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(enabled ? 0.35 : 0, this.ctx.currentTime);
    }
    if (!enabled && this.loopTimer) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
    } else if (enabled && this.currentTheme !== 'none') {
      this.playMusic(this.currentTheme);
    }
  }

  public getSoundEnabled(): boolean {
    return this.isSoundEnabled;
  }

  public getMusicEnabled(): boolean {
    return this.isMusicEnabled;
  }

  // Play a soft bell/piano chord or note
  private playSoftTone(freq: number, startTime: number, duration: number, type: OscillatorType = 'triangle', gainPeak: number = 0.2) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(gainPeak, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  public playMusic(theme: MusicTheme) {
    this.initCtx();
    this.currentTheme = theme;
    if (this.loopTimer) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.stopRainAmbient();

    if (!this.isMusicEnabled || !this.ctx || theme === 'none') return;

    if (theme === 'rain') {
      this.startRainAmbient();
      // Gentle melancholy soft piano
      const playRainPhrase = () => {
        if (!this.ctx || !this.isMusicEnabled || this.currentTheme !== 'rain') return;
        const now = this.ctx.currentTime + 0.05;
        // D minor / F major gentle raindrops: D4, F4, A4, C5, G4, E4
        const notes = [293.66, 349.23, 440.0, 523.25, 392.0, 329.63, 293.66];
        notes.forEach((f, idx) => {
          this.playSoftTone(f, now + idx * 0.7, 1.8, 'sine', 0.12);
        });
      };
      playRainPhrase();
      this.loopTimer = window.setInterval(playRainPhrase, 5500);
    } else if (theme === 'morning') {
      // Warm acoustic style arpeggio in C Major / G
      const playMorningPhrase = () => {
        if (!this.ctx || !this.isMusicEnabled || this.currentTheme !== 'morning') return;
        const now = this.ctx.currentTime + 0.05;
        const chords = [
          [261.63, 329.63, 392.00, 523.25], // C
          [220.00, 261.63, 329.63, 440.00], // Am
          [174.61, 261.63, 329.63, 349.23], // Fmaj7
          [196.00, 246.94, 293.66, 392.00], // G
        ];
        chords.forEach((chord, cIdx) => {
          chord.forEach((f, nIdx) => {
            this.playSoftTone(f, now + cIdx * 1.6 + nIdx * 0.35, 1.4, 'triangle', 0.14);
          });
        });
      };
      playMorningPhrase();
      this.loopTimer = window.setInterval(playMorningPhrase, 7000);
    } else if (theme === 'day') {
      // Light playful marimba bounce
      const playDayPhrase = () => {
        if (!this.ctx || !this.isMusicEnabled || this.currentTheme !== 'day') return;
        const now = this.ctx.currentTime + 0.05;
        const melody = [
          { f: 392.00, t: 0.0, d: 0.3 }, // G4
          { f: 440.00, t: 0.3, d: 0.3 }, // A4
          { f: 523.25, t: 0.6, d: 0.4 }, // C5
          { f: 659.25, t: 1.0, d: 0.5 }, // E5
          { f: 587.33, t: 1.6, d: 0.4 }, // D5
          { f: 523.25, t: 2.1, d: 0.6 }, // C5
          { f: 440.00, t: 2.8, d: 0.4 }, // A4
          { f: 392.00, t: 3.3, d: 0.6 }, // G4
        ];
        melody.forEach(m => {
          this.playSoftTone(m.f, now + m.t, m.d + 0.3, 'triangle', 0.16);
          // light bass note
          this.playSoftTone(m.f / 2, now + m.t, m.d + 0.6, 'sine', 0.08);
        });
      };
      playDayPhrase();
      this.loopTimer = window.setInterval(playDayPhrase, 4500);
    } else if (theme === 'cafe') {
      // Cozy Bossa / Lofi Chords
      const playCafePhrase = () => {
        if (!this.ctx || !this.isMusicEnabled || this.currentTheme !== 'cafe') return;
        const now = this.ctx.currentTime + 0.05;
        // Dm9 -> G13 -> Cmaj9 -> A7b9
        const progression = [
          [293.66, 349.23, 440.0, 493.88, 659.25],
          [196.00, 329.63, 392.0, 440.0, 587.33],
          [261.63, 329.63, 392.0, 493.88, 587.33],
          [220.00, 277.18, 329.63, 392.0, 554.37],
        ];
        progression.forEach((chord, cIdx) => {
          chord.forEach((f, i) => {
            this.playSoftTone(f, now + cIdx * 1.5 + i * 0.08, 1.8, 'sine', 0.11);
          });
        });
      };
      playCafePhrase();
      this.loopTimer = window.setInterval(playCafePhrase, 6500);
    } else if (theme === 'night') {
      // Warm emotional music box & warm drone for "All Nine Lives"
      const playNightPhrase = () => {
        if (!this.ctx || !this.isMusicEnabled || this.currentTheme !== 'night') return;
        const now = this.ctx.currentTime + 0.05;
        // Warm low drone
        this.playSoftTone(130.81, now, 6.0, 'sine', 0.09); // C3
        this.playSoftTone(196.00, now, 6.0, 'sine', 0.07); // G3

        // Tender music box melody
        const tender = [
          { f: 523.25, t: 0.0 }, // C5
          { f: 587.33, t: 0.8 }, // D5
          { f: 659.25, t: 1.6 }, // E5
          { f: 783.99, t: 2.4 }, // G5
          { f: 659.25, t: 3.4 }, // E5
          { f: 587.33, t: 4.2 }, // D5
          { f: 523.25, t: 5.0 }, // C5
        ];
        tender.forEach(n => {
          this.playSoftTone(n.f, now + n.t, 1.2, 'sine', 0.15);
          this.playSoftTone(n.f * 2, now + n.t, 0.8, 'triangle', 0.05); // shimmer
        });
      };
      playNightPhrase();
      this.loopTimer = window.setInterval(playNightPhrase, 7000);
    }
  }

  // Rain ambient noise generator
  private startRainAmbient() {
    if (!this.ctx || !this.isMusicEnabled) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.06;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      if (this.musicGain) gain.connect(this.musicGain);

      noise.start();
      this.rainNode = noise;
    } catch (e) {
      console.warn('Ambient rain error', e);
    }
  }

  private stopRainAmbient() {
    if (this.rainNode) {
      try {
        (this.rainNode as any).stop();
      } catch (e) {}
      this.rainNode = null;
    }
  }

  // SOUND EFFECTS

  public playMeow(variant: 'happy' | 'question' | 'greeting' | 'protest' | 'purr' = 'happy') {
    this.initCtx();
    if (!this.isSoundEnabled || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.5, now);

    if (variant === 'happy') {
      // M-eeeee-o-w rise and fall
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.35);

      filter.frequency.setValueAtTime(900, now);
      filter.frequency.linearRampToValueAtTime(1400, now + 0.15);
      filter.frequency.linearRampToValueAtTime(800, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.38);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (variant === 'greeting') {
      // Quick cheerful chirp "Mrrr-ow!"
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.linearRampToValueAtTime(850, now + 0.1);
      osc.frequency.linearRampToValueAtTime(700, now + 0.22);

      filter.frequency.setValueAtTime(1100, now);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.04);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (variant === 'question') {
      // Inquisitive upward meow "Meoow?"
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(780, now + 0.3);

      filter.frequency.setValueAtTime(1000, now);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.06);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.34);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (variant === 'protest') {
      // Slightly offended lower meow
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(420, now + 0.28);

      filter.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.05);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.32);
      osc.start(now);
      osc.stop(now + 0.33);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
  }

  public startPurr() {
    this.initCtx();
    if (!this.isSoundEnabled || !this.ctx || !this.sfxGain || this.purrOsc) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(38, now); // 38Hz purr vibration

      lfo.frequency.setValueAtTime(24, now);
      lfoGain.gain.setValueAtTime(15, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      lfo.start(now);
      osc.start(now);

      this.purrOsc = osc;
      this.purrGain = gain;
    } catch (e) {}
  }

  public stopPurr() {
    if (this.purrGain && this.ctx) {
      try {
        this.purrGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          if (this.purrOsc) {
            this.purrOsc.stop();
            this.purrOsc = null;
          }
          this.purrGain = null;
        }, 350);
      } catch (e) {
        this.purrOsc = null;
        this.purrGain = null;
      }
    }
  }

  public playFootstep(isCat: boolean = false) {
    this.initCtx();
    if (!this.isSoundEnabled || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isCat ? 280 : 160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);

    gain.gain.setValueAtTime(isCat ? 0.04 : 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playFoodBowl() {
    this.initCtx();
    if (!this.isSoundEnabled || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    // Ceramic bowl chime: 1046Hz, 1318Hz, 1567Hz
    [1046.5, 1318.5, 1567.9].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.12, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.45);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.46);
    });
  }

  public playSplash() {
    this.initCtx();
    if (!this.isSoundEnabled || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 + Math.random() * 200, now + i * 0.03);
      osc.frequency.exponentialRampToValueAtTime(650 + Math.random() * 200, now + i * 0.03 + 0.08);

      gain.gain.setValueAtTime(0.14, now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.13);
    }
  }

  public playInteract() {
    this.initCtx();
    if (!this.isSoundEnabled || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playComplimentChime() {
    this.initCtx();
    if (!this.isSoundEnabled || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    // Magical sparkle arpeggio: C5, E5, G5, B5, C6
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.12, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.5);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.52);
    });
  }

  public playChapterComplete() {
    this.initCtx();
    if (!this.isSoundEnabled || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    // Peaceful celebration chord
    [392.00, 493.88, 587.33, 783.99].forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now);
      osc.stop(now + 1.65);
    });
  }

  public playToyClick() {
    this.initCtx();
    if (!this.isSoundEnabled || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }
}

export const soundEngine = new SoundEngine();
