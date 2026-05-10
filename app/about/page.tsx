"use client"
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // Assuming Next.js for routing
import { Code2, Palette, ShieldCheck, Zap, Globe2, Briefcase, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Shield, Trophy, Smartphone, Layout, Sparkles, 
  Volume2, Waves, Brain, Box, Building2, 
  UserPlus, GraduationCap, Cpu, Landmark 
} from "lucide-react";
const metrics = [
  { label: "Years Experience", value: "10+" },
  { label: "Projects Deployed", value: "40+" },
  { label: "Core Languages", value: "3" },
  { label: "Lines of Code", value: "1M+" },
];

// Added a dedicated logos array for the marquee
const clientLogos = [
  { name: "Cobra Group", icon: Shield },
  { name: "TrainElitePro", icon: Trophy },
  { name: "VERA", icon: Smartphone },
  { name: "Slot", icon: Layout },
  { name: "AURA", icon: Sparkles },
  { name: "SHOUTITOUT", icon: Volume2 },
  { name: "SNUGSTREAM", icon: Waves },
  { name: "TRIVIAL", icon: Brain },
  { name: "AUSBLOCK", icon: Box },
  { name: "NCOA", icon: Building2 },
  { name: "XRECRUITER", icon: UserPlus },
  { name: "UNSW", icon: GraduationCap },
  { name: "SONDA", icon: Cpu },
  { name: "USACH", icon: Landmark },
];
const displayLogos = [...clientLogos, ...clientLogos];

const clients = [
  { name: "Cobra Group", role: "Digital Communications & Systems", year: "2025 - Present" },
  { name: "TrainElitePro", role: "Fitness Platform Architecture", year: "2026" },
  { name: "VERA App", role: "Android Development & UX", year: "2025" },
];

export default function AboutPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-blue-500 font-mono text-sm tracking-widest uppercase mb-4 block">
              Architecting Digital Experiences
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
              Engineering <br/> <span className="text-zinc-600">meets</span> Design.
            </h1>
            <p className="text-zinc-400 text-xl leading-relaxed max-w-xl">
              Based in Sydney, I bridge the gap between complex software engineering 
              and intuitive digital design. I don't just build websites; I engineer 
              accessible, high-performance systems.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="p-8 bg-zinc-900/30 border border-white/5 rounded-3xl">
                <div className="text-4xl font-black text-blue-500 mb-2">{m.value}</div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* NEW: Animated Logo Marquee */}
<section className="py-20 border-y border-white/5 bg-black overflow-hidden relative">
  <div className="mb-10 text-center">
    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
      Trusted By Innovators
    </span>
  </div>

  {/* The Track */}
  <div className="flex overflow-hidden">
      <motion.div 
      className="flex gap-20 items-center whitespace-nowrap"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ ease: "linear", duration: 30, repeat: Infinity }}
    >
      {/* Render the list twice for the seamless loop */}
      {[...clientLogos, ...clientLogos].map((logo, i) => (
        <div key={i} className="flex items-center gap-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default group">
          <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-500">
            <logo.icon size={24} className="text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-zinc-400 uppercase group-hover:text-white transition-colors">
            {logo.name}
          </span>
        </div>
      ))}
    </motion.div>
  </div>

  {/* Gradient Overlays to hide the "pop" at edges */}
  <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
  <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
</section>


      {/* The "Why" Section */}
      <section className="py-24 bg-zinc-900/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Code2 />} 
              color="text-blue-500" 
              title="Technical Depth" 
              desc="From Next.js and Supabase to native Android, I focus on clean, scalable codebases." 
            />
            <FeatureCard 
              icon={<Palette />} 
              color="text-purple-500" 
              title="Visual Strategy" 
              desc="I prioritize usability and WCAG accessibility standards using Figma and Adobe Suite." 
            />
            <FeatureCard 
              icon={<Globe2 />} 
              color="text-emerald-500" 
              title="Global Perspective" 
              desc="Fluent in English, Spanish, and Mandarin, I build products for a diverse global audience." 
            />
          </div>
        </div>
      </section> 

      {/* Final CTA - Linked to Contact */}
      <section className="pb-32 px-6 text-center">
        <div className="max-w-3xl mx-auto border-t border-white/5 pt-32">
          <h2 className="text-4xl font-black tracking-tighter mb-6 italic uppercase">Let's build the future <span className="text-blue-600">together.</span></h2>
          <p className="text-zinc-500 mb-10 italic">Currently accepting specialized projects in Sydney and worldwide for 2026.</p>
          
          <Link href="/contact">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white text-black px-10 py-5 rounded-full font-black uppercase text-sm tracking-[0.2em] inline-flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all"
            >
              Start a Conversation <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, color, title, desc }: any) {
  return (
    <div className="space-y-4 p-4 hover:bg-white/5 rounded-2xl transition-colors">
      <div className={`w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
// Helper component for cleaner code
function LogoItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-4 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default group">
      <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-400 transition-all">
         <div className="w-2 h-2 bg-blue-500 rounded-full" />
      </div>
      <span className="text-3xl font-black tracking-tighter text-zinc-400 uppercase group-hover:text-white transition-colors">
        {name}
      </span>
    </div>
  );
}