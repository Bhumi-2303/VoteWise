"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, RotateCcw, Copy, Check, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage, type Message } from '@/lib/api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your VoteWise AI assistant. How can I help you with election information today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await sendChatMessage([...messages, userMsg], "en");
      const aiReply: Message = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, aiReply]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-btn-primary-bg text-btn-primary-text rounded-full shadow-xl flex items-center justify-center transition-shadow hover:shadow-primary/30"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[80vh] bg-card-bg rounded-2xl shadow-2xl border border-card-border flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="VoteWise AI Chat Assistant"
          >
            {/* Header */}
            <div className="p-4 bg-btn-primary-bg text-btn-primary-text flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-bold">VoteWise AI</h3>
                  <div className="flex items-center gap-1.5 text-[10px] opacity-80">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Online & Neutral
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 hover:bg-bg-primary/10 rounded-lg transition-colors"
                title="Reset Conversation"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-chat-bg"
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] group relative ${
                    msg.role === 'user' 
                      ? 'bg-btn-primary-bg text-btn-primary-text rounded-2xl rounded-tr-none' 
                      : msg.role === 'system'
                        ? 'bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2'
                        : 'bg-card-bg border border-card-border rounded-2xl rounded-tl-none'
                  } p-4 shadow-sm`}>
                    {msg.role === 'system' && <AlertCircle size={16} />}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    
                    {msg.role === 'assistant' && (
                      <button 
                        onClick={() => copyToClipboard(msg.content, i)}
                        className="absolute -right-8 top-0 p-1 text-text-secondary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card-bg border border-card-border rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Prompts */}
            {messages.length === 1 && (
              <div className="p-4 bg-bg-secondary border-t border-card-border">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {["When is the next election?", "How to register?", "Who are the candidates?"].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="whitespace-nowrap px-3 py-1.5 bg-card-bg border border-card-border rounded-full text-xs font-medium hover:border-primary hover:text-primary transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-card-bg border-t border-card-border">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about candidates, voting..."
                  aria-label="Type your civic question here"
                  className="w-full pl-4 pr-12 py-3 bg-card-bg border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 text-primary hover:bg-primary/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-center text-text-secondary">
                AI can hallucinate. Verify info with official sources.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Lucide Sparkles is used
export default ChatWidget;
