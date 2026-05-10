"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, ChevronLeft, Send, Sparkles, Clock, 
  ShieldCheck, Smartphone, Globe, Palette, FileText,
  Zap, Bell, MapPin, Camera, Share2, Database, Layers,
  Server, HardDrive
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Import the service you created in the previous step
import { generateWiredNomadPDF } from "./pdf-service";  
const pricingData = {
  platforms: {
    website: { price: 1500, days: 10, perPagePrice: 250, perPageDays: 2 },
    mobileApp: { price: 3000, days: 20 },
  },
  features: [
    { id: "auth", label: "User Auth (Supabase)", price: 600, days: 4 },
    { id: "stripe", label: "Stripe Payments", price: 800, days: 5 },
    { id: "cms", label: "CMS Integration", price: 500, days: 3 },
    { id: "seo", label: "Advanced SEO", price: 400, days: 2 },
    { id: "pwa", label: "PWA Support", price: 700, days: 4 },
    { id: "logo", label: "Branding & Logo", price: 600, days: 5 },
  ],
  appSpecificFeatures: [
    { id: "push", label: "Push Notifications", price: 450, days: 3, Icon: Bell },
    { id: "geo", label: "Geolocation/Maps", price: 900, days: 7, Icon: MapPin },
    { id: "camera", label: "Camera Access", price: 600, days: 4, Icon: Camera },
    { id: "social", label: "Social Sharing", price: 300, days: 2, Icon: Share2 },
    { id: "db_sync", label: "Real-time Sync", price: 1500, days: 12, Icon: Database },
    { id: "offline", label: "Offline Mode", price: 1200, days: 10, Icon: Zap },
  ],
  infrastructure: {
    domain: [
      { id: "dom_1", label: "1 Year Registration", price: 20 },
      { id: "dom_2", label: "2 Years Registration", price: 38 },
      { id: "dom_5", label: "5 Years (Long-term)", price: 85 },
    ],
    hosting: [
      { id: "host_basic", label: "Standard Cloud", price: 150, desc: "Best for simple sites" },
      { id: "host_pro", label: "Performance SSD", price: 350, desc: "High traffic handling" },
      { id: "host_ent", label: "Dedicated Instance", price: 800, desc: "App-level power" },
    ]
  }
};

export default function AdvancedQuotePage() {
  const [platform, setPlatform] = useState({ web: true, app: false });
  const [webPages, setWebPages] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedAppFeatures, setSelectedAppFeatures] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("dom_1");
  const [selectedHosting, setSelectedHosting] = useState("host_basic");
  const [maintenanceMonths, setMaintenanceMonths] = useState(3);
  const [paymentPlan, setPaymentPlan] = useState("milestones");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
const [errors, setErrors] = useState<string[]>([]);

  // New handler calling the external service
// 1. New State for Client Info
const [clientData, setClientData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  companyName: "",
  abn: ""
});

