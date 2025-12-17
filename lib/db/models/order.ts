import mongoose, { Schema, type Document } from "mongoose"

export interface IOrderLineItem {
  productId: mongoose.Types.ObjectId
  productName: string
  variantId: string
  variantName: string
  price: number
  quantity: number
  sku: string
}

export interface IOrder extends Document {
  lineItems: IOrderLineItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  customerEmail: string
  customerPhone: string
  customerFirstName: string
  customerLastName: string
  shippingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  billingAddress?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  shippingMethod: "standard" | "express" | "overnight"
  shippingCost: number
  deliveryNotes?: string
  paymentStatus: "pending" | "completed" | "failed"
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
}

const lineItemSchema = new Schema<IOrderLineItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  productName: String,
  variantId: String,
  variantName: String,
  price: Number,
  quantity: Number,
  sku: String,
})

const orderSchema = new Schema<IOrder>(
  {
    lineItems: [lineItemSchema],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerFirstName: { type: String, required: true },
    customerLastName: { type: String, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    shippingMethod: { type: String, enum: ["standard", "express", "overnight"], default: "standard" },
    shippingCost: { type: Number, required: true, default: 0 },
    deliveryNotes: String,
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    trackingNumber: String,
  },
  { timestamps: true },
)

export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema)
