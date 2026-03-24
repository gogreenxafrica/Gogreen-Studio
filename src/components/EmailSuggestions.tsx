import React from 'react';
import { DOMAINS } from '../../constants';

export const EmailSuggestions = ({ value, onSelect }: { value: string, onSelect: (val: string) => void }) => {
  if (!value.includes('@')) return null;
  const parts = value.split('@');
  const prefix = parts[0];
  const suffix = parts[1] || '';
  if (!prefix) return null;

  const filtered = DOMAINS.filter(d => d.startsWith(suffix)).slice(0, 5);
  if (filtered.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl animate-fade-in glass-dark">
      {filtered.map(domain => (
        <div
          key={domain}
          onClick={() => onSelect(`${prefix}@${domain}`)}
          className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 text-sm text-white/70 hover:text-white transition-colors"
        >
          {prefix}@{domain}
        </div>
      ))}
    </div>
  );
};
