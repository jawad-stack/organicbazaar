"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSignup} className="space-y-3">
      <div className="flex gap-2">
        <Input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit">{subscribed ? "Subscribed!" : "Subscribe"}</Button>
      </div>
    </form>
  )
}
