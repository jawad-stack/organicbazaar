import mongoose from "mongoose"
import { Product } from "@/lib/db/models/product"
import { Collection } from "@/lib/db/models/collection"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("[v0] Connected to MongoDB")

    // Clear existing data
    await Product.deleteMany({})
    await Collection.deleteMany({})
    console.log("[v0] Cleared existing data")

    // Create collections
    const collectionsData = [
      {
        name: "Best Sellers",
        slug: "best-sellers",
        description: "Our most loved and trusted products",
        image: "/placeholder.svg?height=300&width=400",
        seoDescription: "Shop our best-selling organic products loved by thousands",
        seoKeywords: ["best sellers", "organic products", "top rated"],
      },
      {
        name: "Organic Essentials",
        slug: "organic-essentials",
        description: "Daily essentials for a healthy lifestyle",
        image: "/placeholder.svg?height=300&width=400",
        seoDescription: "Essential organic products for your daily wellness routine",
        seoKeywords: ["organic essentials", "daily products", "wellness"],
      },
      {
        name: "Seasonal Picks",
        slug: "seasonal-picks",
        description: "Fresh and seasonal organic offerings",
        image: "/placeholder.svg?height=300&width=400",
        seoDescription: "Discover our seasonal selection of fresh organic products",
        seoKeywords: ["seasonal products", "fresh organic", "limited edition"],
      },
    ]

    const collections = await Collection.insertMany(collectionsData)
    console.log(
      "[v0] Created collections:",
      collections.map((c) => c.name),
    )

    // Create products with variants
    const productsData = [
      {
        name: "Premium Organic Coffee Beans",
        slug: "premium-organic-coffee-beans",
        description:
          "Hand-roasted, 100% organic arabica coffee beans from sustainable farms. Perfect for espresso or pour-over brewing.",
        images: ["/placeholder.svg?height=600&width=600"],
        variants: [
          {
            name: "250g Bag",
            attributes: { size: "250g" },
            sku: "COFFEE-250",
            price: 14.99,
            stock: 50,
          },
          {
            name: "500g Bag",
            attributes: { size: "500g" },
            sku: "COFFEE-500",
            price: 27.99,
            stock: 30,
          },
          {
            name: "1kg Bag",
            attributes: { size: "1kg" },
            sku: "COFFEE-1000",
            price: 49.99,
            stock: 20,
          },
        ],
        collections: [collections[0]._id, collections[1]._id],
        status: "active",
        seoTitle: "Premium Organic Coffee Beans - Fair Trade Arabica",
        seoDescription: "Hand-roasted 100% organic arabica coffee from sustainable farms. Buy premium coffee online.",
        seoKeywords: ["organic coffee", "arabica beans", "fair trade coffee", "premium coffee"],
      },
      {
        name: "Raw Organic Honey",
        slug: "raw-organic-honey",
        description:
          "Pure raw honey from organic apiaries. Unheated and unfiltered to preserve all natural enzymes and nutrients.",
        images: ["/placeholder.svg?height=600&width=600"],
        variants: [
          {
            name: "250ml Jar",
            attributes: { size: "250ml" },
            sku: "HONEY-250",
            price: 8.99,
            stock: 60,
          },
          {
            name: "500ml Jar",
            attributes: { size: "500ml" },
            sku: "HONEY-500",
            price: 15.99,
            stock: 40,
          },
          {
            name: "1L Jar",
            attributes: { size: "1L" },
            sku: "HONEY-1000",
            price: 28.99,
            stock: 25,
          },
        ],
        collections: [collections[0]._id, collections[2]._id],
        status: "active",
        seoTitle: "Raw Organic Honey - Pure & Unfiltered",
        seoDescription: "Premium raw organic honey. Unheated, unfiltered, and unpasteurized to preserve nutrients.",
        seoKeywords: ["raw honey", "organic honey", "pure honey", "natural sweetener"],
      },
      {
        name: "Organic Green Tea Blend",
        slug: "organic-green-tea-blend",
        description: "A refreshing blend of organic green tea with jasmine flowers. Perfect for daily wellness.",
        images: ["/placeholder.svg?height=600&width=600"],
        variants: [
          {
            name: "50g Loose Leaf",
            attributes: { type: "loose-leaf", size: "50g" },
            sku: "TEA-GREEN-50",
            price: 9.99,
            stock: 40,
          },
          {
            name: "100g Loose Leaf",
            attributes: { type: "loose-leaf", size: "100g" },
            sku: "TEA-GREEN-100",
            price: 17.99,
            stock: 35,
          },
          {
            name: "Tea Bags (20 Pack)",
            attributes: { type: "tea-bags", size: "20-pack" },
            sku: "TEA-GREEN-BAGS",
            price: 12.99,
            stock: 50,
          },
        ],
        collections: [collections[1]._id],
        status: "active",
        seoTitle: "Organic Green Tea with Jasmine - Premium Blend",
        seoDescription: "Organic green tea blended with jasmine flowers. Premium loose leaf and tea bags available.",
        seoKeywords: ["green tea", "organic tea", "jasmine tea", "loose leaf tea"],
      },
      {
        name: "Organic Almond Butter",
        slug: "organic-almond-butter",
        description:
          "Creamy organic almond butter made from raw almonds. No additives, no salt, just pure almond goodness.",
        images: ["/placeholder.svg?height=600&width=600"],
        variants: [
          {
            name: "250g Jar",
            attributes: { size: "250g" },
            sku: "ALMOND-250",
            price: 7.99,
            stock: 45,
          },
          {
            name: "500g Jar",
            attributes: { size: "500g" },
            sku: "ALMOND-500",
            price: 13.99,
            stock: 30,
          },
          {
            name: "1kg Jar",
            attributes: { size: "1kg" },
            sku: "ALMOND-1000",
            price: 24.99,
            stock: 15,
          },
        ],
        collections: [collections[0]._id, collections[1]._id],
        status: "active",
        seoTitle: "Organic Almond Butter - Pure & Natural",
        seoDescription: "100% organic almond butter with no additives. Rich in protein and healthy fats.",
        seoKeywords: ["almond butter", "organic nut butter", "natural protein", "healthy snack"],
      },
      {
        name: "Organic Quinoa Seeds",
        slug: "organic-quinoa-seeds",
        description:
          "Premium organic quinoa seeds from South American farms. Complete protein with all essential amino acids.",
        images: ["/placeholder.svg?height=600&width=600"],
        variants: [
          {
            name: "500g Bag",
            attributes: { size: "500g" },
            sku: "QUINOA-500",
            price: 11.99,
            stock: 35,
          },
          {
            name: "1kg Bag",
            attributes: { size: "1kg" },
            sku: "QUINOA-1000",
            price: 21.99,
            stock: 25,
          },
          {
            name: "2kg Bulk",
            attributes: { size: "2kg" },
            sku: "QUINOA-2000",
            price: 39.99,
            stock: 15,
          },
        ],
        collections: [collections[1]._id, collections[2]._id],
        status: "active",
        seoTitle: "Organic Quinoa Seeds - Complete Protein",
        seoDescription: "Premium organic quinoa from sustainable farms. Complete protein with all amino acids.",
        seoKeywords: ["quinoa seeds", "organic grains", "complete protein", "superfood"],
      },
      {
        name: "Organic Cold-Pressed Coconut Oil",
        slug: "organic-cold-pressed-coconut-oil",
        description:
          "Virgin cold-pressed coconut oil from organic coconuts. Perfect for cooking and skincare routines.",
        images: ["/placeholder.svg?height=600&width=600"],
        variants: [
          {
            name: "250ml Jar",
            attributes: { size: "250ml" },
            sku: "COCONUT-250",
            price: 12.99,
            stock: 40,
          },
          {
            name: "500ml Jar",
            attributes: { size: "500ml" },
            sku: "COCONUT-500",
            price: 22.99,
            stock: 30,
          },
          {
            name: "1L Jar",
            attributes: { size: "1L" },
            sku: "COCONUT-1000",
            price: 39.99,
            stock: 20,
          },
        ],
        collections: [collections[0]._id, collections[1]._id],
        status: "active",
        seoTitle: "Organic Cold-Pressed Coconut Oil - Virgin Quality",
        seoDescription:
          "Cold-pressed virgin coconut oil from certified organic sources. Great for cooking and skincare.",
        seoKeywords: ["coconut oil", "virgin coconut oil", "organic oil", "cooking oil"],
      },
    ]

    const products = await Product.insertMany(productsData)
    console.log(
      "[v0] Created products:",
      products.map((p) => p.name),
    )

    console.log("[v0] Database seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("[v0] Seeding error:", error)
    process.exit(1)
  }
}

seedDatabase()
