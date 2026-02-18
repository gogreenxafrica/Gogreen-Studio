
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  // Added style prop to support standard inline CSS properties (e.g., animation-delay)
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
  style
}) => {
  const baseStyles = "w-full py-4 rounded-card font-bold transition-all duration-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest text-[10px] overflow-hidden relative border";
  
  const variants = {
    // Glassy Greenish Primary
    primary: "bg-primary/20 backdrop-blur-xl border-primary/40 text-white active:scale-[0.98] shadow-lg shadow-primary/10",
    secondary: "bg-secondary text-white active:scale-[0.98] shadow-lg shadow-secondary/20 border-transparent",
    outline: "border-2 border-primary text-primary active:scale-[0.98]",
    ghost: "text-primary border-transparent active:scale-[0.98]",
    // Enhanced Glassy Greenish
    glass: "bg-primary/10 backdrop-blur-2xl border-white/20 text-white active:scale-[0.98] shadow-2xl"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    >
      {/* Dynamic Shine effect for glassy buttons */}
      {(variant === 'glass' || variant === 'primary') && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-40 pointer-events-none" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
