import React from 'react';
import { Logo } from './Logo';
import { motion } from 'motion/react';
import { BrandPattern } from '../src/components/BrandPattern';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Processing...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 overflow-hidden">
      <BrandPattern opacity={0.03} size={80} animate={true} className="absolute inset-0 pointer-events-none" />
      
      {/* Floating Branded Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: '110vh', 
              x: `${10 + Math.random() * 80}vw`,
              opacity: 0, 
              scale: 0.3 + Math.random() * 0.4,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: '-10vh',
              opacity: [0, 0.2, 0.2, 0],
              rotate: (Math.random() > 0.5 ? 1 : -1) * 360,
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "linear"
            }}
            className="absolute text-primary/10"
          >
            <img src="/assets/logos/gogreen-dark-green-logomark.png" alt="GoGreen Particle" className="w-12 h-12 object-contain opacity-50" />
          </motion.div>
        ))}
      </div>

      <div className="relative flex flex-col items-center justify-center z-10">
        {/* Pulsing Glow Rings */}
        <motion.div 
          animate={{ 
            scale: [1, 1.4, 1], 
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-40 h-40 border-2 border-dashed border-primary/20 rounded-full"
        ></motion.div>
        
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute w-48 h-48 bg-primary/5 rounded-full blur-2xl"
        ></motion.div>
        
        {/* Logo Container */}
        <div className="relative z-10 w-24 h-24 bg-white rounded-[32px] shadow-2xl shadow-primary/20 flex items-center justify-center border-4 border-white overflow-hidden group">
          <motion.div 
            animate={{ 
              y: [0, -8, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14"
          >
            <img src="/assets/logos/gogreen-dark-green-logomark.png" alt="GoGreen Logo" className="w-full h-full object-contain" />
          </motion.div>
          
          {/* Shine Effect */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
          />
        </div>
      </div>
      
      <div className="mt-12 text-center space-y-4 z-10">
        <div className="space-y-1">
          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.4em]">{message}</h3>
          <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">Gogreen Secure Processing</p>
        </div>
        
        <div className="flex items-center justify-center gap-2.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.6, 1],
                opacity: [0.2, 1, 0.2],
                y: [0, -4, 0]
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-2 h-2 bg-primary rounded-full shadow-sm shadow-primary/20"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
