"use client"
import Link from "next/link";
import { motion } from "framer-motion"; 
import { 
  Rocket, 
  Atom,  
  Boxes, 
  MessageCircle,
  ArrowUpRight,
  Mail,
  MessageSquare
} from "lucide-react";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black pt-32 pb-12 px-6 border-t border-white/5 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <Rocket className="text-blue-500 group-hover:rotate-12 transition-transform" size={32} />
              <span className="text-3xl font-black tracking-tighter italic uppercase">
                WIRED<span className="text-blue-500">NOMAD</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-lg leading-relaxed max-w-sm mb-8 font-medium">
              Engineering high-performance digital ecosystems for the next generation of industry leaders.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Atom size={20} />, href: "#" },
                { icon: <MessageCircle size={20} />, href: "#" },
                { icon: <Boxes size={20} />, href: "#" },
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href}
                  className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-blue-500/50 hover:bg-zinc-800 transition-all"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-8">Navigation</h4>
              <ul className="space-y-4">
                {['Home', 'Services', 'About', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`} className="text-zinc-400 hover:text-blue-500 text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-1 group">
                      {item}
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-y-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-8">Solutions</h4>
              <ul className="space-y-4">
                {['Web Apps', 'UI/UX Design', 'SEO Strategy', 'Cloud Arch'].map((item) => (
                  <li key={item}>
                    <Link href="/services" className="text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-8">Legal</h4>
              <ul className="space-y-4">
                {['Privacy', 'Terms'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase()}`} className="text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Big Background Text (Watermark style) */}
        <div className="absolute -bottom-10 left-0 right-0 pointer-events-none select-none overflow-hidden h-32 md:h-64 opacity-[0.02]">
           <h2 className="text-[15vw] font-black uppercase italic leading-none whitespace-nowrap">
             WIREDNOMAD DIGITAL
           </h2>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
            © {currentYear} WiredNomad Agency • Sydney, AU
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Systems Operational</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Built with Next.js & Supabase
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}