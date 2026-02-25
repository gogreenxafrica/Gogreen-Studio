
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CaptchaProps {
  onVerify: () => void;
  isVerified: boolean;
}

export const SlideCaptcha = ({ onVerify, isVerified }: CaptchaProps) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);

  const handleStart = (clientX: number) => {
    if (isVerified) return;
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || !containerRef.current || !handleRef.current || isVerified) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const handleWidth = handleRef.current.offsetWidth;
    const maxDrag = containerRect.width - handleWidth - 8; // Adjust for padding
    
    let delta = clientX - startXRef.current;
    delta = Math.max(0, Math.min(delta, maxDrag));
    
    setDragX(delta);

    if (delta > maxDrag * 0.95) {
      setIsDragging(false);
      setDragX(maxDrag);
      onVerify();
    }
  }, [isDragging, isVerified, onVerify]);

  const handleEnd = useCallback(() => {
    if (isVerified) return;
    setIsDragging(false);
    if (dragX < (containerRef.current?.offsetWidth || 0) * 0.9) {
      setDragX(0);
    }
  }, [dragX, isVerified]);

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
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Bot Verification</label>
      <div 
        ref={containerRef}
        className={`w-full h-14 bg-white/5 border ${isVerified ? 'border-primary/50' : 'border-white/10'} rounded-[20px] flex items-center p-1 relative overflow-hidden select-none touch-none transition-colors duration-300`}
      >
        <div className={`absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] pointer-events-none transition-opacity duration-300 ${isVerified ? 'text-primary' : 'text-white/20'}`}>
          {isVerified ? 'Verified' : 'Slide to verify'}
        </div>
        
        <div 
          ref={handleRef}
          onMouseDown={(e) => handleStart(e.clientX)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          style={{ 
            transform: `translateX(${dragX}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className={`w-12 h-full rounded-[16px] flex items-center justify-center text-white shadow-lg cursor-grab active:cursor-grabbing relative z-10 transition-colors duration-300 ${isVerified ? 'bg-primary' : 'bg-primary/40'}`}
        >
          {isVerified ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M13 5l7 7-7 7M5 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </div>
      </div>
    </div>
  );
};
