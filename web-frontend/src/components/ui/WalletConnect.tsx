"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Check, Copy, Loader2 } from "lucide-react"

import { API_URL } from "@/config"

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Check if user has a custodial wallet in local storage or fetch from profile
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const u = JSON.parse(userStr)
      if (u.wallet_address) {
        setAddress(u.wallet_address)
      }
    }
  }, [])

  const handleConnect = async () => {
    setLoading(true)
    try {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await fetch(`${API_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        
        if (res.ok) {
            const data = await res.json()
            if (data.wallet_address) {
                setAddress(data.wallet_address)
                // Update local storage user object if needed
                const userStr = localStorage.getItem("user")
                if (userStr) {
                    const u = JSON.parse(userStr)
                    u.wallet_address = data.wallet_address
                    localStorage.setItem("user", JSON.stringify(u))
                }
            }
        }
    } catch (err) {
        console.error("Wallet connection failed", err)
    } finally {
        setLoading(false)
    }
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold font-mono">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {address.substring(0, 6)}...{address.substring(address.length - 4)}
        </div>
        <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full border-slate-200 hover:bg-slate-100"
            onClick={copyAddress}
        >
            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-500" />}
        </Button>
      </div>
    )
  }

  return (
    <Button 
        onClick={handleConnect} 
        disabled={loading}
        className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-4 h-9 text-xs font-bold shadow-sm"
    >
        {loading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Wallet className="h-3 w-3 mr-2" />}
        Connect Wallet
    </Button>
  )
}
