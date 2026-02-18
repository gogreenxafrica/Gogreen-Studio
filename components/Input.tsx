
import React from 'react';

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  prefix,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-4 text-gray-500 font-medium">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-4 ${prefix ? 'pl-16' : 'px-4'} border-2 border-accent rounded-xl focus:border-primary focus:outline-none transition-colors placeholder:text-gray-400`}
        />
      </div>
    </div>
  );
};
