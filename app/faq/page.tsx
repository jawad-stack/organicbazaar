import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata = {
  title: "FAQ - Organic Store",
  description: "Frequently asked questions about our products and services.",
}

export default function FAQPage() {
  const faqs = [
    {
      id: "products",
      question: "Are all your products certified organic?",
      answer:
        "Yes, 100% of our products are certified organic by recognized international certification bodies. We verify every supplier and batch to ensure compliance with strict organic standards.",
    },
    {
      id: "shipping",
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 5-7 business days. Express shipping is 2-3 business days, and overnight delivery is available for orders placed before 2pm EST. Free shipping applies to orders over Rs.1500.",
    },
    {
      id: "returns",
      question: "What's your return policy?",
      answer:
        "We offer a 30-day money-back guarantee on all products. If you're not satisfied, contact us for a full refund. See our Shipping & Returns page for complete details.",
    },
    {
      id: "payment",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely with SSL encryption.",
    },
    {
      id: "storage",
      question: "How should I store these products?",
      answer:
        "Storage instructions vary by product. Check the packaging or product details page for specific guidance. Most of our products should be stored in a cool, dry place away from direct sunlight.",
    },
    {
      id: "allergens",
      question: "How do I find allergen information?",
      answer:
        "Detailed allergen information is listed on every product page and on the packaging. If you have specific allergies, please review the ingredients carefully or contact our support team.",
    },
    {
      id: "organic",
      question: "What does 'certified organic' mean?",
      answer:
        "Certified organic means the product has been grown and processed without synthetic pesticides, fertilizers, or GMOs. It meets strict standards set by national and international regulatory bodies.",
    },
    {
      id: "sustainable",
      question: "How do you ensure sustainability?",
      answer:
        "We work exclusively with suppliers who practice sustainable farming, use eco-friendly packaging, and maintain fair trade practices. We continuously audit our supply chain for environmental impact.",
    },
    {
      id: "tracking",
      question: "Can I track my order?",
      answer:
        "Yes, you'll receive a tracking number via email once your order ships. You can use this to track your package in real-time on the carrier's website.",
    },
    {
      id: "bulk",
      question: "Do you offer bulk orders or wholesale?",
      answer:
        "Yes, we offer special pricing for bulk and wholesale orders. Please contact our wholesale team at wholesale@organicbazaar.online for more information.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">FAQ</span>
        </nav>

        <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Find answers to common questions about our products and services.
        </p>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left font-semibold text-foreground">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions */}
        <div className="mt-16 bg-primary/10 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Our customer support team is here to help. Don't hesitate to reach out!
          </p>
          <Link href="/contact" className="text-primary hover:underline font-semibold">
            Contact Us →
          </Link>
        </div>
      </div>
    </main>
  )
}
