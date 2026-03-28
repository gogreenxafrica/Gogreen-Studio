import React from 'react';

interface PrivacyTextProps {
  children: React.ReactNode;
  hide: boolean;
  className?: string;
}

export const PrivacyText: React.FC<PrivacyTextProps> = ({ children, hide, className = "" }) => {
  if (!hide) return <span className={className}>{children}</span>;

  return (
    <span 
      className={`relative inline-flex items-center ${className}`}
      style={{ 
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
      }}
    >
      <span 
        className="relative inline-flex items-center justify-center w-full h-full"
        style={{ 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      >
        <span className="blur-[5px] select-none pointer-events-none opacity-60">
          {children}
        </span>
        <span className="absolute inset-0 bg-white/5 backdrop-blur-[3px] rounded-full pointer-events-none" />
      </span>
    </span>
  );
};
