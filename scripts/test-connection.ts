import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.log("[v0] ❌ ERROR: MONGODB_URI environment variable is not set")
  console.log("[v0] Please make sure you've added it to your Vars in v0 settings")
  process.exit(1)
}

async function testConnection() {
  try {
    console.log("[v0] Starting MongoDB connection test...")
    console.log("[v0] Connection URI (masked):", MONGODB_URI.substring(0, 20) + "...")

    await mongoose.connect(MONGODB_URI)
    console.log("[v0] ✅ Successfully connected to MongoDB!")

    // Check database stats
    const db = mongoose.connection.getClient().db()
    const stats = await db.stats()
    console.log("[v0] Database stats:", {
      collections: stats.collections,
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
      indexes: stats.indexes,
    })

    await mongoose.disconnect()
    console.log("[v0] ✅ Connection test passed! Database is ready.")
    process.exit(0)
  } catch (error) {
    if (error instanceof Error) {
      console.log("[v0] ❌ Connection failed!")
      console.log("[v0] Error:", error.message)

      if (error.message.includes("ENOTFOUND")) {
        console.log("[v0] → Issue: Cannot reach MongoDB server")
        console.log("[v0] → Check: Is your MongoDB URI correct?")
      } else if (error.message.includes("authentication failed")) {
        console.log("[v0] → Issue: Authentication failed")
        console.log("[v0] → Check: Username and password are correct?")
      } else if (error.message.includes("PERMISSION_DENIED")) {
        console.log("[v0] → Issue: Permission denied")
        console.log("[v0] → Check: IP whitelist in MongoDB Atlas")
      }
    }
    process.exit(1)
  }
}

testConnection()
