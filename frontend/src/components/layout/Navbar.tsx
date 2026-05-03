"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const translations: Record<string, Record<string, string>> = {
  en: { features: 'Features', howItWorks: 'How it Works', compare: 'Compare', lookup: 'District Lookup', changeLang: 'Change Language' },
  hi: { features: 'विशेषताएं', howItWorks: 'यह कैसे काम करता है', compare: 'तुलना', lookup: 'जिला खोज', changeLang: 'भाषा बदलें' },
  gu: { features: 'વિશેષતાઓ', howItWorks: 'તે કેવી રીતે કામ કરે છે', compare: 'સરખામણી', lookup: 'જિલ્લા શોધ', changeLang: 'ભાષા બદલો' },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Load language and theme from storage
    const savedLang = localStorage.getItem('votewise_lang');
    if (savedLang && translations[savedLang]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(savedLang);
      document.documentElement.lang = savedLang;
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const setLanguage = (value: string) => {
    setLanguageState(value);
    localStorage.setItem('votewise_lang', value);
    document.documentElement.lang = value;
  };

  const t = translations[language] || translations.en;

  const navLinks = [
    { name: t.features, href: '#features' },
    { name: t.howItWorks, href: '#how-it-works' },
    { name: t.compare, href: '#compare' },
    { name: t.lookup, href: '#lookup' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-nav-bg backdrop-blur-md border-b border-card-border" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
            V
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">
            VoteWise <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-primary dark:text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-bg-secondary transition-colors"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun aria-hidden="true" size={20} /> : <Moon aria-hidden="true" size={20} />}
          </button>
          
          <div className="hidden md:flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full border border-card-border hover:bg-bg-secondary transition-colors relative">
            <Globe aria-hidden="true" size={16} />
            <select
              aria-label="Select Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent appearance-none outline-none cursor-pointer pr-4 uppercase"
            >
              <option value="en" className="bg-bg-primary">EN</option>
              <option value="hi" className="bg-bg-primary">HI</option>
              <option value="gu" className="bg-bg-primary">GU</option>
            </select>
            <ChevronDown aria-hidden="true" size={14} className="absolute right-3 pointer-events-none" />
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-text-primary"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={cn(
        "fixed inset-0 top-[73px] bg-card-bg z-40 md:hidden transition-transform duration-300 ease-in-out px-6 py-8",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-semibold text-text-primary"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-card-border my-4" />
          <div className="flex items-center gap-3 text-lg font-medium">
            <Globe aria-hidden="true" size={24} />
            <label htmlFor="mobile-lang-select" className="sr-only">{t.changeLang}</label>
            <select
              id="mobile-lang-select"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setIsOpen(false);
              }}
              className="bg-transparent appearance-none outline-none cursor-pointer border-b border-card-border pb-1 w-full"
            >
              <option value="en" className="bg-bg-primary">English</option>
              <option value="hi" className="bg-bg-primary">हिंदी (Hindi)</option>
              <option value="gu" className="bg-bg-primary">ગુજરાતી (Gujarati)</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
