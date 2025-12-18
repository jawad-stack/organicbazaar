import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connection"
import { Product } from "@/lib/db/models/product"

export async function GET() {
  try {
    await connectDB()
    const products = await Product.find({}).select("slug name images").lean()
    const serialized = products.map((p: any) => (p))
    return NextResponse.json({ products: serialized })
  } catch (error) {
    console.error("Error fetching admin products:", error)
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 })
  }
}
