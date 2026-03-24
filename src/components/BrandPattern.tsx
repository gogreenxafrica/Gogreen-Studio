import React from 'react';
import { motion } from 'motion/react';

interface BrandPatternProps {
  opacity?: number;
  size?: number;
  color?: 'white' | 'primary' | 'black';
  animate?: boolean;
  className?: string;
}

export const BrandPattern: React.FC<BrandPatternProps> = ({ 
  opacity = 0.1, 
  size = 48, 
  color = 'white',
  animate = true,
  className = ""
}) => {
  const imageUrl = color === 'white' 
    ? '/assets/logos/gogreen-white-logomark.png' 
    : color === 'primary' 
      ? '/assets/logos/gogreen-primary-logomark.png'
      : '/assets/logos/gogreen-black-logomark.png';

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <motion.div 
        className="absolute inset-[-100%] w-[300%] h-[300%]"
        style={{ 
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: `${size}px`,
          backgroundRepeat: 'repeat',
          opacity: opacity
        }}
        animate={animate ? {
          x: [-size, 0],
          y: [-size, 0],
        } : {}}
        transition={animate ? {
          x: { duration: 30, repeat: Infinity, ease: "linear" },
          y: { duration: 30, repeat: Infinity, ease: "linear" },
        } : {}}
      />
    </div>
  );
};
