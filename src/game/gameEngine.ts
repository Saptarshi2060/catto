import {
  ChapterId,
  GameLocation,
  BBAnimation,
  Particle,
  SpeechBubble,
  ToyItem,
  InteractiveObject
} from '../types';
import { CHAPTERS, MEMORY_TOKENS } from './constants';
import { HrickAI } from './hrickAI';
import { SpriteRenderer } from './sprites';
import { EnvironmentRenderer } from './environment';
import { soundEngine } from '../audio/soundEngine';

export interface GameEngineOptions {
  canvas: HTMLCanvasElement;
  onChapterComplete: (completedChapter: ChapterId, nextChapter: ChapterId) => void;
  onCompliment: (text: string) => void;
  onActivePromptChange: (prompt: string | null, actionType: string | null) => void;
  onObjectiveChange?: (objective: string) => void;
  onSaveState: (unlockedMemories: string[]) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private running: boolean = false;
  private animFrameId: number | null = null;
  private lastTime: number = 0;

  // Camera
  public camera = { x: 0, y: 0, targetX: 0, targetY: 0, zoom: 1.0, targetZoom: 1.0 };

  // BB State
  public bb = {
    x: 180,
    y: 410,
    vx: 0,
    vy: 0,
    speed: 130,
    facingLeft: false,
    animation: 'idle' as BBAnimation,
    isSitting: false,
    isWet: false,
    heldToy: null as ToyItem | null,
    thoughtBubble: null as SpeechBubble | null
  };

  // Hrick AI
  public hrickAI: HrickAI;

  // Chapter & World
  public currentChapter: ChapterId = 1;
  public currentLocation: GameLocation = 'street_rain';
  public chapterProgress: number = 0; // 0 to 100
  public chapterStep: number = 0;
  public currentObjective: string = '';

  // Interactive items & objects
  public interactiveObjects: InteractiveObject[] = [];
  public toys: ToyItem[] = [];
  public particles: Particle[] = [];
  public unlockedMemories: Set<string> = new Set();

  // World bounds for current location
  public bounds = { minX: 40, maxX: 1040, minY: 320, maxY: 480 };

  // Environment state
  public timeOfDay: number = 0; // accumulator for animations
  public tvChannel: number = 0;
  public waterLevel: number = 0;
  private isEnteringDoor: boolean = false;

  // Control inputs
  public input = {
    left: false,
    right: false,
    up: false,
    down: false,
    interact: false,
    run: false,
    joystickVector: { x: 0, y: 0 }
  };

  // Callbacks
  private onChapterComplete: (c: ChapterId, next: ChapterId) => void;
  private onCompliment: (text: string) => void;
  private onActivePromptChange: (p: string | null, a: string | null) => void;
  private onObjectiveChange?: (obj: string) => void;
  private onSaveState: (m: string[]) => void;

  constructor(options: GameEngineOptions) {
    this.canvas = options.canvas;
    this.ctx = options.canvas.getContext('2d')!;
    this.onChapterComplete = options.onChapterComplete;
    this.onCompliment = options.onCompliment;
    this.onActivePromptChange = options.onActivePromptChange;
    this.onObjectiveChange = options.onObjectiveChange;
    this.onSaveState = options.onSaveState;

    this.hrickAI = new HrickAI(260, 390);
    this.loadChapter(1);
  }

  public setObjective(obj: string) {
    this.currentObjective = obj;
    if (this.onObjectiveChange) {
      this.onObjectiveChange(obj);
    }
  }

  public loadChapter(chId: ChapterId) {
    this.currentChapter = chId;
    const info = CHAPTERS[chId];
    this.currentLocation = info.defaultLocation;
    this.chapterStep = 0;
    this.chapterProgress = 0;
    this.isEnteringDoor = false;
    this.bb.isSitting = false;
    this.bb.isWet = false;
    this.bb.animation = 'idle';
    this.bb.heldToy = null;
    this.bb.thoughtBubble = null;
    this.toys = [];
    this.particles = [];
    this.camera.zoom = 1.0;
    this.camera.targetZoom = 1.0;

    // Set Audio Theme
    if (info.weather === 'rain') {
      soundEngine.playMusic('rain');
    } else if (info.weather === 'night') {
      soundEngine.playMusic('night');
    } else if (this.currentLocation === 'cat_cafe') {
      soundEngine.playMusic('cafe');
    } else if (info.weather === 'clear') {
      soundEngine.playMusic('day');
    } else {
      soundEngine.playMusic('morning');
    }

    // Set Location Bounds & Initial Positions
    this.setupLocationState(chId);
  }

