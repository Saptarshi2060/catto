import React from 'react';
import { ChapterId } from '../types';
import { CHAPTERS } from '../game/constants';
import { soundEngine } from '../audio/soundEngine';
import { Volume2, VolumeX, Music, Music2, BookHeart, Compass } from 'lucide-react';

interface GameHUDProps {
  currentChapter: ChapterId;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenMemories: () => void;
  onOpenChapters: () => void;
  activePrompt: string | null;
  memoryCount: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentChapter,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onOpenMemories,
  onOpenChapters,
  activePrompt,
  memoryCount
}) => {
  const ch = CHAPTERS[currentChapter];

  return (
    <div className="absolute inset-0 pointer-events-none p-3 sm:p-5 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        {/* Chapter Title Card */}
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md text-white rounded-2xl px-4 py-2.5 border border-white/15 shadow-lg max-w-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#F4A261] font-comfortaa">
              {ch.title}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="text-[10px] text-white/60 font-comfortaa">
              {currentChapter === 11 ? 'Free Play' : `${currentChapter}/10`}
            </span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-white font-comfortaa leading-tight mt-0.5">
            {ch.subtitle}
          </h1>
          <p className="text-[11px] text-white/70 font-nunito mt-0.5 line-clamp-1">
            {ch.description}
          </p>
        </div>

        {/* Action Controls (Top Right) */}
        <div className="pointer-events-auto flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-2xl p-1.5 border border-white/15 shadow-lg">
          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl transition-all ${
              soundEnabled ? 'text-white hover:bg-white/20' : 'text-white/40 hover:bg-white/10'
            }`}
            title={soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Music Toggle */}
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-xl transition-all ${
              musicEnabled ? 'text-[#F4A261] hover:bg-white/20' : 'text-white/40 hover:bg-white/10'
            }`}
            title={musicEnabled ? 'Mute Music' : 'Play Music'}
          >
            {musicEnabled ? <Music className="w-4 h-4" /> : <Music2 className="w-4 h-4" />}
          </button>

          {/* Scrapbook / Memories */}
          <button
            onClick={onOpenMemories}
            className="p-2 rounded-xl text-white hover:bg-white/20 transition-all relative"
            title="Open Memory Scrapbook"
          >
            <BookHeart className="w-4 h-4" />
            {memoryCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#DE8C4C] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-black/40">
                {memoryCount}
              </span>
            )}
          </button>

          {/* Chapter Select */}
          <button
            onClick={onOpenChapters}
            className="p-2 rounded-xl text-white hover:bg-white/20 transition-all"
            title="Select Chapter"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Context Tooltip (Floating above bottom controls) */}
      {activePrompt && (
        <div className="self-center mb-24 pointer-events-auto">
          <div className="bg-[#FAF5EF]/95 backdrop-blur-md text-[#3D2E28] rounded-full px-5 py-2 shadow-xl border border-[#DE8C4C]/40 text-xs sm:text-sm font-comfortaa font-semibold flex items-center gap-2 animate-bounce">
            <span className="text-base">🐾</span>
            <span>{activePrompt}</span>
          </div>
        </div>
      )}
    </div>
  );
};
