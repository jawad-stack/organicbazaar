import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connection"
import { Product } from "@/lib/db/models/product"

export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const query: any = {}

    if (status && status !== "all") {
      query.status = status
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit
    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ])

    const serialized = products.map((p: any) => ({
      _id: String(p._id),
      name: p.name,
      slug: p.slug,
      description: p.description,
      status: p.status,
      categories: p.categories || [],
      variants: p.variants || [],
      images: p.images || [],
    }))

    return NextResponse.json({ products: serialized, total })
  } catch (error) {
    console.error("[v0] Error fetching admin products:", error)
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()

    const product = new Product({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
      description: body.description,
      categories: body.categories || [],
      status: body.status || "active",
      variants: body.variants || [{ price: 0, stock: 0 }],
      images: body.images || [],
    })

    await product.save()

    return NextResponse.json(
      {
        _id: String(product._id),
        name: product.name,
        slug: product.slug,
        description: product.description,
        status: product.status,
        categories: product.categories,
        variants: product.variants,
        images: product.images,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
