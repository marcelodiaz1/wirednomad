"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, ArrowRight, Zap, ShieldCheck, 
  TrendingUp, BarChart3, Layout, Code, 
  Mail, MessageSquare, Rocket, Globe 
} from "lucide-react";
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

const STEPS = [
  {
    title: "Instant Quote",
    desc: "Use our interactive calculator to get a transparent investment estimate in under 60 seconds.",
    icon: <Zap className="text-yellow-400" size={24} />,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Digital Agreement",
    desc: "Receive an automated email with your project breakdown and a secure link to finalize the agreement.",
    icon: <Mail className="text-blue-400" size={24} />,
    image: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Strategy Session",
    desc: "We dive deep into your goals, user personas, and technical requirements to map out the architecture.",
    icon: <MessageSquare className="text-purple-400" size={24} />,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Project Kickoff",
    desc: "Development begins in a shared staging environment. You watch your vision come to life in real-time.",
    icon: <Rocket className="text-emerald-400" size={24} />,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1000&auto=format&fit=crop"
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
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      <Navbar />
      
      {/* 1. HERO SECTION */}
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
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms]"
              style={{ backgroundImage: `url(${SLIDES[currentSlide].image})`, transform: 'scale(1.1)' }}
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            key={`text-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
             <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-8">
              Available for Q3 Projects
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 uppercase italic">
              {SLIDES[currentSlide].title} <br /> 
              <span className="text-blue-500">{SLIDES[currentSlide].accent}</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-zinc-400 mb-12 font-medium">
              We engineer high-performance digital ecosystems designed to convert visitors into loyal customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/quote" className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20">
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

      {/* 2. TRUST BAR */}
      <section className="py-16 border-y border-zinc-900 bg-black text-center">
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Industry Standard Stack</p>
        <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-40 grayscale px-6">
            <div className="text-xl md:text-2xl font-black tracking-tighter">VERCEL</div>
            <div className="text-xl md:text-2xl font-black tracking-tighter">SUPABASE</div>
            <div className="text-xl md:text-2xl font-black tracking-tighter">STRIPE</div>
            <div className="text-xl md:text-2xl font-black tracking-tighter">FIGMA</div>
            <div className="text-xl md:text-2xl font-black tracking-tighter">NODE.JS</div>
        </div>
      </section>

      {/* 3. CONVINCING BENTO SECTION */}
    <section className="py-32 px-6 max-w-7xl mx-auto">
  <div className="grid lg:grid-cols-3 gap-6">
    {/* 1. Large Feature - Now with Image Background to fill the height */}
    <div className="lg:col-span-2 relative overflow-hidden bg-zinc-900 rounded-[3rem] min-h-[450px] shadow-2xl group border border-white/5">
      {/* Background Image */}
      <img 
        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
        alt="Tech Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
      />
      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-blue-900/40 to-transparent z-10" />
      
      <div className="relative z-20 p-12 h-full flex flex-col justify-between">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
          <Zap className="text-white" size={32} />
        </div>
        <div>
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase italic leading-none text-white">
            Unmatched <br /> Speed-to-Market.
          </h3>
          <p className="text-blue-100 text-lg max-w-md font-medium">
            While others take months, we leverage custom boilerplates to ship enterprise-grade apps in weeks, not months.
          </p>
        </div>
      </div>
    </div>

    {/* 2. SEO Dominance */}
 {/* 2. SEO Dominance - Now also tall with Image Background */}
<div className="relative overflow-hidden bg-zinc-900 rounded-[3rem] min-h-[450px] shadow-2xl group border border-white/5 hover:border-emerald-500/30 transition-all duration-500">
  {/* Background Image */}
 <img 
        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2026" 
        alt="Data Analytics"
        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
      />
  {/* Gradient Overlay for Readability - Emerald theme */}
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/60 via-emerald-900/30 to-transparent z-10" />
  
  <div className="relative z-20 p-12 h-full flex flex-col justify-between">
    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-shadow duration-500">
      <TrendingUp className="text-white" size={32} />
    </div>
    <div>
      <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase italic leading-none text-white">
        SEO <br /> Dominance.
      </h3>
      <p className="text-emerald-100 text-lg max-w-md font-medium">
        Every line of code is optimized for Core Web Vitals, ensuring your app loads instantly and ranks higher on Google from day one.
      </p>
    </div>
  </div>
</div>

    {/* 3. Global Edge (New) */}
    <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] flex flex-col justify-between group hover:border-blue-500/30 transition-all duration-500">
      <Globe className="text-blue-500 group-hover:rotate-12 transition-transform" size={48} />
      <div>
        <h4 className="text-2xl font-bold mb-2">Global Delivery</h4>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Edge-computing deployment ensures your app loads instantly for users in Sydney, London, or New York.
        </p>
      </div>
    </div>

    {/* 4. Accessibility/WCAG (New) */}
    <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] flex flex-col justify-between group hover:border-orange-500/30 transition-all duration-500">
      <Layout className="text-orange-500 group-hover:scale-110 transition-transform" size={48} />
      <div>
        <h4 className="text-2xl font-bold mb-2">Inclusive Design</h4>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Strict WCAG 2.1 compliance ensures your digital products are accessible to everyone, everywhere.
        </p>
      </div>
    </div>

    {/* 5. Bulletproof Security */}
    <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] flex flex-col justify-between group hover:border-purple-500/30 transition-all duration-500">
      <ShieldCheck className="text-purple-500 group-hover:scale-110 transition-transform" size={48} />
      <div>
        <h4 className="text-2xl font-bold mb-2">Secure by Default</h4>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Enterprise-grade encryption and Row-Level Security (RLS) keeping your user data locked tight.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* 4. SERVICES SECTION */}
      <section id="services" className="py-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight italic uppercase">
              Engineering <span className="text-blue-500">Results.</span>
            </h2>
            <div className="space-y-10">
              <ServiceItem icon={<BarChart3 className="text-blue-400" />} title="Conversion UX" desc="Data-driven design that turns passive visitors into high-value customers." />
              <ServiceItem icon={<Code className="text-purple-400" />} title="Next.js Core" desc="Ultra-fast performance using Server Components and ISR for 100/100 speed scores." />
              <ServiceItem icon={<Globe className="text-emerald-400" />} title="Scalable Architecture" desc="Cloud-native solutions designed to handle thousands of concurrent users." />
            </div>
          </div>
          
          <div className="bg-zinc-900/30 border border-white/5 p-12 rounded-[3.5rem] text-center backdrop-blur-sm relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6">Need a custom quote?</h3>
              <p className="text-zinc-500 mb-10 text-lg">Discover your project's investment in real-time with our transparent calculator.</p>
              <Link href="/quote" className="inline-flex h-16 px-12 rounded-2xl bg-white text-black font-black items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-white/5">
                Launch Calculator <ArrowRight />
              </Link>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-colors" />
          </div>
      </section>

      {/* 5. THE 4-STEP PROCESS (TIMELINE) */}
      <section className="py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 italic uppercase">
              How to <span className="text-blue-600">Hire.</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto font-medium text-lg">
              A frictionless onboarding experience designed for modern founders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-black text-xl z-20 shadow-xl shadow-blue-600/40 border-4 border-black">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all h-full flex flex-col">
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  </div>
                  <div className="p-8 pt-4 flex-grow">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform origin-left">{step.icon}</div>
                    <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">{step.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
                
                {/* Connector Line (Desktop Only) */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-zinc-800 z-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Sub-component for Services
function ServiceItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-6 group">
      <div className="h-16 w-16 shrink-0 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.15)]">
        {icon}
      </div>
      <div>
        <h4 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{title}</h4>
        <p className="text-zinc-500 leading-relaxed text-sm font-medium">{desc}</p>
      </div>
    </div>
  );
}