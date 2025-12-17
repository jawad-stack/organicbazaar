import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

async function verifySetup() {
  console.log("[v0] ========================================")
  console.log("[v0] E-Commerce App Verification")
  console.log("[v0] ========================================")

  // Check environment variable
  if (!MONGODB_URI) {
    console.error("[v0] ❌ MONGODB_URI is not set!")
    console.log("[v0] Please add MONGODB_URI to your environment variables")
    process.exit(1)
  }

  console.log("[v0] ✅ MONGODB_URI is configured")

  // Test connection
  try {
    console.log("[v0] Attempting to connect to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("[v0] ✅ Successfully connected to MongoDB!")

    // Get database stats
    const adminDb = mongoose.connection.db?.admin()
    if (adminDb) {
      const stats = await adminDb.stats()
      console.log(`[v0] Database: ${stats.db}`)
      console.log(`[v0] Collections: ${Object.keys(stats.collections || {}).length}`)
    }

    console.log("[v0] ========================================")
    console.log("[v0] ✅ Setup verification completed successfully!")
    console.log("[v0] Next step: Run 'npx tsx scripts/seed-db.ts' to populate database")
    console.log("[v0] ========================================")
  } catch (error) {
    console.error("[v0] ❌ MongoDB connection failed!")
    console.error("[v0] Error:", error instanceof Error ? error.message : String(error))
    console.log("[v0] ❌ Please check your MONGODB_URI and try again")
    process.exit(1)
  }

  process.exit(0)
}

verifySetup()
