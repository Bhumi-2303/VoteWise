"use client";

import React, { useState } from 'react';
import { Search, ArrowRightLeft, User, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { compareCandidates } from '@/lib/api';

const CandidateComparison = () => {
  const [c1, setC1] = useState('');
  const [c2, setC2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleCompare = async () => {
    if (!c1 || !c2) return;
    setIsLoading(true);
    try {
      const data = await compareCandidates(c1, c2, "English");
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="compare" className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Neutral Candidate Comparison</h2>
          <p className="text-text-secondary dark:text-zinc-400">
            Compare two candidates side-by-side. Our AI scans official records and 
            verified statements to provide an objective breakdown.
          </p>
        </div>

        {/* Inputs */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-primary">Candidate A</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  value={c1}
                  onChange={(e) => setC1(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 hidden md:block">
              <ArrowRightLeft size={20} />
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-primary">Candidate B</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  value={c2}
                  onChange={(e) => setC2(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleCompare}
            disabled={isLoading || !c1 || !c2}
            className="w-full mt-8 py-4 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search size={20} />
                Generate Neutral Comparison
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {results.comparison.map((item: any, i: number) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-center">
                    <div className="text-sm font-medium text-text-primary dark:text-white">{item.v1}</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-tighter text-zinc-500">
                      {item.category}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-center">
                    <div className="text-sm font-medium text-text-primary dark:text-white">{item.v2}</div>
                  </div>
                </div>
              ))}
              
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl flex gap-4">
                <Info className="text-primary shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-primary mb-1">AI Trust Indicator</h4>
                  <p className="text-xs text-text-secondary dark:text-zinc-400">
                    This comparison was generated based on verified records from the FEC and official candidate sites. 
                    No editorial bias was applied to these data points.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CandidateComparison;
