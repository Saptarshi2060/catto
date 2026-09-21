import React from 'react';
import { MEMORY_TOKENS } from '../game/constants';
import { X, BookHeart, Sparkles } from 'lucide-react';

interface MemoryJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedMemories: string[];
}

export const MemoryJournalModal: React.FC<MemoryJournalModalProps> = ({
  isOpen,
  onClose,
  unlockedMemories
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF5EF] text-[#3D2E28] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8D8C8] relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2D2C0]">
          <div className="flex items-center gap-2">
            <BookHeart className="w-6 h-6 text-[#DE8C4C]" />
            <h2 className="text-xl font-comfortaa font-bold text-[#4A3B32]">
              Hrick & BB's Scrapbook
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#7A6B62] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="py-2.5 flex items-center justify-between text-xs text-[#8A7568] font-comfortaa">
          <span>Memories Collected:</span>
          <span className="font-bold text-[#DE8C4C]">
            {unlockedMemories.length} / {MEMORY_TOKENS.length}
          </span>
        </div>

        {/* Memories Grid */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-3 py-2">
          {MEMORY_TOKENS.map((token) => {
            const isUnlocked = unlockedMemories.includes(token.id);

            return (
              <div
                key={token.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-white/80 border-[#E8D4BE] shadow-sm'
                    : 'bg-black/5 border-dashed border-[#D5C4B4] opacity-50'
                }`}
              >
                <div className="text-2xl p-2 rounded-lg bg-[#FDF8F3] border border-[#F0E4D5]">
                  {isUnlocked ? token.icon : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm font-comfortaa text-[#3D2E28]">
                      {isUnlocked ? token.name : 'Unknown Memory'}
                    </h3>
                    {isUnlocked && <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" />}
                  </div>
                  <p className="text-xs text-[#736055] mt-0.5 leading-relaxed font-nunito">
                    {isUnlocked
                      ? token.desc
                      : 'Play through the chapters to uncover this sweet everyday memory.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Quote */}
        <div className="pt-3 border-t border-[#E2D2C0] text-center text-xs text-[#8F7C70] italic font-story">
          “I don't want nine different lives... I want all nine with you.”
        </div>
      </div>
    </div>
  );
};
