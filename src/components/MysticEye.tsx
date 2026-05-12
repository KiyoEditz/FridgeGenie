import { useState, useRef } from 'react';
import { X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface MysticEyeProps {
  onImageCaptured: (base64: string) => void;
  capturedImage: string | null;
  onClear: () => void;
}

export function MysticEye({ onImageCaptured, capturedImage, onClear }: MysticEyeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageCaptured(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className={cn(
          "relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-all duration-700 shadow-2xl",
          "border border-white/10 hover:border-mystic-gold/50",
          capturedImage ? "bg-black" : "bg-white/5"
        )}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        
        <AnimatePresence mode="wait">
          {capturedImage ? (
            <motion.div
              key="image"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full h-full rounded-full overflow-hidden border border-mystic-gold/20"
            >
              <img src={capturedImage} className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/40 hover:bg-transparent transition-colors" />
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-white/20 hover:text-mystic-gold transition-colors"
            >
              <Eye className={cn("w-8 h-8 transition-all duration-700", isHovered ? "scale-110 rotate-180" : "")} />
              <span className="text-[9px] mt-2 font-serif tracking-[0.3em] uppercase italic">Mystic Eye</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating dust/particles around the eye */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border border-dashed border-mystic-gold/10 rounded-full pointer-events-none"
        />
      </motion.div>

      {capturedImage && (
        <button
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="mt-6 text-[9px] font-serif flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors uppercase tracking-[0.2em] italic"
        >
          <X className="w-3 h-3" /> Dismiss Vision
        </button>
      )}
    </div>
  );
}
