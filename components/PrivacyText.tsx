import React from 'react';

interface PrivacyTextProps {
  children: React.ReactNode;
  hide: boolean;
  className?: string;
}

export const PrivacyText: React.FC<PrivacyTextProps> = ({ children, hide, className = "" }) => {
  if (!hide) return <span className={className}>{children}</span>;

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <span className="relative inline-flex items-center justify-center">
        <span className="blur-[5px] select-none pointer-events-none opacity-25 scale-105">
          {children}
        </span>
        <span className="absolute inset-[-4px] backdrop-blur-[8px] pointer-events-none rounded-2xl" />
      </span>
    </span>
  );
};
