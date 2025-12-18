"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"

interface AdminAuthWrapperProps {
  children: React.ReactNode
}

export function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth")
    if (auth) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        sessionStorage.setItem("adminAuth", "true")
        setIsAuthenticated(true)
        setUsername("")
        setPassword("")
      } else {
        const data = await response.json()
        setError(data.error || "Invalid credentials")
      }
    } catch {
      setError("Authentication failed")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth")
    setIsAuthenticated(false)
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-border rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Admin Access</h1>
            <p className="text-sm text-muted-foreground">Please authenticate to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="bg-card"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-card"
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/90">
              Sign In
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Credentials are configured via ADMIN_USER and ADMIN_PASS environment variables
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={handleLogout} variant="outline" size="sm" className="bg-background">
          Logout
        </Button>
      </div>
    </>
  )
}
