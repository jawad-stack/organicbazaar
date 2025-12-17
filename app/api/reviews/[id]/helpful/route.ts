import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connection"
import { Review } from "@/lib/db/models/review"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { type } = body

    if (!type || !["helpful", "notHelpful"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    await connectDB()

    const review = await Review.findById(params.id)
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (type === "helpful") {
      review.helpful += 1
    } else {
      review.notHelpful += 1
    }

    await review.save()

    return NextResponse.json({
      helpful: review.helpful,
      notHelpful: review.notHelpful,
    })
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}
