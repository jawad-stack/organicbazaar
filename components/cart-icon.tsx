"use client"

import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CartIcon() {
  const items = useCart((state) => state.items)
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Button asChild variant="ghost" size="sm" className="relative hover:bg-muted/50 transition-colors">
      <Link href="/cart" className="flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <span className="text-sm font-medium">Cart</span>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center animate-scale-in">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
