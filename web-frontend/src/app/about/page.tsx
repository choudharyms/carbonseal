"use client"

import { Navbar } from "@/components/ui/Navbar"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, Users, History, Linkedin, Twitter, Globe } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const team = [
    { name: "Madhusudan Singh", role: "Chief Tech Officer", bg: "from-emerald-400 to-teal-500" },
    { name: "Kunal Gupta", role: "SWE", bg: "from-blue-400 to-indigo-500" },
    { name: "Lakshit", role: "SWE", bg: "from-purple-400 to-pink-500" },
    { name: "Pragya Sharma", role: "SWE & Researcher", bg: "from-orange-400 to-red-500" },
    { name: "Mahak Sharma", role: "SWE - UI&UX", bg: "from-pink-400 to-rose-500" },
    { name: "Aastha", role: "Project Manager", bg: "from-yellow-400 to-amber-500" },
  ]

  return (
    <div className="min-h-screen bg-[#05050A] text-white selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
                <span className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-4 block">Our Mission</span>
                <h1 className="text-5xl md:text-7xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
                  Transparency is the<br/>new gold standard.
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed mb-12">
                  Carbon Seal was founded to solve the "Trust Crisis" in carbon markets. 
                  By combining satellite intelligence with blockchain immutability, we are building 
                  the digital infrastructure for the planet's regeneration.
                </p>
            </div>
        </div>
      </div>

      {/* Story Grid */}
      <div className="px-6 py-20 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <StoryCard 
                icon={History}
                title="The Problem"
                content="Traditional carbon verification is slow, expensive, and prone to human error. Paper-based audits can take 12-18 months, leading to 'phantom credits' and double-counting issues."
            />
            <StoryCard 
                icon={Target}
                title="The Solution"
                content="We automated the audit loop. Our dMRV engine ingests satellite data daily to prove ecosystem health. If the mangroves are standing, the credits are valid. Instantly."
            />
            <StoryCard 
                icon={Globe}
                title="The Impact"
                content="Accelerating funding for critical blue carbon ecosystems in the Global South. We ensure 90% of revenue goes directly to conservation projects, not intermediaries."
            />
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Meet the Builders</h2>
            <p className="text-slate-400">The multidisciplinary team behind Carbon Seal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member) => (
                <TeamMember 
                    key={member.name}
                    name={member.name}
                    role={member.role}
                    bg={member.bg}
                />
            ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-32">
        <div className="max-w-4xl mx-auto p-12 border border-white/10 rounded-[3rem] bg-gradient-to-b from-blue-900/20 to-black text-center relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-6">Join the Movement</h3>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                    Whether you are a developer protecting land or a company seeking offsets, Carbon Seal provides the trust layer you need.
                </p>
                <Link href="/login">
                    <Button className="h-14 px-8 rounded-full bg-white text-black hover:bg-slate-200 font-bold text-lg transition-transform hover:scale-105">
                        Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </div>
      </div>
    </div>
  )
}

function StoryCard({ title, content, icon: Icon }: any) {
    return (
        <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-blue-400">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{content}</p>
        </div>
    )
}

function TeamMember({ name, role, bg }: any) {
    const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
    
    return (
        <div className="group text-center">
            <div className={`relative w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br ${bg} shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                <span className="text-3xl font-black text-white/90 drop-shadow-sm tracking-wider">{initials}</span>
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${bg} blur-xl opacity-40 group-hover:opacity-60 transition-opacity`} />
            </div>
            <h4 className="text-xl font-bold text-white mb-1">{name}</h4>
            <p className="text-sm text-slate-400 font-mono uppercase tracking-wide mb-4">{role}</p>
            <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                <div className="p-2 bg-white/5 rounded-full hover:bg-white/20 cursor-pointer transition-colors">
                    <Twitter className="h-4 w-4 text-slate-300" />
                </div>
                <div className="p-2 bg-white/5 rounded-full hover:bg-white/20 cursor-pointer transition-colors">
                    <Linkedin className="h-4 w-4 text-slate-300" />
                </div>
            </div>
        </div>
    )
}