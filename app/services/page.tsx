"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, Smartphone, Sparkles, Layout, 
  Zap, ArrowUpRight, CheckCircle2, Calendar, X
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link"; 
import { generatePremadePDF } from "./generatePremadePDF";

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

const plansData = {
  websites: [
    { 
      name: "Local Presence Express", 
      price: 1200, 
      days: 5, 
      desc: "Essential 1-page digital business card. Perfect for local service providers needing rapid validation.", 
      features: ["WordPress Core Deployment", "Responsive Visual Framework", "Contact & Lead Form Setup", "2 Years Domain + Cloud Hosting INC."] 
    },
    { 
      name: "Growth Catalyst", 
      price: 2400, 
      days: 10, 
      desc: "Standard 5-page business profile. Engineered to showcase services, portfolios, and capture organic leads.", 
      features: ["WordPress Elementor/Gutenberg Pro", "Up to 5 Tailored Page Architectures", "Basic Blog/News Functionality", "2 Years Domain + Cloud Hosting INC."] 
    },
    { 
      name: "Enterprise CMS Core", 
      price: 4200, 
      days: 20, 
      desc: "Robust Content Management layout using advanced Drupal or complex WordPress architectures for larger data needs.", 
      features: ["Drupal / Advanced WP Core Setup", "Custom Content Types & Taxonomies", "Enhanced Security & User Roles Framework", "2 Years Domain + Premium Hosting INC."] 
    }
  ],
  apps: [
    { 
      name: "WebView Hybrid MVP", 
      price: 3500, 
      days: 14, 
      desc: "Wrap your existing digital profile or web platform into an interactive, downloadable native mobile shell.", 
      features: ["Native iOS/Android Shell", "Push Notification Dashboard Setup", "App Store Submission Architecture", "Basic Splash Screen & Icon Configurations"] 
    },
    { 
      name: "CMS-Driven Mobile App", 
      price: 6800, 
      days: 25, 
      desc: "A headless mobile app that pulls all of its content directly from your WordPress or Drupal admin panel dashboard.", 
      features: ["Cross-Platform Mobile Build", "REST API / GraphQL Sync Layer", "Real-Time Content Update Pipeline", "App & Play Store Deployment Setup"] 
    },
    { 
      name: "Custom Feature Framework", 
      price: 11500, 
      days: 45, 
      desc: "Advanced mobile interface layer interacting with a localized relational database backend.", 
      features: ["Premium Interface Screens (Up to 12)", "User Authentication Profiles Setup", "Custom Plugin/Module Integrations", "Full UX Optimization Strategy"] 
    }
  ],
  hybrid: [
    { 
      name: "Starter Ecosystem", 
      price: 4200, 
      days: 20, 
      desc: "The ultimate package for new companies: a solid web profile linked with an accessible native mobile shell.", 
      features: ["5-Page WordPress Web Build", "WebView Hybrid Mobile Application", "Unified Contact Submission Layout", "2 Years Domain + Cloud Hosting INC."] 
    },
    { 
      name: "Omni-Channel Basic", 
      price: 8500, 
      days: 35, 
      desc: "Synchronized digital layer utilizing a central WordPress/Drupal engine feeding both web and mobile displays simultaneously.", 
      features: ["Headless CMS Architecture Layer", "High-Performance Modern Web Build", "API-Connected Mobile Core App", "2 Years Domain + Global Hosting INC."] 
    },
    { 
      name: "Titan Market Suite", 
      price: 14500, 
      days: 60, 
      desc: "Total digital operational footprint. Maximum scope deployment for businesses targeting market disruption.", 
      features: ["Full Advanced Drupal/WP Ecosystem", "Premium Cross-Platform Mobile System", "Integrated E-Commerce / Payment Vaults", "2 Years Enterprise Infrastructure Hosting"] 
    }
  ]
};

type CategoryType = 'websites' | 'apps' | 'hybrid';
type PlanType = 'weekly' | 'fortnightly' | 'monthly' | 'full';

