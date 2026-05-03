"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Compare', href: '#compare' },
    { name: 'District Lookup', href: '#lookup' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
            V
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary dark:text-white">
            VoteWise <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-primary dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="hidden md:flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Globe size={16} />
            <span>EN</span>
            <ChevronDown size={14} />
          </button>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-text-primary dark:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={cn(
        "fixed inset-0 top-[73px] bg-white dark:bg-zinc-900 z-40 md:hidden transition-transform duration-300 ease-in-out px-6 py-8",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-text-primary dark:text-white"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4" />
          <button className="flex items-center gap-3 text-lg font-medium">
            <Globe size={24} />
            <span>Change Language</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
