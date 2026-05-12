import { motion } from 'motion/react';
import { Wand2 } from 'lucide-react';

export function CrystalLoading() {
  const messages = [
    "Consulting the culinary constellations...",
    "Stirring the cauldron of destiny...",
    "Deciphering ingredient omens...",
    "Aligning the spice stars...",
    "Chasing away the spirits of waste..."
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-20 w-full h-full">
      <div className="relative">
        <motion.div
          animate={{
            boxShadow: [
              "0 0 20px rgba(197, 160, 89, 0.1)",
              "0 0 60px rgba(197, 160, 89, 0.3)",
              "0 0 20px rgba(197, 160, 89, 0.1)"
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-mystic-gold/10 via-mystic-orange/5 to-bg-deep overflow-hidden border border-white/5 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-32 h-32 rounded-full bg-mystic-gold/10 blur-xl absolute"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Wand2 className="w-16 h-16 text-mystic-gold opacity-40" />
          </motion.div>
        </motion.div>
        
        {/* Floating elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [0, -40],
              x: (i % 2 === 0 ? 20 : -20),
              scale: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2 + i * 0.5, 
              repeat: Infinity,
              delay: i * 0.3
            }}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-mystic-gold rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="text-center space-y-3">
        <motion.p
          key="message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-mystic-gold font-serif text-xl tracking-widest italic"
        >
          {messages[Math.floor(Date.now() / 3000) % messages.length]}
        </motion.p>
        <p className="text-white/20 text-[10px] uppercase tracking-[0.3em]">The Genie is in a deep ritual trance.</p>
      </div>
    </div>
  );
}
