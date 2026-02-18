
import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  prefix,
  icon,
  rightElement,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">{label}</label>}
      <div className="relative flex items-center group">
        {icon && (
          <div className="absolute left-4 text-white/30 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        {prefix && (
          <span className="absolute left-4 text-primary font-bold">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-4 ${icon || prefix ? 'pl-12' : 'px-4'} ${rightElement ? 'pr-12' : 'px-4'} bg-white/5 border border-white/10 rounded-[20px] focus:border-primary/50 focus:bg-white/10 focus:outline-none transition-all text-white font-medium placeholder:text-white/20 tracking-tight text-sm`}
        />
        {rightElement && (
          <div className="absolute right-4 text-white/30 cursor-pointer hover:text-white transition-colors">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};
