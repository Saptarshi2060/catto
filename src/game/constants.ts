import { ChapterId, ChapterInfo, GameLocation } from '../types';

export const CHAPTERS: Record<ChapterId, ChapterInfo> = {
  1: {
    id: 1,
    title: "Chapter 1",
    subtitle: "The Day Hrick Found BB",
    description: "A rainy evening. Under a lonely bus shelter sits a tiny shivering stray cat.",
    defaultLocation: "street_rain",
    weather: "rain"
  },
  2: {
    id: 2,
    title: "Chapter 2",
    subtitle: "First Meal",
    description: "Hrick's little tummy is rumbling. Help BB prepare his very first warm dinner in the kitchen.",
    defaultLocation: "kitchen",
    weather: "indoor"
  },
  3: {
    id: 3,
    title: "Chapter 3",
    subtitle: "Bath Time",
    description: "Hrick is covered in street mud. He senses the bathtub and bolts!",
    defaultLocation: "bathroom",
    weather: "indoor"
  },
  4: {
    id: 4,
    title: "Chapter 4",
    subtitle: "The Couch",
    description: "A quiet evening on the living room sofa with hot tea and cozy TV.",
    defaultLocation: "living_room",
    weather: "sunset"
  },
  5: {
    id: 5,
    title: "Chapter 5",
    subtitle: "Playtime",
    description: "Yarn, feather toys, mice, and of course... the irresistible cardboard box.",
    defaultLocation: "living_room",
    weather: "indoor"
  },
  6: {
    id: 6,
    title: "Chapter 6",
    subtitle: "A Little Outing",
    description: "With his cute mint collar on, Hrick and BB explore the gentle neighborhood path.",
    defaultLocation: "neighborhood",
    weather: "clear"
  },
  7: {
    id: 7,
    title: "Chapter 7",
    subtitle: "The Cat Café",
    description: "Visiting the neighborhood cat cafe to meet Mochi, Pepper, Barnaby, and Cleo.",
    defaultLocation: "cat_cafe",
    weather: "clear"
  },
  8: {
    id: 8,
    title: "Chapter 8",
    subtitle: "Sick Day",
    description: "Hrick is feeling under the weather. Tender care, warm broth, and gentle pets.",
    defaultLocation: "bedroom",
    weather: "indoor"
  },
  9: {
    id: 9,
    title: "Chapter 9",
    subtitle: "BB's Day",
    description: "BB had a long exhausting day. Now it's Hrick's turn to take care of his favorite human.",
    defaultLocation: "living_room",
    weather: "sunset"
  },
  10: {
    id: 10,
    title: "Final Chapter",
    subtitle: "All Nine Lives",
    description: "Sitting together under the quiet night sky as Hrick makes his sweetest promise.",
    defaultLocation: "veranda_night",
    weather: "night"
  },
  11: {
    id: 11,
    title: "Epilogue",
    subtitle: "Just Another Day with Hrick",
    description: "Free-play life simulation mode. Explore, cuddle, play, feed, and discover everyday cat antics forever.",
    defaultLocation: "living_room",
    weather: "clear"
  }
};

export const HRICK_COMPLIMENTS: Record<string, string[]> = {
  puzzle: ["Smart human.", "I knew you were clever."],
  caring: ["You're really caring.", "Very good human.", "You have a gentle heart."],
  kind: ["Kind heart.", "BB is the sweetest."],
  dress: ["Okay...", "Why do you make everything cute?", "I look majestic, don't I?"],
  mirror: ["Pretty.", "Obviously.", "Best looking human in town."],
  funny: ["My favorite human is ridiculous.", "Hehe, you silly bean."],
  difficult: ["See?", "I knew you could do it.", "Proud of my human."],
  sit: ["Best seat.", "Saved this spot for you."],
  cuddle: ["Don't stop.", "Maximum comfort achieved.", "Prrrrr..."],
  feed: ["Excellent human.", "Five star service.", "Delicious. Human approved."],
  comfort: ["You're very loving.", "I think I got lucky.", "Best human in the universe."]
};

export const MEMORY_TOKENS = [
  { id: "shelter", name: "Rainy Shelter", desc: "Where BB and Hrick first touched hands", icon: "☂️" },
  { id: "bowl", name: "Ceramic Food Bowl", desc: "The meal that sealed the deal: 'I'm keeping you.'", icon: "🍲" },
  { id: "towel", name: "Fluffy Yellow Towel", desc: "From dramatic bath escapee to cozy cloud", icon: "🛁" },
  { id: "tv", name: "Couch & Remote", desc: "Watching bird shows and falling asleep on BB's lap", icon: "📺" },
  { id: "box", name: "Cardboard Box", desc: "Ignored the expensive toys for the holy box", icon: "📦" },
  { id: "collar", name: "Mint Little Collar", desc: "First big adventure outside chasing butterflies", icon: "🎀" },
  { id: "cafe", name: "Cat Café Cup", desc: "'I met everyone. But you're still my favorite.'", icon: "☕" },
  { id: "blanket", name: "Fleece Blanket", desc: "Sick day comfort broth and warm cuddles", icon: "🧣" },
  { id: "sock", name: "Sock & Mouse", desc: "Hrick's clumsy attempts to cheer up tired BB", icon: "🧦" },
  { id: "ninelives", name: "All Nine Lives", desc: "'I don't want 9 different lives. I want all 9 with you.'", icon: "✨" }
];

export const CAFE_CATS = [
  { id: "mochi", name: "Mochi", color: "#FDF0D5", personality: "sleepy", x: 190, y: 310 },
  { id: "pepper", name: "Pepper", color: "#3A3636", personality: "playful", x: 420, y: 260 },
  { id: "barnaby", name: "Barnaby", color: "#C08A3E", personality: "grumpy", x: 680, y: 340 },
  { id: "cleo", name: "Cleo", color: "#E0A899", personality: "friendly", x: 860, y: 280 }
];

export const TV_SHOWS = [
  { id: "birds", name: "Feathered Friends Bird Watch", catInterest: "high", desc: "Chirping sparrows flitting between berry branches." },
  { id: "cooking", name: "Cozy Baking with Grandma", catInterest: "medium", desc: "Warm pastries baking in a sunny country kitchen." },
  { id: "fish", name: "Aquarium Deep Blue Sea", catInterest: "high", desc: "Bright clownfish swimming back and forth behind the glass." },
  { id: "weather", name: "Local Evening Weather Forecast", catInterest: "low", desc: "The meteorologist droning on about tomorrow's humidity." }
];
