import React, { useRef, useState, useEffect } from 'react';
import { GameEngine } from '../game/gameEngine';
import { Hand, Footprints } from 'lucide-react';

interface VirtualControlsProps {
  engine: GameEngine | null;
  activePrompt: string | null;
  onInteract: () => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({ engine, activePrompt, onInteract }) => {
  const [joystickActive, setJoystickActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  // Handle Desktop Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engine) return;
      const key = e.key.toLowerCase();

      if (key === 'a' || key === 'arrowleft') engine.input.left = true;
      if (key === 'd' || key === 'arrowright') engine.input.right = true;
      if (key === 'w' || key === 'arrowup') engine.input.up = true;
      if (key === 's' || key === 'arrowdown') engine.input.down = true;
      if (key === ' ' || key === 'shift') {
        engine.input.run = true;
        setIsRunning(true);
      }
      if (key === 'e' || key === 'enter') {
        engine.handleInteract();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!engine) return;
      const key = e.key.toLowerCase();

      if (key === 'a' || key === 'arrowleft') engine.input.left = false;
      if (key === 'd' || key === 'arrowright') engine.input.right = false;
      if (key === 'w' || key === 'arrowup') engine.input.up = false;
      if (key === 's' || key === 'arrowdown') engine.input.down = false;
      if (key === ' ' || key === 'shift') {
        engine.input.run = false;
        setIsRunning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [engine]);

  // Touch handlers for virtual joystick
  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setJoystickActive(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setJoystickActive(false);
        setKnobPos({ x: 0, y: 0 });
        if (engine) {
          engine.input.joystickVector = { x: 0, y: 0 };
        }
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current || !engine) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = rect.width / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setKnobPos({ x: dx, y: dy });

    const normalizedX = dx / maxRadius;
    const normalizedY = dy / maxRadius;
    engine.input.joystickVector = { x: normalizedX, y: normalizedY };
  };

  const toggleRun = () => {
    if (!engine) return;
    const next = !isRunning;
    setIsRunning(next);
    engine.input.run = next;
  };

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none p-4 pb-6 flex justify-between items-end select-none">
      {/* Virtual Joystick for Mobile (Left side) */}
      <div className="pointer-events-auto flex flex-col items-center">
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg relative touch-none"
        >
          <div
            className="w-12 h-12 rounded-full bg-white/80 shadow-md transition-transform duration-75 flex items-center justify-center pointer-events-none"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
            }}
          >
            <div className="w-4 h-4 rounded-full bg-[#DE8C4C]/80" />
          </div>
        </div>
        <span className="text-[10px] text-white/60 font-comfortaa mt-1 hidden sm:block">
          WASD / Touch Joystick
        </span>
      </div>

      {/* Action Buttons (Right side) */}
      <div className="pointer-events-auto flex items-end gap-3">
        {/* Sprint Toggle */}
        <button
          onClick={toggleRun}
          className={`w-12 h-12 rounded-full backdrop-blur-md border shadow-md flex flex-col items-center justify-center transition-transform active:scale-95 ${
            isRunning
              ? 'bg-[#DE8C4C] text-white border-white/40'
              : 'bg-white/20 text-white/90 border-white/30 hover:bg-white/30'
          }`}
          title="Run / Sprint"
        >
          <Footprints className="w-5 h-5" />
          <span className="text-[8px] font-bold mt-0.5">RUN</span>
        </button>

        {/* Primary Interact / Pet Button */}
        <button
          onClick={onInteract}
          className="w-16 h-16 rounded-full bg-[#E88B6E] hover:bg-[#D97A5D] active:scale-95 text-white border-2 border-white/40 shadow-xl flex flex-col items-center justify-center transition-all group"
          title="Interact or Pet Hrick"
        >
          <Hand className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-comfortaa font-bold mt-0.5">
            {activePrompt ? 'ACT [E]' : 'PET [E]'}
          </span>
        </button>
      </div>
    </div>
  );
};
