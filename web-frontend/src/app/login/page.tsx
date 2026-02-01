"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Hexagon, Loader2, ArrowRight } from "lucide-react"
import { API_URL } from "@/config"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.msg || "Access denied. Please check your credentials.")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        
        <div className="text-center space-y-2">
            <div className="flex justify-center">
                <div className="bg-slate-900 p-2 rounded-lg">
                    <Hexagon className="h-8 w-8 text-white fill-current" />
                </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Carbon Seal</h1>
            <p className="text-sm text-slate-500">National Blue Carbon Registry</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-medium">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your organizational credentials below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@organization.com"
                  className="bg-white"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-white"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-600 font-medium">
                    {error}
                </div>
              )}
              <Button className="w-full bg-slate-900 hover:bg-slate-800" type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Authenticate"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-50 pt-4">
            <Link href="/signup" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              Request account access <ArrowRight className="h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
        
        <p className="text-center text-xs text-slate-400">
            Authorized personnel only. All activity is logged.
        </p>
      </div>
    </div>
  )
}