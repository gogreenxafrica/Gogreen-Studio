
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
  const baseStyles = "w-full py-3 rounded-[20px] font-black transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.15em] text-[9px] overflow-hidden relative active:scale-[0.95] hover:scale-[1.02] hover:shadow-lg";
  
  const variants = {
    // iPhone 17 Liquid Glass Primary: Deep gradient, top inner highlight, soft glow
    primary: "bg-gradient-to-b from-[#2DA437] to-[#1A5D22] text-white border-t border-line-strong shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_rgba(26,93,34,0.4)]",
    
    // Premium White: Soft inner glow, subtle border, clean shadow
    secondary: "bg-surface dark:bg-surface-alt text-gray-900 dark:text-content border border-line-strong/80 dark:border-line shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:bg-surface-alt dark:hover:bg-surface",
    
    // Glass Outline: Subtle border, very light glass background
    outline: "border border-primary/20 text-primary hover:bg-primary/5 bg-primary/[0.02]",
    
    // Minimal Ghost: No border, neutral text, light gray hover
    ghost: "text-content-muted dark:text-content-subtle hover:bg-gray-500/10 bg-transparent shadow-none hover:text-primary transition-colors",
    
    // Enhanced Glass for dark backgrounds: Strong blur, inner highlight
    glass: "bg-surface border border-line-strong text-content shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md hover:bg-surface",

    // Solid Black for high contrast
    black: "bg-gray-900 text-content hover:bg-surface-alt",

    // Solid White with black text
    white: "bg-surface text-gray-900 border border-line-strong shadow-sm hover:bg-surface-alt",

    // Danger for destructive actions
    danger: "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 shadow-none",
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
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />
          {!noShine && (
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine pointer-events-none" />
          )}
        </>
      )}
      <span className="relative z-10 flex items-center justify-center gap-2 w-full px-4">{children}</span>
    </button>
  );
};
