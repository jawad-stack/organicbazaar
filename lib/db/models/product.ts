import mongoose, { Schema, type Document } from "mongoose"
import "./collection"

export interface IVariant {
  _id?: string
  name: string
  attributes: Record<string, string>
  sku: string
  price: number
  stock: number
  image?: string
}

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  images: string[]
  collections: mongoose.Types.ObjectId[]
  variants: IVariant[]
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

const variantSchema = new Schema<IVariant>({
  name: { type: String, required: true },
  attributes: { type: Schema.Types.Mixed, required: true },
  sku: { type: String, required: true, unique: true, sparse: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: String,
})

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, sparse: true, index: true },
    description: { type: String, required: true },
    images: [String],
    collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
    variants: [variantSchema],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
  },
  { timestamps: true },
)

productSchema.index({ slug: 1, status: 1 })

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)
