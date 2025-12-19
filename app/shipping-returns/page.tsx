import Link from "next/link"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "Shipping & Returns - Organic Store",
  description: "Our shipping and returns policy.",
}

export default function ShippingReturnsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">Shipping & Returns</span>
        </nav>

        <h1 className="text-4xl font-bold text-foreground mb-2">Shipping & Returns</h1>
        <p className="text-lg text-muted-foreground mb-12">We want you to be completely satisfied with your purchase.</p>

        {/* Shipping */}
        <div className="space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Shipping Information</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Shipping Methods</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded">
                    <p className="font-semibold text-foreground">Standard Shipping (5-7 business days)</p>
                    <p className="text-sm text-muted-foreground">Rs.149.99 - FREE on orders over Rs.1500</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded">
                    <p className="font-semibold text-foreground">Express Shipping (2-3 business days)</p>
                    <p className="text-sm text-muted-foreground">Rs.249.99</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded">
                    <p className="font-semibold text-foreground">Overnight Delivery (Next business day)</p>
                    <p className="text-sm text-muted-foreground">Rs.499.99 (orders placed before 11amT)</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Processing Time</h3>
                <p className="text-muted-foreground">
                  All orders are processed within 1 business day. Orders placed on weekends or holidays will be
                  processed the next business day.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Tracking</h3>
                <p className="text-muted-foreground">
                  Once your order ships, you'll receive a tracking number via email. Use this to monitor your
                  delivery in real-time.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Shipping Locations</h3>
                <p className="text-muted-foreground">
                  We ship to all 50 US states and many international locations. International shipping rates are
                  calculated at checkout. International orders may be subject to customs duties and taxes.
                </p>
              </div>
            </div>
          </Card>

          {/* Returns */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Return & Refund Policy</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">30-Day Money-Back Guarantee</h3>
                <p className="text-muted-foreground mb-4">
                  We stand behind our products 100%. If you're not satisfied for any reason within 30 days of
                  purchase, we'll provide a full refund.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">How to Return</h3>
                <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
                  <li>Contact our support team at jawadiqbal962@gmail.com with your order number</li>
                  <li>Provide a reason for the return (optional feedback appreciated)</li>
                  <li>Receive a return shipping label and instructions</li>
                  <li>Ship the item back to us in its original condition</li>
                  <li>Once received and inspected, we'll process your refund within 5-7 business days</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Return Conditions</h3>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Items must be in original, unopened condition for full refund</li>
                  <li>Opened food items must be unopened and sealed to be eligible for return</li>
                  <li>Items must be returned within 30 days of purchase</li>
                  <li>Original receipt or order confirmation is required</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Damaged or Defective Items</h3>
                <p className="text-muted-foreground">
                  If you receive a damaged or defective item, contact us immediately with photos. We'll send a
                  replacement at no cost or process a full refund.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Return Shipping</h3>
                <p className="text-muted-foreground">
                  We provide prepaid return shipping labels for all eligible returns. For international orders,
                  return shipping costs may apply.
                </p>
              </div>
            </div>
          </Card>

          {/* Exchanges */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Exchanges</h2>
            <p className="text-muted-foreground mb-4">
              Need to exchange an item? We can help! If you'd like to exchange for a different size, flavor, or
              product, contact our support team and we'll arrange an exchange at no additional cost.
            </p>
            <p className="text-muted-foreground">
              Email us at jawadiqbal962@gmail.com with your order number and what you'd like to exchange.
            </p>
          </Card>

          {/* Questions */}
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Questions?</h2>
            <p className="text-muted-foreground">
              Our customer service team is happy to help. Contact us at jawadiqbal962@gmail.com or call
              1-800-ORG-GOOD.
            </p>
          </Card>
        </div>
      </div>
    </main>
  )
}
