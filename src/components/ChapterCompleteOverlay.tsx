import React, { useEffect } from 'react';
import { ChapterId } from '../types';
import { CHAPTERS } from '../game/constants';
import { Heart, ArrowRight } from 'lucide-react';

interface ChapterCompleteOverlayProps {
  completedChapter: ChapterId;
  nextChapter: ChapterId;
  onContinue: () => void;
}

export const ChapterCompleteOverlay: React.FC<ChapterCompleteOverlayProps> = ({
  completedChapter,
  nextChapter,
  onContinue
}) => {
  const currentInfo = CHAPTERS[completedChapter];
  const nextInfo = CHAPTERS[nextChapter];

  // Auto-dismiss after 3.5 seconds, or on any Space / Enter key
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3800);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape' || e.key.toLowerCase() === 'e') {
        onContinue();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onContinue]);

  const buttonLabel = nextChapter === 2 ? 'Step Inside The Kitchen 🐾' : 'Continue Journey';

  return (
    <div
      onClick={onContinue}
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF5EF] text-[#3D2E28] rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-[#E8D8C8] space-y-4 animate-scale-up"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-[#DE8C4C]/15 flex items-center justify-center text-[#DE8C4C]">
          <Heart className="w-7 h-7 fill-[#DE8C4C]" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#DE8C4C] font-comfortaa">
            Chapter Complete
          </span>
          <h2 className="text-xl font-bold font-comfortaa text-[#3D2E28] mt-1">
            {currentInfo.subtitle}
          </h2>
        </div>

        <div className="p-3.5 bg-black/5 rounded-2xl text-left border border-black/5">
          <span className="text-[11px] font-bold text-[#8A7568] font-comfortaa block">
            NEXT: {nextInfo.title}
          </span>
          <h3 className="font-bold text-sm text-[#4A3B32] font-comfortaa mt-0.5">
            {nextInfo.subtitle}
          </h3>
          <p className="text-xs text-[#736055] mt-1 line-clamp-2">
            {nextInfo.description}
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3 rounded-full bg-[#E88B6E] hover:bg-[#D97A5D] text-white font-comfortaa font-bold shadow-lg shadow-black/10 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span>{buttonLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
