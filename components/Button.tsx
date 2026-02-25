
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'black' | 'white' | 'danger';
  disabled?: boolean;
  noShine?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  id?: string;
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  noShine = false,
  className = '',
  type = 'button',
  style,
  id
}: ButtonProps) => {
  // Updated radius to 24px for smoother liquid feel
  const baseStyles = "w-full py-4 rounded-[24px] font-black transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.15em] text-[10px] overflow-hidden relative border active:scale-[0.98]";
  
  const variants = {
    // iPhone 17 Liquid Glass Primary: Deep gradient, top inner highlight, soft glow
    primary: "bg-gradient-to-b from-[#2DA437] to-[#1A5D22] text-white border-t border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_rgba(26,93,34,0.4)]",
    
    // Premium White: Soft inner glow, subtle border, clean shadow
    secondary: "bg-white dark:bg-white/5 text-black dark:text-white border-gray-200/80 dark:border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:bg-gray-50 dark:hover:bg-white/10",
    
    // Glass Outline: Subtle border, very light glass background
    outline: "border-primary/20 text-primary hover:bg-primary/5 bg-primary/[0.02]",
    
    // Minimal Ghost: No border, neutral text, light gray hover
    ghost: "border-transparent text-gray-500 hover:bg-gray-500/10 bg-transparent shadow-none",
    
    // Enhanced Glass for dark backgrounds: Strong blur, inner highlight
    glass: "bg-white/10 border border-white/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md",

    // Solid Black for high contrast
    black: "bg-black text-white border-transparent hover:bg-gray-800",

    // Solid White with black text
    white: "bg-white text-black border-gray-200 shadow-sm hover:bg-gray-50",

    // Danger for destructive actions
    danger: "bg-red-500/10 text-red-600 border-transparent hover:bg-red-500/20 shadow-none",
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    >
      {/* Shine effect for liquid look */}
      {(variant === 'primary' || variant === 'glass') && (
        <>
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
          {!noShine && (
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine pointer-events-none" />
          )}
        </>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
