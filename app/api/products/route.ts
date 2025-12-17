import { connectDB } from "@/lib/db/connection"
import { Product } from "@/lib/db/models/product"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const collectionId = searchParams.get("collectionId")

    const query: any = { status: "active" }

    if (collectionId) {
      query.collections = collectionId
    }

    const products = await Product.find(query).populate("collections").lean()

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