  private setupLocationState(chId: ChapterId) {
    switch (chId) {
      case 1: { // Stray cat in rain
        this.bounds = { minX: 50, maxX: 1050, minY: 370, maxY: 460 };
        this.bb.x = 80;
        this.bb.y = 410;
        this.bb.facingLeft = false;
        // Hrick alone under shelter
        this.hrickAI.resetPosition(260, 395, 'sit');
        this.hrickAI.state.mode = 'idle';
        this.hrickAI.state.isWet = true;
        this.setObjective('Walk right to the bus shelter and offer your hand to Hrick [E / ACT]');
        this.interactiveObjects = [
          {
            id: 'hrick_shelter',
            name: 'Tiny Stray Cat',
            x: 260,
            y: 395,
            width: 50,
            height: 50,
            prompt: 'Gently crouch & offer hand',
            actionType: 'offer_hand'
          },
          {
            id: 'home_door',
            name: "BB's Front Door",
            x: 980,
            y: 400,
            width: 140,
            height: 140,
            prompt: 'Locked: Find the kitten at the bus shelter first (← Left)',
            actionType: 'door_locked'
          }
        ];
        break;
      }

      case 2: { // First Meal in Kitchen
        this.bounds = { minX: 80, maxX: 980, minY: 320, maxY: 460 };
        this.bb.x = 220;
        this.bb.y = 380;
        this.hrickAI.resetPosition(330, 380, 'sit');
        this.hrickAI.state.hunger = 85;
        this.setObjective("Go to the kitchen counter to prepare Hrick's warm dinner [E / ACT]");
        this.interactiveObjects = [
          {
            id: 'kitchen_counter',
            name: 'Food Prep Counter',
            x: 220,
            y: 320,
            width: 140,
            height: 40,
            prompt: 'Prepare delicious cat dinner',
            actionType: 'cook_food'
          }
        ];
        break;
      }

      case 3: { // Bath Time
        this.bounds = { minX: 100, maxX: 950, minY: 310, maxY: 470 };
        this.bb.x = 200;
        this.bb.y = 380;
        this.hrickAI.resetPosition(380, 380, 'sit');
        this.hrickAI.state.isWet = true;
        this.setObjective("Approach the bathtub to start warm bath time [E / ACT]");
        this.interactiveObjects = [
          {
            id: 'bathtub',
            name: 'Warm Bubble Bath',
            x: 540,
            y: 340,
            width: 120,
            height: 60,
            prompt: 'Carry Hrick to bath',
            actionType: 'start_bath'
          }
        ];
        break;
      }

      case 4: { // The Couch & TV
        this.bounds = { minX: 80, maxX: 980, minY: 330, maxY: 470 };
        this.bb.x = 320;
        this.bb.y = 390;
        this.hrickAI.resetPosition(460, 390, 'sit');
        this.setObjective('Sit down on the sofa to cuddle with Hrick [E / ACT]');
        this.interactiveObjects = [
          {
            id: 'couch',
            name: 'Cozy Sofa',
            x: 540,
            y: 350,
            width: 140,
            height: 50,
            prompt: 'Sit down and relax',
            actionType: 'sit_couch'
          },
          {
            id: 'tv_remote',
            name: 'TV Remote',
            x: 880,
            y: 340,
            width: 60,
            height: 40,
            prompt: 'Change TV channel',
            actionType: 'change_tv'
          }
        ];
        break;
      }

      case 5: { // Playtime with toys & cardboard box
        this.bounds = { minX: 80, maxX: 980, minY: 330, maxY: 470 };
        this.bb.x = 260;
        this.bb.y = 390;
        this.hrickAI.resetPosition(440, 390, 'sit');
        this.setObjective('Throw yarn from the toy pile for Hrick to chase [E / ACT]');
        this.toys = [
          { id: 'yarn1', type: 'yarn', name: 'Yarn Ball', x: 220, y: 390, vx: 0, vy: 0 },
          { id: 'feather1', type: 'feather', name: 'Feather Wand', x: 380, y: 410, vx: 0, vy: 0 },
          { id: 'mouse1', type: 'mouse', name: 'Toy Mouse', x: 600, y: 390, vx: 0, vy: 0 },
          { id: 'box1', type: 'box', name: 'Cardboard Box', x: 740, y: 400, vx: 0, vy: 0 }
        ];
        this.interactiveObjects = [
          {
            id: 'toys_pile',
            name: 'Toy Pile',
            x: 220,
            y: 390,
            width: 50,
            height: 40,
            prompt: 'Throw yarn toy for Hrick',
            actionType: 'throw_toy'
          },
          {
            id: 'box_interact',
            name: 'Cardboard Box',
            x: 740,
            y: 400,
            width: 50,
            height: 40,
            prompt: 'Inspect box',
            actionType: 'inspect_box'
          }
        ];
        break;
      }

      case 6: { // Neighborhood Outing
        this.bounds = { minX: 60, maxX: 1040, minY: 340, maxY: 470 };
        this.bb.x = 120;
        this.bb.y = 400;
        this.hrickAI.resetPosition(180, 400, 'walk');
        this.setObjective('Stroll down the street to the lavender planter on the right [E / ACT]');
        this.interactiveObjects = [
          {
            id: 'bakery_window',
            name: 'Neighborhood Bakery',
            x: 220,
            y: 330,
            width: 80,
            height: 50,
            prompt: 'Check out the pastries',
            actionType: 'bakery'
          },
          {
            id: 'park_bench',
            name: 'Park Bench',
            x: 730,
            y: 350,
            width: 80,
            height: 40,
            prompt: 'Rest under the blossom tree',
            actionType: 'park_bench'
          },
          {
            id: 'flower_planter',
            name: 'Lavender Planter',
            x: 920,
            y: 340,
            width: 70,
            height: 40,
            prompt: 'Admire fluttering butterflies',
            actionType: 'butterflies'
          }
        ];
        break;
      }

      case 7: { // Cat Cafe
        this.bounds = { minX: 90, maxX: 980, minY: 300, maxY: 460 };
        this.bb.x = 180;
        this.bb.y = 380;
        this.hrickAI.resetPosition(250, 380, 'walk');
        this.setObjective('Walk to the cafe counter to order a warm cat-ear latte [E / ACT]');
        this.interactiveObjects = [
          {
            id: 'cat_tree',
            name: 'Cat Climbing Tree',
            x: 350,
            y: 320,
            width: 90,
            height: 50,
            prompt: 'Watch Hrick climb tree',
            actionType: 'cat_tree'
          },
          {
            id: 'cafe_counter',
            name: 'Matcha & Treats Counter',
            x: 860,
            y: 310,
            width: 90,
            height: 50,
            prompt: 'Order warm cat-ear latte',
            actionType: 'cafe_drink'
          }
        ];
        break;
      }

      case 8: { // Sick Day in Bedroom
        this.bounds = { minX: 90, maxX: 980, minY: 320, maxY: 470 };
        this.bb.x = 220;
        this.bb.y = 390;
        // Hrick in cozy bed
        this.hrickAI.resetPosition(640, 380, 'curled');
        this.hrickAI.state.mode = 'sleep';
        this.setObjective('Prepare warm broth and medicine at the nightstand on the left [E / ACT]');
        this.interactiveObjects = [
          {
            id: 'nightstand',
            name: 'Nightstand Medicine & Broth',
            x: 200,
            y: 320,
            width: 60,
            height: 40,
            prompt: 'Prepare warm broth & medicine',
            actionType: 'prep_medicine'
          },
          {
            id: 'cat_bed',
            name: 'Hrick in Bed',
            x: 640,
            y: 380,
            width: 70,
            height: 50,
            prompt: 'Care for Hrick & tuck him in',
            actionType: 'care_hrick'
          }
        ];
        break;
      }

      case 9: { // BB's Day (Hrick takes care of BB)
        this.bounds = { minX: 80, maxX: 980, minY: 330, maxY: 470 };
        this.bb.x = 540;
        this.bb.y = 400;
        this.bb.animation = 'tired';
        this.bb.isSitting = true;
        this.hrickAI.resetPosition(280, 390, 'walk');
        this.setObjective('Sit and rest on the living room rug with Hrick [E / ACT]');
        this.interactiveObjects = [
          {
            id: 'sit_rug',
            name: 'Cozy Living Room Rug',
            x: 540,
            y: 400,
            width: 90,
            height: 50,
            prompt: 'Rest here with Hrick',
            actionType: 'rest_with_hrick'
          }
        ];
        // Hrick automatically runs to BB with gifts
        this.chapterStep = 1;
        break;
      }

      case 10: { // Final Chapter: All Nine Lives (Veranda at Night)
        this.bounds = { minX: 120, maxX: 980, minY: 370, maxY: 460 };
        this.bb.x = 480;
        this.bb.y = 420;
        this.bb.animation = 'sit';
        this.bb.isSitting = true;
        this.hrickAI.resetPosition(530, 420, 'sit');
        this.setObjective('Listen to Hrick under the quiet night stars [E / ACT]');
        this.interactiveObjects = [
          {
            id: 'night_sky',
            name: 'Quiet Starry Veranda',
            x: 500,
            y: 420,
            width: 100,
            height: 60,
            prompt: 'Listen to Hrick under the stars',
            actionType: 'listen_nine_lives'
          }
        ];
        break;
      }

      case 11: { // Epilogue: Free Play
        this.bounds = { minX: 80, maxX: 980, minY: 320, maxY: 470 };
        this.bb.x = 340;
        this.bb.y = 390;
        this.hrickAI.resetPosition(420, 390, 'sit');
        this.setObjective('Free Play: Cuddle on sofa, treat in kitchen, or play with toys');
        this.interactiveObjects = [
          {
            id: 'free_couch',
            name: 'Living Room Sofa',
            x: 540,
            y: 350,
            width: 140,
            height: 50,
            prompt: 'Cuddle with Hrick',
            actionType: 'free_cuddle'
          },
          {
            id: 'free_kitchen',
            name: 'Kitchen',
            x: 180,
            y: 340,
            width: 80,
            height: 50,
            prompt: 'Treat Hrick to tuna treats',
            actionType: 'free_treat'
          },
          {
            id: 'free_play',
            name: 'Cardboard Box & Toys',
            x: 820,
            y: 390,
            width: 80,
            height: 50,
            prompt: 'Play with toys & box',
            actionType: 'free_play'
          }
        ];
        this.toys = [
          { id: 'box1', type: 'box', name: 'Cardboard Box', x: 820, y: 390, vx: 0, vy: 0 },
          { id: 'yarn1', type: 'yarn', name: 'Yarn', x: 300, y: 400, vx: 0, vy: 0 }
        ];
        break;
      }
    }
  }

