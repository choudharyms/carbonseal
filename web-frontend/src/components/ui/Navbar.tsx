"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Hexagon, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "MRV Tech", href: "/mrv" },
    { name: "Projects", href: "/marketplace" }, // Will redirect to login if not auth
    { name: "About", href: "/about" },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
            <Hexagon className="h-6 w-6 text-white fill-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Carbon Seal
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-white ${
                pathname === link.href ? "text-white" : "text-slate-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <span className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Log in
            </span>
          </Link>
          <Link href="/login">
            <Button className="bg-white text-black hover:bg-slate-200 rounded-full px-6 font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black/95 border-b border-white/10 p-6 flex flex-col gap-6 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2" />
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
