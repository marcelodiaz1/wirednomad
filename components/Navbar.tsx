"use client"
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Rocket, ChevronRight, Globe, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { dictionaries, Locale } from "@/lib/dictionaries";
 
const menuVariants: Variants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      when: "afterChildren",
    },
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  closed: { opacity: 0, y: -10 },
  open: { opacity: 1, y: 0 },
};

interface NavbarProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function Navbar({ locale, onLocaleChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = dictionaries[locale].navbar;

  const navLinks = [
    { name: t.home, href: "/" },
    { name: t.services, href: "/services" },
    { name: t.about, href: "/about" },
    { name: t.contact, href: "/contact" },
  ];

  return (
    <div className="fixed top-6 w-full z-[100] px-4 sm:px-6 flex flex-col items-center">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-5xl flex items-center justify-between p-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] relative z-20"
      >
        {/* Logo Section */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2 pl-4 pr-4 sm:pr-6 border-r border-white/10 group"
        >
          <Rocket
            className="text-blue-500 group-hover:rotate-12 transition-transform duration-300"
            fill="currentColor"
            size={22}
          />
          <span className="font-black text-sm tracking-[0.2em] italic uppercase">
            Wired<span className="text-blue-500">Nomad</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 px-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors"
              >
                <span
                  className={`relative z-10 ${
                    isActive ? "text-white" : "text-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {link.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-blue-600/10 rounded-full border border-blue-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Controls & Mobile Toggle */} 
         <div className="hidden md:flex items-center gap-1 px-2">
        {/* Call to Action */}
              <Link
                href="/quote"
                onClick={() => setIsOpen(false)}
                className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white pl-4 sm:pl-5 pr-3 sm:pr-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-500/20 overflow-hidden"
              >
                <span className="relative z-10">{t.startProject}</span>
                <ChevronRight
                  size={14}
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                />
                {/* Animated Shine Effect */}
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                />
              </Link>
         </div>
          
        {/* Desktop Language Switcher */}
        <div className="hidden lg:flex items-center gap-1 bg-zinc-900/80 border border-white/5 p-1 rounded-full">
          <Globe size={14} className="text-zinc-500 ml-2 mr-1" />
          {(["en", "es", "zh-TW"] as Locale[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLocaleChange(lang)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                locale === lang
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {lang === "zh-TW" ? "繁中" : lang === "es" ? "ES" : "EN"}
            </button>
          ))}
        </div>

        {/* Action Controls & Mobile Toggle */}
        <div className="flex items-center gap-2 pr-1">
         

          {/* Animated Hamburger Toggle Button (Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2.5 rounded-full bg-zinc-900/80 border border-white/10 text-white hover:bg-zinc-800 transition-colors focus:outline-none"
          >
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {isOpen ? <X size={18} className="text-blue-500" /> : <Menu size={18} />}
            </motion.div>
          </button>
        </div>
      </motion.nav>

      {/* Animated Mobile Overlay Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="w-full max-w-5xl mt-3 p-6 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col gap-6 md:hidden z-10"
          >
            {/* Navigation Links */}
            <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        isActive
                          ? "bg-blue-600/10 border border-blue-500/30 text-white"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                      )}
                    </Link>
                    
                  </motion.div>
                );
              })}
              
            </div>
            <motion.div 
            variants={itemVariants} >
                  {/* Call to Action */}
              <Link
                href="/quote"
                onClick={() => setIsOpen(false)}
                className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white pl-4 sm:pl-5 pr-3 sm:pr-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-500/20 overflow-hidden"
              >
                <span className="relative z-10">{t.startProject}</span>
                <ChevronRight
                  size={14}
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                />
                {/* Animated Shine Effect */}
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                />
              </Link>
            </motion.div>
            {/* Mobile Language Switcher */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between bg-zinc-900/80 border border-white/5 p-2 rounded-2xl"
            >
              
              <div className="flex items-center gap-2 text-zinc-400 px-2">
                <Globe size={16} />
                <span className="text-[11px] font-black uppercase tracking-wider">Language</span>
              </div>
              <div className="flex items-center gap-1">
                {(["en", "es", "zh-TW"] as Locale[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onLocaleChange(lang);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      locale === lang
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {lang === "zh-TW" ? "繁中" : lang === "es" ? "ES" : "EN"}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}