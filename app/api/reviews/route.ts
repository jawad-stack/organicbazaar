import { NextResponse } from "next/server";
import mongoose from "mongoose"; // Import mongoose
import { connectDB } from "@/lib/db/connection";
import { Review } from "@/lib/db/models/review";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, customerName, customerEmail, rating, title, content } =
      body;

    // Validate required fields
    if (
      !productId ||
      !customerName ||
      !customerEmail ||
      !rating ||
      !title ||
      !content
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating is 1-5
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate content lengths
    if (title.length < 5 || title.length > 200) {
      return NextResponse.json(
        { error: "Title must be between 5 and 200 characters" },
        { status: 400 }
      );
    }

    if (content.length < 10 || content.length > 2000) {
      return NextResponse.json(
        { error: "Review must be between 10 and 2000 characters" },
        { status: 400 }
      );
    }

    await connectDB();
    debugger;
    const review = new Review({
      productId,
      customerName,
      customerEmail,
      rating,
      title,
      content,
      verified: false,
    });

    await review.save();

    return NextResponse.json(
      {
        _id: new mongoose.Schema.Types.ObjectId(review._id),
        productId: new mongoose.Schema.Types.ObjectId(review.productId),
        customerName: review.customerName,
        customerEmail: review.customerEmail,
        rating: review.rating,
        title: review.title,
        content: review.content,
        helpful: review.helpful,
        notHelpful: review.notHelpful,
        verified: review.verified,
        createdAt: review.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const sortBy = searchParams.get("sortBy") || "newest";
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    let sortOptions: Record<string, number> = {};
    switch (sortBy) {
      case "helpful":
        sortOptions = { helpful: -1, createdAt: -1 };
        break;
      case "rating-high":
        sortOptions = { rating: -1, createdAt: -1 };
        break;
      case "rating-low":
        sortOptions = { rating: 1, createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "newest":
      default:
        sortOptions = { createdAt: -1 };
    }
    const reviews = await Review.find({
      productId: new mongoose.Types.ObjectId(productId), // Use mongoose.Types.ObjectId
    })
      .sort(sortOptions)
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Review.countDocuments({ productId });

    const serializedReviews = reviews.map((review: any) => ({
      _id: String(review._id),
      productId: review.productId,
      customerName: review.customerName,
      rating: review.rating,
      title: review.title,
      content: review.content,
      helpful: review.helpful,
      notHelpful: review.notHelpful,
      verified: review.verified,
      createdAt: review.createdAt,
    }));

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
            reviews.length
          ).toFixed(1)
        : 0;

    return NextResponse.json({
      reviews: serializedReviews,
      total,
      averageRating: parseFloat(avgRating as string),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
