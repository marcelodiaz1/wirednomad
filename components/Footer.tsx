"use client"
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-zinc-900 bg-black">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-black mb-6">WIREDNOMAD<span className="text-blue-500">.</span></h2>
          <p className="text-zinc-500 max-w-sm">
            Engineering high-performance digital ecosystems for the next generation of industry leaders.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-zinc-500 text-sm">
            <li><Link href="/about" className="hover:text-blue-500">About</Link></li>
            <li><Link href="/services" className="hover:text-blue-500">Services</Link></li>
            <li><Link href="/quote" className="hover:text-blue-500">Quote</Link></li>
            <li><Link href="/contact" className="hover:text-blue-500">Contact</Link></li>  
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Social</h4>
          <ul className="space-y-4 text-zinc-500 text-sm">
            <li><Link href="#" className="hover:text-blue-500">LinkedIn</Link></li>
            <li><Link href="#" className="hover:text-blue-500">Twitter</Link></li>
            <li><Link href="#" className="hover:text-blue-500">GitHub</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-zinc-500 text-sm"> 
            <li><Link href="/terms" className="hover:text-blue-500">Terms and Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-blue-500">Privacy Policy</Link></li> 
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 flex justify-between text-zinc-600 text-xs uppercase tracking-widest">
        <span>© 2026 WIREDNOMAD Digital Agency Studio</span>
        <span>Built with Next.js & Supabase</span>
      </div>
    </footer>
  );
}