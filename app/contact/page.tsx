import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const metadata = {
  title: "Contact Us - Organic Bazaar",
  description: "Contact Organic Bazaar for customer support and inquiries about organic products.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">Contact Us</span>
        </nav>

        <h1 className="text-4xl font-bold text-foreground mb-2">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-12">We'd love to hear from you. Get in touch with our team.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground">organicbazaar962@gmail.com</p>
              <p className="text-sm text-muted-foreground mt-1">We'll respond within 24 hours</p>
            </Card>

            {/* <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Phone</h3>
              <p className="text-muted-foreground">1-800-ORG-GOOD</p>
              <p className="text-sm text-muted-foreground mt-1">Monday - Friday, 9am - 5pm EST</p>
            </Card> */}

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Hours</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Monday - Friday: 9am - 5pm EST</p>
                <p>Saturday: 10am - 3pm EST</p>
                <p>Sunday: Closed</p>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <Input id="subject" name="subject" placeholder="What is this about?" required />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for?{" "}
            <Link href="/faq" className="text-primary hover:underline">
              Visit our FAQ page
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
