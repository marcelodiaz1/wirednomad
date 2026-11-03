"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Send, Mail, MessageSquare, MapPin, 
  Link, Code, Globe, CheckCircle2 
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { dictionaries, Locale } from "@/lib/dictionaries";

export default function ContactPage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const t = dictionaries[locale].contact;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      projectType: formData.get("projectType"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        console.error("API error:", res.statusText);
        alert("Transmission failed. Please check your API key and terminal.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }; 

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
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 italic uppercase">
              {t.titlePre} <span className="text-blue-600">{t.titleAccent}</span>
            </h1>
            <p className="text-zinc-400 text-xl leading-relaxed">
              {t.desc}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-16">
          
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-8">
              <ContactMethod 
                icon={<MapPin className="text-blue-500" />}
                title={t.methods.location.title}
                detail={t.methods.location.detail}
                sub={t.methods.location.sub}
              />
              <ContactMethod 
                icon={<Mail className="text-purple-500" />}
                title={t.methods.email.title}
                detail={t.methods.email.detail}
                sub={t.methods.email.sub}
              />
              <ContactMethod 
                icon={<MessageSquare className="text-emerald-500" />}
                title={t.methods.languages.title}
                detail={t.methods.languages.detail}
                sub={t.methods.languages.sub}
              />
            </div>

            <div className="pt-12 border-t border-white/5">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">{t.socialEcosystem}</h4>
              <div className="flex gap-4">
                <SocialLink icon={<Link size={20} />} href="#" />
                <SocialLink icon={<Code size={20} />} href="#" />
                <SocialLink icon={<Globe size={20} />} href="#" />
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-3">
            {!submitted ? (
              <motion.form 
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-900/30 border border-white/5 p-8 md:p-12 rounded-[2.5rem] space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">{t.form.fullName}</label>
                    <input required name="name" type="text" placeholder={t.form.namePlaceholder} className="w-full bg-black border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">{t.form.emailAddress}</label>
                    <input name="email" required type="email" placeholder={t.form.emailPlaceholder} className="w-full bg-black border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">{t.form.projectType}</label>
                  <select name="projectType" className="w-full bg-black border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all text-zinc-400">
                    {t.form.projectOptions.map((opt, i) => (
                      <option key={i}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">{t.form.message}</label>
                  <textarea name="message" rows={5} placeholder={t.form.messagePlaceholder} className="w-full bg-black border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700 resize-none"></textarea>
                </div>

                <button disabled={loading} type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all group shadow-xl shadow-blue-500/20">
                  {loading ? t.form.transmitting : t.form.submitBtn}  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </motion.form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50">
                  <CheckCircle2 size={40} className="text-white" />
                </div>
                <h3 className="text-3xl font-black mb-4">{t.success.title}</h3>
                <p className="text-zinc-400 max-w-sm">
                  {t.success.desc}
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-8 text-sm font-bold text-blue-500 hover:text-white transition-colors">
                  {t.success.resetBtn}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
}

// Sub-components
function ContactMethod({ icon, title, detail, sub }: any) {
  return (
    <div className="flex gap-6 group">
      <div className="w-14 h-14 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">{title}</h4>
        <div className="text-lg font-bold mb-1">{detail}</div>
        <div className="text-xs text-zinc-600 font-medium">{sub}</div>
      </div>
    </div>
  );
}

function SocialLink({ icon, href }: any) {
  return (
    <a href={href} className="w-12 h-12 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:border-blue-500 transition-all">
      {icon}
    </a>
  );
}