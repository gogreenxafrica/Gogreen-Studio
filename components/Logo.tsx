
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'primary' | 'white' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = "w-24 h-24", variant = 'primary' }) => {
  const primaryColor = "#2DA437";
  const secondaryColor = "#89CE33";
  const white = "#FFFFFF";

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill={variant === 'white' ? 'transparent' : (variant === 'dark' ? '#111' : white)} />
        <path d="M50 25C36.19 25 25 36.19 25 50C25 63.81 36.19 75 50 75C63.81 75 75 63.81 75 50C75 42 70 35 63 30" stroke={primaryColor} strokeWidth="8" strokeLinecap="round" />
        <path d="M63 30C66 22 72 18 80 15C75 25 65 28 63 30Z" fill={secondaryColor} />
        <circle cx="50" cy="50" r="12" stroke={primaryColor} strokeWidth="6" />
      </svg>
    </div>
  );
};

export const LogoText: React.FC<{ className?: string }> = ({ className = "h-8" }) => (
  <div className={`flex items-baseline ${className}`}>
    <span className="text-[#2DA437] font-bold text-3xl tracking-tight">go</span>
    <span className="text-[#89CE33] font-bold text-3xl tracking-tight">green</span>
  </div>
);
