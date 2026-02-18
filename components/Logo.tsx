
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'color' | 'white';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-24 h-24", 
  variant = 'color' 
}) => {
  const src = variant === 'color' ? 'input_file_0.png' : 'input_file_1.png';
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img 
        src={src} 
        alt="Gogreen Logo" 
        className="w-full h-full object-contain"
        onError={(e) => {
          // If the specific variant fails, try the other one before hiding
          if (e.currentTarget.src.includes('input_file_1.png')) {
            e.currentTarget.src = 'input_file_0.png';
          } else {
            e.currentTarget.style.display = 'none';
          }
        }} 
      />
    </div>
  );
};

export const LogoText: React.FC<{ className?: string, variant?: 'white' | 'primary' }> = ({ 
  className = "h-8", 
  variant = 'primary' 
}) => {
  const textColor = variant === 'white' ? 'text-white' : 'text-primary';
  
  return (
    <div className={`flex items-baseline font-bold text-3xl tracking-tight ${className} ${textColor}`}>
      <span>go</span>
      <span className={variant === 'white' ? 'text-white' : 'text-primary'}>green</span>
    </div>
  );
};

export const FullLogo: React.FC<{ className?: string, variant?: 'white' | 'color' }> = ({ 
  className = "", 
  variant = 'color' 
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo className="w-10 h-10" variant={variant} />
      <LogoText className="h-auto !text-2xl" variant={variant === 'white' ? 'white' : 'primary'} />
    </div>
  );
};
