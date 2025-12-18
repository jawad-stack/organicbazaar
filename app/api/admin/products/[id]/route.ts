import { connectDB } from "@/lib/db/connection"
import { Product } from "@/lib/db/models/product"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params

    const product = await Product.findById(id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      product: { ...product.toObject(), _id: String(product._id) },
    })
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params
    const body = await request.json()

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name: body.name,
        slug: body.slug,
        description: body.description,
        category: body.category,
        status: body.status,
        variants: body.variants,
        images: body.images,
        categories: body.categories,
      },
      { new: true },
    )

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Product updated successfully",
      product: { ...product.toObject(), _id: String(product._id) },
    })
  } catch (error: any) {
    console.error("[v0] Error updating product:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to update product",
      },
      { status: 400 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
