"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"

interface CheckoutFormData {
  // Customer Info
  firstName: string
  lastName: string
  email: string
  phone: string

  // Shipping Address
  shippingStreet: string
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string

  // Billing Address (optional)
  sameAsBilling: boolean
  billingStreet: string
  billingCity: string
  billingState: string
  billingPostalCode: string
  billingCountry: string

  // Shipping Method
  shippingMethod: "standard" | "express" | "overnight"
  deliveryNotes: string
}

const SHIPPING_COSTS = {
  standard: 5.99,
  express: 14.99,
  overnight: 29.99,
}

export function CheckoutForm() {
  const { items, getTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
    shippingCountry: "United States",
    sameAsBilling: true,
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingPostalCode: "",
    billingCountry: "United States",
    shippingMethod: "standard",
    deliveryNotes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, sameAsBilling: e.target.checked }))
  }

  const shippingCost = SHIPPING_COSTS[formData.shippingMethod]
  const subtotal = getTotal()
  const total = subtotal + shippingCost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate required fields
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone ||
        !formData.shippingStreet ||
        !formData.shippingCity ||
        !formData.shippingState ||
        !formData.shippingPostalCode
      ) {
        throw new Error("Please fill in all required fields")
      }

      if (items.length === 0) {
        throw new Error("Your cart is empty")
      }

      // Submit order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems: items,
          subtotal,
          shippingCost,
          total,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerFirstName: formData.firstName,
          customerLastName: formData.lastName,
          shippingAddress: {
            street: formData.shippingStreet,
            city: formData.shippingCity,
            state: formData.shippingState,
            postalCode: formData.shippingPostalCode,
            country: formData.shippingCountry,
          },
          billingAddress: formData.sameAsBilling
            ? null
            : {
                street: formData.billingStreet,
                city: formData.billingCity,
                state: formData.billingState,
                postalCode: formData.billingPostalCode,
                country: formData.billingCountry,
              },
          shippingMethod: formData.shippingMethod,
          deliveryNotes: formData.deliveryNotes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create order")
      }

      const { orderId } = await response.json()

      setSuccess(true)
      clearCart()

      // Redirect to order confirmation
      setTimeout(() => {
        window.location.href = `/order-confirmation?orderId=${orderId}`
      }, 1500)
    } catch (err: any) {
      console.error("Checkout error:", err)
      setError(err.message || "An error occurred during checkout")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">✓ Order Submitted!</h2>
        <p className="text-muted-foreground">Redirecting to order confirmation...</p>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Customer Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </Card>

      {/* Shipping Address */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="shippingStreet">Street Address *</Label>
            <Input
              id="shippingStreet"
              name="shippingStreet"
              value={formData.shippingStreet}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="shippingCity">City *</Label>
              <Input
                id="shippingCity"
                name="shippingCity"
                value={formData.shippingCity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="shippingState">State/Province *</Label>
              <Input
                id="shippingState"
                name="shippingState"
                value={formData.shippingState}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="shippingPostalCode">Postal Code *</Label>
              <Input
                id="shippingPostalCode"
                name="shippingPostalCode"
                value={formData.shippingPostalCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="shippingCountry">Country</Label>
            <Input
              id="shippingCountry"
              name="shippingCountry"
              value={formData.shippingCountry}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </Card>

      {/* Billing Address */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <input
            id="sameAsBilling"
            name="sameAsBilling"
            type="checkbox"
            checked={formData.sameAsBilling}
            onChange={handleCheckboxChange}
            className="w-4 h-4"
          />
          <Label htmlFor="sameAsBilling" className="ml-2 cursor-pointer">
            Billing address same as shipping
          </Label>
        </div>

        {!formData.sameAsBilling && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Billing Address</h3>
            <div>
              <Label htmlFor="billingStreet">Street Address *</Label>
              <Input
                id="billingStreet"
                name="billingStreet"
                value={formData.billingStreet}
                onChange={handleInputChange}
                required={!formData.sameAsBilling}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="billingCity">City *</Label>
                <Input
                  id="billingCity"
                  name="billingCity"
                  value={formData.billingCity}
                  onChange={handleInputChange}
                  required={!formData.sameAsBilling}
                />
              </div>
              <div>
                <Label htmlFor="billingState">State/Province *</Label>
                <Input
                  id="billingState"
                  name="billingState"
                  value={formData.billingState}
                  onChange={handleInputChange}
                  required={!formData.sameAsBilling}
                />
              </div>
              <div>
                <Label htmlFor="billingPostalCode">Postal Code *</Label>
                <Input
                  id="billingPostalCode"
                  name="billingPostalCode"
                  value={formData.billingPostalCode}
                  onChange={handleInputChange}
                  required={!formData.sameAsBilling}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="billingCountry">Country</Label>
              <Input
                id="billingCountry"
                name="billingCountry"
                value={formData.billingCountry}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Shipping Method */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
        <div className="space-y-3">
          {Object.entries(SHIPPING_COSTS).map(([method, cost]) => (
            <label key={method} className="flex items-center cursor-pointer p-3 border rounded hover:bg-muted">
              <input
                type="radio"
                name="shippingMethod"
                value={method}
                checked={formData.shippingMethod === method}
                onChange={(e) => handleSelectChange("shippingMethod", e.target.value)}
                className="w-4 h-4"
              />
              <span className="ml-3 flex-1 capitalize">
                {method === "standard"
                  ? "Standard (5-7 business days)"
                  : method === "express"
                    ? "Express (2-3 business days)"
                    : "Overnight Delivery"}
              </span>
              <span className="font-semibold text-primary">${cost.toFixed(2)}</span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <Label htmlFor="deliveryNotes">Delivery Instructions (Optional)</Label>
          <Textarea
            id="deliveryNotes"
            name="deliveryNotes"
            value={formData.deliveryNotes}
            onChange={handleInputChange}
            placeholder="e.g., Leave at front door, ring doorbell twice..."
            rows={3}
          />
        </div>
      </Card>

      {/* Order Summary */}
      <Card className="p-6 bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
              <span>
                {item.productName} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping ({formData.shippingMethod}):</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading || items.length === 0}
      >
        {loading ? "Processing Order..." : "Place Order"}
      </Button>
    </form>
  )
}