  // Handle Player Interaction Trigger (E / Tap)
  public handleInteract() {
    // Find closest interactive object within range
    const interactRange = 110;
    let closestObj: InteractiveObject | null = null;
    let minDist = interactRange;

    for (const obj of this.interactiveObjects) {
      const dist = Math.hypot(this.bb.x - obj.x, this.bb.y - obj.y);
      if (dist < minDist) {
        minDist = dist;
        closestObj = obj;
      }
    }

    // Also check if Hrick is directly clicked/interacted with
    const distToHrick = Math.hypot(this.bb.x - this.hrickAI.state.x, this.bb.y - this.hrickAI.state.y);
    if (!closestObj && distToHrick < 75) {
      this.petHrick();
      return;
    }

    if (closestObj) {
      this.executeAction(closestObj.actionType, closestObj);
    } else if (distToHrick < 85) {
      this.petHrick();
    }
  }

  // Petting Hrick
  public petHrick() {
    this.bb.animation = 'pet';
    this.camera.targetZoom = 1.25;
    this.hrickAI.state.animation = 'rub';
    soundEngine.playMeow('happy');
    soundEngine.startPurr();
    this.spawnParticles(this.hrickAI.state.x, this.hrickAI.state.y - 12, 'purr', 4);

    setTimeout(() => {
      this.hrickAI.triggerCompliment('cuddle');
      this.camera.targetZoom = 1.0;
      if (!this.bb.isSitting) this.bb.animation = 'idle';
    }, 1800);
  }

