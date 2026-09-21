import { HrickAnimation, SpeechBubble, ToyItem } from '../types';
import { HRICK_COMPLIMENTS } from './constants';
import { soundEngine } from '../audio/soundEngine';

export interface HrickState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facingLeft: boolean;
  animation: HrickAnimation;
  targetX: number;
  targetY: number;
  stateTimer: number;
  stateDuration: number;
  mode: 'follow' | 'idle' | 'explore' | 'sleep' | 'chase_toy' | 'flee' | 'zoomies' | 'on_lap' | 'in_box' | 'eating';
  hunger: number; // 0 to 100
  energy: number; // 0 to 100
  affection: number; // 0 to 100
  isWet: boolean;
  isFluffy: boolean;
  activeToy: ToyItem | null;
  thoughtBubble: SpeechBubble | null;
  lastComplimentTime: number;
}

export class HrickAI {
  public state: HrickState;

  constructor(startX: number = 300, startY: number = 300) {
    this.state = {
      x: startX,
      y: startY,
      vx: 0,
      vy: 0,
      facingLeft: false,
      animation: 'idle',
      targetX: startX,
      targetY: startY,
      stateTimer: 0,
      stateDuration: 3,
      mode: 'idle',
      hunger: 50,
      energy: 80,
      affection: 20,
      isWet: false,
      isFluffy: false,
      activeToy: null,
      thoughtBubble: null,
      lastComplimentTime: 0
    };
  }

  public resetPosition(x: number, y: number, anim: HrickAnimation = 'idle') {
    this.state.x = x;
    this.state.y = y;
    this.state.vx = 0;
    this.state.vy = 0;
    this.state.targetX = x;
    this.state.targetY = y;
    this.state.animation = anim;
    this.state.mode = 'idle';
    this.state.stateTimer = 0;
  }

  public triggerSpeech(text: string, isThought: boolean = false, duration: number = 3.5) {
    this.state.thoughtBubble = {
      id: Math.random().toString(36).substring(2, 9),
      speaker: 'hrick',
      speakerName: 'Hrick',
      text,
      duration,
      elapsed: 0,
      isThought
    };
    if (!isThought) {
      soundEngine.playMeow('greeting');
    }
  }

  public triggerCompliment(category: keyof typeof HRICK_COMPLIMENTS) {
    const now = Date.now();
    // Don't spam compliments too quickly
    if (now - this.state.lastComplimentTime < 6000) return;
    this.state.lastComplimentTime = now;

    const list = HRICK_COMPLIMENTS[category];
    if (list && list.length > 0) {
      const phrase = list[Math.floor(Math.random() * list.length)];
      this.triggerSpeech(phrase, false, 3.2);
      soundEngine.playComplimentChime();
    }
  }

