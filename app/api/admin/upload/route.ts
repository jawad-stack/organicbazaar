import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connection"
import { Product } from "@/lib/db/models/product"
import fs from "fs"
import path from "path"

const ADMIN_USER = process.env.ADMIN_USER || "admin"
const ADMIN_PASS = process.env.ADMIN_PASS || "password123"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, productSlug, filename, data } = body

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!productSlug || !filename || !data) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // validate base64 data
    const matches = data.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.*)$/)
    if (!matches) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 })
    }

    const ext = matches[1].split('/')[1]
    const base64Data = matches[3]

    const buffer = Buffer.from(base64Data, 'base64')

    // ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const safeFilename = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const filePath = path.join(uploadsDir, safeFilename)

    fs.writeFileSync(filePath, buffer)

    // update product images array by slug
    await connectDB()
    const product = await Product.findOne({ slug: productSlug })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const publicPath = `/uploads/${safeFilename}`
    product.images = product.images || []
    product.images.push(publicPath)
    await product.save()

    return NextResponse.json({ message: "Uploaded", url: publicPath }, { status: 201 })
  } catch (error) {
    console.error('Upload error', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
