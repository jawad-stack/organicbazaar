"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden hover:bg-muted/50">
          <Menu className="w-6 h-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
          <Link
            href="/"
            className="font-bold text-lg text-foreground transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Organic Bazaar
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary pl-3"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="px-4 py-4 border-t border-border/50 space-y-3">
          <Button asChild className="w-full" onClick={() => setOpen(false)}>
            <Link href="/cart">Go to Cart</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