  // Action Dispatcher for Story & Chapters
  private executeAction(actionType: string, obj: InteractiveObject) {
    soundEngine.playInteract();

    switch (actionType) {
      // CHAPTER 1 ACTIONS
      case 'door_locked': {
        this.bb.animation = 'idle';
        this.bb.thoughtBubble = {
          id: 'locked_door',
          speaker: 'bb',
          speakerName: 'BB',
          text: "I can't go inside yet! There's a little kitten shivering in the rain back at the shelter (←).",
          duration: 3.5,
          elapsed: 0
        };
        soundEngine.playFootstep(false);
        break;
      }

      case 'offer_hand': {
        this.bb.animation = 'crouch';
        this.camera.targetZoom = 1.3;
        this.chapterStep = 1;
        this.hrickAI.state.thoughtBubble = {
          id: '1',
          speaker: 'hrick',
          text: '...',
          duration: 1.5,
          elapsed: 0,
          isThought: true
        };

        // Hrick cautiously approaches BB
        setTimeout(() => {
          this.hrickAI.state.mode = 'follow';
          this.hrickAI.state.targetX = this.bb.x + 35;
          this.hrickAI.state.targetY = this.bb.y;
          this.hrickAI.state.animation = 'walk';
          soundEngine.playMeow('question');
        }, 800);

        // Touches hand!
        setTimeout(() => {
          this.hrickAI.state.animation = 'rub';
          this.spawnParticles(this.bb.x + 20, this.bb.y - 10, 'sparkle', 8);
          soundEngine.startPurr();
          this.hrickAI.triggerSpeech('Mrrr?', false, 2.5);
          this.bb.animation = 'pet';
          this.bb.thoughtBubble = {
            id: 'bb1',
            speaker: 'bb',
            speakerName: 'BB',
            text: 'Hey little one... Let’s get you out of the cold rain.',
            duration: 3,
            elapsed: 0
          };
          this.camera.targetZoom = 1.1;

          // Update chapter objective: Walk home!
          this.chapterStep = 2;
          this.setObjective("Walk right with Hrick and open BB's front door to enter the kitchen [E / ACT]");
          this.interactiveObjects = [
            {
              id: 'home_door',
              name: "BB's Front Door",
              x: 980,
              y: 400,
              width: 140,
              height: 140,
              prompt: 'Open door & enter the kitchen!',
              actionType: 'enter_home'
            }
          ];
        }, 1800);
        break;
      }

      case 'enter_home': {
        this.bb.animation = 'walk';
        this.hrickAI.state.animation = 'walk';
        this.hrickAI.state.mode = 'follow';
        this.camera.targetZoom = 1.25;
        this.hrickAI.triggerSpeech('...home?', true, 2.5);
        this.spawnParticles(980, 360, 'sparkle', 16);
        this.unlockedMemories.add('shelter');
        this.onSaveState(Array.from(this.unlockedMemories));
        soundEngine.playChapterComplete();

        // Responsive, smooth transition into the kitchen!
        setTimeout(() => {
          this.onChapterComplete(1, 2);
        }, 800);
        break;
      }

      // CHAPTER 2 ACTIONS (First Meal)
      case 'cook_food': {
        this.bb.animation = 'feed';
        this.camera.targetZoom = 1.2;
        soundEngine.playFoodBowl();
        this.spawnParticles(330, 340, 'steam', 6);
        this.bb.thoughtBubble = {
          id: 'bb2',
          speaker: 'bb',
          speakerName: 'BB',
          text: 'Fresh warm salmon & gentle broth for you!',
          duration: 3,
          elapsed: 0
        };

        // Hrick impatiently waits, looks at food, looks at BB, then eats!
        setTimeout(() => {
          this.hrickAI.state.x = 330;
          this.hrickAI.state.y = 350;
          this.hrickAI.state.animation = 'eat';
          soundEngine.playFoodBowl();
        }, 1200);

        // After eating: licks paws and rubs legs!
        setTimeout(() => {
          this.hrickAI.state.animation = 'groom';
        }, 3500);

        setTimeout(() => {
          this.hrickAI.state.mode = 'follow';
          this.hrickAI.state.animation = 'rub';
          this.hrickAI.triggerSpeech('Okay. Human approved.', false, 3.0);
          soundEngine.startPurr();
          this.spawnParticles(this.bb.x, this.bb.y, 'heart', 4);
        }, 5200);

        setTimeout(() => {
          this.hrickAI.triggerSpeech("I'm keeping you.", false, 3.5);
          this.unlockedMemories.add('bowl');
          this.onSaveState(Array.from(this.unlockedMemories));
        }, 8200);

        setTimeout(() => {
          soundEngine.playChapterComplete();
          this.onChapterComplete(2, 3);
        }, 11500);
        break;
      }

      // CHAPTER 3 ACTIONS (Bath Time Chase & Fluff)
      case 'start_bath': {
        this.bb.animation = 'walk';
        // Hrick realizes what is happening!
        this.hrickAI.triggerSpeech('NO.', false, 2.0);
        soundEngine.playMeow('protest');
        this.hrickAI.state.mode = 'flee';
        this.hrickAI.state.animation = 'bath_scared';

        // Update prompt to chase & catch
        this.interactiveObjects = [
          {
            id: 'catch_hrick',
            name: 'Catch Slippery Hrick!',
            x: 540,
            y: 380,
            width: 100,
            height: 100,
            prompt: 'Gently scoop up Hrick',
            actionType: 'catch_hrick'
          }
        ];
        break;
      }

      case 'catch_hrick': {
        this.bb.animation = 'carry';
        this.hrickAI.state.mode = 'idle';
        this.hrickAI.state.x = 540;
        this.hrickAI.state.y = 310;
        this.camera.targetZoom = 1.3;

        // In the tub! Water splashes everywhere
        soundEngine.playSplash();
        this.spawnParticles(540, 310, 'splash', 14);
        this.hrickAI.state.animation = 'shake_water';
        this.bb.isWet = true;
        this.hrickAI.state.isWet = true;

        setTimeout(() => {
          this.hrickAI.triggerSpeech('...worth it.', false, 2.5);
          soundEngine.playMeow('greeting');
        }, 2200);

        // Towel drying sequence
        setTimeout(() => {
          this.bb.animation = 'dry';
          this.hrickAI.state.isFluffy = true;
          this.hrickAI.state.isWet = false;
          this.hrickAI.state.animation = 'fluffy_sleep';
          this.spawnParticles(540, 310, 'sparkle', 8);
          soundEngine.startPurr();
          this.bb.thoughtBubble = {
            id: 'bb3',
            speaker: 'bb',
            speakerName: 'BB',
            text: 'Look at how fluffy and clean you are now!',
            duration: 3,
            elapsed: 0
          };
          this.unlockedMemories.add('towel');
          this.onSaveState(Array.from(this.unlockedMemories));
        }, 4500);

        setTimeout(() => {
          soundEngine.playChapterComplete();
          this.onChapterComplete(3, 4);
        }, 8500);
        break;
      }

      // CHAPTER 4 ACTIONS (The Couch)
      case 'sit_couch': {
        this.bb.x = 540;
        this.bb.y = 350;
        this.bb.isSitting = true;
        this.bb.animation = 'sit';
        this.camera.targetZoom = 1.25;

        // Hrick jumps up, circles 3 times, curls on lap
        setTimeout(() => {
          this.hrickAI.state.x = 540;
          this.hrickAI.state.y = 345;
          this.hrickAI.state.animation = 'walk';
        }, 600);

        setTimeout(() => {
          this.hrickAI.state.mode = 'on_lap';
          this.hrickAI.state.animation = 'on_lap';
          this.hrickAI.triggerCompliment('sit');
          soundEngine.startPurr();
          this.bb.animation = 'cuddle';
        }, 2000);

        setTimeout(() => {
          this.hrickAI.triggerSpeech("I think I like you.", false, 3.5);
          this.unlockedMemories.add('tv');
          this.onSaveState(Array.from(this.unlockedMemories));
        }, 4500);

        setTimeout(() => {
          soundEngine.playChapterComplete();
          this.onChapterComplete(4, 5);
        }, 8000);
        break;
      }

      case 'change_tv': {
        this.tvChannel = (this.tvChannel + 1) % 4;
        soundEngine.playToyClick();
        if (this.tvChannel === 0) {
          // Bird show!
          this.hrickAI.triggerSpeech('Birds!', false, 2.0);
          soundEngine.playMeow('happy');
        }
        break;
      }

      // CHAPTER 5 ACTIONS (Playtime)
      case 'throw_toy': {
        this.bb.animation = 'throw';
        soundEngine.playToyClick();
        // Spawn active toy flying toward center
        const toy = this.toys.find(t => t.type === 'yarn') || this.toys[0];
        if (toy) {
          toy.isInPlay = true;
          toy.x = 500;
          toy.y = 410;
          this.hrickAI.state.mode = 'chase_toy';
          this.hrickAI.state.activeToy = toy;
        }

        setTimeout(() => {
          this.bb.animation = 'idle';
          this.hrickAI.triggerCompliment('difficult');
        }, 2200);

        setTimeout(() => {
          this.unlockedMemories.add('box');
          this.onSaveState(Array.from(this.unlockedMemories));
          soundEngine.playChapterComplete();
          this.onChapterComplete(5, 6);
        }, 6500);
        break;
      }

      case 'inspect_box': {
        this.hrickAI.state.mode = 'in_box';
        this.hrickAI.state.x = 740;
        this.hrickAI.state.y = 400;
        this.hrickAI.triggerSpeech('Perfect.', false, 3.0);
        soundEngine.playMeow('happy');
        break;
      }

      // CHAPTER 6 ACTIONS (Neighborhood Outing)
      case 'bakery': {
        this.bb.animation = 'crouch';
        this.hrickAI.triggerSpeech('Smells like warm vanilla!', true, 3.0);
        soundEngine.playMeow('greeting');
        this.bb.thoughtBubble = {
          id: 'bakery_thought',
          speaker: 'bb',
          speakerName: 'BB',
          text: 'Everything smells so sweet! Let’s keep walking towards the blossom garden (→).',
          duration: 3.5,
          elapsed: 0
        };
        this.spawnParticles(220, 310, 'sparkle', 6);
        this.setObjective('Follow the flower petals down the street to the lavender planter [E / ACT]');
        // Automatically stand back up after crouch
        setTimeout(() => {
          if (this.bb.animation === 'crouch') {
            this.bb.animation = 'idle';
          }
        }, 1800);
        break;
      }

      case 'park_bench': {
        this.bb.x = 730;
        this.bb.y = 355;
        this.bb.isSitting = true;
        this.bb.animation = 'sit';
        this.hrickAI.state.x = 760;
        this.hrickAI.state.y = 350;
        this.hrickAI.state.animation = 'sit';
        soundEngine.startPurr();
        this.spawnParticles(730, 310, 'petal', 8);
        this.hrickAI.triggerSpeech('Nice breeze under the trees.', false, 2.8);
        this.bb.thoughtBubble = {
          id: 'bench_rest',
          speaker: 'bb',
          speakerName: 'BB',
          text: 'What a beautiful spring day.',
          duration: 3,
          elapsed: 0
        };
        setTimeout(() => {
          if (this.bb.isSitting) {
            this.bb.isSitting = false;
            this.bb.animation = 'idle';
          }
        }, 2500);
        break;
      }

      case 'butterflies': {
        this.hrickAI.state.mode = 'explore';
        this.hrickAI.state.targetX = 920;
        this.hrickAI.state.targetY = 360;
        this.hrickAI.state.animation = 'pounce';
        this.spawnParticles(920, 320, 'petal', 10);
        this.hrickAI.triggerSpeech("Almost caught a butterfly!", false, 2.5);
        soundEngine.playToyClick();

        setTimeout(() => {
          this.hrickAI.triggerSpeech("You're my favorite person.", false, 3.5);
          this.unlockedMemories.add('collar');
          this.onSaveState(Array.from(this.unlockedMemories));
        }, 2200);

        setTimeout(() => {
          soundEngine.playChapterComplete();
          this.onChapterComplete(6, 7);
        }, 5000);
        break;
      }

      // CHAPTER 7 ACTIONS (Cat Cafe)
      case 'cat_tree': {
        this.hrickAI.state.x = 350;
        this.hrickAI.state.y = 210;
        this.hrickAI.state.animation = 'sit';
        soundEngine.playMeow('happy');
        this.hrickAI.triggerSpeech("King of the cat tree.", false, 2.5);
        break;
      }

      case 'cafe_drink': {
        this.bb.animation = 'sit';
        this.hrickAI.state.x = this.bb.x + 35;
        this.hrickAI.state.y = this.bb.y;
        this.hrickAI.state.mode = 'follow';
        this.hrickAI.state.animation = 'rub';
        soundEngine.startPurr();
        this.camera.targetZoom = 1.25;

        this.hrickAI.triggerSpeech("I met everyone.", false, 2.8);

        setTimeout(() => {
          this.hrickAI.triggerSpeech("But you're still my favorite.", false, 3.8);
          this.spawnParticles(this.bb.x, this.bb.y, 'heart', 6);
          this.unlockedMemories.add('cafe');
          this.onSaveState(Array.from(this.unlockedMemories));
        }, 3200);

        setTimeout(() => {
          soundEngine.playChapterComplete();
          this.onChapterComplete(7, 8);
        }, 7500);
        break;
      }

      // CHAPTER 8 ACTIONS (Sick Day)
      case 'prep_medicine': {
        this.bb.animation = 'feed';
        soundEngine.playFoodBowl();
        this.bb.thoughtBubble = {
          id: 'bb8',
          speaker: 'bb',
          speakerName: 'BB',
          text: 'Here is gentle warm broth and vitamins.',
          duration: 3,
          elapsed: 0
        };
        this.chapterStep = 1;
        break;
      }

      case 'care_hrick': {
        this.bb.animation = 'pet';
        this.camera.targetZoom = 1.3;
        soundEngine.startPurr();
        this.spawnParticles(640, 380, 'sparkle', 6);

        this.hrickAI.triggerSpeech("You take care of me.", false, 3.0);

        setTimeout(() => {
          this.hrickAI.triggerSpeech("Very good human. I think I got lucky.", false, 4.0);
          this.unlockedMemories.add('blanket');
          this.onSaveState(Array.from(this.unlockedMemories));
        }, 3200);

        setTimeout(() => {
          this.hrickAI.triggerSpeech("I think you're my home.", false, 3.5);
        }, 7200);

        setTimeout(() => {
          soundEngine.playChapterComplete();
          this.onChapterComplete(8, 9);
        }, 11000);
        break;
      }

      // CHAPTER 9 ACTIONS (BB's Day)
      case 'rest_with_hrick': {
        // Hrick brings a toy, then brings a sock, then jumps on lap!
        this.camera.targetZoom = 1.25;
        this.hrickAI.state.animation = 'walk';
        this.hrickAI.state.x = 500;
        this.hrickAI.state.y = 400;
        this.hrickAI.triggerSpeech("Brought you my mouse.", false, 2.5);

        setTimeout(() => {
          this.hrickAI.triggerSpeech("And a fluffy sock...", false, 2.5);
        }, 3000);

        setTimeout(() => {
          this.hrickAI.state.mode = 'on_lap';
          this.hrickAI.state.x = this.bb.x + 6;
          this.hrickAI.state.y = this.bb.y - 10;
          this.hrickAI.state.animation = 'on_lap';
          soundEngine.startPurr();
          this.bb.animation = 'cuddle';
          this.hrickAI.triggerSpeech("Okay. I'm helping.", false, 3.5);
          this.spawnParticles(this.bb.x, this.bb.y, 'purr', 8);
          this.unlockedMemories.add('sock');
          this.onSaveState(Array.from(this.unlockedMemories));
        }, 6000);

        setTimeout(() => {
          soundEngine.playChapterComplete();
          this.onChapterComplete(9, 10);
        }, 10500);
        break;
      }

      // CHAPTER 10 ACTIONS (All Nine Lives Climax)
      case 'listen_nine_lives': {
        this.camera.targetZoom = 1.35;
        soundEngine.playMusic('night');
        soundEngine.startPurr();

        // Dialogue sequence
        this.hrickAI.triggerSpeech("BB.", false, 2.8);

        setTimeout(() => {
          this.hrickAI.triggerSpeech("I've been thinking...", false, 3.2);
        }, 3200);

        setTimeout(() => {
          this.hrickAI.triggerSpeech("If cats really get nine lives...", false, 4.0);
        }, 6800);

        setTimeout(() => {
          this.hrickAI.triggerSpeech("I don't want nine different lives.", false, 4.0);
        }, 11200);

        setTimeout(() => {
          this.hrickAI.triggerSpeech("I want the same one... with you.", false, 4.5);
          this.spawnParticles(500, 410, 'sparkle', 12);
        }, 15600);

        setTimeout(() => {
          this.hrickAI.state.animation = 'on_lap';
          this.hrickAI.state.x = this.bb.x + 4;
          this.hrickAI.state.y = this.bb.y - 8;
          this.bb.animation = 'cuddle';
          this.hrickAI.triggerSpeech("All nine.", false, 4.0);
          this.unlockedMemories.add('ninelives');
          this.onSaveState(Array.from(this.unlockedMemories));
        }, 20500);

        setTimeout(() => {
          // Camera slowly zooms out showing the whole world and floating memories
          this.camera.targetZoom = 0.85;
          soundEngine.playChapterComplete();
          this.onChapterComplete(10, 11);
        }, 25500);
        break;
      }

      // EPILOGUE (Free Play)
      case 'free_cuddle': {
        this.bb.animation = 'cuddle';
        this.bb.isSitting = true;
        this.hrickAI.state.mode = 'on_lap';
        this.hrickAI.state.animation = 'on_lap';
        this.hrickAI.triggerCompliment('cuddle');
        soundEngine.startPurr();
        break;
      }

      case 'free_treat': {
        this.bb.animation = 'feed';
        soundEngine.playFoodBowl();
        this.hrickAI.triggerCompliment('feed');
        break;
      }

      case 'free_play': {
        this.hrickAI.state.mode = 'in_box';
        this.hrickAI.state.x = 820;
        this.hrickAI.state.y = 390;
        this.hrickAI.triggerSpeech('Still the best box in existence.', false, 3.0);
        break;
      }
    }
  }

