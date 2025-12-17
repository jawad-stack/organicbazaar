import mongoose, { Schema, type Document } from "mongoose"

export interface ICollection extends Document {
  name: string
  slug: string
  description: string
  image: string
  seoDescription?: string
  seoKeywords?: string[]
  createdAt: Date
  updatedAt: Date
}

const collectionSchema = new Schema<ICollection>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, sparse: true, index: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    seoDescription: String,
    seoKeywords: [String],
  },
  { timestamps: true },
)

collectionSchema.index({ slug: 1 })

export const Collection = mongoose.models.Collection || mongoose.model<ICollection>("Collection", collectionSchema)
