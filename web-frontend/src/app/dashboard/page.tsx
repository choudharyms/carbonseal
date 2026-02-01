"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  TrendingUp,
  MapPin,
  Leaf,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Sidebar from "@/components/ui/Sidebar"
import { PageHeader } from "@/components/ui/PageHeader"
import { Badge } from "@/components/ui/badge"
import { WalletConnect } from "@/components/ui/WalletConnect"
import { API_URL } from "@/config"

interface ActivityItem {
  id: string
  project: string
  status: "verified" | "pending" | "rejected"
  credits: number
  location: string
  timestamp: string
}

function StatusBadge({ status }: { status: string }) {
  if (status === "verified") {
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Verified</span>
        </div>
    )
  }
  if (status === "pending") {
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Processing</span>
        </div>
    )
  }
  return <Badge variant="destructive">Rejected</Badge>
}

export default function DashboardPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ credits: 0, area: 0, value: 0 })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        const [resPublic, resMy] = await Promise.all([
             fetch(`${API_URL}/api/projects`),
             fetch(`${API_URL}/api/projects/my`, {
                headers: { Authorization: `Bearer ${token}` }
             })
        ])

        let allProjects: any[] = []
        if (resPublic.ok) allProjects = [...allProjects, ...await resPublic.json()]
        if (resMy.ok) allProjects = [...allProjects, ...await resMy.json()]

        const uniqueProjects = Array.from(new Map(allProjects.map((item: any) => [item.id, item])).values())

        // Calculate Stats
        let totalCredits = 0
        let totalArea = 0
        
        uniqueProjects.forEach((p: any) => {
            if (p.status === 'VERIFIED') {
                const credits = p.verifications?.[0]?.carbon_credits_calculated || 0
                totalCredits += credits
                // Mock area based on credits roughly if not present
                totalArea += (p.area_in_hectares || (credits / 400))
            }
        })

        setStats({
            credits: totalCredits,
            area: Math.round(totalArea),
            value: totalCredits * 25 // Assuming $25/tonne avg
        })

        if (uniqueProjects.length > 0) {
            const mapped: ActivityItem[] = uniqueProjects.map((p: any) => ({
              id: p.id,
              project: p.name,
              status: p.status === 'VERIFIED' ? 'verified' : (p.status === 'SUBMITTED' || p.status === 'DRAFT' ? 'pending' : 'rejected'),
              credits: p.verifications?.[0]?.carbon_credits_calculated || 0,
              location: p.location_name || p.ecosystem_type,
              timestamp: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recently'
            }))
            setActivities(mapped.reverse().slice(0, 5)) 
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <Sidebar />
      <div className="flex-1 md:ml-64 py-8 px-10">
        
        <PageHeader 
            title="Command Center" 
            description="Real-time registry performance and verification feed."
        >
            <div className="flex items-center gap-3">
                <WalletConnect />
                <Button 
                    onClick={() => router.push("/projects/submit")} 
                    className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                >
                    Register New Project
                </Button>
            </div>
        </PageHeader>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <KPICard 
                title="Verified Credits"
                value={`${stats.credits.toLocaleString()} t`}
                subValue="+12% from last month"
                icon={Leaf}
                trend="up"
                color="emerald"
            />
            <KPICard 
                title="Protected Area"
                value={`${stats.area.toLocaleString()} ha`}
                subValue="Fully Monitored (Sentinel-2)"
                icon={MapPin}
                trend="neutral"
                color="blue"
            />
            <KPICard 
                title="Market Value"
                value={`$${stats.value.toLocaleString()}`}
                subValue="Est. Registry Cap"
                icon={Building}
                trend="up"
                color="purple"
            />
        </div>

        {/* Recent Projects Table */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-800">Active Projects</CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                            Latest submissions and verification status updates
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-900">
                        View All
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="py-12 text-center text-sm text-slate-400 animate-pulse">Syncing registry data...</div>
                ) : activities.length === 0 ? (
                    <div className="py-12 text-center text-sm text-slate-400">No active projects found.</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50/50 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left">
                            <tr>
                                <th className="px-6 py-3">Project Name</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">Volume</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {activities.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                {item.project.substring(0,2).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-sm text-slate-900">{item.project}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {item.location}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-900">
                                            {item.credits > 0 ? item.credits.toLocaleString() : '-'}
                                        </span>
                                        <span className="text-xs text-slate-400 ml-1">tCO₂e</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </CardContent>
        </Card>

      </div>
    </div>
  )
}

function KPICard({ title, value, subValue, icon: Icon, color, trend }: any) {
    const colors: any = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100"
    }

    return (
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    {trend === "up" && (
                        <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1" /> +12%
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">{subValue}</p>
                </div>
            </CardContent>
        </Card>
    )
}