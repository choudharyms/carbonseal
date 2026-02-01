"use client"

import { Navbar } from "@/components/ui/Navbar"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, ShieldCheck, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#05050A] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "4s" }} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">
              Live Registry Active
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Verify. Tokenize.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Regenerate.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            The world's first government-grade digital MRV platform for blue carbon. 
            We use satellite AI to verify environmental impact and issue traceable, high-quality carbon credits.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <Link href="/login">
              <Button className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-slate-200 transition-all font-bold hover:scale-105">
                Get Started
              </Button>
            </Link>
            <Link href="/mrv">
              <Button variant="outline" className="h-14 px-8 text-lg rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm transition-all">
                How it Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Globe}
            title="Satellite dMRV"
            description="Real-time monitoring using Sentinel-2 and Landsat data to verify vegetation health (NDVI) and biomass density."
            gradient="from-blue-500/20 to-cyan-500/20"
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="Institutional Trust"
            description="Credits are minted only after rigorous digital verification. Every token represents 1 tonne of proven CO₂e removal."
            gradient="from-emerald-500/20 to-teal-500/20"
          />
          <FeatureCard 
            icon={Zap}
            title="Liquid Marketplace"
            description="Trade credits instantly on a regulated blockchain registry. Retire assets with a permanent, immutable audit trail."
            gradient="from-purple-500/20 to-pink-500/20"
          />
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto p-12 md:p-20 rounded-[3rem] bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-white/10 backdrop-blur-xl text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to make an impact?</h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
              Join project developers and institutional buyers in the next generation carbon market.
            </p>
            <Link href="/login">
              <Button className="h-16 px-10 text-xl rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all">
                Launch Registry <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <p>© 2026 Carbon Seal Registry. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, gradient }: any) {
  return (
    <div className={`p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group overflow-hidden relative`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">
          {description}
        </p>
      </div>
    </div>
  )
}
