import { connectDB } from "@/lib/db/connection"
import { Collection } from "@/lib/db/models/collection"
import { Product } from "@/lib/db/models/product"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB()
    const { slug } = await params

    const collection = await Collection.findOne({ slug }).lean()

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    const products = await Product.find({
      collections: collection._id,
      status: "active",
    }).lean()

    return NextResponse.json({ collection, products })
  } catch (error) {
    console.error("Error fetching collection:", error)
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 })
  }
}
