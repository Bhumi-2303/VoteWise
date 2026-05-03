"use client";

import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-primary mb-8"
        >
          <Sparkles size={16} />
          <span>Powered by Gemini 2.0 Flash</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-primary dark:text-white mb-6"
        >
          Empowering Voters with <br />
          <span className="text-primary italic">Civic Intelligence.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-text-secondary dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Navigate elections with confidence. Get neutral candidate comparisons, 
          real-time district data, and verified civic education in your language.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group">
            Ask AI Assistant
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full font-bold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2">
            <Search size={20} />
            Find My District
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-8 text-zinc-400 dark:text-zinc-500 grayscale opacity-70"
        >
          <div className="flex items-center gap-2 font-medium italic">
            <ShieldCheck size={20} />
            Neutral & Non-Partisan
          </div>
          <div className="hidden sm:block h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
          <div className="flex items-center gap-2 font-medium italic">
            <span>Verified Sources Only</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
