"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, MapPin, Eye, Loader2 } from "lucide-react"
import Sidebar from "@/components/ui/Sidebar"
import { PageHeader } from "@/components/ui/PageHeader"
import { Badge } from "@/components/ui/badge"
import { API_URL } from "@/config"

export default function AdminPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState<string | null>(null)

  useEffect(() => {
    fetchPending()
  }, [])

  const fetchPending = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
        const res = await fetch(`${API_URL}/api/admin/pending`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
            const data = await res.json()
            setProjects(data)
        }
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }
  }

  const handleVerify = async (projectId: string) => {
    setVerifying(projectId)
    const token = localStorage.getItem("token")
    
    try {
        const res = await fetch(`${API_URL}/api/admin/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ projectId })
        })
        
        if (res.ok) {
            alert("Verification Complete. Certificates Issued.")
            setProjects(projects.filter(p => p.id !== projectId))
        } else {
            const err = await res.json()
            alert("Failed: " + err.error)
        }
    } catch (error) {
        console.error(error)
    } finally {
        setVerifying(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 py-10 px-8">
        <PageHeader title="Verification Queue" description="Pending dMRV assessments requiring auditor approval." />

        {loading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        ) : projects.length === 0 ? (
            <div className="text-center py-24 bg-white border border-slate-200 rounded-xl shadow-sm">
                <ShieldCheck className="h-10 w-10 text-emerald-600/50 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-900">All Clear</h3>
                <p className="text-sm text-slate-500">No pending projects in the registry queue.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {projects.map((project) => (
                    <Card key={project.id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 border-slate-200 shadow-sm">
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                                    Submitted
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {project.location_name}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span>{project.ecosystem_type}</span>
                                <span className="text-slate-300">•</span>
                                <span>Dev: {project.owner?.username}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button variant="outline" className="flex-1 md:flex-none">
                                <Eye className="h-4 w-4 mr-2" /> Review Data
                            </Button>
                            <Button 
                                onClick={() => handleVerify(project.id)}
                                disabled={verifying === project.id}
                                className="bg-slate-900 hover:bg-slate-800 text-white flex-1 md:flex-none"
                            >
                                {verifying === project.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Approve & Mint
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}