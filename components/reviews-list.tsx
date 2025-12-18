"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Review {
  _id: string
  productId: string
  customerName: string
  rating: number
  title: string
  content: string
  helpful: number
  notHelpful: number
  verified: boolean
  createdAt: string
}

interface ReviewsListProps {
  productId: string
}

export function ReviewsList({ productId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const [page, setPage] = useState(0)
  const itemsPerPage = 5

  useEffect(() => {
    fetchReviews()
  }, [sortBy, page])

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `/api/reviews?productId=${productId}&sortBy=${sortBy}&limit=${itemsPerPage}&skip=${page * itemsPerPage}`
      )

      if (!response.ok) throw new Error("Failed to fetch reviews")

      const data = await response.json()
      setReviews(data.reviews)
      setAverageRating(data.averageRating)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleHelpful = async (reviewId: string, type: "helpful" | "notHelpful") => {
    try {
      await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      })
      fetchReviews()
    } catch (error) {
      console.error("Error marking review:", error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return distribution
  }

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5"
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClass} ${
              star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-300 text-gray-300"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {reviews.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <div className="space-y-6">
            {/* Main Rating */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-600">{averageRating.toFixed(1)}</div>
                <div className="mt-2">{renderStars(averageRating, "md")}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = getRatingDistribution()[rating as keyof ReturnType<typeof getRatingDistribution>]
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex gap-0.5 w-8">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < rating ? "fill-amber-400" : "fill-gray-300"}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Sort Control */}
      {reviews.length > 0 && (
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Customer Reviews</h3>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
              <SelectItem value="rating-high">Highest Rating</SelectItem>
              <SelectItem value="rating-low">Lowest Rating</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mb-3" />
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <svg className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <p className="text-muted-foreground text-lg">No reviews yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Be the first to share your experience!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review._id} className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-amber-400">
              <div className="flex justify-between items-start mb-3 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-foreground">{review.customerName}</p>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                </div>
                {renderStars(review.rating, "sm")}
              </div>

              <h4 className="font-semibold text-foreground mb-2 text-base">{review.title}</h4>
              <p className="text-sm text-foreground/75 mb-4 leading-relaxed">{review.content}</p>

              {/* Helpful Section */}
              <div className="flex items-center gap-4 pt-3 border-t">
                <button
                  onClick={() => handleHelpful(review._id, "helpful")}
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors hover:bg-primary/5 px-3 py-2 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.646 7.23a2 2 0 01-1.789 1.106H9m0 0H7m2 0a2 2 0 100-4m0 4a2 2 0 110-4m0 4V5a2 2 0 012-2h3.28a1 1 0 00.894-.553l1.333-2.667a1 1 0 00-.894-1.447h-6.693a2 2 0 00-2 2v13m9-13h-3" />
                  </svg>
                  <span>Helpful ({review.helpful})</span>
                </button>
                <button
                  onClick={() => handleHelpful(review._id, "notHelpful")}
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-red-500 transition-colors hover:bg-red-50 px-3 py-2 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.646-7.23a2 2 0 011.789-1.106H15m0 0h2m-2 0a2 2 0 110-4m0 4a2 2 0 100-4m0 4v8a2 2 0 01-2 2h-3.28a1 1 0 00-.894.553l-1.333 2.667a1 1 0 00.894 1.447h6.693a2 2 0 002-2V5a2 2 0 00-2-2h-3" />
                  </svg>
                  <span>Not Helpful ({review.notHelpful})</span>
                </button>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          {reviews.length === itemsPerPage && (
            <div className="flex justify-center gap-2 pt-6">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="w-32"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                className="w-32"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
