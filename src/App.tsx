/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/gameEngine';
import { ChapterId } from './types';
import { VirtualControls } from './components/VirtualControls';
import { GameHUD } from './components/GameHUD';
import { MemoryJournalModal } from './components/MemoryJournalModal';
import { ChapterSelectModal } from './components/ChapterSelectModal';
import { ChapterCompleteOverlay } from './components/ChapterCompleteOverlay';
import { EndingCinematic } from './components/EndingCinematic';
import { soundEngine } from './audio/soundEngine';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Game UI State
  const [currentChapter, setCurrentChapter] = useState<ChapterId>(1);
  const [highestChapter, setHighestChapter] = useState<ChapterId>(1);
  const [unlockedMemories, setUnlockedMemories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hrick_bb_memories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  // Modals
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [isChaptersOpen, setIsChaptersOpen] = useState(false);
  const [completedChapterInfo, setCompletedChapterInfo] = useState<{
    completed: ChapterId;
    next: ChapterId;
  } | null>(null);
  const [showEndingCinematic, setShowEndingCinematic] = useState(false);

  // Compliment Notification Toast
  const [complimentToast, setComplimentToast] = useState<string | null>(null);

  // Initialize Game Engine on Canvas Mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Canvas resize observer
    const resizeCanvas = () => {
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    const engine = new GameEngine({
      canvas,
      onChapterComplete: (completed, next) => {
        setHighestChapter((prev) => Math.max(prev, next) as ChapterId);
        // Immediately advance to next chapter so the engine loads the next level (Kitchen)!
        setCurrentChapter(next);
        if (engineRef.current) {
          engineRef.current.loadChapter(next);
        }
        if (completed === 10) {
          setShowEndingCinematic(true);
        } else {
          setCompletedChapterInfo({ completed, next });
        }
      },
      onCompliment: (text) => {
        setComplimentToast(text);
        setTimeout(() => setComplimentToast(null), 3500);
      },
      onActivePromptChange: (prompt) => {
        setActivePrompt(prompt);
      },
      onSaveState: (memories) => {
        setUnlockedMemories(memories);
        try {
          localStorage.setItem('hrick_bb_memories', JSON.stringify(memories));
        } catch {}
      }
    });

    engine.unlockedMemories = new Set(unlockedMemories);
    engineRef.current = engine;
    engine.start();

    return () => {
      resizeObserver.disconnect();
      engine.stop();
      engineRef.current = null;
    };
  }, []);

  // Sync Audio Settings
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setSoundEnabled(next);
  };

  const handleToggleMusic = () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    soundEngine.setMusicEnabled(next);
  };

  // Chapter Transitions
  const handleSelectChapter = useCallback((chId: ChapterId) => {
    setCurrentChapter(chId);
    if (engineRef.current) {
      engineRef.current.loadChapter(chId);
    }
  }, []);

  const handleContinueNextChapter = () => {
    if (!completedChapterInfo) return;
    const next = completedChapterInfo.next;
    setCompletedChapterInfo(null);
    handleSelectChapter(next);
  };

  const handleFinishEnding = () => {
    setShowEndingCinematic(false);
    handleSelectChapter(11); // Epilogue: Free Play!
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#241E2B] flex items-center justify-center select-none"
    >
      {/* 2D Game Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
      />

      {/* Minimalistic HUD */}
      <GameHUD
        currentChapter={currentChapter}
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        onToggleSound={handleToggleSound}
        onToggleMusic={handleToggleMusic}
        onOpenMemories={() => setIsMemoriesOpen(true)}
        onOpenChapters={() => setIsChaptersOpen(true)}
        activePrompt={activePrompt}
        memoryCount={unlockedMemories.length}
      />

      {/* Virtual Controls (Joystick for Mobile + Action Button) */}
      <VirtualControls
        engine={engineRef.current}
        activePrompt={activePrompt}
        onInteract={() => {
          if (engineRef.current) {
            engineRef.current.handleInteract();
          }
        }}
      />

      {/* Compliment Banner */}
      {complimentToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fade-in">
          <div className="bg-[#FAF5EF]/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#DE8C4C]/40 text-[#4A3B32] shadow-lg flex items-center gap-2 text-xs font-comfortaa font-bold">
            <span>✨</span>
            <span>Hrick: “{complimentToast}”</span>
          </div>
        </div>
      )}

      {/* Chapter Complete Overlay */}
      {completedChapterInfo && (
        <ChapterCompleteOverlay
          completedChapter={completedChapterInfo.completed}
          nextChapter={completedChapterInfo.next}
          onContinue={handleContinueNextChapter}
        />
      )}

      {/* Ending Cinematic */}
      {showEndingCinematic && (
        <EndingCinematic onFinish={handleFinishEnding} />
      )}

      {/* Memory Scrapbook Modal */}
      <MemoryJournalModal
        isOpen={isMemoriesOpen}
        onClose={() => setIsMemoriesOpen(false)}
        unlockedMemories={unlockedMemories}
      />

      {/* Chapter Select Modal */}
      <ChapterSelectModal
        isOpen={isChaptersOpen}
        onClose={() => setIsChaptersOpen(false)}
        currentChapter={currentChapter}
        highestChapter={highestChapter}
        onSelectChapter={handleSelectChapter}
      />
    </div>
  );
}
