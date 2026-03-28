import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { AppScreen } from '../../types';
import { Icons } from '../../components/Icons';

const TABS = [
  { id: AppScreen.HOME, label: 'Home', icon: Icons.Home },
  { id: AppScreen.SERVICES, label: 'Services', icon: Icons.Grid },
  { id: AppScreen.TRANSACTION_HISTORY, label: 'History', icon: Icons.History },
  { id: AppScreen.CHAT, label: 'Chat', icon: Icons.MessageSquare },
  { id: AppScreen.ME, label: 'More', icon: Icons.MoreHorizontal },
];

export const FloatingNavBar: React.FC<{ currentScreen: AppScreen, activeTab: AppScreen, onNavigate: (screen: AppScreen, isFromNavBar?: boolean) => void, disabled?: boolean }> = ({ currentScreen, activeTab, onNavigate, disabled }) => {
  const activeIndex = useMemo(() => TABS.findIndex(tab => tab.id === activeTab), [activeTab]);

  const handleNavigate = (screen: AppScreen) => {
    if (disabled) return;
    onNavigate(screen, true);
  };

  // SVG Path for the bottom bar with a wider, smoother, more premium organic hump
  const navPath = useMemo(() => {
    const w = 100; // Viewbox width
    const topY = 30; // The flat top edge of the bar (decreased to raise the bar)
    const bottomY = 100; // Touches the bottom of the viewbox
    const step = w / TABS.length;
    const center = (activeIndex + 0.5) * step;
    
    const humpWidth = 30; // Even wider for a more spacious, premium feel
    const humpDepth = 30; // Adjusted depth relative to the new topY so the notch still covers the circle

    // Build a continuous smooth path with wider Bezier curves for a natural flow
    return `
      M 0 ${topY}
      L ${center - humpWidth} ${topY}
      C ${center - humpWidth * 0.5} ${topY}, ${center - humpWidth * 0.5} ${topY - humpDepth}, ${center} ${topY - humpDepth}
      C ${center + humpWidth * 0.5} ${topY - humpDepth}, ${center + humpWidth * 0.5} ${topY}, ${center + humpWidth} ${topY}
      L ${w} ${topY}
      V ${bottomY}
      H 0
      Z
    `;
  }, [activeIndex]);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[100px] pointer-events-none">
      <div className="relative w-full h-full pointer-events-auto">
        {/* Background SVG with animated path - White theme with soft shadow */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="drop-shadow-[0_-8px_25px_rgba(0,0,0,0.06)] overflow-visible">
            <motion.path
              d={navPath}
              fill="white"
              animate={{ d: navPath }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            />
          </svg>
        </div>

        {/* Active Indicator Circle - Glassmorphic brand green highlight for icon only */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute w-[56px] h-[56px] bg-gradient-to-br from-[#00D54B]/90 to-[#00D54B]/70 backdrop-blur-md rounded-full shadow-lg shadow-[#00D54B]/20 flex items-center justify-center border border-white/30"
            initial={false}
            animate={{
              left: `${(activeIndex + 0.5) * (100 / TABS.length)}%`,
              x: "-50%",
              top: "8px",
              scale: [0.85, 1.1, 1],
            }}
            transition={{
              left: { type: "spring", stiffness: 300, damping: 28 },
              scale: { duration: 0.4 }
            }}
          />
        </div>

        {/* Tab Items */}
        <div className="absolute inset-0 flex items-center w-full">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <div
                key={tab.id}
                onClick={() => handleNavigate(tab.id)}
                className="relative flex flex-col items-center justify-center flex-1 h-full cursor-pointer pt-10"
              >
                {/* Icon - Moves into circle and zooms when active */}
                <motion.div
                  animate={{
                    y: isActive ? -24 : 0,
                    scale: isActive ? 1.1 : 1,
                    color: isActive ? "#FFFFFF" : "#9CA3AF"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="z-10 flex items-center justify-center"
                >
                   <Icon className="w-6 h-6" fill={isActive ? "currentColor" : "none"} />
                </motion.div>

                {/* Label - Remains below circle, outside it, same font/size, position remains exactly the same */}
                <motion.span
                  animate={{
                    y: 0,
                    color: isActive ? "#00D54B" : "#9CA3AF"
                  }}
                  className={`text-[10px] font-black uppercase tracking-widest mt-1.5`}
                >
                  {tab.label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
