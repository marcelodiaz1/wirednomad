"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Zap, ShieldCheck, TrendingUp, BarChart3, Layout, Code } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    title: "We Build Apps That Scale.",
    accent: "Scale Your Revenue."
  },
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    title: "Security By Design.",
    accent: "Next.js + Supabase."
  },
  {
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1974&auto=format&fit=crop",
    title: "Design That Converts.",
    accent: "Experience Excellence."
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 font-sans">
      <Navbar />
      
      {/* ⚡ 1. ANIMATED SLIDESHOW HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] scale-110"
              style={{ backgroundImage: `url(${SLIDES[currentSlide].image})`, transform: 'scale(1.05)' }}
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 text-center px-6">
          <motion.div
            key={`text-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
             <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-8">
              Available for Q3 Projects
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">
              {SLIDES[currentSlide].title} <br /> 
              <span className="text-blue-500">{SLIDES[currentSlide].accent}</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-zinc-400 mb-12 font-medium">
              We engineer high-performance digital ecosystems designed to convert visitors into loyal customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/quote" className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center gap-3">
                Start Your Project <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 flex gap-3">
          {SLIDES.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-12 bg-blue-500' : 'w-4 bg-zinc-800'}`} 
            />
          ))}
        </div>
      </section>

      {/* 🏆 2. TRUST BAR */}
      <section className="py-16 border-y border-zinc-900 bg-zinc-950/50 text-center">
        <p className="text-zinc-600 text-xs font-bold uppercase tracking-[0.3em] mb-10">Industry Standard Partners</p>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale">
            <div className="text-2xl font-black tracking-tighter">VERCEL</div>
            <div className="text-2xl font-black tracking-tighter">SUPABASE</div>
            <div className="text-2xl font-black tracking-tighter">STRIPE</div>
            <div className="text-2xl font-black tracking-tighter">FIGMA</div>
        </div>
      </section>

      {/* 🛠️ 3. SERVICES SECTION */}
      <section id="services" className="py-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Engineering <span className="text-blue-500">Results.</span>
            </h2>
            <div className="space-y-10">
              <ServiceItem icon={<BarChart3 className="text-blue-400" />} title="Conversion UX" desc="Data-driven design that turns users into revenue." />
              <ServiceItem icon={<Code className="text-purple-400" />} title="Next.js Core" desc="Static generation and server components for 100/100 speed." />
              <ServiceItem icon={<ShieldCheck className="text-emerald-400" />} title="Supabase Cloud" desc="Real-time databases with enterprise-level encryption." />
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-[3rem] text-center">
            <h3 className="text-3xl font-bold mb-6">Need a custom quote?</h3>
            <p className="text-zinc-400 mb-10">Discover your project's investment in real-time with our interactive calculator.</p>
            <Link href="/quote" className="inline-flex h-16 px-12 rounded-2xl bg-white text-black font-black items-center gap-3 hover:scale-105 transition-transform">
              Launch Calculator <ArrowRight />
            </Link>
          </div>
      </section>

      <Footer />
    </div>
  );
}

function ServiceItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-6 group">
      <div className="h-14 w-14 shrink-0 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-zinc-400 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  );
}