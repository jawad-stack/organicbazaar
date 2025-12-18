import { connectDB } from "@/lib/db/connection"
import { BlogPost } from "@/lib/db/models/blog"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const post = await BlogPost.findById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({
      post: { ...post.toObject(), _id: String(post._id) },
    })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const body = await request.json()

    const post = await BlogPost.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category,
        author: body.author,
        image: body.image,
        status: body.status,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords,
        publishedAt: body.publishedAt,
      },
      { new: true },
    )

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Post updated successfully",
      post: { ...post.toObject(), _id: String(post._id) },
    })
  } catch (error: any) {
    console.error("Error updating blog post:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to update post",
      },
      { status: 400 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const post = await BlogPost.findByIdAndDelete(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
