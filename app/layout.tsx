import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartIcon } from "@/components/cart-icon"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Organic Products Store - Shop Pure & Sustainable",
    description: "Discover our curated selection of 100% organic, sustainably sourced products.",
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
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_METADATA_BASE || "http://localhost:3000"),
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
              className="text-lg font-bold text-foreground tracking-tight hover:text-primary transition-colors duration-200"
            >
              Organic Bazaar
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

        {/* Existing footer code */}
        <footer className="bg-muted/30 border-t border-border/50 mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div>
                <h3 className="font-semibold text-foreground mb-4">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We provide 100% certified organic, sustainably sourced products for a healthier lifestyle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">Shop</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/#collections" className="text-muted-foreground hover:text-primary transition-colors">
                      All Collections
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">Help</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shipping-returns"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Shipping & Returns
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border/50 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-6">
                <p>&copy; 2025 Organic Bazaar. All rights reserved.</p>
                <div className="flex gap-6">
                  <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                    Privacy
                  </Link>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    Terms
                  </Link>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </div>
                <div className="flex gap-4 items-center">
                  <Link
                    href="https://facebook.com/organicbazaar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://twitter.com/organicbazaar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 002.856-10.986c-1.486.074-5.461 1.748-5.461 1.748-.439-.122-.839-.122-1.039-.122-1.938 0-3.5 1.562-3.5 3.5 0 .276.033.552.1.824-2.488-.1-4.849-1.225-6.976-3.039-.439.766-.439 2.209.871 3.39.661.555 1.221.716 1.991.716-.166.584-.496 1.579-1.383 2.344-1.296 1.371-4.281-.042-4.281-.042l-.633 7.251c0 3.622 3.318 5.434 6.921 5.434 3.604 0 5.602-3.368 5.602-5.411 0-.212-.007-.922-.033-1.629 1.038.974 2.4 1.559 3.905 1.559 1.037 0 2.074-.276 2.922-.827.315-.205.632-.405.948-.605.316.2.633.4.948.605.848.551 1.885.827 2.922.827.945 0 1.982-.583 2.974-1.555.03.707.03 1.417.03 1.629 0 2.043-1.998 5.411-5.602 5.411-3.603 0-6.921-1.812-6.921-5.434z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://instagram.com/organicbazaar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                        ry="5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                    </svg>
                  </Link>
                  <Link
                    href="https://linkedin.com/company/organicbazaar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://youtube.com/@organicbazaar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  )
}
