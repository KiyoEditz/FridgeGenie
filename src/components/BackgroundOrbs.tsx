import { motion } from 'motion/react';

export function BackgroundOrbs() {
  return (
    <>
      <div 
        className="orb w-[500px] h-[500px] top-[-10%] left-[-10%] bg-mystic-gold/5" 
        id="orb-1"
      />
      <motion.div 
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="orb w-[400px] h-[400px] bottom-[10%] right-[-5%] bg-mystic-gold/10" 
        id="orb-2"
      />
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="orb w-[600px] h-[600px] top-[40%] left-[20%] bg-mystic-orange/5" 
        id="orb-3"
      />
    </>
  );
}
