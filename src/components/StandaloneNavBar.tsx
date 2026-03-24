import React from 'react';

export const StandaloneNavBar = () => {
  return (
    <div className="flex justify-center items-center p-10 bg-[#f0f0f0] min-h-screen font-sans">
      <div className="bg-white rounded-[40px] px-10 py-5 flex items-center justify-between w-[480px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative">
        
        {/* Home (Active) */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10L12 3l8 7v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z"></path>
            <rect x="9" y="12" width="6" height="6" rx="2"></rect>
          </svg>
          <span className="text-[13px] font-semibold text-[#111111]">Home</span>
        </div>

        {/* Explore (Inactive) */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="15.5 8.5 11 10.5 8.5 15.5 13 13.5"></polygon>
          </svg>
          <span className="text-[13px] font-medium text-[#A3A3A3]">Explore</span>
        </div>

        {/* Center Action Button */}
        <div className="relative cursor-pointer group mx-2">
          {/* Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[80px] bg-[#8a6df8] blur-[24px] opacity-50 rounded-full pointer-events-none"></div>
          
          {/* Button */}
          <div className="relative w-[84px] h-[52px] bg-gradient-to-br from-[#a68cff] via-[#8a6df8] to-[#7151f5] rounded-[26px] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_4px_12px_rgba(138,109,248,0.4)] border border-white/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 10h10" />
              <path d="M14 7l3 3-3 3" />
              <path d="M17 14H7" />
              <path d="M10 17l-3-3 3-3" />
            </svg>
          </div>
        </div>

        {/* Analyze (Inactive) */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="4"></rect>
            <path d="M7 15l3.5-4 3.5 3 3-4"></path>
          </svg>
          <span className="text-[13px] font-medium text-[#A3A3A3]">Analyze</span>
        </div>

        {/* Jobs (Inactive) */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="8" width="16" height="11" rx="3"></rect>
            <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <path d="M4 13h16"></path>
          </svg>
          <span className="text-[13px] font-medium text-[#A3A3A3]">Jobs</span>
        </div>

      </div>
    </div>
  );
};
