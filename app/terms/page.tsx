"use client"
import React from "react";
import { motion } from "framer-motion";
import { Scale, Gavel, Handshake, ShieldAlert, FileCode } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function TermsPage() {
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
              <Scale size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Service Governance</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 italic uppercase leading-none">
              Terms <span className="text-blue-600">Of Service.</span>
            </h1>
            <p className="text-zinc-400 text-xl leading-relaxed">
              These terms constitute a legally binding agreement between the Client 
              and WiredNomad regarding the provision of software engineering, 
              digital design, and technical consultancy services.
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
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Core Principles</h4>
                <ul className="space-y-4">
                  <SummaryItem icon={<Handshake size={16}/>} text="Clear Statement of Work (SOW)" />
                  <SummaryItem icon={<FileCode size={16}/>} text="IP Transfer upon Full Payment" />
                  <SummaryItem icon={<ShieldAlert size={16}/>} text="Limited Technical Liability" />
                  <SummaryItem icon={<Gavel size={16}/>} text="Governed by NSW Law" />
                </ul>
              </div>
              <p className="text-[10px] text-zinc-600 px-4 leading-relaxed">
                Last Updated: May 2026. WiredNomad reserves the right to modify these terms at any time to reflect changes in local legislation or service offerings.
              </p>
            </div>
          </aside>

          {/* Legal Clauses */}
          <div className="lg:col-span-8 space-y-16">
            
            <TermBlock 
              number="01"
              title="Engagement & Deliverables"
              content="Every project is initiated with a specific Statement of Work (SOW). WiredNomad will perform services with professional care and skill in accordance with the specifications outlined. Any modifications to the project scope after commencement (Scope Creep) will be subject to additional fees and adjusted timelines."
            />

            <TermBlock 
              number="02"
              title="Intellectual Property Rights"
              content="All original code, design systems, and creative assets developed by WiredNomad remain the sole property of WiredNomad until the final balance of the project invoice is settled in full. Upon final payment, the Client is granted a worldwide, perpetual, non-exclusive license to use the deliverables for their intended business purpose."
            />

            <TermBlock 
              number="03"
              title="Payment Protocols"
              content="Standard engagement requires a 50% commencement deposit. Final balances are due within 7 days of project completion or deployment. WiredNomad reserves the right to suspend hosting, API access, or support services for accounts with overdue invoices exceeding 14 days."
            />

            <TermBlock 
              number="04"
              title="Technical Liability & Warranties"
              content="WiredNomad utilizes modern frameworks (Next.js, Supabase) to ensure stability. However, we do not warrant that software will be error-free or uninterrupted. We are not liable for losses caused by third-party services, browser deprecations, or security vulnerabilities introduced by client-side modifications after handover."
            />

            <TermBlock 
              number="05"
              title="Termination of Service"
              content="Either party may terminate an engagement with 14 days' written notice. In the event of termination, the Client is liable to pay for all hours worked and expenses incurred up to the date of termination. WiredNomad will provide all completed assets upon receipt of final pro-rata payment."
            />

            <TermBlock 
              number="06"
              title="Governing Law"
              content="These terms are governed by and construed in accordance with the laws of New South Wales, Australia. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of NSW."
            />

          </div>
        </div>
      </section>

      <Footer />
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