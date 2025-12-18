import { connectDB } from "@/lib/db/connection"
import { BlogPost } from "@/lib/db/models/blog"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit
    const query: any = { status: "published" }

    if (category) query.category = category
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { excerpt: { $regex: search, $options: "i" } }]
    }

    const [posts, total] = await Promise.all([
      BlogPost.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
      BlogPost.countDocuments(query),
    ])

    const categories = await BlogPost.distinct("category", { status: "published" })

    return NextResponse.json({
      posts: posts.map((p: any) => ({ ...p, _id: String(p._id) })),
      total,
      pages: Math.ceil(total / limit),
      categories,
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
