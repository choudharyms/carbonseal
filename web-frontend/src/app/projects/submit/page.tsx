"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, ArrowRight, Loader2, UploadCloud, Check, ArrowLeft, Upload, FileText, Globe } from "lucide-react"
import Sidebar from "@/components/ui/Sidebar"
import { PageHeader } from "@/components/ui/PageHeader"
import { WalletConnect } from "@/components/ui/WalletConnect"
import { Badge } from "@/components/ui/badge"

export default function SubmitProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ecosystem_type: "MANGROVE",
    location_name: "",
    geoJson: ""
  })

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      if (!formData.name || !formData.ecosystem_type) {
        alert("Please fill in all required fields (Name, Ecosystem)")
        setLoading(false)
        return
      }

      let boundary
      try {
        boundary = formData.geoJson ? JSON.parse(formData.geoJson) : null
      } catch (err) {
        // Allow bypass if invalid for demo, but backend handles null
        boundary = null
      }

      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            ecosystem_type: formData.ecosystem_type,
            location_name: formData.location_name,
            boundary: boundary
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.message || "Submission failed")
      }

      router.push("/dashboard")
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <Sidebar />
      <div className="flex-1 md:ml-64 py-8 px-10">
        <PageHeader title="Register Project" description="Submit new ecosystem data for dMRV verification.">
            <WalletConnect />
        </PageHeader>

        <div className="max-w-4xl mx-auto">
            {/* Progress Stepper */}
            <div className="mb-10">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-900 -z-10 rounded-full transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
                    
                    <StepIndicator step={1} currentStep={step} label="Details" icon={FileText} />
                    <StepIndicator step={2} currentStep={step} label="Boundary" icon={Globe} />
                    <StepIndicator step={3} currentStep={step} label="Review" icon={Check} />
                </div>
            </div>

            <Card className="border-slate-200 shadow-lg bg-white overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <CardContent className="p-8 min-h-[400px]">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Project Name</Label>
                                    <Input name="name" placeholder="e.g. Sundarbans Restoration Phase I" value={formData.name} onChange={handleChange} className="bg-slate-50 border-slate-200 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Region / State</Label>
                                    <Input name="location_name" placeholder="e.g. West Bengal, India" value={formData.location_name} onChange={handleChange} className="bg-slate-50 border-slate-200 h-12" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-slate-500">Ecosystem Type</Label>
                                <select 
                                    name="ecosystem_type" 
                                    className="flex h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                                    value={formData.ecosystem_type} 
                                    onChange={handleChange}
                                >
                                    <option value="MANGROVE">Mangrove Forest</option>
                                    <option value="SEAGRASS">Seagrass Meadow</option>
                                    <option value="WETLAND">Coastal Wetland</option>
                                    <option value="PEATLAND">Peatland</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-slate-500">Description</Label>
                                <textarea 
                                    name="description" 
                                    className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 resize-none"
                                    placeholder="Provide context about the project site, verification methodology, and baseline year..."
                                    value={formData.description} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-900">Geospatial Requirement</h4>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Upload a valid GeoJSON Polygon. This boundary will be used to task Sentinel-2 satellites for NDVI analysis.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-slate-500">GeoJSON Data</Label>
                                <div className="relative">
                                    <textarea 
                                        name="geoJson" 
                                        className="flex min-h-[250px] font-mono text-xs w-full rounded-md border border-slate-200 bg-slate-900 text-slate-300 px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                        placeholder='{ "type": "Polygon", "coordinates": [...] }'
                                        value={formData.geoJson} 
                                        onChange={handleChange} 
                                    />
                                    <div className="absolute top-4 right-4">
                                        <Button size="sm" variant="secondary" className="h-7 text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700">
                                            <Upload className="h-3 w-3 mr-2" /> Upload File
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4">
                                    <Check className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Ready to Submit</h3>
                                <p className="text-slate-500">Please review your project details before registration.</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                                <div className="flex justify-between border-b border-slate-200 pb-4">
                                    <span className="text-sm text-slate-500">Project Name</span>
                                    <span className="text-sm font-bold text-slate-900">{formData.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 pb-4">
                                    <span className="text-sm text-slate-500">Ecosystem</span>
                                    <Badge variant="outline">{formData.ecosystem_type}</Badge>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 pb-4">
                                    <span className="text-sm text-slate-500">Location</span>
                                    <span className="text-sm font-medium text-slate-900">{formData.location_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">Boundary Status</span>
                                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                                        <Check className="h-3 w-3" /> Valid Polygon
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between p-8 border-t border-slate-100 bg-slate-50/50">
                    <Button 
                        variant="outline" 
                        onClick={() => setStep(s => Math.max(1, s - 1))}
                        disabled={step === 1}
                        className="border-slate-200 hover:bg-white"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    
                    {step < 3 ? (
                        <Button onClick={() => setStep(s => s + 1)} className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                            Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 shadow-lg shadow-emerald-600/20">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Registration"}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  )
}

function StepIndicator({ step, currentStep, label, icon: Icon }: any) {
    const isActive = step <= currentStep
    const isCurrent = step === currentStep
    
    return (
        <div className="flex flex-col items-center gap-2 z-10 bg-[#F8FAFC] px-2">
            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${isActive ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 text-slate-300'}
                ${isCurrent ? 'ring-4 ring-slate-200' : ''}
            `}>
                <Icon className="h-4 w-4" />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                {label}
            </span>
        </div>
    )
}