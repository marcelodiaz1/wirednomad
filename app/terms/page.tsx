"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Gavel, Handshake, ShieldAlert, FileCode } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { dictionaries, Locale } from "@/lib/dictionaries";

export default function TermsPage() {
  const [locale, setLocale] = useState<Locale>("en");
  const t = dictionaries[locale].terms;

  const summaryIcons = [
    <Handshake size={16} key={0}/>,
    <FileCode size={16} key={1}/>,
    <ShieldAlert size={16} key={2}/>,
    <Gavel size={16} key={3}/>
  ];

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
              <Scale size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.badge}</span>
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

      {/* Main Content */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16">
          
          {/* Summary Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem]">
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">{t.corePrinciples}</h4>
                <ul className="space-y-4">
                  {t.summaryItems.map((item, index) => (
                    <SummaryItem key={index} icon={summaryIcons[index]} text={item} />
                  ))}
                </ul>
              </div>
              <p className="text-[10px] text-zinc-600 px-4 leading-relaxed">
                {t.lastUpdated}
              </p>
            </div>
          </aside>

          {/* Legal Clauses */}
          <div className="lg:col-span-8 space-y-16">
            {t.clauses.map((clause) => (
              <TermBlock 
                key={clause.number}
                number={clause.number}
                title={clause.title}
                content={clause.content}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}

// Sub-components
function TermBlock({ number, title, content }: { number: string; title: string; content: string }) {
  return (
    <div className="group space-y-4">
      <div className="flex items-baseline gap-4">
        <span className="text-blue-600 font-mono text-sm font-bold tracking-tighter">{number} //</span>
        <h2 className="text-2xl font-black uppercase tracking-tight">{title}</h2>
      </div>
      <p className="text-zinc-400 text-lg leading-relaxed font-medium pl-10 border-l border-white/5">
        {content}
      </p>
    </div>
  );
}

function SummaryItem({ icon, text }: { icon: any; text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm font-bold text-zinc-300">
      <span className="text-blue-500">{icon}</span>
      {text}
    </li>
  );
}