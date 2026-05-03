"use client";

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">V</div>
              <span className="text-xl font-bold tracking-tight">VoteWise <span className="text-primary">AI</span></span>
            </Link>
            <p className="text-sm text-text-secondary dark:text-zinc-400 leading-relaxed mb-6">
              Empowering global citizens with neutral, AI-driven civic intelligence. 
              Our mission is to simplify democracy through data transparency.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-text-secondary dark:text-zinc-400">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#compare" className="hover:text-primary transition-colors">Candidate Compare</Link></li>
              <li><Link href="#lookup" className="hover:text-primary transition-colors">District Lookup</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Transparency</h4>
            <ul className="space-y-4 text-sm text-text-secondary dark:text-zinc-400">
              <li><Link href="#" className="hover:text-primary transition-colors">How AI Works</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Data Sources</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Neutrality Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-text-secondary dark:text-zinc-400">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Accessibility Statement</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-zinc-500 dark:text-zinc-600">
            © {currentYear} VoteWise AI. Not affiliated with any government entity. 
            All data provided for educational purposes only.
          </p>
          <div className="flex items-center gap-6 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Systems Operational
            </span>
            <span>v1.2.4-stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