interface SelectedPlanInfo {
  name: string;
  price: number;
  days: number;
  features: string[];
}

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('websites');
  const [paymentPlan, setPaymentPlan] = useState<PlanType>('monthly');

  // --- MODAL CONFIGURATION STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlanInfo | null>(null);
  const [clientForm, setClientForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    abn: ""
  });

  const calculateInstallments = (totalPrice: number, totalDays: number) => {
    if (paymentPlan === 'full') {
      return { 
        installment: totalPrice, 
        iterations: 1, 
        label: "Upfront Investment",
        subLabel: "Single Payment"
      };
    }

    let iterations = 12; 
    let label = "Per Month";
    let subLabel = "12 Monthly Payments";

    if (paymentPlan === "weekly") {
      iterations = 52;
      label = "Per Week";
      subLabel = "52 Weekly Installments";
    } else if (paymentPlan === "fortnightly") {
      iterations = 26;
      label = "Per Fortnight";
      subLabel = "26 Fortnightly Installments";
    }

    const installment = Math.round(totalPrice / iterations);
    return { installment, iterations, label, subLabel };
  };

  // --- TRIGGER ENGINE SHEET INTERCEPTOR ---
  const handleReviewDraftClick = (plan: SelectedPlanInfo) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // --- FORM DISPATCH & FILE DOWNSTREAM PIPELINE ---
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    generatePremadePDF({
      planName: selectedPlan.name,
      totalPrice: selectedPlan.price,
      totalDays: selectedPlan.days,
      features: selectedPlan.features,
      paymentPlan: paymentPlan,
      category: activeCategory,
      client: {
        firstName: clientForm.firstName.trim() || "Draft",
        lastName: clientForm.lastName.trim() || "Agreement",
        email: clientForm.email.trim() || "info@wirednomad.com",
        companyName: clientForm.companyName.trim() || undefined,
        abn: clientForm.abn.trim() || undefined
      }
    });

    setIsModalOpen(false); // Clean overlay view wrapper state
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans overflow-x-hidden">
      <Navbar /> 

      {/* --- SERVICES HERO SECTION --- */}
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

      {/* --- TRUST BAR SECTION --- */}
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

      {/* --- PREMADE PLANS SECTION --- */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent via-zinc-900/10 to-transparent relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 italic uppercase">
              PREMADE <span className="text-blue-600">PLANS.</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Select an optimized operational tier. Scale across flexible iterations designed to accommodate startup cash flows or enterprise speed requirements.
            </p>

            {/* Controls Base Wrapper */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
              
              {/* Category Switches */}
              <div className="p-1.5 bg-zinc-900/80 border border-white/5 rounded-2xl flex gap-2">
                {(['websites', 'apps', 'hybrid'] as CategoryType[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat === 'hybrid' ? 'Web + App' : cat}
                  </button>
                ))}
              </div>

              {/* Frequency Installments Switch */}
              <div className="p-1.5 bg-zinc-900/80 border border-white/5 rounded-2xl flex gap-2">
                {(['weekly', 'fortnightly', 'monthly', 'full'] as PlanType[]).map((plan) => (
                  <button
                    key={plan}
                    onClick={() => setPaymentPlan(plan)}
                    className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      paymentPlan === plan 
                        ? 'bg-white text-black font-black' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {plan === 'full' ? 'Upfront' : plan.replace('ly', '')}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Pricing Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <AnimatePresence mode="wait">
              {plansData[activeCategory].map((plan, idx) => {
                const { installment, label, subLabel } = calculateInstallments(plan.price, plan.days);
                
                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-8 rounded-[2.5rem] border backdrop-blur-sm relative flex flex-col justify-between h-full min-h-[580px] transition-all duration-300 ${
                      idx === 1 
                        ? 'bg-zinc-900/60 border-blue-500/50 shadow-2xl shadow-blue-500/5 scale-105 z-10' 
                        : 'bg-zinc-900/20 border-white/5 hover:border-white/10'
                    }`}
                  >
                    {idx === 1 && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                        Recommended
                      </span>
                    )}

                    {/* Top Details Content Block */}
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black uppercase tracking-tight italic leading-none">{plan.name}</h3>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold bg-black/40 px-3 py-1 rounded-lg shrink-0">
                          <Calendar size={12} className="text-blue-500" /> {plan.days} Days
                        </div>
                      </div>
                      
                      <p className="text-zinc-400 text-sm leading-relaxed mb-8">{plan.desc}</p>
                      
                      {/* Installments Math Panel */}
                      <div className="mb-8 p-6 bg-black/30 rounded-3xl border border-white/5">
                        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
                          {subLabel}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-black tracking-tighter text-white">
                            ${installment.toLocaleString('en-US')}
                          </span>
                          <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                            {label}
                          </span>
                        </div>
                        {paymentPlan !== 'full' && (
                          <div className="text-[11px] text-zinc-400 mt-2 border-t border-white/5 pt-2 flex justify-between">
                            <span>Total Contract Value:</span>
                            <span className="font-bold text-white">${plan.price.toLocaleString('en-US')} AUD</span>
                          </div>
                        )}
                      </div>

                      {/* Feature Checkpoints */}
                      <ul className="space-y-3.5 mb-8">
                        {plan.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-3 text-sm text-zinc-300">
                            <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Pipeline Stack */}
                    <div className="space-y-3 mt-auto w-full">
                  

                      <button
                        onClick={() => handleReviewDraftClick(plan)}
                       className={`w-full py-4 rounded-2xl text-center text-xs font-black uppercase tracking-widest transition-all duration-300 block ${
                          idx === 1
                            ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/10'
                            : 'bg-white text-black hover:bg-zinc-200'
                        }`}>
                        Deploy Project Tier
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 border-y border-white/5 bg-zinc-900/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center"> 
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>
      </section>

      {/* --- CLIENT CONTEXT OVERLAY MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Backdrop Shadow */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Modal Sheet Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-[2rem] p-8 relative z-10 overflow-hidden shadow-2xl text-left"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2 text-white">
                Client <span className="text-blue-500">Details.</span>
              </h3>
              <p className="text-zinc-400 text-xs mb-6">
                Input your business credentials to automatically configure and map the generated ecosystem agreement document.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1.5 tracking-wider">First Name</label>
                    <input 
                      type="text" required
                      value={clientForm.firstName}
                      onChange={(e) => setClientForm({...clientForm, firstName: e.target.value})}
                      className="w-full bg-black/50 border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1.5 tracking-wider">Last Name</label>
                    <input 
                      type="text" required
                      value={clientForm.lastName}
                      onChange={(e) => setClientForm({...clientForm, lastName: e.target.value})}
                      className="w-full bg-black/50 border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1.5 tracking-wider">Email Address</label>
                  <input 
                    type="email" required
                    value={clientForm.email}
                    onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                    className="w-full bg-black/50 border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1.5 tracking-wider">Company Name (Optional)</label>
                  <input 
                    type="text"
                    value={clientForm.companyName}
                    onChange={(e) => setClientForm({...clientForm, companyName: e.target.value})}
                    className="w-full bg-black/50 border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1.5 tracking-wider">ABN (Optional)</label>
                  <input 
                    type="text"
                    value={clientForm.abn}
                    onChange={(e) => setClientForm({...clientForm, abn: e.target.value})}
                    className="w-full bg-black/50 border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20"
                >
                  Generate & Download Agreement
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <Footer/>
    </div>
  );
}