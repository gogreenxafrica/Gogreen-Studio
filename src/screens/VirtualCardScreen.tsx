import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { AppScreen } from '../../types';
import { BackHeader } from '../components/BackHeader';
import { Icons } from '../../components/Icons';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';

import { useAppContext } from '../../AppContext';

export const VirtualCardScreen: React.FC<{ setScreen: (screen: AppScreen) => void }> = ({ setScreen }) => {
  const { goBack } = useAppContext();
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleJoinWaitlist = () => {
    if (acceptedTerms) {
      setIsOnWaitlist(true);
      setShowWaitlistModal(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-in items-center w-full h-full overflow-hidden min-h-0 box-border relative">
      <div className="w-full max-w-md flex flex-col h-full mx-auto overflow-x-hidden box-border">
        <BackHeader title="Virtual Card" onBack={goBack} />
        
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 w-full box-border px-5 pt-6">
          
          {/* Card Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl mb-10 bg-[#121212] border border-white/10 group"
          >
            {/* Noise Texture for Matte Finish */}
            <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            
            {/* Subtle Glowing Orbs (Premium Dark) */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px]"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[60px]"></div>
            
            {/* Concentric Circles Pattern (Glossy Black Effect) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square opacity-60 mix-blend-overlay" style={{ backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 8px, rgba(0,0,0,0.8) 8px, rgba(0,0,0,0.8) 16px)` }}></div>
            
            {/* Metallic Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5"></div>
            
            {/* Card Content */}
            <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="text-white/50 font-medium tracking-widest text-[10px] uppercase">Virtual Card</div>
                <img src="/assets/logos/gogreen-full-text-logo-white.png" alt="GoGreen" className="h-6 object-contain opacity-90 drop-shadow-md" />
              </div>
              
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-3">
                  {/* Chip */}
                  <div className="w-11 h-8 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded flex items-center justify-center overflow-hidden border border-gray-400/50 shadow-sm relative">
                    <div className="absolute inset-0 opacity-40">
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-black stroke-[2.5]">
                        <path d="M 20 0 L 20 100 M 80 0 L 80 100 M 0 35 L 100 35 M 0 65 L 100 65 M 20 35 L 50 50 L 80 35 M 20 65 L 50 50 L 80 65" />
                      </svg>
                    </div>
                  </div>
                  {/* Contactless Icon */}
                  <div className="flex gap-1 ml-1 opacity-60">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.5 14c-.3-.6-.5-1.3-.5-2s.2-1.4.5-2" />
                      <path d="M11.5 16.5c-.8-1.4-1.2-3-1.2-4.5s.4-3.1 1.2-4.5" />
                      <path d="M14.5 19c-1.3-2.1-2-4.5-2-7s.7-4.9 2-7" />
                      <path d="M17.5 21.5c-1.8-2.8-2.7-6.1-2.7-9.5s.9-6.7 2.7-9.5" />
                    </svg>
                  </div>
                </div>
                
                {/* Visa Logo */}
                <div className="text-gray-200 font-black text-3xl italic tracking-widest drop-shadow-md">VISA</div>
              </div>
            </div>
          </motion.div>

          {/* Coming Soon Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Coming soon!</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Icons.Gift className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-gray-700 font-medium text-sm">Earn cashback everytime you use the card</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Icons.CreditCard className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-gray-700 font-medium text-sm">Get the virtual card instantly in your wallet</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Icons.Globe className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-gray-700 font-medium text-sm">Save on FX fees when traveling</p>
              </div>
            </div>
          </div>

          {/* Waitlist Button */}
          <div className="mt-auto mb-10">
            {isOnWaitlist ? (
              <div className="w-full h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 font-black uppercase tracking-widest text-sm">
                You're in
              </div>
            ) : (
              <Button 
                variant="primary" 
                onClick={() => setShowWaitlistModal(true)}
                className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
              >
                Join Waitlist
              </Button>
            )}
          </div>

          {/* Card Carousel Section */}
          <div className="pb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Exclusive Designs</h3>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                <div className="w-1 h-1 rounded-full bg-gray-200"></div>
              </div>
            </div>
            
            <div 
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'}`}
            >
              {/* Card 1: Emerald Fusion (Matte Black + Glossy Circles) */}
              <div className="min-w-[280px] aspect-[1.586/1] rounded-2xl overflow-hidden shadow-lg bg-[#121212] border border-white/10 snap-center relative shrink-0 active:scale-[0.98] transition-transform">
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[40px]"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-[40px]"></div>
                <div className="absolute inset-0 opacity-60 mix-blend-overlay" style={{ backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 6px, rgba(0,0,0,0.8) 6px, rgba(0,0,0,0.8) 12px)` }}></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5"></div>
                
                <div className="relative z-10 h-full p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-white/40 font-medium tracking-[0.2em] text-[8px] uppercase">Emerald Fusion</div>
                    <img src="/assets/logos/gogreen-full-text-logo-white.png" alt="GoGreen" className="h-4 object-contain opacity-90" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-8 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-sm border border-gray-400/50 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full opacity-40">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-black stroke-[3]">
                          <path d="M 20 0 L 20 100 M 80 0 L 80 100 M 0 35 L 100 35 M 0 65 L 100 65 M 20 35 L 50 50 L 80 35 M 20 65 L 50 50 L 80 65" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-gray-200 font-black text-lg italic tracking-widest">VISA</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Midnight Aurora (Matte Black + Glossy Dots) */}
              <div className="min-w-[280px] aspect-[1.586/1] rounded-2xl overflow-hidden shadow-lg bg-[#121212] border border-white/10 snap-center relative shrink-0 active:scale-[0.98] transition-transform">
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-[40px]"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-[40px]"></div>
                <div className="absolute inset-0 opacity-60 mix-blend-overlay" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.8) 2px, transparent 0)`, backgroundSize: '12px 12px' }}></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5"></div>
                
                <div className="relative z-10 h-full p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-white/40 font-medium tracking-[0.2em] text-[8px] uppercase">Midnight Aurora</div>
                    <img src="/assets/logos/gogreen-full-text-logo-white.png" alt="GoGreen" className="h-4 object-contain opacity-90" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-8 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-sm border border-gray-400/50 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full opacity-40">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-black stroke-[3]">
                          <path d="M 20 0 L 20 100 M 80 0 L 80 100 M 0 35 L 100 35 M 0 65 L 100 65 M 20 35 L 50 50 L 80 35 M 20 65 L 50 50 L 80 65" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-gray-200 font-black text-lg italic tracking-widest">VISA</div>
                  </div>
                </div>
              </div>

              {/* Card 3: Solar Flare (Matte Black + Glossy Rays) */}
              <div className="min-w-[280px] aspect-[1.586/1] rounded-2xl overflow-hidden shadow-lg bg-[#121212] border border-white/10 snap-center relative shrink-0 active:scale-[0.98] transition-transform">
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-[40px]"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-[40px]"></div>
                <div className="absolute inset-0 opacity-60 mix-blend-overlay" style={{ backgroundImage: `repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(0,0,0,0.8) 10deg 20deg)` }}></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5"></div>
                
                <div className="relative z-10 h-full p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-white/40 font-medium tracking-[0.2em] text-[8px] uppercase">Solar Flare</div>
                    <img src="/assets/logos/gogreen-full-text-logo-white.png" alt="GoGreen" className="h-4 object-contain opacity-90" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-8 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-sm border border-gray-400/50 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full opacity-40">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-black stroke-[3]">
                          <path d="M 20 0 L 20 100 M 80 0 L 80 100 M 0 35 L 100 35 M 0 65 L 100 65 M 20 35 L 50 50 L 80 35 M 20 65 L 50 50 L 80 65" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-gray-200 font-black text-lg italic tracking-widest">VISA</div>
                  </div>
                </div>
              </div>

              {/* Card 4: Emerald Platinum (Matte Black + Brushed Metal) */}
              <div className="min-w-[280px] aspect-[1.586/1] rounded-2xl overflow-hidden shadow-lg bg-[#121212] border border-white/10 snap-center relative shrink-0 active:scale-[0.98] transition-transform">
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[40px]"></div>
                <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)` }}></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 transform -skew-x-12 translate-x-1/3"></div>
                
                <div className="relative z-10 h-full p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-white/40 font-medium tracking-[0.2em] text-[8px] uppercase">Emerald Platinum</div>
                    <img src="/assets/logos/gogreen-full-text-logo-white.png" alt="GoGreen" className="h-4 object-contain opacity-90" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-8 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-sm border border-gray-400/50 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full opacity-40">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-black stroke-[3]">
                          <path d="M 20 0 L 20 100 M 80 0 L 80 100 M 0 35 L 100 35 M 0 65 L 100 65 M 20 35 L 50 50 L 80 35 M 20 65 L 50 50 L 80 65" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-gray-200 font-black text-lg italic tracking-widest">VISA</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 mt-4 text-center font-bold uppercase tracking-widest animate-pulse">Swipe to preview styles</p>
          </div>
        </div>
      </div>

      {/* Waitlist Terms Modal */}
      <BottomSheet isOpen={showWaitlistModal} onClose={() => setShowWaitlistModal(false)} title="Waitlist Terms">
        <div className="p-6 space-y-6 pb-10">
          <p className="text-gray-600 text-sm leading-relaxed">
            By joining the waitlist for the GoGreen Virtual Card, you agree to receive updates and promotional materials regarding the card's launch. 
            Joining the waitlist does not guarantee immediate access upon launch, as rollout may be phased.
          </p>
          
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input 
                type="checkbox" 
                className="peer sr-only"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                <Icons.Check className={`w-3.5 h-3.5 text-white transition-opacity ${acceptedTerms ? 'opacity-100' : 'opacity-0'}`} />
              </div>
            </div>
            <span className="text-sm text-gray-700 font-medium select-none group-hover:text-gray-900 transition-colors">
              I accept the terms and conditions for the GoGreen Virtual Card waitlist.
            </span>
          </label>

          <Button 
            variant="primary" 
            onClick={handleJoinWaitlist}
            disabled={!acceptedTerms}
            className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${acceptedTerms ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-gray-100 text-gray-400'}`}
          >
            Confirm
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
};
