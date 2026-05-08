"use client"
import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter">
          <Rocket className="text-blue-500" fill="currentColor" size={28} />
          <span>WIREDNOMAD<span className="text-blue-500">.</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/services" className="hover:text-white transition-colors">Services</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        <Link href="/quote" className="h-10 px-5 rounded-full bg-white text-black text-sm font-bold flex items-center hover:bg-zinc-200 transition-all">
          Get a Quote
        </Link>
      </div>
    </nav>
  );
}