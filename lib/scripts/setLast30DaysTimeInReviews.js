import mongoose from "mongoose";

async function randomizeCreatedAt() {
  try {
    await mongoose.connect(
      "mongodb+srv://organicbazaar:ymYABNi3qTOKLQBC@cluster0.80ftwds.mongodb.net/?appName=Cluster0"
    );
    console.log("MongoDB connected");

    const db = mongoose.connection.db;
    const reviewsCollection = db.collection("reviews"); // use your actual collection name

    const reviews = await reviewsCollection.find({}).toArray();
    console.log(`Found ${reviews.length} reviews`);

    const bulkOps = reviews.map((review) => {
      const randomDate = new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      );
      return {
        updateOne: {
          filter: { _id: review._id },
          update: { $set: { createdAt: randomDate, updatedAt: new Date() } },
        },
      };
    });

    if (bulkOps.length > 0) {
      const result = await reviewsCollection.bulkWrite(bulkOps);
      console.log(`Updated ${result.modifiedCount} reviews with random createdAt`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error updating reviews:", error);
    process.exit(1);
  }
}

randomizeCreatedAt();
