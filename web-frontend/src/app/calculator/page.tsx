"use client"

import { useState, useEffect } from "react"
import { 
  Plane, 
  Car, 
  Zap, 
  ShoppingBag, 
  ArrowRight, 
  Leaf, 
  RotateCcw,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import Link from "next/link"

export default function CalculatorPage() {
  // State for inputs
  const [flights, setFlights] = useState(2) // Short haul flights
  const [miles, setMiles] = useState(150)   // Miles driven per week
  const [energy, setEnergy] = useState(120) // Monthly energy bill ($)
  
  // Results state
  const [totalEmissions, setTotalEmissions] = useState(0)
  const [creditsNeeded, setCreditsNeeded] = useState(0)
  const [costEstimate, setCostEstimate] = useState(0)

  // Simple Carbon Formula (Approximation)
  useEffect(() => {
    // Factors: 0.5 tons per flight, 0.0004 tons per mile (annualized), 0.005 tons per $ energy (annualized)
    const flightCarbon = flights * 0.5
    const carCarbon = miles * 52 * 0.0004
    const energyCarbon = energy * 12 * 0.005
    
    const total = flightCarbon + carCarbon + energyCarbon
    setTotalEmissions(parseFloat(total.toFixed(2)))
    
    // 1 Credit = 1 Ton. Buffer added for safety.
    const credits = Math.ceil(total)
    setCreditsNeeded(credits)
    
    // Avg price $15 per credit
    setCostEstimate(credits * 15)
  }, [flights, miles, energy])

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Header />

      {/* Hero */}
      <div className="relative bg-white/40 backdrop-blur-xl border-b border-white/20 pt-12 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <Leaf className="h-3 w-3" /> Offset Assistant
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800">
            Calculate Your Impact
          </h1>
          <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto">
            Estimate your annual carbon footprint and instantly find certified blue carbon projects to neutralize it.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-xl border-white/60 shadow-lg p-6">
            <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
              1. Travel & Transport
            </h3>
            
            <div className="space-y-8">
              {/* Flights Slider */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                    <Plane className="h-4 w-4 text-blue-500" /> Annual Flights
                  </label>
                  <span className="text-blue-600 font-black">{flights} trips</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="20" 
                  value={flights} 
                  onChange={(e) => setFlights(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-xs text-slate-400">Short to medium haul flights per year.</p>
              </div>

              {/* Car Slider */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                    <Car className="h-4 w-4 text-orange-500" /> Weekly Driving
                  </label>
                  <span className="text-orange-600 font-black">{miles} miles</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="1000" step="10"
                  value={miles} 
                  onChange={(e) => setMiles(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-xl border-white/60 shadow-lg p-6">
            <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
              2. Home & Lifestyle
            </h3>
            
            {/* Energy Slider */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" /> Monthly Energy Bill
                </label>
                <span className="text-yellow-600 font-black">${energy}</span>
              </div>
              <input 
                type="range" 
                min="0" max="1000" step="10"
                value={energy} 
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <p className="text-xs text-slate-400">Combined electric and heating costs.</p>
            </div>
          </Card>

           <Button 
            variant="ghost" 
            className="text-slate-400 hover:text-slate-600"
            onClick={() => {setFlights(0); setMiles(0); setEnergy(0)}}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Calculator
          </Button>
        </div>

        {/* Results Section */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <Card className="relative bg-slate-900 text-white border-slate-800 shadow-2xl p-8 overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <div className="relative z-10 text-center space-y-2 mb-8">
                <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">Your Annual Footprint</div>
                <div className="text-7xl font-black tracking-tighter">
                  {totalEmissions} <span className="text-2xl text-slate-400 font-bold">tons</span>
                </div>
                <div className="text-slate-400 text-sm">CO2 Equivalent Emissions</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-white">{creditsNeeded}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase mt-1">Credits Needed</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-emerald-400">${costEstimate}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase mt-1">Est. Cost</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 flex gap-3">
                  <Info className="h-5 w-5 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    By purchasing <strong>{creditsNeeded} Blue Carbon Credits</strong>, you support the restoration of approximately <strong>{creditsNeeded * 20} mangrove saplings</strong>, which absorb carbon 4x faster than rainforests.
                  </p>
                </div>

                <Link href="/marketplace" className="block">
                  <Button className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 border-0 shadow-lg shadow-emerald-900/50">
                    Offset Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <p className="text-center text-xs text-slate-500">
                  Secure blockchain transaction via Polygon
                </p>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}