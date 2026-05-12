import { motion } from 'motion/react';
import { Sparkles, Clock, Hammer, Leaf, Share2, Printer } from 'lucide-react';
import { RecipeProphecy } from '../types';

interface ProphecyCardProps {
  prophecy: RecipeProphecy;
}

export function ProphecyCard({ prophecy }: ProphecyCardProps) {
  return (
    <div className="relative h-full flex flex-col">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10">
        <div className="space-y-4">
          <span className="px-3 py-1 border border-mystic-gold/30 text-mystic-gold text-[10px] uppercase tracking-[0.3em] rounded-full inline-block">
            Prophecy Confirmed
          </span>
          <h3 className="text-4xl md:text-6xl font-serif text-white leading-tight">
            {prophecy.title}
          </h3>
        </div>
        <div className="text-left md:text-right">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Complexity</p>
          <p className="text-mystic-gold font-serif italic text-lg">{prophecy.difficulty}</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-10">
        {/* Left Col: Preparation */}
        <div className="space-y-8">
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-mystic-gold mb-6">The Ritual Steps</h4>
            <ol className="space-y-6">
              {prophecy.instructions.map((step, i) => (
                <li key={i} className="text-sm md:text-base text-white/70 font-light leading-relaxed flex gap-4">
                  <span className="text-mystic-gold font-serif italic font-bold">{(i + 1).toString().padStart(2, '0')}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        {/* Right Col: Details & Meta */}
        <div className="space-y-8">
          <div className="bg-white/5 p-8 rounded-2xl border border-white/5 backdrop-blur-sm space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-mystic-gold">Oracle's Insight</h4>
            <p className="text-base italic text-white/50 leading-relaxed font-serif">
              "{prophecy.prophecy}"
            </p>
          </div>

          <div className="space-y-6">
             <h4 className="text-[10px] uppercase tracking-[0.3em] text-mystic-gold">Required Artifacts</h4>
             <div className="flex flex-wrap gap-2">
                {prophecy.ingredients.map((ing, i) => (
                  <span key={i} className="text-xs px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-white/70">
                    {ing}
                  </span>
                ))}
             </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5 text-center">
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Cook Time</p>
              <p className="text-xl text-white font-serif italic">{prophecy.cookTime}</p>
            </div>
            <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5 text-center">
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Earth Saved</p>
              <p className="text-xl text-white font-serif italic">{prophecy.wasteSavedApprox}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-12 flex flex-wrap gap-4 pt-10 border-t border-white/10">
        <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2">
          <Share2 className="w-3 h-3" /> Share Vision
        </button>
        <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2">
          <Printer className="w-3 h-3" /> Print Scroll
        </button>
      </div>
    </div>
  );
}
