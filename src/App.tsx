import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Plus, Trash2, Wand2, History, Eye, X } from 'lucide-react';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { MysticEye } from './components/MysticEye';
import { CrystalLoading } from './components/CrystalLoading';
import { ProphecyCard } from './components/ProphecyCard';
import { generateRecipeProphecy } from './services/geminiService';
import { RecipeProphecy } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prophecy, setProphecy] = useState<RecipeProphecy | null>(null);
  const [history, setHistory] = useState<RecipeProphecy[]>([]);

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeIngredient = (tag: string) => {
    setIngredients(ingredients.filter(i => i !== tag));
  };

  const handleConsultGenie = async () => {
    if (ingredients.length === 0 && !capturedImage) return;

    setIsGenerating(true);
    setProphecy(null);

    try {
      const result = await generateRecipeProphecy(ingredients, capturedImage || undefined);
      setProphecy(result);
      setHistory(prev => [result, ...prev].slice(0, 5));
    } catch (error) {
      console.error(error);
      alert("The stars are cloudy. " + (error instanceof Error ? error.message : "Try again later."));
    } finally {
      setIsGenerating(false);
    }
  };

  const resetRitual = () => {
    setProphecy(null);
    setIngredients([]);
    setCapturedImage(null);
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden selection:bg-mystic-gold/30">
      <BackgroundOrbs />
      
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-white/10 relative z-30 bg-bg-deep/50 backdrop-blur-sm">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={resetRitual}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-mystic-gold to-mystic-orange rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)] group-hover:scale-110 transition-transform">
            <span className="text-black text-xl">✨</span>
          </div>
          <h1 className="text-2xl font-light tracking-widest uppercase font-serif">
            Fridge<span className="text-mystic-gold font-bold">Genie</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.3em] font-medium opacity-60">
          <button className="hover:text-mystic-gold transition-colors">The Oracle</button>
          <button className="hover:text-mystic-gold transition-colors">Saved Scrolls</button>
          <button className="hover:text-mystic-gold transition-colors">Marketplace</button>
        </nav>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-20 overflow-hidden">
        
        {/* Left Altar: Input Section */}
        <section className="lg:col-span-4 border-r border-white/10 p-8 md:p-12 flex flex-col justify-between bg-black/20 overflow-y-auto">
          <div className="space-y-12">
            <header>
              <p className="text-mystic-gold text-xs uppercase tracking-[0.4em] mb-4">The Ritual</p>
              <h2 className="text-3xl md:text-4xl font-serif font-light leading-tight italic">
                Cast your ingredients into the <span className="text-white block not-italic mt-2">Cold Chamber...</span>
              </h2>
            </header>

            <div className="space-y-8">
              {/* Mystic Eye for Visual Uploads */}
              <div className="flex justify-center">
                <MysticEye 
                  onImageCaptured={setCapturedImage} 
                  capturedImage={capturedImage} 
                  onClear={() => setCapturedImage(null)}
                />
              </div>

              {/* Tag Altar */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 block">Current Inventory</label>
                <div className="min-h-[160px] w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-2 items-start altar-input">
                  <AnimatePresence>
                    {ingredients.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="tag-mystic flex items-center gap-2 group"
                      >
                        {tag}
                        <X 
                          className="w-3 h-3 text-white/30 hover:text-red-400 cursor-pointer" 
                          onClick={() => removeIngredient(tag)}
                        />
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  
                  <div className="flex-1 min-w-[120px]">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                      placeholder="Add offering..."
                      className="w-full bg-transparent border-none text-sm text-white placeholder:text-white/20 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleConsultGenie}
                disabled={isGenerating || (ingredients.length === 0 && !capturedImage)}
                className="w-full btn-mystic flex items-center justify-center gap-3 disabled:bg-white/10 disabled:text-white/20"
              >
                {isGenerating ? "Enchanting..." : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Consult the Oracle
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-6">
            <div className="text-4xl font-serif italic text-white leading-none">
              {prophecy ? (parseInt(prophecy.wasteSavedApprox) || "480") : "0"}
              <span className="text-sm not-italic text-white/40 ml-1">g</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] leading-relaxed text-mystic-gold">
              Food Waste<br/>Averted Today
            </div>
          </div>
        </section>

        {/* Right Section: Prophecy or Loading */}
        <section className="lg:col-span-8 p-6 md:p-12 lg:p-20 bg-gradient-to-br from-bg-deep to-[#121212] relative overflow-y-auto scrollbar-hide">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mystic-orange/5 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none"></div>
          
          <AnimatePresence mode="wait">
            {!isGenerating && !prophecy && (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40"
              >
                <div className="w-24 h-24 border border-white/5 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-mystic-gold" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif italic mb-2">The parchment remains blank.</h3>
                  <p className="text-[10px] uppercase tracking-[0.3em]">Fill the altar to receive your gastronomic destiny.</p>
                </div>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center"
              >
                <CrystalLoading />
              </motion.div>
            )}

            {prophecy && !isGenerating && (
              <motion.div
                key="prophecy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                <ProphecyCard prophecy={prophecy} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Sub-Footer */}
      <footer className="px-10 py-4 bg-black border-t border-white/5 relative z-30 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/30 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          Powered by Gemini Oracle Engine
        </div>
        <div className="flex gap-8">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Seal</span>
          <span className="hover:text-white transition-colors cursor-pointer">Alchemy Guidelines</span>
        </div>
      </footer>
    </div>
  );
}

