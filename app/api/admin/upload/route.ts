import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db/connection"
import { Product } from "@/lib/db/models/product"
import { v2 as cloudinary } from 'cloudinary'

const ADMIN_USER = process.env.ADMIN_USER || "admin"
const ADMIN_PASS = process.env.ADMIN_PASS || "password123"

// Configure Cloudinary (add to your .env.local file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

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

    // Validate base64 data format
    const matches = data.match(/^data:(image\/(png|jpeg|jpg|webp|gif|svg\+xml));base64,(.*)$/)
    if (!matches) {
      return NextResponse.json({ error: "Invalid image data format" }, { status: 400 })
    }

    const mimeType = matches[1]
    const base64Data = matches[3]
    
    // Create a buffer from base64
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Convert buffer to data URI for Cloudinary upload
    const dataUri = `data:${mimeType};base64,${base64Data}`

    // Upload to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products", // Optional: Organize in Cloudinary folder
          public_id: `${productSlug}_${Date.now()}`, // Optional: Custom public ID
          overwrite: false,
          resource_type: "auto",
          transformation: [
            { width: 800, height: 800, crop: "limit" }, // Auto-resize
            { quality: "auto" } // Auto-optimize
          ]
        },
        (error: any, result: any) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      
      // Write buffer to the upload stream
      uploadStream.end(buffer)
    })

    // Update product in database
    await connectDB()
    const product = await Product.findOne({ slug: productSlug })
    if (!product) {
      // Optional: Clean up the Cloudinary upload if product not found
      await cloudinary.uploader.destroy(uploadResult.public_id)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Add the Cloudinary URL to product images
    product.images = product.images || []
    product.images.push({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id, // Store for potential deletion
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format
    })
    
    await product.save()

    return NextResponse.json(
      { 
        message: "Uploaded to Cloudinary", 
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height
      }, 
      { status: 201 }
    )
  } catch (error:any) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed',
      details: error.message 
    }, { status: 500 })
  }
}

// Optional: Add a DELETE endpoint for removing images
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { username, password, productSlug, public_id } = body

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!public_id) {
      return NextResponse.json({ error: "Missing public_id" }, { status: 400 })
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id)
    
    if (result.result === 'ok') {
      // Remove from database if productSlug provided
      if (productSlug) {
        await connectDB()
        await Product.updateOne(
          { slug: productSlug },
          { $pull: { images: { public_id: public_id } } }
        )
      }
      
      return NextResponse.json({ message: "Image deleted successfully" })
    } else {
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}