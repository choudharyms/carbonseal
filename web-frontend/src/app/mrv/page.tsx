"use client"

import { Navbar } from "@/components/ui/Navbar"
import { Card } from "@/components/ui/card"
import { Satellite, ScanLine, Database, BarChart3 } from "lucide-react"

export default function MRVPage() {
  return (
    <div className="min-h-screen bg-[#05050A] text-white">
      <Navbar />

      <div className="relative pt-40 px-6 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 mb-20">
            <span className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-4 block">Technology Stack</span>
            <h1 className="text-5xl md:text-7xl font-black mb-6">Digital MRV Engine</h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Measurement, Reporting, and Verification (MRV) reimagined for the digital age.
                Zero site visits. 100% data-driven.
            </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <TechCard 
                icon={Satellite}
                title="1. Satellite Acquisition"
                description="We ingest multispectral imagery from Sentinel-2 (ESA) and Landsat-8 (NASA) with a 10m resolution and 5-day revisit cycle."
                detail="Source: Sentinel-2 L2A"
            />
            <TechCard 
                icon={ScanLine}
                title="2. AI Analysis"
                description="Our Computer Vision models calculate NDVI (Normalized Difference Vegetation Index) to assess chlorophyll content and biomass health."
                detail="Model: ResNet-50 + NDVI"
            />
            <TechCard 
                icon={Database}
                title="3. Immutable Storage"
                description="Verification reports are hashed (SHA-256) and pinned to IPFS. The hash is stored on-chain, creating a tamper-proof audit trail."
                detail="Storage: IPFS / Filecoin"
            />
            <TechCard 
                icon={BarChart3}
                title="4. Credit Issuance"
                description="Smart contracts automatically mint ERC-1155 tokens based on the verified hectare area and carbon density factors."
                detail="Chain: Polygon / Eth"
            />
        </div>

        <div className="max-w-4xl mx-auto mt-24">
            <div className="aspect-video rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl relative overflow-hidden flex items-center justify-center group cursor-crosshair">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/88.61,21.55,11,0/1280x720?access_token=pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2toZ3V4Z3A0MDBrdTJ5bzF6Z2djcnJpbiJ9.80o8a8e8')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                <div className="relative z-10 text-center">
                    <ScanLine className="h-16 w-16 text-white/80 mx-auto mb-4 animate-pulse" />
                    <p className="text-white/80 font-mono text-sm">LIVE FEED // SUNDARBANS SECTOR 4</p>
                </div>
                
                {/* HUD Elements */}
                <div className="absolute top-6 left-6 font-mono text-xs text-green-400">NDVI: 0.78 (HEALTHY)</div>
                <div className="absolute top-6 right-6 font-mono text-xs text-blue-400">LAT: 21.55 N</div>
                <div className="absolute bottom-6 left-6 font-mono text-xs text-slate-400">SAT: SENTINEL-2B</div>
                
                {/* Scanning Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-scan"></div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-4 font-mono">
                * Simulated satellite feed for demonstration
            </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
            animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  )
}

function TechCard({ icon: Icon, title, description, detail }: any) {
    return (
        <Card className="bg-white/5 border-white/10 p-8 hover:bg-white/10 transition-colors backdrop-blur-sm">
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400">
                    <Icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded text-slate-400">
                    {detail}
                </span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
                {description}
            </p>
        </Card>
    )
}
