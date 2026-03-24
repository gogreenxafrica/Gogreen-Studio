import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppScreen } from '../../types';
import { Button } from '../../components/Button';
import { MousePointer2 } from 'lucide-react';

interface TutorialStep {
  targetId?: string; // ID of the element to highlight
  highlightMultipleIds?: string[]; // IDs of multiple elements to highlight
  demoImage?: string; // URL of the demo image/screenshot
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'center';
  screenToNavigate?: AppScreen; // Screen to navigate to before showing this step
  showPointer?: boolean; // Whether to show a pointing hand animation
}

const WELCOME_TOUR: TutorialStep[] = [
  {
    title: "Welcome to Gogreen!",
    description: "Your all-in-one crypto and finance hub. Let's get you started.",
    position: 'center'
  },
  {
    targetId: 'quick-actions-grid',
    title: "Quick Actions",
    description: "Access all our services like Bill Payments, Earn Money, and more here.",
    position: 'bottom'
  },
  {
    targetId: 'tutorial-add-money',
    title: "Add Money",
    description: "Fund your wallet instantly via bank transfer or card to start trading.",
    position: 'bottom'
  },
  {
    targetId: 'wallet-balance-card',
    title: "Naira Wallet",
    description: "This is your main Naira balance. You can hide it by tapping the amount.",
    position: 'bottom'
  },
  {
    targetId: 'tutorial-sell-crypto',
    title: "Sell Crypto",
    description: "Convert your Bitcoin, Ethereum, or USDT to Naira instantly at the best rates.",
    position: 'bottom',
    screenToNavigate: AppScreen.RATES,
    highlightMultipleIds: ['tutorial-sell-crypto-0', 'tutorial-sell-crypto-1']
  },
  {
    title: "One More Thing...",
    description: "Let's check out a powerful feature in your profile.",
    position: 'center',
    screenToNavigate: AppScreen.ME
  },
  {
    targetId: 'tutorial-auto-withdrawal',
    title: "Auto-Withdrawal",
    description: "Enable this to automatically send all crypto sales directly to your bank account. Try toggling it!",
    position: 'bottom',
    screenToNavigate: AppScreen.PAYMENT_SETTINGS,
    showPointer: true
  }
];

interface TutorialOverlayProps {
  onComplete: () => void;
  onNavigate?: (screen: AppScreen) => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete, onNavigate }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const steps = WELCOME_TOUR;

  useEffect(() => {
    const step = steps?.[currentStepIndex];
    
    if (step?.screenToNavigate && onNavigate) {
      onNavigate(step.screenToNavigate);
    }

    if (step?.targetId) {
      // Small delay to allow navigation/rendering to complete
      const timer = setTimeout(() => {
        const element = document.getElementById(step.targetId!);
        if (element) {
          setTargetRect(element.getBoundingClientRect());
        } else {
          setTargetRect(null);
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setTargetRect(null);
    }
  }, [currentStepIndex, steps, onNavigate]);

  if (!steps || steps.length === 0) {
    onComplete();
    return null;
  }

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const [rects, setRects] = useState<DOMRect[]>([]);

  useEffect(() => {
    const step = steps?.[currentStepIndex];
    
    if (step?.screenToNavigate && onNavigate) {
      onNavigate(step.screenToNavigate);
    }

    const timer = setTimeout(() => {
        const targetIds = step?.highlightMultipleIds || (step?.targetId ? [step.targetId] : []);
        const newRects = targetIds.map(id => document.getElementById(id)?.getBoundingClientRect()).filter(Boolean) as DOMRect[];
        setRects(newRects);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStepIndex, steps, onNavigate]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden">
      {/* Backdrop with Hole for Spotlight */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {rects.map((rect, i) => (
              <rect 
                key={i}
                x={rect.left - 12} 
                y={rect.top - 12} 
                width={rect.width + 24} 
                height={rect.height + 24} 
                fill="black" 
                rx="16"
              />
            ))}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.4)" mask="url(#spotlight-mask)" />
      </svg>
      
      {/* Clickable area to advance */}
      <div className="absolute inset-0 z-[101]" onClick={handleNext} />
      
      {/* Spotlight Border */}
      {rects.length > 0 && !currentStep.demoImage && (
        <>
          {currentStep.showPointer && (
            <motion.div
              className="fixed z-[105] text-primary pointer-events-none"
              initial={{ opacity: 0, x: 20, y: 20 }}
              animate={{ 
                opacity: 1,
                x: rects[0].left + rects[0].width / 2,
                y: rects[0].top + rects[0].height / 2,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  x: [0, -10, 0],
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <MousePointer2 className="w-8 h-8 fill-primary stroke-white stroke-[2px]" />
              </motion.div>
            </motion.div>
          )}
        </>
      )}

      {/* Demo Image */}
      <AnimatePresence>
        {currentStep.demoImage && (
          <motion.div
            className="fixed z-[103] inset-0 flex items-center justify-center p-6 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <div className="relative max-w-[280px] w-full aspect-[9/16] bg-white rounded-[32px] shadow-2xl border-4 border-white/20 overflow-hidden">
               <img src={currentStep.demoImage} alt="Demo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative z-[104] flex-1 flex flex-col p-6 pointer-events-none ${currentStep.position === 'top' ? 'justify-start pt-20' : currentStep.position === 'bottom' ? 'justify-end pb-24' : 'justify-center'}`}>
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-[32px] p-6 shadow-2xl border border-primary/10 relative overflow-hidden max-w-sm mx-auto w-full pointer-events-auto"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="font-black text-sm">{currentStepIndex + 1}/{steps.length}</span>
              </div>
              <button onClick={handleSkip} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600">
                Skip
              </button>
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">{currentStep.title}</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
              {currentStep.description}
            </p>

            <div className="flex gap-3">
              <Button onClick={handleNext} className="!h-12 !text-xs">
                {currentStepIndex === steps.length - 1 ? "Get Started" : "Next"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