  // Particle Emitter
  public spawnParticles(x: number, y: number, type: Particle['type'], count: number = 5) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 50;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === 'steam' || type === 'purr' ? 30 : 0),
        life: 0,
        maxLife: 0.8 + Math.random() * 0.8,
        size: type === 'heart' ? 7 : (type === 'splash' ? 4 : 3.5),
        color: type === 'heart' ? '#E76F51' : (type === 'sparkle' ? '#FFE494' : '#A2D2FF'),
        type,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 4
      });
    }
  }

  // Main Loop
  public start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    this.running = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private loop = (currentTime: number) => {
    if (!this.running) return;
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    this.update(dt);
    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    this.timeOfDay += dt;

    // Check Prompt For Nearest Object
    let activePrompt: string | null = null;
    let actionType: string | null = null;
    const checkDist = 110;

    for (const obj of this.interactiveObjects) {
      const dist = Math.hypot(this.bb.x - obj.x, this.bb.y - obj.y);
      if (dist < checkDist) {
        activePrompt = `${obj.name}: ${obj.prompt}`;
        actionType = obj.actionType;
        break;
      }
    }

    if (!activePrompt) {
      const distToCat = Math.hypot(this.bb.x - this.hrickAI.state.x, this.bb.y - this.hrickAI.state.y);
      if (distToCat < 75) {
        activePrompt = "Pet & Cuddle Hrick (E / Tap)";
        actionType = "pet_hrick";
      }
    }

    this.onActivePromptChange(activePrompt, actionType);

    // Update BB Input & Physics
    let moveX = 0;
    let moveY = 0;

    if (this.input.left) moveX -= 1;
    if (this.input.right) moveX += 1;
    if (this.input.up) moveY -= 1;
    if (this.input.down) moveY += 1;

    // Add virtual joystick
    if (Math.hypot(this.input.joystickVector.x, this.input.joystickVector.y) > 0.15) {
      moveX = this.input.joystickVector.x;
      moveY = this.input.joystickVector.y;
    }

    const len = Math.hypot(moveX, moveY);
    const hasMovementInput = len > 0.1;

    // If player inputs movement, immediately stand up from crouch/sit/pet
    if (hasMovementInput) {
      if (this.bb.isSitting) {
        this.bb.isSitting = false;
      }
      if (this.bb.animation === 'crouch' || this.bb.animation === 'sit' || this.bb.animation === 'pet' || this.bb.animation === 'feed') {
        this.bb.animation = 'walk';
      }
    }

    if (!this.bb.isSitting && this.bb.animation !== 'bath') {
      if (hasMovementInput) {
        const speedMultiplier = this.input.run ? 1.5 : 1.0;
        this.bb.vx = (moveX / (len > 1 ? len : 1)) * this.bb.speed * speedMultiplier;
        this.bb.vy = (moveY / (len > 1 ? len : 1)) * this.bb.speed * speedMultiplier;
        this.bb.animation = this.input.run ? 'run' : 'walk';
        this.bb.facingLeft = this.bb.vx < 0;

        // Play footstep sound periodically
        if (Math.sin(this.timeOfDay * 12) > 0.9) {
          soundEngine.playFootstep(false);
        }
      } else {
        this.bb.vx = 0;
        this.bb.vy = 0;
        if (this.bb.animation === 'walk' || this.bb.animation === 'run') {
          this.bb.animation = 'idle';
        }
      }

      this.bb.x += this.bb.vx * dt;
      this.bb.y += this.bb.vy * dt;

      // Constrain inside bounds
      this.bb.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, this.bb.x));
      this.bb.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, this.bb.y));

      // Auto-enter kitchen when walking right into the front door with Hrick
      if (this.currentChapter === 1 && this.chapterStep >= 2 && this.bb.x >= 960) {
        const doorObj = this.interactiveObjects.find(o => o.actionType === 'enter_home');
        if (doorObj && !this.isEnteringDoor) {
          this.isEnteringDoor = true;
          this.executeAction('enter_home', doorObj);
        }
      }
    }

    // Update Hrick Autonomous AI
    this.hrickAI.update(
      dt,
      this.bb.x,
      this.bb.y,
      this.bb.vx,
      this.bb.isSitting,
      this.toys,
      this.currentChapter,
      this.bounds
    );

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.vRot) p.rotation = (p.rotation || 0) + p.vRot * dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    // Update Camera Target (Smooth Lerp)
    this.camera.targetX = this.bb.x;
    this.camera.targetY = this.bb.y - 20;

    const lerpSpeed = 4.5 * dt;
    this.camera.x += (this.camera.targetX - this.camera.x) * lerpSpeed;
    this.camera.y += (this.camera.targetY - this.camera.y) * lerpSpeed;
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * lerpSpeed;
  }

  private render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // Camera Transform (Centered on BB with Zoom)
    ctx.translate(width / 2, height / 2);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Render Environment Background
    EnvironmentRenderer.renderScene(
      ctx,
      this.currentLocation,
      CHAPTERS[this.currentChapter].weather,
      this.timeOfDay,
      this.tvChannel,
      this.waterLevel
    );

    // 2. Render Toys on ground
    for (const toy of this.toys) {
      if (!toy.isHeld) {
        SpriteRenderer.renderToy(ctx, toy);
      }
    }

    // 3. Render Characters with Y-sorting (so whoever is lower renders in front)
    const entities = [
      {
        type: 'bb',
        y: this.bb.y,
        render: () => {
          SpriteRenderer.renderBB(
            ctx,
            this.bb.x,
            this.bb.y,
            this.bb.animation,
            this.bb.facingLeft,
            this.timeOfDay,
            this.bb.isWet
          );
        }
      },
      {
        type: 'hrick',
        y: this.hrickAI.state.y,
        render: () => {
          SpriteRenderer.renderHrick(
            ctx,
            this.hrickAI.state.x,
            this.hrickAI.state.y,
            this.hrickAI.state.animation,
            this.hrickAI.state.facingLeft,
            this.timeOfDay,
            this.hrickAI.state.isWet,
            this.hrickAI.state.isFluffy
          );
        }
      }
    ];

    entities.sort((a, b) => a.y - b.y);
    entities.forEach(e => e.render());

    // 4. Render Particles
    for (const p of this.particles) {
      const alpha = 1.0 - p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      if (p.type === 'heart') {
        ctx.font = '14px Nunito, sans-serif';
        ctx.fillText('♥', p.x, p.y);
      } else if (p.type === 'purr') {
        ctx.font = '12px Comfortaa, sans-serif';
        ctx.fillText('~', p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 5. Render Floating Speech Bubbles
    if (this.hrickAI.state.thoughtBubble) {
      SpriteRenderer.renderSpeechBubble(
        ctx,
        this.hrickAI.state.x,
        this.hrickAI.state.y - 25,
        this.hrickAI.state.thoughtBubble.text,
        this.hrickAI.state.thoughtBubble.isThought,
        'hrick',
        'Hrick'
      );
    }

    if (this.bb.thoughtBubble) {
      SpriteRenderer.renderSpeechBubble(
        ctx,
        this.bb.x,
        this.bb.y - 45,
        this.bb.thoughtBubble.text,
        this.bb.thoughtBubble.isThought,
        'bb',
        'BB'
      );
    }

    ctx.restore();
  }
}
