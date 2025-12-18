import mongoose, { Schema, type Document } from "mongoose";
import "./collection";

export interface ICloudinaryImage {
  url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  created_at?: Date;
}

export interface IVariant {
  _id?: string;
  name: string;
  attributes: Record<string, string>;
  sku: string;
  price: number;
  stock: number;
  image?: ICloudinaryImage; // Updated from string to object
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  images: ICloudinaryImage[]; // Updated from string[] to object[]
  collections: mongoose.Types.ObjectId[];
  variants: IVariant[];
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

// Cloudinary Image Schema
const cloudinaryImageSchema = new Schema<ICloudinaryImage>({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  width: Number,
  height: Number,
  format: String,
  resource_type: { type: String, default: "image" },
  created_at: { type: Date, default: Date.now },
});

const variantSchema = new Schema<IVariant>({
  name: { type: String, required: true },
  attributes: { type: Schema.Types.Mixed, required: true },
  sku: { type: String, required: true, unique: true, sparse: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: cloudinaryImageSchema, // Updated from String to cloudinaryImageSchema
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      index: true,
    },
    description: { type: String, required: true },
    images: [cloudinaryImageSchema], // Updated from [String] to [cloudinaryImageSchema]
    collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
    variants: [variantSchema],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
  },
  { timestamps: true }
);

productSchema.index({ slug: 1, status: 1 });

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
