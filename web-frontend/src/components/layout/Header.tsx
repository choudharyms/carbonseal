"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Waves, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"



declare global {
  interface Window {
    ethereum: any;
  }
}

export function Header() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const { BrowserProvider } = await import("ethers")
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          const address = await accounts[0].getAddress()
          setWalletAddress(address)
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this feature!")
      return
    }

    try {
      setIsConnecting(true)
      const { BrowserProvider } = await import("ethers")
      const provider = new BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      setWalletAddress(address)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Failed to connect wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-2xl shadow-lg shadow-blue-500/5">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse-slow" />
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-2 rounded-xl shadow-xl group-hover:scale-110 transition-transform">
              <Waves className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Carbon Seal
            </span>
            <span className="text-xs text-slate-600 font-bold tracking-widest uppercase">
              Blue Carbon Registry
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all rounded-full" />
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors relative group"
          >
            Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all rounded-full" />
          </Link>
           <Link
            href="/marketplace"
            className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors relative group"
          >
            Marketplace
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all rounded-full" />
          </Link>
          <Link
            href="/projects"
            className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors relative group"
          >
            Projects
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all rounded-full" />
          </Link>
          <Link
  href="/mrv"
  className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors relative group"
>
  MRV Data
  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all rounded-full" />
</Link>
<Link
  href="/map"
  className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors relative group"
>
  Digital Twin
  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all rounded-full" />
</Link>
<Link
  href="/portfolio"
  className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors relative group"
>
  Portfolio
  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all rounded-full" />
</Link>
<Link
  href="/calculator"
  className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors relative group"
>
  Calculator
  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all rounded-full" />
</Link>
          <Link
  href="/about"
  className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors relative group"
>
  About
  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all rounded-full" />
</Link>
        </nav>

        {/* Wallet Connection */}
        <div className="flex items-center gap-4">
          {walletAddress ? (
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 shadow-lg shadow-emerald-500/20">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 animate-pulse shadow-lg shadow-emerald-500/50" />
              <span className="text-sm font-mono font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {formatAddress(walletAddress)}
              </span>
            </div>
          ) : (
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              variant="default"
              size="default"
              className="group"
            >
              <Wallet className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
