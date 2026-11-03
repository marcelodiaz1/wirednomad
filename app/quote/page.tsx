"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Clock, ShieldCheck, Smartphone, Globe, FileText,
  Zap, Bell, MapPin, Camera, Share2, Database, Server
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateWiredNomadPDF } from "./pdf-service";  
import { dictionaries, Locale } from "@/lib/dictionaries";

const pricingData = {
  platforms: {
    website: { price: 1500, days: 10, perPagePrice: 250, perPageDays: 2 },
    mobileApp: { price: 3000, days: 20 },
  },
  features: [
    { id: "auth", price: 600, days: 4 },
    { id: "stripe", price: 800, days: 5 },
    { id: "cms", price: 500, days: 3 },
    { id: "seo", price: 400, days: 2 },
    { id: "pwa", price: 700, days: 4 },
    { id: "logo", price: 600, days: 5 },
  ],
  appSpecificFeatures: [
    { id: "push", price: 450, days: 3, Icon: Bell },
    { id: "geo", price: 900, days: 7, Icon: MapPin },
    { id: "camera", price: 600, days: 4, Icon: Camera },
    { id: "social", price: 300, days: 2, Icon: Share2 },
    { id: "db_sync", price: 1500, days: 12, Icon: Database },
    { id: "offline", price: 1200, days: 10, Icon: Zap },
  ],
  infrastructure: {
    domain: [
      { id: "dom_1", price: 20 },
      { id: "dom_2", price: 38 },
      { id: "dom_5", price: 85 },
    ],
    hosting: [
      { id: "host_basic", price: 150 },
      { id: "host_pro", price: 350 },
      { id: "host_ent", price: 800 },
    ]
  }
};
export default function AdvancedQuotePage() {
  const [locale, setLocale] = useState<Locale>("en");
  const t = dictionaries[locale].quote;

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
  const [priceAdjustment, setPriceAdjustment] = useState({ percent: 0, amount: 0, type: 'none' });
  
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    abn: ""
  });

  const handleDownload = () => {
    const newErrors: string[] = [];
    if (!platform.web && !platform.app) newErrors.push("platform");
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
    generateWiredNomadPDF({
      totalPrice,
      totalDays,
      platform,
      priceAdjustment,
      webPages,
      selectedAppFeatures,
      selectedFeatures,
      selectedDomain,
      selectedHosting,
      maintenanceMonths,
      paymentPlan,
      pricingData,
      client: clientData,
      locale // <-- Pass the active locale state here
    });
  };
  useEffect(() => {
    let currentPrice = 0;
    let currentDays = 0;

    if (platform.web) { 
      currentPrice += pricingData.platforms.website.price + (webPages - 1) * pricingData.platforms.website.perPagePrice; 
      currentDays += pricingData.platforms.website.days + (webPages - 1) * pricingData.platforms.website.perPageDays; 
    }
    
    if (platform.app) { 
      currentPrice += pricingData.platforms.mobileApp.price; 
      currentDays += pricingData.platforms.mobileApp.days; 
      selectedAppFeatures.forEach(id => {
        const feature = pricingData.appSpecificFeatures.find(f => f.id === id);
        if (feature) { currentPrice += feature.price; currentDays += feature.days; }
      });
    }

    selectedFeatures.forEach(id => {
      const feature = pricingData.features.find(f => f.id === id);
      if (feature) { currentPrice += feature.price; currentDays += feature.days; }
    });

    const dom = pricingData.infrastructure.domain.find(d => d.id === selectedDomain);
    const host = pricingData.infrastructure.hosting.find(h => h.id === selectedHosting);
    currentPrice += (dom?.price || 0) + (host?.price || 0) + (maintenanceMonths * 150);

    const baseBeforeModifier = currentPrice;
    let modifier = 0;
    let type = 'none';

    switch (paymentPlan) {
      case "50-50":
        modifier = -0.10;
        type = 'discount';
        break;
      case "weekly":
        modifier = -0.05;
        type = 'discount';
        break;
      case "fortnightly":
        modifier = 0;
        type = 'none';
        break;
      case "milestones":
        modifier = 0.05;
        type = 'surcharge';
        break;
      case "monthly":
        modifier = 0.08;
        type = 'surcharge';
        break;
      case "daily":
        modifier = 0.15;
        type = 'surcharge';
        break;
    }

    const finalPrice = baseBeforeModifier * (1 + modifier);
    
    setPriceAdjustment({
      percent: Math.abs(modifier * 100),
      amount: Math.abs(finalPrice - baseBeforeModifier),
      type: type
    });

    setTotalPrice(finalPrice);
    setTotalDays(currentDays); 
  }, [platform, webPages, selectedFeatures, selectedAppFeatures, selectedDomain, selectedHosting, maintenanceMonths, paymentPlan]);

  return ( 
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 font-sans">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      
      <header className="pt-32 pb-12 px-6 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">
            {t.badge}
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
        </motion.div>
      </header>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16 pb-40">
          
          {/* Section 1: Core Platform */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-6 font-mono">
              01. {t.corePlatform}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <PlatformBox 
                active={platform.web} 
                onClick={() => {
                  if (!platform.web || platform.app) {
                    setPlatform(prev => ({...prev, web: !prev.web}));
                    setErrors(prev => prev.filter(e => e !== "platform"));
                  }
                }}
                icon={<Globe />} 
                label={t.webApp} 
                price={pricingData.platforms.website.price}
              />
              
              <PlatformBox 
                active={platform.app} 
                onClick={() => {
                  if (!platform.app || platform.web) {
                    setPlatform(prev => ({...prev, app: !prev.app}));
                    setErrors(prev => prev.filter(e => e !== "platform"));
                  }
                }}
                icon={<Smartphone />} 
                label={t.mobileApp} 
                price={pricingData.platforms.mobileApp.price}
              />
            </div>

            <AnimatePresence mode="wait">
              {platform.web && (
                <motion.div key="web-config" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 mb-6 overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-zinc-300">{t.uniquePages}</span>
                    <span className="text-3xl font-black text-blue-500">{webPages}</span>
                  </div>
                  <input type="range" min="1" max="25" value={webPages} onChange={(e) => setWebPages(parseInt(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {platform.app && (
                <motion.div key="app-config" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{t.appFunctionalities}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {pricingData.appSpecificFeatures.map(({ id, Icon }) => {
                      const featureLabel = t.appFeaturesList[id as keyof typeof t.appFeaturesList];
                      return (
                        <button 
                          key={id} 
                          onClick={() => setSelectedAppFeatures(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} 
                          className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${selectedAppFeatures.includes(id) ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 bg-zinc-900/30'}`}
                        >
                          <div className={selectedAppFeatures.includes(id) ? 'text-blue-500' : 'text-zinc-600'}>
                            <Icon size={16} />
                          </div>
                          <span className="text-[11px] font-bold leading-tight">{featureLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Section 2: Infrastructure Hire */}
          <section>
  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-6 font-mono">{t.infrastructureHire}</h2>
  <div className="grid sm:grid-cols-2 gap-8">
    
    {/* Domain Registration */}
    <div>
      <label className="text-xs font-bold text-zinc-500 uppercase mb-4 block">{t.domainRegistration}</label>
      <div className="space-y-2">
        {pricingData.infrastructure.domain.map(d => {
          const domainLabel = t.infrastructureList[d.id as keyof typeof t.infrastructureList];
          return (
            <button 
              key={d.id} 
              onClick={() => setSelectedDomain(d.id)} 
              className={`w-full p-4 rounded-xl border text-sm flex justify-between items-center transition-all ${selectedDomain === d.id ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 bg-zinc-900/30'}`}
            >
              <span>{domainLabel}</span> 
              <span className="font-mono text-blue-400">${d.price}</span>
            </button>
          );
        })}
      </div>
    </div>

    {/* Cloud Hosting Tier */}
    <div>
      <label className="text-xs font-bold text-zinc-500 uppercase mb-4 block">{t.cloudHostingTier}</label>
      <div className="space-y-2">
        {pricingData.infrastructure.hosting.map(h => {
          const hostingLabel = t.infrastructureList[h.id as keyof typeof t.infrastructureList];
          const hostingDesc = t.infrastructureList[`${h.id}_desc` as keyof typeof t.infrastructureList];
          return (
            <button 
              key={h.id} 
              onClick={() => setSelectedHosting(h.id)} 
              className={`w-full p-4 rounded-xl border text-left transition-all ${selectedHosting === h.id ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 bg-zinc-900/30'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm">{hostingLabel}</span>
                <span className="font-mono text-xs text-blue-400">${h.price}</span>
              </div>
              <div className="text-[10px] text-zinc-500 italic">{hostingDesc}</div>
            </button>
          );
        })}
      </div>
    </div>

  </div>
</section>
    {/* Section 3: Shared Modules */}  
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-12 font-mono">{t.maintenance}</h2> 
             
               
          <section className="grid sm:grid-cols-2 gap-8">
            {pricingData.features.map((f) => {
              const label = t.featuresList[f.id as keyof typeof t.featuresList];
              return (
                <FeatureToggle 
                  key={f.id}
                  active={selectedFeatures.includes(f.id)}
                  onClick={() => setSelectedFeatures(prev => prev.includes(f.id) ? prev.filter(i => i !== f.id) : [...prev, f.id])}
                  label={label}
                  price={f.price}
                />
              );
            })}
 
          </section>
          <section className="grid sm:grid-cols-2 gap-8"> 
          {/* Hosting Tiers Rendering */}
         {pricingData.infrastructure.hosting.map(h => {
            const label = t.infrastructureList[h.id as keyof typeof t.infrastructureList];
            const desc = t.infrastructureList[`${h.id}_desc` as keyof typeof t.infrastructureList];
            return (
              <button 
                key={h.id} 
                onClick={() => setSelectedHosting(h.id)} 
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selectedHosting === h.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-zinc-800 bg-zinc-900/30'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">{label}</span>
                  <span className="font-mono text-xs text-blue-400">${h.price}</span>
                </div>
                <div className="text-[10px] text-zinc-500 italic">{desc}</div>
              </button>
            );
          })}
        </section>
         

          {/* Section 4 & 5: Maintenance & Payment Plan */}
          <section className="grid sm:grid-cols-2 gap-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-6 font-mono">{t.maintenance}</h2>
              <select 
                value={maintenanceMonths} 
                onChange={(e) => setMaintenanceMonths(Number(e.target.value))} 
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-blue-500 outline-none"
              >
                <option value={3}>{t.maintenanceOptions.support3}</option>
                <option value={6}>{t.maintenanceOptions.support6}</option>
                <option value={12}>{t.maintenanceOptions.support12}</option>
              </select>
            </div>

            <div id="strategy-section">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-6 font-mono">{t.paymentPlan}</h2> 
              <div className="grid grid-cols-3 gap-3">
                {Object.keys(t.paymentPlans).map((key) => {
                  const planInfo = t.paymentPlans[key as keyof typeof t.paymentPlans];
                  return (
                    <PaymentOption 
                      key={key}
                      current={paymentPlan} 
                      set={setPaymentPlan} 
                      id={key} 
                      title={planInfo.title} 
                      desc={planInfo.desc} 
                    />
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section 6: Client Identification */}
          <section id="client-info-section">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500 mb-6 font-mono">{t.clientIdentification}</h2>
            <div className="grid sm:grid-cols-2 gap-6 bg-zinc-900/30 p-8 rounded-[2.5rem] border border-zinc-800">
              
              <div id="firstName" className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t.firstName}</label>
                <input 
                  type="text" 
                  value={clientData.firstName}
                  onChange={(e) => setClientData({...clientData, firstName: e.target.value})}
                  className={`w-full bg-zinc-950 border ${errors.includes("firstName") ? 'border-red-500' : 'border-zinc-800'} p-4 rounded-xl focus:border-blue-500 outline-none transition-all`}
                />
              </div>

              <div id="lastName" className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t.lastName}</label>
                <input 
                  type="text" 
                  value={clientData.lastName}
                  onChange={(e) => setClientData({...clientData, lastName: e.target.value})}
                  className={`w-full bg-zinc-950 border ${errors.includes("lastName") ? 'border-red-500' : 'border-zinc-800'} p-4 rounded-xl focus:border-blue-500 outline-none transition-all`}
                />
              </div>

              <div id="email" className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t.email}</label>
                <input 
                  type="email" 
                  value={clientData.email}
                  onChange={(e) => setClientData({...clientData, email: e.target.value})}
                  className={`w-full bg-zinc-950 border ${errors.includes("email") ? 'border-red-500' : 'border-zinc-800'} p-4 rounded-xl focus:border-blue-500 outline-none transition-all`}
                />
              </div>

              <div id="phone" className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t.phone}</label>
                <input 
                  type="tel" 
                  value={clientData.phone}
                  onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                  className={`w-full bg-zinc-950 border ${errors.includes("phone") ? 'border-red-500' : 'border-zinc-800'} p-4 rounded-xl focus:border-blue-500 outline-none transition-all`}
                />
              </div>

              <div id="companyName" className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t.companyName}</label>
                <input 
                  type="text" 
                  value={clientData.companyName}
                  onChange={(e) => setClientData({...clientData, companyName: e.target.value})}
                  placeholder={t.companyNamePlaceholder}
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div id="abn" className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t.abn}</label>
                <input 
                  type="text" 
                  value={clientData.abn}
                  onChange={(e) => setClientData({...clientData, abn: e.target.value})}
                  placeholder={t.abnPlaceholder}
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-12 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex items-center gap-2 text-blue-500 mb-6">
              <Sparkles size={20} />
              <span className="font-black uppercase tracking-tighter">{t.projectedQuote}</span>
            </div>

            <div className="space-y-6 mb-10">
              <SummaryDetail icon={<Clock size={16}/>} label={t.delivery} value={`${totalDays} ${t.workDaysSuffix}`} />
              <SummaryDetail icon={<ShieldCheck size={16}/>} label={t.warranty} value={`${maintenanceMonths} ${t.monthsSuffix}`} />
              <SummaryDetail icon={<Server size={16}/>} label={t.cloud} value={pricingData.infrastructure.hosting.find(h => h.id === selectedHosting)?.label || ""} />
            </div>

            <div className="border-t border-zinc-800 pt-8 mb-8">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{t.investmentTotal}</span>
              <div className="text-6xl font-black mt-2 tracking-tighter">${Math.round(totalPrice).toLocaleString()}</div> 

              <AnimatePresence>
                {priceAdjustment.type !== 'none' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit ${
                      priceAdjustment.type === 'discount' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-orange-500/10 text-orange-400'
                    }`}
                  >
                    {priceAdjustment.type === 'discount' ? '-' : '+'} 
                    {priceAdjustment.percent}% {paymentPlan.toUpperCase()} {t.planLabelSuffix} 
                    ({priceAdjustment.type === 'discount' ? t.saved : t.fee}: ${Math.round(priceAdjustment.amount).toLocaleString()})
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={handleDownload} 
              className={`w-full h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${errors.length > 0 ? 'bg-red-600/80' : 'bg-blue-600 hover:bg-blue-500'}`}
            >
              {errors.length > 0 ? t.checkRequiredFields : t.generateProposal} <FileText size={20} />
            </button>
          </div>
        </div>
      </div>
      <Footer locale={locale} />
    </div>
  );
}

// --- HELPER COMPONENTS ---
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