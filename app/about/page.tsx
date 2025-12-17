import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "About Us - Organic Store",
  description: "Learn about our mission to provide 100% organic, sustainably sourced products.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">About Us</span>
        </nav>

        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">About Our Store</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            We're passionate about bringing you the finest 100% certified organic, sustainably sourced products
            for a healthier lifestyle and a better planet.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              To make organic, sustainably sourced products accessible to everyone who believes in living a
              healthier, more conscious lifestyle. We believe that what you put into your body matters, and where
              it comes from matters even more.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every product in our store has been carefully selected and vetted to ensure it meets our strict
              standards for quality, purity, and sustainability.
            </p>
          </div>
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h3 className="text-2xl font-semibold text-foreground mb-4">Why Choose Us?</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>100% Certified Organic Products</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Sustainably Sourced from Trusted Suppliers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Eco-Friendly Packaging</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Fair Trade Certified</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Fast & Free Shipping Over $50</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>30-Day Money-Back Guarantee</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">Quality</h3>
              <p className="text-muted-foreground">
                We never compromise on quality. Every product is rigorously tested and verified to meet the highest
                standards.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">Sustainability</h3>
              <p className="text-muted-foreground">
                We care about our planet. Our packaging is recyclable and we support sustainable farming practices.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in complete transparency. Know exactly where your products come from and how they're made.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Join the Organic Revolution?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our collection of premium organic products and start your journey to a healthier lifestyle today.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
