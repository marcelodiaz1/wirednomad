"use client"
import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="fixed top-6 w-full z-[100] px-6 flex justify-center">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 p-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)]"
      >
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 pl-4 pr-6 border-r border-white/10 group">
          <Rocket 
            className="text-blue-500 group-hover:rotate-12 transition-transform duration-300" 
            fill="currentColor" 
            size={22} 
          />
          <span className="font-black text-sm tracking-[0.2em] italic uppercase hidden sm:block">
            Wired<span className="text-blue-500">Nomad</span>
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 px-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className="relative px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors"
              >
                <span className={`relative z-10 ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}`}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-blue-600/10 rounded-full border border-blue-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <Link 
          href="/quote" 
          className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white pl-5 pr-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-500/20 overflow-hidden"
        >
          <span className="relative z-10">Start Project</span>
          <ChevronRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          
          {/* Animated Shine Effect */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          />
        </Link>
      </motion.nav>
    </div>
  );
}