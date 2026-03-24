
import React, { useState } from 'react';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  variant?: 'default' | 'glass' | 'glass-light';
  disabled?: boolean;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  maxLength?: number;
}

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  prefix,
  icon,
  rightElement,
  className = '',
  inputClassName = '',
  variant = 'default',
  disabled = false,
  onPaste,
  autoFocus,
  maxLength
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const variantStyles = {
    default: 'bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 text-gray-900 placeholder:text-gray-400 shadow-sm',
    glass: 'bg-white/5 backdrop-blur-xl border-white/10 focus:bg-white/10 focus:border-primary focus:ring-4 focus:ring-primary/20 text-white placeholder:text-white/40 shadow-sm',
    'glass-light': 'bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 text-gray-900 placeholder:text-gray-400 shadow-sm'
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className={`text-[9px] font-black uppercase tracking-[0.2em] ml-1 transition-colors duration-300 ${
          isFocused 
            ? 'text-primary' 
            : variant === 'glass' ? 'text-white/60' : 'text-gray-500'
        }`}>
          {label}
        </label>
      )}
      <div className={`relative flex items-center group transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
        {icon && (
          <div className={`absolute left-4 transition-colors duration-300 ${
            isFocused 
              ? (variant === 'glass' ? 'text-white' : 'text-primary') 
              : (variant === 'glass' ? 'text-white/40' : 'text-gray-400')
          }`}>
            {icon}
          </div>
        )}
        {prefix && (
          <span className={`absolute left-4 font-black tracking-tight pointer-events-none transition-colors duration-300 ${
            variant === 'glass' ? 'text-white' : 'text-gray-900'
          }`}>
            {prefix}
          </span>
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          onPaste={onPaste}
          autoFocus={autoFocus}
          maxLength={maxLength}
          className={`w-full py-3 ${icon ? 'pl-11' : prefix ? (prefix.length > 1 ? 'pl-11' : 'pl-9') : 'px-4'} ${rightElement || isPassword ? 'pr-11' : 'px-4'} border rounded-2xl focus:outline-none transition-all duration-300 font-bold tracking-tight text-[13px] ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${variantStyles[variant]} ${inputClassName}`}
        />
        {(rightElement || isPassword) && (
          <div className="absolute right-4 flex items-center gap-2">
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`transition-colors focus:outline-none ${variant === 'glass' ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            )}
            {rightElement && (
              <div className={`cursor-pointer transition-colors ${variant === 'glass' ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                {rightElement}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
