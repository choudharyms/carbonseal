"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Globe, Briefcase, ShieldCheck, LogOut, Hexagon } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<string>("")

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
        const u = JSON.parse(userStr)
        setRole(u.role || "DEVELOPER")
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const isActive = (path: string) => pathname.startsWith(path)

  const NavItem = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => (
    <Link href={href}>
        <div className={`
            flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all
            ${isActive(href) 
                ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
        `}>
            <Icon className={`h-4 w-4 ${isActive(href) ? 'text-slate-900' : 'text-slate-400'}`} />
            {label}
        </div>
    </Link>
  )

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
            <div className="bg-slate-900 p-1.5 rounded-md">
                <Hexagon className="h-5 w-5 text-white fill-current" />
            </div>
            <div>
                <h1 className="font-bold text-sm tracking-tight text-slate-900 leading-none">CARBON SEAL</h1>
                <p className="text-[10px] font-medium text-slate-500 tracking-wide mt-0.5">NATIONAL REGISTRY</p>
            </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Platform</div>
        <NavItem href="/dashboard" icon={LayoutDashboard} label="Command Center" />
        <NavItem href="/projects/submit" icon={Globe} label="Register Project" />
        <NavItem href="/marketplace" icon={Globe} label="Marketplace" />
        
        <div className="px-3 mb-2 mt-6 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Assets</div>
        <NavItem href="/portfolio" icon={Briefcase} label="Carbon Assets" />
        
        <div className="px-3 mb-2 mt-6 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Compliance</div>
        <NavItem href="/admin" icon={ShieldCheck} label="Verification" />
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
        >
            <LogOut className="h-4 w-4" />
            Sign Out
        </button>
      </div>
    </div>
  )
}
