"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge" 
import { ShoppingCart, Leaf, Loader2, ArrowRight } from "lucide-react"
import Sidebar from "@/components/ui/Sidebar"
import { PageHeader } from "@/components/ui/PageHeader"

interface Listing {
  id: string
  amount_available: number
  price_per_tonne_usd: number
  project: {
    name: string
    ecosystem_type: string
    location_name: string
  }
  seller: {
    username: string
  }
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/marketplace")
        if (res.ok) {
            const data = await res.json()
            setListings(data)
        }
    } catch (error) {
        console.error("Failed to fetch listings", error)
    } finally {
        setLoading(false)
    }
  }

  const handleBuy = async (listingId: string, price: number) => {
    if (!confirm(`Confirm purchase of 1 Tonne for $${price}?`)) return
    
    setPurchasing(listingId)
    const token = localStorage.getItem("token")
    if (!token) return

    try {
        const res = await fetch("http://localhost:5000/api/marketplace/buy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ listingId, amount: 1 })
        })
        
        const data = await res.json()
        if (res.ok) {
            alert("Success. Assets transferred.")
            fetchListings()
        } else {
            alert("Error: " + data.error)
        }
    } catch (err) {
        console.error(err)
    } finally {
        setPurchasing(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 py-10 px-8">
        <PageHeader title="Marketplace" description="Acquire verified dMRV carbon credits from registered developers." />

        {loading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        ) : listings.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                <Leaf className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-900">No Listings Available</h3>
                <p className="text-sm text-slate-500">Marketplace is currently empty.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <Card key={listing.id} className="group hover:border-slate-300 transition-all shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="font-medium text-slate-600 bg-slate-100">
                                    {listing.project.ecosystem_type}
                                </Badge>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded">
                                    Vintage 2024
                                </span>
                            </div>
                            <CardTitle className="text-lg leading-tight">{listing.project.name}</CardTitle>
                            <CardDescription className="text-xs">
                                {listing.project.location_name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-end justify-between border-t border-b border-slate-50 py-3">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Price / Tonne</p>
                                    <p className="text-xl font-bold text-slate-900">${listing.price_per_tonne_usd}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Available</p>
                                    <p className="text-lg font-medium text-slate-700">{listing.amount_available} t</p>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={() => handleBuy(listing.id, listing.price_per_tonne_usd)}
                                disabled={purchasing === listing.id}
                                className="w-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                            >
                                {purchasing === listing.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <span className="flex items-center text-sm font-medium">
                                        Purchase Credits <ArrowRight className="ml-2 h-4 w-4 opacity-50" />
                                    </span>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}
