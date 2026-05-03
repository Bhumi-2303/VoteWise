"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Search, Users, Scale, Shield, Globe, Clock } from 'lucide-react';

interface BentoItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

const BentoItem = ({ title, description, icon: Icon, className, delay = 0 }: BentoItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`p-8 rounded-3xl border border-card-border bg-card-bg hover:shadow-xl hover:border-primary/20 transition-all group ${className}`}
  >
    <div className="w-12 h-12 bg-card-bg rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
    <p className="text-text-secondary leading-relaxed text-sm">{description}</p>
  </motion.div>
);

const BentoGrid = () => {
  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-text-primary mb-4">
          Everything You Need to Vote <span className="text-primary">Wise.</span>
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          We combine real-time official data with neutral AI analysis to help you 
          make the most informed decision at the ballot box.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoItem 
          title="Smart Candidate Search"
          description="Instant access to candidate profiles, including education, experience, and public promises."
          icon={Search}
          className="md:col-span-2"
        />
        <BentoItem 
          title="Neutral Comparison"
          description="Side-by-side neutral analysis of policies and manifestos without partisan bias."
          icon={Scale}
          delay={0.1}
        />
        <BentoItem 
          title="District Lookup"
          description="Find your constituency, polling booth, and local representatives with a simple ZIP code."
          icon={Globe}
          delay={0.2}
        />
        <BentoItem 
          title="Verified Sources"
          description="All AI responses are cross-referenced with Election Commission and official datasets."
          icon={Shield}
          className="md:col-span-2"
          delay={0.3}
        />
        <BentoItem 
          title="Real-time Deadlines"
          description="Never miss a registration date or election day with localized alerts and reminders."
          icon={Clock}
          delay={0.4}
        />
        <BentoItem 
          title="Community Driven"
          description="Join thousands of voters using AI to simplify the complex world of civic data."
          icon={Users}
          delay={0.5}
        />
      </div>
    </section>
  );
};

export default BentoGrid;
