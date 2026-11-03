"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Lock, Eye, Database, Globe 
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { dictionaries, Locale } from "@/lib/dictionaries";

export default function PrivacyPolicy() {
  const [locale, setLocale] = useState<Locale>("en");
  const t = dictionaries[locale].privacy;

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-blue-500/30">
      <Navbar locale={locale} onLocaleChange={setLocale} />

      {/* Hero Header */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 text-blue-500 mb-6">
              <ShieldCheck size={24} />
              <span className="text-xs font-black uppercase tracking-[0.4em]">{t.badge}</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 italic uppercase leading-none">
              {t.title} 
            </h1>
            <p className="text-zinc-400 text-xl leading-relaxed">
              {t.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16">
          
          {/* Status & Quick Info */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-[2rem] space-y-6">
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t.lastRevised}</h4>
                <p className="font-mono text-sm text-blue-500">{t.lastRevisedDate}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t.jurisdiction}</h4>
                <p className="text-sm">{t.jurisdictionValue}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t.compliance}</h4>
                <p className="text-sm">{t.complianceValue}</p>
              </div>
              <hr className="border-white/5" />
              <p className="text-xs text-zinc-500 leading-relaxed italic">
                {t.consentNote}
              </p>
            </div>

            <div className="hidden lg:block space-y-4 px-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{t.sectionsLabel}</h5>
              <NavItem icon={<Eye size={14}/>} label={t.navItems.collection} href="#collection" />
              <NavItem icon={<Database size={14}/>} label={t.navItems.usage} href="#usage" />
              <NavItem icon={<Lock size={14}/>} label={t.navItems.security} href="#security" />
              <NavItem icon={<Globe size={14}/>} label={t.navItems.global} href="#global" />
            </div>
          </aside>

          {/* Main Legal Provisions */}
          <div className="lg:col-span-8 space-y-20">
            {t.provisions.map((provision) => (
              <PolicySection 
                key={provision.id}
                id={provision.id}
                title={provision.title}
                content={provision.content}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}

// Internal Helper Components
function PolicySection({ id, title, content }: { id: string; title: string; content: string }) {
  return (
    <motion.div 
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
        <span className="text-blue-600">/</span> {title}
      </h2>
      <p className="text-zinc-400 text-lg leading-relaxed font-medium">
        {content}
      </p>
    </motion.div>
  );
}

function NavItem({ icon, label, href }: { icon: any; label: string; href: string }) {
  return (
    <a href={href} className="flex items-center gap-3 text-zinc-500 hover:text-blue-500 transition-colors py-1 group">
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </a>
  );
}