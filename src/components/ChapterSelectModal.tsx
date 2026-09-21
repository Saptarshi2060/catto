import React from 'react';
import { ChapterId } from '../types';
import { CHAPTERS } from '../game/constants';
import { X, Compass, CheckCircle2 } from 'lucide-react';

interface ChapterSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapter: ChapterId;
  highestChapter: ChapterId;
  onSelectChapter: (id: ChapterId) => void;
}

export const ChapterSelectModal: React.FC<ChapterSelectModalProps> = ({
  isOpen,
  onClose,
  currentChapter,
  highestChapter,
  onSelectChapter
}) => {
  if (!isOpen) return null;

  const chapterList = Object.values(CHAPTERS);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF5EF] text-[#3D2E28] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8D8C8] relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2D2C0]">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#DE8C4C]" />
            <h2 className="text-xl font-comfortaa font-bold text-[#4A3B32]">
              Story Chapters
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#7A6B62] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapter List */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-2.5 py-3">
          {chapterList.map((ch) => {
            const isUnlocked = ch.id <= Math.max(highestChapter, 2) || highestChapter >= 10;
            const isCurrent = ch.id === currentChapter;

            return (
              <button
                key={ch.id}
                disabled={!isUnlocked}
                onClick={() => {
                  onSelectChapter(ch.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'bg-[#DE8C4C]/15 border-[#DE8C4C] shadow-sm'
                    : isUnlocked
                    ? 'bg-white/80 border-[#E8D4BE] hover:bg-white hover:border-[#D4BC9E]'
                    : 'bg-black/5 border-dashed border-[#D5C4B4] opacity-40 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-comfortaa text-[#DE8C4C]">
                      {ch.title}
                    </span>
                    {ch.id < highestChapter && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-[#3D2E28] font-comfortaa mt-0.5">
                    {ch.subtitle}
                  </h3>
                  <p className="text-xs text-[#736055] mt-0.5 line-clamp-1">
                    {ch.description}
                  </p>
                </div>
                <div className="text-xs font-comfortaa font-semibold text-[#8A7568] pl-2 whitespace-nowrap">
                  {isCurrent ? 'Playing' : isUnlocked ? 'Replay' : 'Locked'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
