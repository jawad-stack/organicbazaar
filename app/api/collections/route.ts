import { connectDB } from "@/lib/db/connection"
import { Collection } from "@/lib/db/models/collection"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    const collections = await Collection.find().lean()
    return NextResponse.json(collections)
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
  }
}
