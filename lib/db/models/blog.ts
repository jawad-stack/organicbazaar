import mongoose, { Schema, type Document } from "mongoose"

export interface IBlogPost extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  publishedAt: Date
  image?: string
  views: number
  createdAt: Date
  updatedAt: Date
  status: "draft" | "published"
  seoDescription?: string
  seoKeywords?: string[]
}

const BlogSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true, index: true },
    author: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
    image: String,
    views: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    seoDescription: String,
    seoKeywords: [String],
  },
  { timestamps: true },
)

export const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogSchema)
