"use client";

import React, { useState } from 'react';
import { MapPin, Search, Calendar, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { lookupDistrict, Election, Representative } from '@/lib/api';

const DistrictLookup = () => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{district: string, elections: Election[], representatives: Representative[]} | null>(null);

  const handleLookup = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      const result = await lookupDistrict(address);
      // Map backend response to UI structure
      setData({
        district: result.address,
        elections: result.elections || [],
        representatives: result.representatives || []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="lookup" className="py-24 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-4xl font-extrabold mb-6">Know Your <span className="text-primary">Constituency.</span></h2>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            Enter your address or ZIP code to find your current representatives, 
            upcoming elections, and official polling locations. We use the 
            Google Civic Information API to ensure 100% accuracy.
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-secondary border border-card-border">
              <div className="w-10 h-10 bg-card-bg rounded-xl flex items-center justify-center text-primary shadow-sm">
                <Landmark aria-hidden="true" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Real-time Data</h4>
                <p className="text-xs text-text-secondary">Direct connection to official election databases.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-secondary border border-card-border">
              <div className="w-10 h-10 bg-card-bg rounded-xl flex items-center justify-center text-primary shadow-sm">
                <Calendar aria-hidden="true" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Election Reminders</h4>
                <p className="text-xs text-text-secondary">Sync official dates directly to your calendar.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card-bg p-8 rounded-[40px] border border-card-border shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin aria-hidden="true" size={24} className="text-primary" />
              Location Lookup
            </h3>
            
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="address-input" className="sr-only">Enter Address or ZIP Code</label>
                <Search aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input 
                  id="address-input"
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Address or ZIP Code..."
                  className="w-full pl-12 pr-4 py-4 bg-card-bg border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <button 
                onClick={handleLookup}
                disabled={isLoading || !address}
                className="w-full py-4 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? "Searching Databases..." : "Find My District"}
              </button>
            </div>

            <AnimatePresence>
              {data && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-10 pt-10 border-t border-card-border space-y-6"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-primary tracking-widest block mb-2">Current District</span>
                    <h4 className="text-2xl font-extrabold">{data.district}</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-card-bg/50">
                      <span className="text-[10px] font-bold text-text-secondary uppercase block mb-1">Upcoming Election</span>
                      <p className="text-sm font-bold">{data.elections[0].name}</p>
                      <p className="text-xs text-text-secondary">{data.elections[0].date}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-card-bg/50">
                      <span className="text-[10px] font-bold text-text-secondary uppercase block mb-1">Primary Rep</span>
                      <p className="text-sm font-bold">{data.representatives[0].name}</p>
                      <p className="text-xs text-text-secondary">{data.representatives[0].office}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistrictLookup;