  public update(
    dt: number,
    bbX: number,
    bbY: number,
    bbVelocityX: number,
    bbIsSitting: boolean,
    toys: ToyItem[],
    currentChapter: number,
    bounds: { minX: number; maxX: number; minY: number; maxY: number }
  ) {
    this.state.stateTimer += dt;

    // Update thought bubble timer
    if (this.state.thoughtBubble) {
      this.state.thoughtBubble.elapsed += dt;
      if (this.state.thoughtBubble.elapsed >= this.state.thoughtBubble.duration) {
        this.state.thoughtBubble = null;
      }
    }

    const distToBB = Math.hypot(bbX - this.state.x, bbY - this.state.y);

    // CHAPTER SPECIFIC OVERRIDES
    if (currentChapter === 1 && this.state.mode === 'idle' && distToBB > 200) {
      // Waiting alone under shelter in Chapter 1
      this.state.animation = 'sit';
      return;
    }

    // CHAPTER 3: BATH TIME Mini-chase & hide
    if (currentChapter === 3 && this.state.mode === 'flee') {
      this.state.animation = 'bath_scared';
      const fleeAngle = Math.atan2(this.state.y - bbY, this.state.x - bbX);
      this.state.vx = Math.cos(fleeAngle) * 110;
      this.state.vy = Math.sin(fleeAngle) * 110;
      this.moveWithBounds(dt, bounds);
      return;
    }

    // LAP SITTING MODE (Chapter 4, 9, or free-play cozy cuddle)
    if (this.state.mode === 'on_lap') {
      this.state.x = bbX + (bbIsSitting ? 6 : 0);
      this.state.y = bbY - (bbIsSitting ? 10 : 0);
      this.state.animation = 'on_lap';
      return;
    }

    // BOX HIDING MODE (Chapter 5)
    if (this.state.mode === 'in_box') {
      this.state.animation = 'in_box';
      return;
    }

    // SICK BED MODE (Chapter 8)
    if (currentChapter === 8 && this.state.mode === 'sleep') {
      this.state.animation = 'sleep';
      return;
    }

    // TOY HUNTING: If there is an active toy in play, Hrick gets curious!
    const activeToy = toys.find(t => t.isInPlay && !t.isHeld);
    if (activeToy && this.state.mode !== 'chase_toy' && Math.random() < 0.6) {
      // 25% cat unpredictability: ignore toy and prefer cardboard box!
      const boxToy = toys.find(t => t.type === 'box');
      if (boxToy && Math.random() < 0.4) {
        this.state.mode = 'in_box';
        this.state.x = boxToy.x;
        this.state.y = boxToy.y;
        this.triggerSpeech("Perfect.", false, 2.5);
        return;
      }

      this.state.mode = 'chase_toy';
      this.state.activeToy = activeToy;
      this.state.targetX = activeToy.x + (Math.random() * 10 - 5);
      this.state.targetY = activeToy.y + (Math.random() * 10 - 5);
    }

    // STATE MACHINE TRANSITIONS
    if (this.state.stateTimer >= this.state.stateDuration) {
      this.state.stateTimer = 0;
      this.chooseNextBehavior(distToBB, bbX, bbY, bounds);
    }

    // EXECUTE CURRENT BEHAVIOR
    switch (this.state.mode) {
      case 'follow': {
        // Keep a cozy distance (35 - 55 px)
        const targetDist = 42;
        const dx = bbX - this.state.x;
        const dy = bbY - this.state.y;
        const angle = Math.atan2(dy, dx);

        if (distToBB > targetDist + 15) {
          // Walk or run to catch up
          const isCatchingUp = distToBB > 95;
          const speed = isCatchingUp ? 105 : 60;
          this.state.vx = Math.cos(angle) * speed;
          this.state.vy = Math.sin(angle) * speed;
          this.state.animation = isCatchingUp ? 'run' : 'walk';
          this.state.facingLeft = this.state.vx < 0;
        } else if (distToBB < targetDist - 10) {
          // Give BB personal space
          this.state.vx = -Math.cos(angle) * 30;
          this.state.vy = -Math.sin(angle) * 30;
          this.state.animation = 'walk';
          this.state.facingLeft = this.state.vx < 0;
        } else {
          // Close enough: stop, rub against her legs, or sit
          this.state.vx = 0;
          this.state.vy = 0;
          if (Math.random() < 0.4) {
            this.state.animation = 'rub';
            soundEngine.startPurr();
          } else {
            this.state.animation = 'sit';
            soundEngine.stopPurr();
          }
        }
        break;
      }

      case 'chase_toy': {
        if (!this.state.activeToy) {
          this.state.mode = 'idle';
          break;
        }
        const tdx = this.state.activeToy.x - this.state.x;
        const tdy = this.state.activeToy.y - this.state.y;
        const tDist = Math.hypot(tdx, tdy);

        if (tDist > 16) {
          const angle = Math.atan2(tdy, tdx);
          this.state.vx = Math.cos(angle) * 95;
          this.state.vy = Math.sin(angle) * 95;
          this.state.animation = 'run';
          this.state.facingLeft = this.state.vx < 0;
        } else {
          // Pounce!
          this.state.vx = 0;
          this.state.vy = 0;
          this.state.animation = 'pounce';
          soundEngine.playToyClick();
          // Cat decision: bring it back, or walk away?
          if (Math.random() < 0.5) {
            this.state.mode = 'follow';
            this.state.stateDuration = 4;
          } else {
            this.state.mode = 'idle';
            this.state.stateDuration = 3;
          }
          this.state.activeToy.isInPlay = false;
          this.state.activeToy = null;
        }
        break;
      }

      case 'explore': {
        const edx = this.state.targetX - this.state.x;
        const edy = this.state.targetY - this.state.y;
        const eDist = Math.hypot(edx, edy);

        if (eDist > 8) {
          const angle = Math.atan2(edy, edx);
          this.state.vx = Math.cos(angle) * 45;
          this.state.vy = Math.sin(angle) * 45;
          this.state.animation = 'walk';
          this.state.facingLeft = this.state.vx < 0;
        } else {
          this.state.vx = 0;
          this.state.vy = 0;
          this.state.animation = Math.random() < 0.5 ? 'stretch' : 'yawn';
          if (this.state.animation === 'yawn') {
            soundEngine.playMeow('happy');
          }
          this.state.mode = 'idle';
          this.state.stateDuration = 2.5;
        }
        break;
      }

      case 'zoomies': {
        // Unpredictable 3am cat zoomies!
        const zdx = this.state.targetX - this.state.x;
        const zdy = this.state.targetY - this.state.y;
        const zDist = Math.hypot(zdx, zdy);

        if (zDist > 12) {
          const angle = Math.atan2(zdy, zdx);
          this.state.vx = Math.cos(angle) * 140;
          this.state.vy = Math.sin(angle) * 140;
          this.state.animation = 'zoomies';
          this.state.facingLeft = this.state.vx < 0;
        } else {
          // Pick new random point inside bounds
          this.state.targetX = bounds.minX + 30 + Math.random() * (bounds.maxX - bounds.minX - 60);
          this.state.targetY = bounds.minY + 30 + Math.random() * (bounds.maxY - bounds.minY - 60);
        }
        break;
      }

      case 'sleep': {
        this.state.vx = 0;
        this.state.vy = 0;
        this.state.animation = 'curled';
        break;
      }

      case 'idle':
      default: {
        this.state.vx = 0;
        this.state.vy = 0;
        // If BB walked far away while Hrick was idling, switch to follow
        if (distToBB > 90) {
          this.state.mode = 'follow';
          this.state.stateDuration = 5;
        }
        break;
      }
    }

    this.moveWithBounds(dt, bounds);
  }

