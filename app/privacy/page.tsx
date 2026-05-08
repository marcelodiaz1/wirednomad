"use client"
import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Lock, Eye, Database, 
  FileText, Globe, UserCheck, AlertCircle 
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-blue-500/30">
      <Navbar />

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
              <span className="text-xs font-black uppercase tracking-[0.4em]">Data Protection Protocol</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 italic uppercase leading-none">
              Privacy <span className="text-blue-600">Policy.</span>
            </h1>
            <p className="text-zinc-400 text-xl leading-relaxed">
              This policy outlines how WiredNomad handles personal information in 
              accordance with the Privacy Act 1988 (Cth) and international data 
              standards. We prioritize security by design.
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
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Last Revised</h4>
                <p className="font-mono text-sm text-blue-500">May 08, 2026</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Jurisdiction</h4>
                <p className="text-sm">New South Wales, Australia</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Compliance</h4>
                <p className="text-sm">APP, GDPR, CCPA</p>
              </div>
              <hr className="border-white/5" />
              <p className="text-xs text-zinc-500 leading-relaxed italic">
                By using our services or communicating with us, you consent to the data practices described in this policy.
              </p>
            </div>

            <div className="hidden lg:block space-y-4 px-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Sections</h5>
              <NavItem icon={<Eye size={14}/>} label="Information Collection" href="#collection" />
              <NavItem icon={<Database size={14}/>} label="Data Utilization" href="#usage" />
              <NavItem icon={<Lock size={14}/>} label="Security Infrastructure" href="#security" />
              <NavItem icon={<Globe size={14}/>} label="International Transfers" href="#global" />
            </div>
          </aside>

          {/* Main Legal Provisions */}
          <div className="lg:col-span-8 space-y-20">
            
            <PolicySection 
              id="collection"
              title="1. Scope of Information Collection"
              content="We collect information that identifies you or could reasonably link to you. This includes identifiers such as your legal name, professional email address, and IP address. For software engineering projects, we may collect technical specifications and system access credentials, which are handled via encrypted vaults."
            />

            <PolicySection 
              id="usage"
              title="2. Strategic Data Utilization"
              content="Your data is utilized strictly for the execution of digital services. This includes project management, technical troubleshooting, and fulfilling our contractual obligations. We do not engage in data mining for advertising purposes. Any use of AI for content generation is strictly isolated from your personal identifiable information (PII)."
            />

            <PolicySection 
              id="security"
              title="3. Security Infrastructure"
              content="As engineers, we implement industry-standard security. All data stored via our platforms (using Supabase/PostgreSQL) is encrypted at rest and in transit (TLS/SSL). We utilize multi-factor authentication (MFA) for all administrative access and conduct regular vulnerability assessments to ensure WCAG and security compliance."
            />

            <PolicySection 
              id="global"
              title="4. International Data Transfers"
              content="WiredNomad operates globally. While our primary servers are located in Australia, data may be processed in other jurisdictions depending on the cloud infrastructure utilized (e.g., Vercel, AWS). We ensure that all third-party sub-processors adhere to data protection standards equivalent to the Australian Privacy Principles."
            />

            <PolicySection 
              id="rights"
              title="5. User Rights & Governance"
              content="You possess the right to access, rectify, or request the erasure of your personal data. To exercise these rights, or to lodge a formal inquiry regarding our data handling, please contact our privacy officer at contact@wirednomad.xyz."
            />

          </div>
        </div>
      </section>

      <Footer />
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