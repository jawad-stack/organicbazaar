import mongoose from "mongoose"

export interface IReview {
  _id: string
  productId: string
  customerName: string
  customerEmail: string
  rating: number // 1-5
  title: string
  content: string
  helpful: number
  notHelpful: number
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 2000,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    notHelpful: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema)
