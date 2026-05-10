"use client"
import React from "react";
import { motion } from "framer-motion";
import { 
  Code2, Smartphone, Sparkles, Layout, 
  Database, ShieldCheck, Zap, Globe, ArrowUpRight 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
// Import your actual components here
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

const services = [
  {
    title: "Web Engineering",
    description: "High-performance web applications built with Next.js, React, and TypeScript. Optimized for speed, SEO, and accessibility.",
    icon: <Code2 className="text-blue-500" />,
    features: ["Custom SaaS Platforms", "E-commerce Solutions", "Performance Audits"]
  },
  {
    title: "Mobile Ecosystems",
    description: "Native-feel iOS and Android applications. We focus on smooth animations and offline-first architectures.",
    icon: <Smartphone className="text-purple-500" />,
    features: ["React Native Development", "Cross-platform Sync", "App Store Optimization"]
  },
  {
    title: "AI & Automation",
    description: "Integrating LLMs and autonomous agents into your workflow to automate content, customer service, and data analysis.",
    icon: <Sparkles className="text-amber-500" />,
    features: ["AI Content Engines", "Custom GPT Integration", "Workflow Automation"]
  },
  {
    title: "UI/UX Strategy",
    description: "User-centric design that converts. We bridge the gap between complex functionality and intuitive visual language.",
    icon: <Layout className="text-emerald-500" />,
    features: ["High-fidelity Prototyping", "User Journey Mapping", "Design Systems"]
  }
];

export default function ServicesPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans">
     <Navbar /> 

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-8 italic uppercase"
            >
              Our <span className="text-blue-600">Expertise.</span>
            </motion.h1>
            <p className="text-zinc-400 text-xl leading-relaxed">
              We build digital products that combine technical excellence with 
              disruptive design. From startups to enterprises, we deliver 
              scalable solutions that drive growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-24">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-10 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] hover:bg-zinc-900/50 transition-all"
              >
                <div className="mb-6 p-4 bg-black rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">{service.title}</h3>
                <p className="text-zinc-500 mb-8 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-10">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
                      <Zap size={14} className="text-blue-500" /> {feat}
                    </li>
                  ))}
                </ul>
                <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-500 group-hover:text-white transition-colors">
                  Learn More <ArrowUpRight size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar Section */}
      <section className="py-20 border-y border-white/5 bg-zinc-900/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl font-black mb-2">99%</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Uptime Guaranteed</div>
          </div>
          <div>
            <div className="text-4xl font-black mb-2">10+</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Years Experience</div>
          </div>
          <div>
            <div className="text-4xl font-black mb-2">24/7</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Priority Support</div>
          </div>
          <div>
            <div className="text-4xl font-black mb-2">WCAG</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Accessibility Lead</div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-32 border-y border-white/5 bg-zinc-900/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center"> 
          {/* ^ This div centers everything and adds side padding */}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12 italic uppercase">
              Ready to start your <br />
              <span className="text-blue-600">next project?</span>
            </h2>
            
            <Link 
              href="/quote" 
              className="inline-block bg-white text-black px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-600 hover:text-white hover:scale-105 transition-all duration-300 shadow-2xl shadow-white/5"
            >
              Get a quote 
            </Link>
          </motion.div>
        </div>

        {/* Optional: Subtle ambient glow to make it "pop" */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>
      </section>
        <Footer/>
    </div>
  );
}