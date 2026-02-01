"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Wind, Leaf, ArrowRight, X } from "lucide-react"

// Dynamically import Globe (no SSR for 3D)
const Globe = dynamic(() => import("@/components/3d/Globe"), { 
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center text-slate-400 font-mono animate-pulse">Initializing Satellite Feed...</div>
})

// Mock Data matching the Globe markers
const projectDetails: Record<number, any> = {
  1: { name: "Sundarbans Mangrove", location: "India/Bangladesh", type: "Mangrove", carbon: "15,420 BCC", status: "Verified", desc: "Largest mangrove forest in the world, protecting millions from cyclones." },
  2: { name: "Gazi Bay Restoration", location: "Kenya", type: "Seagrass", carbon: "8,500 BCC", status: "Verified", desc: "Community-led seagrass conservation project in the Indian Ocean." },
  3: { name: "Great Barrier Reef", location: "Australia", type: "Coral", carbon: "42,000 BCC", status: "Pending", desc: "Coral restoration initiative using bio-rock technology." },
  4: { name: "Amazon River Delta", location: "Brazil", type: "Wetland", carbon: "95,000 BCC", status: "Verified", desc: "High-impact wetland conservation in the Amazon basin." },
  5: { name: "Mekong Delta", location: "Vietnam", type: "Mangrove", carbon: "12,100 BCC", status: "Review", desc: "Rice-shrimp farming integration with mangrove restoration." },
}

export default function MapPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const activeProject = selectedId ? projectDetails[selectedId] : null

  return (
    <div className="h-screen w-full bg-slate-950 overflow-hidden relative flex flex-col">
      <div className="absolute top-0 w-full z-50">
        <Header />
      </div>

      {/* 3D Container */}
      <div className="flex-1 relative">
        <Globe onSelectProject={setSelectedId} />
        
        {/* Overlay Instructions */}
        {!selectedId && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white text-sm animate-bounce pointer-events-none">
            Click on the glowing nodes to view project data
          </div>
        )}

        {/* Floating Project Card (Glassmorphism) */}
        {activeProject && (
          <div className="absolute top-24 right-6 w-96 z-40 animate-in slide-in-from-right-10 duration-500">
            <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700 shadow-2xl text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="h-3 w-3" /> Live Data
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-slate-400 hover:text-white"
                  onClick={() => setSelectedId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-2xl font-black leading-tight">{activeProject.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">{activeProject.location}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="text-xs text-blue-300 font-bold uppercase">Type</div>
                    <div className="font-bold flex items-center gap-1 mt-1">
                      <Leaf className="h-3 w-3" /> {activeProject.type}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-xs text-emerald-300 font-bold uppercase">Carbon</div>
                    <div className="font-bold flex items-center gap-1 mt-1">
                      <Wind className="h-3 w-3" /> {activeProject.carbon}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeProject.desc}
                </p>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0">
                  View Full Analytics <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}