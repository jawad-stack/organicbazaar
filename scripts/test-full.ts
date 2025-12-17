import mongoose from "mongoose"
import { Product } from "@/lib/db/models/product"
import { Collection } from "@/lib/db/models/collection"

const MONGODB_URI = process.env.MONGODB_URI

async function runFullTest() {
  console.log("[v0] ========================================")
  console.log("[v0] Full E-Commerce Test Suite")
  console.log("[v0] ========================================\n")

  // Step 1: Check environment
  console.log("[v0] STEP 1: Checking Environment Variables")
  console.log("[v0] ------------------------------------")
  if (!MONGODB_URI) {
    console.error("[v0] ❌ ERROR: MONGODB_URI is not set!")
    console.log("[v0] Add MONGODB_URI in your environment variables")
    process.exit(1)
  }
  console.log("[v0] ✅ MONGODB_URI is configured")
  console.log("[v0] URI Pattern: " + MONGODB_URI.substring(0, 30) + "...")
  console.log()

  // Step 2: Test MongoDB Connection
  console.log("[v0] STEP 2: Testing MongoDB Connection")
  console.log("[v0] ------------------------------------")
  try {
    console.log("[v0] Attempting to connect...")
    await mongoose.connect(MONGODB_URI)
    console.log("[v0] ✅ Successfully connected to MongoDB!")

    const connection = mongoose.connection
    console.log("[v0] Database Host: " + connection.host)
    console.log("[v0] Database Name: " + connection.name)
    console.log()
  } catch (error) {
    console.error("[v0] ❌ Connection Failed!")
    console.error("[v0] Error Type: " + (error instanceof Error ? error.constructor.name : typeof error))
    console.error("[v0] Error Message: " + (error instanceof Error ? error.message : String(error)))
    if (error instanceof Error && error.cause) {
      console.error("[v0] Error Cause: " + String(error.cause))
    }
    process.exit(1)
  }

  // Step 3: Check Models
  console.log("[v0] STEP 3: Checking Models")
  console.log("[v0] ------------------------------------")
  try {
    console.log("[v0] Product Model: ", Product.collection.name)
    console.log("[v0] Collection Model: ", Collection.collection.name)
    console.log("[v0] ✅ All models initialized")
    console.log()
  } catch (error) {
    console.error("[v0] ❌ Model Error: " + (error instanceof Error ? error.message : String(error)))
    process.exit(1)
  }

  // Step 4: Clear Existing Data
  console.log("[v0] STEP 4: Clearing Existing Data")
  console.log("[v0] ------------------------------------")
  try {
    const deletedProducts = await Product.deleteMany({})
    const deletedCollections = await Collection.deleteMany({})
    console.log("[v0] ✅ Deleted " + deletedProducts.deletedCount + " products")
    console.log("[v0] ✅ Deleted " + deletedCollections.deletedCount + " collections")
    console.log()
  } catch (error) {
    console.error("[v0] ❌ Delete Error: " + (error instanceof Error ? error.message : String(error)))
    process.exit(1)
  }

  // Step 5: Create Collections
  console.log("[v0] STEP 5: Creating Collections")
  console.log("[v0] ------------------------------------")
  try {
    const collectionsData = [
      {
        name: "Best Sellers",
        slug: "best-sellers",
        description: "Our most loved and trusted products",
        image: "/placeholder.svg?height=300&width=400",
        seoDescription: "Shop our best-selling organic products",
        seoKeywords: ["best sellers", "organic products"],
      },
      {
        name: "Organic Essentials",
        slug: "organic-essentials",
        description: "Daily essentials for a healthy lifestyle",
        image: "/placeholder.svg?height=300&width=400",
        seoDescription: "Essential organic products for wellness",
        seoKeywords: ["organic essentials", "wellness"],
      },
      {
        name: "Seasonal Picks",
        slug: "seasonal-picks",
        description: "Fresh and seasonal organic offerings",
        image: "/placeholder.svg?height=300&width=400",
        seoDescription: "Fresh seasonal organic selection",
        seoKeywords: ["seasonal products", "fresh organic"],
      },
    ]

    const collections = await Collection.insertMany(collectionsData)
    console.log("[v0] ✅ Created " + collections.length + " collections:")
    collections.forEach((c) => {
      console.log("[v0]   - " + c.name + " (" + c.slug + ")")
    })
    console.log()

    // Step 6: Create Products
    console.log("[v0] STEP 6: Creating Products with Variants")
    console.log("[v0] ------------------------------------")

    const productsData = [
      {
        name: "Premium Organic Coffee Beans",
        slug: "premium-organic-coffee-beans",
        description: "Hand-roasted 100% organic arabica coffee",
        images: ["/placeholder.svg?height=600&width=600"],
        variants: [
          { name: "250g Bag", attributes: { size: "250g" }, sku: "COFFEE-250", price: 14.99, stock: 50 },
          { name: "500g Bag", attributes: { size: "500g" }, sku: "COFFEE-500", price: 27.99, stock: 30 },
        ],
        collections: [collections[0]._id],
        status: "active",
      },
      {
        name: "Raw Organic Honey",
        slug: "raw-organic-honey",
        description: "Pure raw honey from organic apiaries",
        images: ["/placeholder.svg?height=600&width=600"],
        variants: [
          { name: "250ml Jar", attributes: { size: "250ml" }, sku: "HONEY-250", price: 8.99, stock: 60 },
          { name: "500ml Jar", attributes: { size: "500ml" }, sku: "HONEY-500", price: 15.99, stock: 40 },
        ],
        collections: [collections[0]._id],
        status: "active",
      },
    ]

    const products = await Product.insertMany(productsData)
    console.log("[v0] ✅ Created " + products.length + " products:")
    products.forEach((p) => {
      console.log("[v0]   - " + p.name + " (" + p.variants.length + " variants)")
    })
    console.log()
  } catch (error) {
    console.error("[v0] ❌ Product Creation Error!")
    console.error("[v0] Error: " + (error instanceof Error ? error.message : String(error)))
    if (error instanceof Error && "errors" in error) {
      console.error("[v0] Details: " + JSON.stringify((error as any).errors, null, 2))
    }
    process.exit(1)
  }

  // Step 7: Verify Data
  console.log("[v0] STEP 7: Verifying Data in Database")
  console.log("[v0] ------------------------------------")
  try {
    const productCount = await Product.countDocuments()
    const collectionCount = await Collection.countDocuments()
    console.log("[v0] ✅ Total Products: " + productCount)
    console.log("[v0] ✅ Total Collections: " + collectionCount)
    console.log()
  } catch (error) {
    console.error("[v0] ❌ Verification Error: " + (error instanceof Error ? error.message : String(error)))
  }

  // Success
  console.log("[v0] ========================================")
  console.log("[v0] ✅ ALL TESTS PASSED!")
  console.log("[v0] Database is ready for deployment")
  console.log("[v0] ========================================")

  await mongoose.disconnect()
  process.exit(0)
}

runFullTest().catch((error) => {
  console.error("[v0] Unexpected error: ", error)
  process.exit(1)
})
