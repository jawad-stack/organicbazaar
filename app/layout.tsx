import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartIcon } from "@/components/cart-icon"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"
import { Leaf, Mail } from "lucide-react"
import Image from "next/image"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Organic Bazaar - 100% Organic Products Online Store",
  description:
    "Shop premium 100% organic, sustainably sourced products at Organic Bazaar. From wellness to beauty, discover high-quality organic items for a healthier, sustainable lifestyle.",
  generator: "v0.app",
  keywords: [
    "organic products",
    "sustainable shopping",
    "eco-friendly",
    "natural products",
    "organic bazaar",
    "buy organic online",
  ],
  authors: [{ name: "Organic Bazaar" }],
  openGraph: {
    title: "Organic Bazaar - 100% Organic Products Online Store",
    description: "Shop premium 100% organic, sustainably sourced products at Organic Bazaar.",
    type: "website",
    siteName: "Organic Bazaar",
    locale: "en_US",
    images: ["/apple-icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organic Products Store - Shop Pure & Sustainable",
    description: "Discover our curated selection of 100% organic, sustainably sourced products.",
    images: ["/apple-icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
 icons: {
  icon: [
    { url: "/icon.svg", type: "image/svg+xml" },
    { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
    { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
  ],
  apple: "/apple-icon.png",
},

  metadataBase: new URL(process.env.NEXT_PUBLIC_METADATA_BASE || "http://localhost:3000"),
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#6b9a7a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b border-border/50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand */}
            <Link
              href="/"
              className="relative h-10 w-48 flex items-center hover:opacity-90 transition-opacity duration-200"
            >
              <Image
                src="/apple-icon.png"
                alt="Organic Bazaar"
                fill
                className="object-contain"
                priority
                sizes="192px"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/products"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
              >
                Blog
              </Link>
              <Link
                href="/faq"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
              >
                Contact
              </Link>
            </div>

            {/* Right Side: Mobile Menu + Cart */}
            <div className="flex items-center gap-2">
              <CartIcon />
              <MobileNav />
            </div>
          </nav>
        </header>

        {children}

        {/* CHANGE: Redesigned footer with premium styling and proper hierarchy */}
        <footer className="bg-gradient-to-b from-background to-muted/30 border-t border-border/50 mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
              {/* Brand Column */}
              <div className="space-y-4">
               <Link
              href="/"
              className="relative h-10 w-48 flex items-center hover:opacity-90 transition-opacity duration-200"
            >
              <Image
                src="/apple-icon.png"
                alt="Organic Bazaar"
                fill
                className="object-contain"
                priority
                sizes="192px"
              />
            </Link>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  Premium 100% certified organic, sustainably sourced products for a healthier lifestyle.
                </p>
                <div className="flex gap-3 pt-2">
                  <Link
                    href="https://facebook.com/organicbazaar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary transition-all"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://twitter.com/organicbazaar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary transition-all"
                    aria-label="Twitter"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 002.856-10.986c-1.486.074-5.461 1.748-5.461 1.748-.439-.122-.839-.122-1.039-.122-1.938 0-3.5 1.562-3.5 3.5 0 .276.033.552.1.824-2.488-.1-4.849-1.225-6.976-3.039-.439.766-.439 2.209.871 3.39.661.555 1.221.716 1.991.716-.166.584-.496 1.579-1.383 2.344-1.296 1.371-4.281-.042-4.281-.042l-.633 7.251c0 3.622 3.318 5.434 6.921 5.434 3.604 0 5.602-3.368 5.602-5.411 0-.212-.007-.922-.033-1.629 1.038.974 2.4 1.559 3.905 1.559 1.037 0 2.074-.276 2.922-.827.315-.205.632-.405.948-.605.316.2.633.4.948.605.848.551 1.885.827 2.922.827.945 0 1.982-.583 2.974-1.555.03.707.03 1.417.03 1.629 0 2.043-1.998 5.411-5.602 5.411-3.603 0-6.921-1.812-6.921-5.434z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://instagram.com/organicbazaar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary transition-all"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-4.358-.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.205.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.204-.013-3.663-.069-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
                      <circle cx="18.5" cy="5.5" r="1.5" fill="currentColor" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Shop Column */}
              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Shop</h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link
                      href="/products"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#collections"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      Collections
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support Column */}
              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Support</h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link
                      href="/faq"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shipping-returns"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      Shipping & Returns
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="mailto:support@organicbazaar.com"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      Email Support
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Company</h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cookies"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sustainability"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      Sustainability
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Newsletter Column */}
              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Newsletter</h4>
                <p className="text-sm text-muted-foreground mb-3">Subscribe for organic tips and exclusive offers.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 rounded-lg border border-border/50 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <button className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Divider */}
            <div className="border-t border-border/50" />

            {/* Bottom Footer */}
            <div className="py-6 md:py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>&copy; 2025 Organic Bazaar. All rights reserved. Proudly organic and sustainable.</p>
              <div className="flex gap-6">
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms
                </Link>
                <Link href="/sitemap" className="hover:text-primary transition-colors">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  )
}
