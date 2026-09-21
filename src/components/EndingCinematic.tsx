import React, { useEffect, useState } from 'react';
import { MEMORY_TOKENS } from '../game/constants';
import { Heart, Home } from 'lucide-react';

interface EndingCinematicProps {
  onFinish: () => void;
}

export const EndingCinematic: React.FC<EndingCinematicProps> = ({ onFinish }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000),  // "BB..."
      setTimeout(() => setStep(2), 3500),  // "If cats really get nine lives..."
      setTimeout(() => setStep(3), 7500),  // "I don't want nine different lives..."
      setTimeout(() => setStep(4), 11500), // "...with you. All nine."
      setTimeout(() => setStep(5), 15500), // Memories floating
      setTimeout(() => setStep(6), 20500), // Final quote
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C1A]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white select-none transition-all duration-1000">
      {/* Dialogue progression */}
      {step >= 1 && step < 5 && (
        <div className="max-w-md space-y-4 animate-fade-in">
          <p className="text-xl sm:text-2xl font-comfortaa text-[#FFE6A7] font-semibold">
            {step === 1 && "“BB...”"}
            {step === 2 && "“If cats really get nine lives...”"}
            {step === 3 && "“I don't want nine different lives.”"}
            {step === 4 && "“I want the same one... with you. All nine.”"}
          </p>
          <div className="flex justify-center">
            <Heart className="w-6 h-6 text-[#E76F51] animate-pulse" />
          </div>
        </div>
      )}

      {/* Memories floating showcase */}
      {step === 5 && (
        <div className="max-w-lg space-y-6 animate-fade-in">
          <h2 className="text-sm tracking-widest text-[#DE8C4C] font-comfortaa uppercase">
            Nine Lives of Everyday Love
          </h2>
          <div className="grid grid-cols-5 gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
            {MEMORY_TOKENS.map((token) => (
              <div key={token.id} className="flex flex-col items-center p-2 rounded-lg bg-white/5">
                <span className="text-2xl">{token.icon}</span>
                <span className="text-[10px] text-white/70 font-comfortaa mt-1 text-center line-clamp-1">
                  {token.name}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-white/80 font-story italic">
            “The little shelter, the first warm meal, fluffy baths, bird shows, and cardboard boxes...”
          </p>
        </div>
      )}

      {/* Final Chapter Card */}
      {step >= 6 && (
        <div className="max-w-md space-y-6 animate-fade-in">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-comfortaa text-[#FFE6A7] leading-relaxed">
              “Thank you for finding me, BB.”
            </h1>
            <p className="text-lg font-story italic text-[#F4A261]">
              “I'll spend all nine lives finding my way back to you.”
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={onFinish}
              className="px-6 py-3 rounded-full bg-[#E88B6E] hover:bg-[#D97A5D] text-white font-comfortaa font-bold shadow-lg shadow-black/40 flex items-center gap-2 mx-auto active:scale-95 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Begin Free-Play: Just Another Day with Hrick</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