// 2. Updated handleDownload with Validation
const handleDownload = () => {
  const newErrors: string[] = [];

  // Platform Validation
  if (!platform.web && !platform.app) newErrors.push("platform");

  // Client Data Validation (Required fields)
  if (!clientData.firstName) newErrors.push("firstName");
  if (!clientData.lastName) newErrors.push("lastName");
  if (!clientData.email.includes("@")) newErrors.push("email");
  if (!clientData.phone) newErrors.push("phone");

  if (newErrors.length > 0) {
    setErrors(newErrors);
    const firstError = document.getElementById(newErrors[0]);
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  setErrors([]);

  // Pass clientData to the PDF generator
  generateWiredNomadPDF({
    totalPrice,
    totalDays,
    platform,
    webPages,
    selectedAppFeatures,
    selectedFeatures,
    selectedDomain,
    selectedHosting,
    maintenanceMonths,
    paymentPlan,
    pricingData,
    client: clientData // <--- New field
  });
};

  useEffect(() => {
    let price = 0;
    let days = 0;

    if (platform.web) { 
      price += pricingData.platforms.website.price + (webPages - 1) * pricingData.platforms.website.perPagePrice; 
      days += pricingData.platforms.website.days + (webPages - 1) * pricingData.platforms.website.perPageDays; 
    }
    
    if (platform.app) { 
      price += pricingData.platforms.mobileApp.price; 
      days += pricingData.platforms.mobileApp.days; 
      selectedAppFeatures.forEach(id => {
        const feature = pricingData.appSpecificFeatures.find(f => f.id === id);
        if (feature) { price += feature.price; days += feature.days; }
      });
    } else {
      if (selectedAppFeatures.length > 0) setSelectedAppFeatures([]);
    }

    selectedFeatures.forEach(id => {
      const feature = pricingData.features.find(f => f.id === id);
      if (feature) { price += feature.price; days += feature.days; }
    });

    const dom = pricingData.infrastructure.domain.find(d => d.id === selectedDomain);
    const host = pricingData.infrastructure.hosting.find(h => h.id === selectedHosting);
   price += (dom?.price || 0) + (host?.price || 0) + (maintenanceMonths * 150);

    // Apply Incentive/Surcharge Strategy
    switch (paymentPlan) {
      case "50-50":
        price *= 0.90; // 10% Discount
        break;
      case "weekly":
        price *= 0.95; // 5% Discount
        break;
      case "fortnightly":
        price *= 1.00; // Baseline (Standard)
        break;
      case "milestones":
        price *= 1.05; // 5% Surcharge
        break;
      case "monthly":
        price *= 1.08; // 8% Surcharge
        break;
      case "daily":
        price *= 1.15; // 15% Surcharge
        break;
      default:
        break;
    }

    setTotalPrice(price);
    setTotalDays(days);
  }, [platform, webPages, selectedFeatures, selectedAppFeatures, selectedDomain, selectedHosting, maintenanceMonths, paymentPlan]);

  return ( 
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 font-sans">
      <Navbar/>
      <header className="pt-32 pb-12 px-6 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">
            Instant Estimates v2.0
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Transparent Pricing.
          </h1>
        </motion.div>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16  pb-40">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-6 font-mono">01. Core Platform</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <PlatformBox 
                active={platform.web} 
                onClick={() => {
                  // Only allow toggle if the OTHER platform is active
                  if (!platform.web || platform.app) {
                    setPlatform(prev => ({...prev, web: !prev.web}));
                    setErrors(prev => prev.filter(e => e !== "platform"));
                  }
                }}
                icon={<Globe />} 
                label="Web Application" 
                price={pricingData.platforms.website.price}
              />
              
              <PlatformBox 
                active={platform.app} 
                onClick={() => {
                  // Only allow toggle if the OTHER platform is active
                  if (!platform.app || platform.web) {
                    setPlatform(prev => ({...prev, app: !prev.app}));
                    setErrors(prev => prev.filter(e => e !== "platform"));
                  }
                }}
                icon={<Smartphone />} 
                label="iOS & Android App" 
                price={pricingData.platforms.mobileApp.price}
              />
            </div>

            <AnimatePresence mode="wait">
              {platform.web && (
                <motion.div key="web-config" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 mb-6 overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-zinc-300">Total Unique Web Pages</span>
                    <span className="text-3xl font-black text-blue-500">{webPages}</span>
                  </div>
                  <input type="range" min="1" max="25" value={webPages} onChange={(e) => setWebPages(parseInt(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {platform.app && (
                <motion.div key="app-config" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">App Functionalities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {pricingData.appSpecificFeatures.map(({ id, label, price, Icon }) => (
                      <button 
                        key={id} 
                        onClick={() => setSelectedAppFeatures(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} 
                        className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${selectedAppFeatures.includes(id) ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 bg-zinc-900/30'}`}
                      >
                        <div className={selectedAppFeatures.includes(id) ? 'text-blue-500' : 'text-zinc-600'}>
                          <Icon size={16} />
                        </div>
                        <span className="text-[11px] font-bold leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-6 font-mono">02. Infrastructure Hire</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase mb-4 block">Domain Registration</label>
                <div className="space-y-2">
                  {pricingData.infrastructure.domain.map(d => (
                    <button key={d.id} onClick={() => setSelectedDomain(d.id)} className={`w-full p-4 rounded-xl border text-sm flex justify-between items-center transition-all ${selectedDomain === d.id ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 bg-zinc-900/30'}`}>
                      {d.label} <span className="font-mono text-blue-400">${d.price}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase mb-4 block">Cloud Hosting Tier</label>
                <div className="space-y-2">
                  {pricingData.infrastructure.hosting.map(h => (
                    <button key={h.id} onClick={() => setSelectedHosting(h.id)} className={`w-full p-4 rounded-xl border text-left transition-all ${selectedHosting === h.id ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 bg-zinc-900/30'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm">{h.label}</span>
                        <span className="font-mono text-xs text-blue-400">${h.price}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 italic">{h.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-6 font-mono">03. Shared Modules</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {pricingData.features.map((f) => (
                <FeatureToggle 
                  key={f.id}
                  active={selectedFeatures.includes(f.id)}
                  onClick={() => setSelectedFeatures(prev => prev.includes(f.id) ? prev.filter(i => i !== f.id) : [...prev, f.id])}
                  label={f.label}
                  price={f.price}
                />
              ))}
            </div>
          </section>

          
          <section className="grid sm:grid-cols-2 gap-8">
            {/* 04. Maintenance */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-6 font-mono">04. Maintenance</h2>
              <select 
                value={maintenanceMonths} 
                onChange={(e) => setMaintenanceMonths(Number(e.target.value))} 
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-blue-500 outline-none"
              >
                <option value={3}>3 Months Priority Support</option>
                <option value={6}>6 Months Priority Support</option>
                <option value={12}>1 Year Managed Support</option>
              </select>
            </div>

            {/* 05. Strategy */}
            <div id="strategy-section" className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 font-mono">05. Payment plan</h2> 
                {!paymentPlan && <span className="text-red-500 text-[10px] font-bold uppercase">Selection Required</span>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Row 1: High Incentive / Standard */}
                <PaymentOption 
                  current={paymentPlan} 
                  set={setPaymentPlan} 
                  id="50-50" 
                  title="50/50" 
                  desc="10% OFF" 
                />
                <PaymentOption 
                  current={paymentPlan} 
                  set={setPaymentPlan} 
                  id="weekly" 
                  title="Weekly" 
                  desc="5% OFF" 
                />
                <PaymentOption 
                  current={paymentPlan} 
                  set={setPaymentPlan} 
                  id="fortnightly" 
                  title="Fortnightly" 
                  desc="STD" 
                />

                {/* Row 2: Management Surcharges */}
                <PaymentOption 
                  current={paymentPlan} 
                  set={setPaymentPlan} 
                  id="milestones" 
                  title="Milestones" 
                  desc="+5%" 
                />
                <PaymentOption 
                  current={paymentPlan} 
                  set={setPaymentPlan} 
                  id="monthly" 
                  title="Monthly" 
                  desc="+8%" 
                />
                <PaymentOption 
                  current={paymentPlan} 
                  set={setPaymentPlan} 
                  id="daily" 
                  title="Daily" 
                  desc="+15%" 
                />
              </div>
            </div>
          </section>
            <section id="client-info-section">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-6 font-mono">06. Client Identification</h2>
              
              <div className="grid sm:grid-cols-2 gap-6 bg-zinc-900/30 p-8 rounded-[2.5rem] border border-zinc-800">
                {/* First Name */}
                <div id="firstName" className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">First Name *</label>
                  <input 
                    type="text" 
                    value={clientData.firstName}
                    onChange={(e) => setClientData({...clientData, firstName: e.target.value})}
                    className={`w-full bg-zinc-950 border ${errors.includes("firstName") ? 'border-red-500' : 'border-zinc-800'} p-4 rounded-xl focus:border-blue-500 outline-none transition-all`}
                    placeholder="John"
                  />
                </div>

                {/* Last Name */}
                <div id="lastName" className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Last Name *</label>
                  <input 
                    type="text" 
                    value={clientData.lastName}
                    onChange={(e) => setClientData({...clientData, lastName: e.target.value})}
                    className={`w-full bg-zinc-950 border ${errors.includes("lastName") ? 'border-red-500' : 'border-zinc-800'} p-4 rounded-xl focus:border-blue-500 outline-none transition-all`}
                    placeholder="Doe"
                  />
                </div>

                {/* Email */}
                <div id="email" className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address *</label>
                  <input 
                    type="email" 
                    value={clientData.email}
                    onChange={(e) => setClientData({...clientData, email: e.target.value})}
                    className={`w-full bg-zinc-950 border ${errors.includes("email") ? 'border-red-500' : 'border-zinc-800'} p-4 rounded-xl focus:border-blue-500 outline-none transition-all`}
                    placeholder="john@company.com"
                  />
                </div>

                {/* Phone */}
                <div id="phone" className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    value={clientData.phone}
                    onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                    className={`w-full bg-zinc-950 border ${errors.includes("phone") ? 'border-red-500' : 'border-zinc-800'} p-4 rounded-xl focus:border-blue-500 outline-none transition-all`}
                    placeholder="+61 400 000 000"
                  />
                </div>

                {/* Company Name (Optional) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Company Name</label>
                  <input 
                    type="text" 
                    value={clientData.companyName}
                    onChange={(e) => setClientData({...clientData, companyName: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-blue-500 outline-none transition-all"
                    placeholder="Optional"
                  />
                </div>

                {/* ABN (Optional) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">ABN (Australia)</label>
                  <input 
                    type="text" 
                    value={clientData.abn}
                    onChange={(e) => setClientData({...clientData, abn: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-blue-500 outline-none transition-all"
                    placeholder="XX XXX XXX XXX"
                  />
                </div>
              </div>
            </section>
        </div>

        <div className="lg:col-span-1 ">
          <div className="sticky top-12 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex items-center gap-2 text-blue-500 mb-6">
              <Sparkles size={20} />
              <span className="font-black uppercase tracking-tighter">Projected Quote</span>
            </div>

            <div className="space-y-6 mb-10">
              <SummaryDetail icon={<Clock size={16}/>} label="Delivery" value={`${totalDays} Work Days`} />
              <SummaryDetail icon={<ShieldCheck size={16}/>} label="Warranty" value={`${maintenanceMonths} Months`} />
              <SummaryDetail icon={<Server size={16}/>} label="Cloud" value={pricingData.infrastructure.hosting.find(h => h.id === selectedHosting)?.label || ""} />
            </div>

            <div className="border-t border-zinc-800 pt-8 mb-8">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Investment Total</span>
              <div className="text-6xl font-black mt-2 tracking-tighter">${totalPrice.toLocaleString()}</div>
            </div>
            <button 
              onClick={handleDownload} 
              className={`w-full h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${errors.length > 0 ? 'bg-red-600/80' : 'bg-blue-600 hover:bg-blue-500'}`}
            >
              {errors.length > 0 ? "Check Required Fields" : "Generate Proposal"} <FileText size={20} />
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

// --- HELPERS ---
function PlatformBox({ active, onClick, icon, label, price }: any) {
  return (
    <button onClick={onClick} className={`p-6 rounded-3xl border-2 text-left transition-all ${active ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-800 bg-zinc-900/30'}`}>
      <div className={`mb-4 ${active ? 'text-blue-500' : 'text-zinc-500'}`}>{React.cloneElement(icon, { size: 28 })}</div>
      <div className="font-black text-lg leading-tight">{label}</div>
      <div className="text-zinc-500 text-[10px] mt-1 uppercase font-bold tracking-widest">Base ${price}</div>
    </button>
  );
}

function FeatureToggle({ active, onClick, label, price }: any) {
  return (
    <button onClick={onClick} className={`p-4 rounded-xl border flex justify-between items-center transition-all ${active ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 bg-zinc-900/30'}`}>
      <span className={active ? 'text-white font-bold' : 'text-zinc-400 text-xs'}>{label}</span>
      <span className="text-[10px] font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-300">+${price}</span>
    </button>
  );
}

function PaymentOption({ current, set, id, title, desc }: any) {
  const active = current === id;
  return (
    <button onClick={() => set(id)} className={`p-3 rounded-xl border transition-all text-center ${active ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 bg-zinc-900/30'}`}>
      <div className={`font-bold text-xs ${active ? 'text-white' : 'text-zinc-500'}`}>{title}</div>
      <div className="text-[8px] font-black tracking-widest uppercase mt-1 opacity-60">{desc}</div>
    </button>
  );
}

function SummaryDetail({ icon, label, value }: any) {
  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-zinc-400">{icon} {label}</div>
      <span className="font-bold text-zinc-200">{value}</span>
    </div>
  );
}