  private chooseNextBehavior(
    distToBB: number,
    bbX: number,
    bbY: number,
    bounds: { minX: number; maxX: number; minY: number; maxY: number }
  ) {
    // If far from BB, usually follow her!
    if (distToBB > 80) {
      this.state.mode = 'follow';
      this.state.stateDuration = 3 + Math.random() * 3;
      return;
    }

    // Otherwise choose random cat action
    const rand = Math.random();
    if (rand < 0.40) {
      // Follow BB / rub legs
      this.state.mode = 'follow';
      this.state.stateDuration = 3 + Math.random() * 2;
    } else if (rand < 0.65) {
      // Explore nearby spot
      this.state.mode = 'explore';
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 60;
      this.state.targetX = Math.max(bounds.minX + 20, Math.min(bounds.maxX - 20, this.state.x + Math.cos(angle) * radius));
      this.state.targetY = Math.max(bounds.minY + 20, Math.min(bounds.maxY - 20, this.state.y + Math.sin(angle) * radius));
      this.state.stateDuration = 2 + Math.random() * 2;
    } else if (rand < 0.85) {
      // Groom / stretch / sit idly
      this.state.mode = 'idle';
      const anims: HrickAnimation[] = ['groom', 'stretch', 'yawn', 'sit'];
      this.state.animation = anims[Math.floor(Math.random() * anims.length)];
      this.state.stateDuration = 2 + Math.random() * 2;
      if (Math.random() < 0.3) {
        soundEngine.playMeow('happy');
      }
    } else if (rand < 0.95) {
      // Sleep in cozy donut
      this.state.mode = 'sleep';
      this.state.animation = 'curled';
      this.state.stateDuration = 4 + Math.random() * 4;
    } else {
      // SUDDEN ZOOMIES!
      this.state.mode = 'zoomies';
      this.state.targetX = bounds.minX + 30 + Math.random() * (bounds.maxX - bounds.minX - 60);
      this.state.targetY = bounds.minY + 30 + Math.random() * (bounds.maxY - bounds.minY - 60);
      this.state.stateDuration = 2.5;
      soundEngine.playMeow('happy');
    }
  }

  private moveWithBounds(dt: number, bounds: { minX: number; maxX: number; minY: number; maxY: number }) {
    this.state.x += this.state.vx * dt;
    this.state.y += this.state.vy * dt;

    if (this.state.x < bounds.minX) {
      this.state.x = bounds.minX;
      this.state.vx = 0;
    } else if (this.state.x > bounds.maxX) {
      this.state.x = bounds.maxX;
      this.state.vx = 0;
    }

    if (this.state.y < bounds.minY) {
      this.state.y = bounds.minY;
      this.state.vy = 0;
    } else if (this.state.y > bounds.maxY) {
      this.state.y = bounds.maxY;
      this.state.vy = 0;
    }
  }
}
