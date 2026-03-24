import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  variant?: 'color' | 'white' | 'premium' | 'icon' | 'icon-white';
}

/**
 * Logo component using the provided high-fidelity assets.
 */
export const Logo = ({ 
  className = "w-48 h-16", 
  variant = 'color' 
}: LogoProps) => {
  const [hasError, setHasError] = useState(false);
  
  // Updated to use real files from public/assets/logos
  const getSrc = () => {
    switch (variant) {
      case 'white':
        return '/assets/logos/gogreen-full-text-logo-white.png';
      case 'premium':
        return '/assets/logos/gogreen-full-text+icon-logo-full-green+white-combo.png';
      case 'icon':
        return '/assets/logos/gogreen-dark-green-logomark.png';
      case 'icon-white':
        return '/assets/logos/gogreen-white-logomark.png';
      case 'color':
      default:
        return '/assets/logos/gogreen-full-text-logo-full-green.png';
    }
  };

  const src = getSrc();
  
  if (hasError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`font-black text-2xl tracking-tighter flex items-baseline ${variant === 'white' || variant === 'premium' ? 'text-content' : 'text-primary'}`}>
          go<span className={variant === 'white' ? 'opacity-60' : variant === 'premium' ? 'text-secondary' : 'text-secondary'}>green</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center overflow-hidden ${className}`}>
      <img 
        src={src} 
        alt="Gogreen Logo" 
        className="w-full h-full object-contain"
        onError={() => setHasError(true)} 
      />
    </div>
  );
};

export const LogoText = ({ 
  className = "h-8", 
  variant = 'primary' 
}: { className?: string, variant?: 'white' | 'primary' }) => {
  const textColor = variant === 'white' ? 'text-content' : 'text-primary';
  
  return (
    <div className={`flex items-baseline font-bold text-3xl tracking-tight ${className} ${textColor}`}>
      <span>go</span>
      <span className={variant === 'white' ? 'text-content' : 'text-primary'}>green</span>
    </div>
  );
};

export const FullLogo = ({ 
  className = "", 
  variant = 'color' 
}: { className?: string, variant?: 'white' | 'color' | 'premium' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo className="w-32 h-10" variant={variant as any} />
    </div>
  );
};
