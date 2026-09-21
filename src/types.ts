export type ChapterId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11; 
// 10 = All Nine Lives (Climax), 11 = Epilogue (Free Play)

export type GameLocation = 'street_rain' | 'living_room' | 'kitchen' | 'bathroom' | 'bedroom' | 'neighborhood' | 'cat_cafe' | 'veranda_night';

export type WeatherType = 'rain' | 'clear' | 'sunset' | 'night' | 'indoor';

export interface Vector2D {
  x: number;
  y: number;
}

export type BBAnimation = 
  | 'idle' 
  | 'walk' 
  | 'run' 
  | 'sit' 
  | 'crouch' 
  | 'pet' 
  | 'carry' 
  | 'feed' 
  | 'bath' 
  | 'dry' 
  | 'cuddle' 
  | 'sleep' 
  | 'tired' 
  | 'surprised'
  | 'laugh'
  | 'throw';

export type HrickAnimation = 
  | 'idle' 
  | 'walk' 
  | 'run' 
  | 'sit' 
  | 'sleep' 
  | 'curled' 
  | 'stretch' 
  | 'yawn' 
  | 'groom' 
  | 'eat' 
  | 'rub' 
  | 'purr'
  | 'bath_scared' 
  | 'shake_water' 
  | 'fluffy_sleep' 
  | 'on_lap' 
  | 'pounce' 
  | 'in_box' 
  | 'sick_bed' 
  | 'bring_gift' 
  | 'curious' 
  | 'zoomies';

export interface SpeechBubble {
  id: string;
  speaker: 'hrick' | 'bb' | 'cafe_cat';
  speakerName?: string;
  text: string;
  duration: number; // in seconds
  elapsed: number;
  offsetY?: number;
  isThought?: boolean;
}

export interface ToyItem {
  id: string;
  type: 'yarn' | 'feather' | 'mouse' | 'ball' | 'box';
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isHeld?: boolean;
  isInPlay?: boolean;
}

export interface InteractiveObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  prompt: string;
  actionType: string;
  icon?: string;
  data?: any;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'rain' | 'splash' | 'steam' | 'leaf' | 'petal' | 'purr' | 'memory' | 'dust' | 'sparkle' | 'heart';
  rotation?: number;
  vRot?: number;
  opacity?: number;
}

export interface ChapterInfo {
  id: ChapterId;
  title: string;
  subtitle: string;
  description: string;
  defaultLocation: GameLocation;
  weather: WeatherType;
}

export interface GameSaveState {
  currentChapter: ChapterId;
  highestChapter: ChapterId;
  soundEnabled: boolean;
  musicEnabled: boolean;
  unlockedMemories: string[];
  complimentsReceived: number;
  freePlayUnlocked: boolean;
}
