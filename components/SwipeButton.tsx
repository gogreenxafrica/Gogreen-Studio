
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SwipeButtonProps {
  onComplete: () => void;
  text: string;
}

export const SwipeButton = ({ onComplete, text }: SwipeButtonProps) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);

  const handleStart = (clientX: number) => {
    if (isFinished) return;
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || !containerRef.current || !handleRef.current || isFinished) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const handleWidth = handleRef.current.offsetWidth;
    const maxDrag = containerRect.width - handleWidth - 16; // 16px total horizontal padding
    
    // Swiping to the RIGHT:
    let delta = clientX - startXRef.current;
    delta = Math.max(0, Math.min(delta, maxDrag));
    
    setDragX(delta);

    // Auto-complete if dragged far enough (85% of max)
    if (delta > maxDrag * 0.85) {
      setIsFinished(true);
      setIsDragging(false);
      setDragX(maxDrag);
      onComplete();
    }
  }, [isDragging, isFinished, onComplete]);

  const handleEnd = useCallback(() => {
    if (isFinished) return;
    setIsDragging(false);
    
    if (dragX > 0) {
      // Snap back if not finished
      setDragX(0);
    }
  }, [dragX, isFinished]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchend', onEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-16 bg-white border border-gray-200 rounded-full flex items-center p-1.5 shadow-inner relative overflow-hidden select-none touch-none group"
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-100/50 to-transparent pointer-events-none" />
      
      {/* Swipe Handle */}
      <div 
        ref={handleRef}
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        style={{ 
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 cursor-grab active:cursor-grabbing relative z-20 group-hover:scale-[1.02] transition-transform"
      >
        {isFinished ? (
          <img 
            src="/assets/logos/gogreen-white-logomark.png" 
            alt="Processing..." 
            className="w-6 h-6 animate-spin object-contain" 
          />
        ) : (
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            viewBox="0 0 24 24"
          >
            <path d="M13 17l5-5-5-5M6 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Text track */}
      <div 
        className="flex-1 text-primary font-bold uppercase text-[10px] tracking-wider pr-12 text-center relative z-10 transition-opacity duration-300 select-none"
        style={{ opacity: 1 - (dragX / 100) }}
      >
        {text}
      </div>
    </div>
  );
};
