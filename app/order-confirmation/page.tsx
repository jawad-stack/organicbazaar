"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Order {
  _id: string
  orderNumber: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  shippingMethod: string
  shippingCost: number
  total: number
  status: string
  lineItems: Array<{
    productName: string
    variantName: string
    quantity: number
    price: number
  }>
  createdAt: string
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError("Order ID not provided")
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?orderId=${orderId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }
        const data = await response.json()
        setOrder(data)
      } catch (err: any) {
        console.error("Error fetching order:", err)
        setError(err.message || "Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  console.log("Order state:", order, error, loading)

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-muted border-t-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">{error || "Order not found"}</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Thank you for your purchase, {order.customerFirstName}!
          </p>
          <p className="text-sm text-muted-foreground">
            Order Number: <span className="font-semibold text-foreground">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Confirmation Email */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              A confirmation email has been sent to{" "}
              <span className="font-semibold">{order.customerEmail}</span>
            </p>
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-3 border-b pb-4 mb-4">
              {order.lineItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">{item.variantName}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">Rs.{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping:</span>
                <span>Rs.{(order.shippingCost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>Rs.{(order.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Shipping Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">
                {order.customerFirstName} {order.customerLastName}
              </p>
              <p>{order?.shippingAddress?.street}</p>
              <p>
                {order?.shippingAddress?.city}, {order?.shippingAddress?.state}{" "}
                {order?.shippingAddress?.postalCode}
              </p>
              <p>{order?.shippingAddress?.country}</p>
              <p className="pt-2">{order.customerPhone}</p>
            </div>
          </Card>

          {/* Shipping Method */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Method</h2>
            <p className="text-sm text-muted-foreground capitalize">
              {order.shippingMethod === "standard"
                ? "Standard Shipping (5-7 business days)"
                : order.shippingMethod === "express"
                  ? "Express Shipping (2-3 business days)"
                  : "Overnight Delivery"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Your order will be carefully packaged and shipped to your address. You will receive a
              tracking number via email.
            </p>
          </Card>

          {/* Order Status */}
          <Card className="p-6 bg-amber-50 border-amber-200">
            <h2 className="text-lg font-semibold mb-2 text-amber-900">Order Status</h2>
            <p className="text-sm text-amber-800 mb-2">
              <span className="capitalize font-medium">{order.status}</span>
            </p>
            <p className="text-sm text-amber-700">
              We're preparing your order for shipment. You'll receive an email with tracking
              information once it ships.
            </p>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button asChild className="flex-1">
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>

          {/* Support */}
          <div className="text-center p-6 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Questions about your order?</p>
            <p className="text-sm">
              Contact us at{" "}
              <a href="mailto:jawadiqbal962@gmail.com" className="text-primary hover:underline">
                jawadiqbal962@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
