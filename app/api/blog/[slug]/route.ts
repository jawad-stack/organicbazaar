import { connectDB } from "@/lib/db/connection"
import { BlogPost } from "@/lib/db/models/blog"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB()

    const post = await BlogPost.findOneAndUpdate(
      { slug: params.slug, status: "published" },
      { $inc: { views: 1 } },
      {
        new: true,
      },
    )

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Get related posts
    const relatedPosts = await BlogPost.find(
      {
        category: post.category,
        _id: { $ne: post._id },
        status: "published",
      },
      "-content",
    )
      .limit(3)
      .lean()

    return NextResponse.json({
      post: { ...post.toObject(), _id: String(post._id) },
      relatedPosts: relatedPosts.map((p: any) => ({ ...p, _id: String(p._id) })),
    })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}
