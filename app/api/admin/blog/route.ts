import { connectDB } from "@/lib/db/connection"
import { BlogPost } from "@/lib/db/models/blog"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || "all"

    const skip = (page - 1) * limit
    const query: any = status !== "all" ? { status } : {}

    const [posts, total] = await Promise.all([
      BlogPost.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      BlogPost.countDocuments(query),
    ])

    return NextResponse.json({
      posts: posts.map((p: any) => ({ ...p, _id: String(p._id) })),
      total,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const post = new BlogPost({
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-"),
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      author: body.author,
      publishedAt: body.publishedAt || new Date(),
      image: body.image,
      status: body.status || "draft",
      seoDescription: body.seoDescription,
      seoKeywords: body.seoKeywords,
    })

    await post.save()

    return NextResponse.json(
      {
        message: "Post created successfully",
        post: { ...post.toObject(), _id: String(post._id) },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error creating blog post:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to create post",
      },
      { status: 400 },
    )
  }
}
