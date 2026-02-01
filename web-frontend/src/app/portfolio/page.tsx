"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Archive, Download, Loader2, FileText, CheckCircle2, Tag, X } from "lucide-react"
import Sidebar from "@/components/ui/Sidebar"
import { PageHeader } from "@/components/ui/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { API_URL } from "@/config"

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [retiring, setRetiring] = useState<string | null>(null)
  const [selling, setSelling] = useState<string | null>(null)
  const [sellAmount, setSellAmount] = useState("")
  const [sellPrice, setSellPrice] = useState("")

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
        const res = await fetch(`${API_URL}/api/portfolio`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
            const data = await res.json()
            setHoldings(data)
        }
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }
  }

  const handleRetire = async (id: string) => {
    if (!confirm("Confirm Retirement? This will permanently remove these credits from circulation.")) return
    
    setRetiring(id)
    const token = localStorage.getItem("token")
    
    try {
        const res = await fetch(`${API_URL}/api/portfolio/retire`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ holdingId: id })
        })
        
        if (res.ok) {
            const data = await res.json()
            alert(`Certificate Generated: ${data.certificateId}`)
        }
    } catch (error) {
        console.error(error)
    } finally {
        setRetiring(null)
    }
  }

  const handleSell = async () => {
    if (!selling) return
    const token = localStorage.getItem("token")
    
    try {
        const holding = holdings.find(h => h.id === selling)
        if (!holding) return

        const res = await fetch(`${API_URL}/api/marketplace/list`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                projectId: holding.id, 
                tokenId: holding.tokenId, 
                amount: parseInt(sellAmount),
                pricePerToken: parseFloat(sellPrice)
            })
        })
        
        if (res.ok) {
            alert("Listing Created Successfully")
            setSelling(null)
            fetchPortfolio()
        } else {
            const err = await res.json()
            alert("Error: " + err.error)
        }
    } catch (error) {
        console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 py-10 px-8 relative">
        <PageHeader title="Carbon Assets" description="Manage verified holdings and generate retirement certificates." />

        {loading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        ) : holdings.length === 0 ? (
            <div className="text-center py-24 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Archive className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">No Assets Found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                    Your wallet is empty. Credits minted from your projects or purchased from the marketplace will appear here.
                </p>
            </div>
        ) : (
            <div className="space-y-4">
                {holdings.map((item) => (
                    <Card key={item.id} className="p-0 overflow-hidden flex flex-col md:flex-row items-stretch border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="w-2 bg-emerald-600 shrink-0" />
                        
                        <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-slate-900">{item.projectName}</h3>
                                    <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                                        Verified Asset
                                    </Badge>
                                </div>
                                <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-slate-400" />
                                    Source: {item.source}
                                    <span className="text-slate-300">•</span>
                                    ID: {String(item.tokenId).substring(0, 12)}...
                                </p>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Balance</p>
                                    <p className="text-2xl font-bold text-slate-900">{item.amount.toLocaleString()} <span className="text-sm font-medium text-slate-500">tCO₂e</span></p>
                                </div>
                                <div className="h-10 w-px bg-slate-200 hidden md:block" />
                                <div className="flex gap-2">
                                    <Button variant="outline" className="gap-2" onClick={() => setSelling(item.id)}>
                                        <Tag className="h-4 w-4" /> Sell
                                    </Button>
                                    <Button 
                                        onClick={() => handleRetire(item.id)}
                                        disabled={retiring === item.id}
                                        className="bg-slate-900 hover:bg-slate-800 text-white gap-2 min-w-[140px]"
                                    >
                                        {retiring === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                        Retire
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        )}

        {selling && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
                    <button 
                        onClick={() => setSelling(null)}
                        className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-1">List on Marketplace</h3>
                    <p className="text-sm text-slate-500 mb-6">Set your price and quantity for institutional buyers.</p>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Amount to Sell (tonnes)</Label>
                            <Input 
                                type="number" 
                                placeholder="e.g. 100" 
                                value={sellAmount} 
                                onChange={(e) => setSellAmount(e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Price per Tonne ($USD)</Label>
                            <Input 
                                type="number" 
                                placeholder="e.g. 25.00" 
                                value={sellPrice} 
                                onChange={(e) => setSellPrice(e.target.value)} 
                            />
                        </div>
                        <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2" 
                            onClick={handleSell}
                        >
                            Create Listing
                        </Button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  )
}