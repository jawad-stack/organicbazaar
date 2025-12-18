"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  images: any[]
  variants: Array<{ price: number }>
}

export function ProductCard({ id, name, slug, images, variants }: ProductCardProps) {
  const [averageRating, setAverageRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRating()
  }, [id])

  const fetchRating = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${id}&limit=1`)
      if (response.ok) {
        const data = await response.json()
        setAverageRating(data.averageRating || 0)
        setReviewCount(data.total || 0)
      }
    } catch (error) {
      console.error("Error fetching rating:", error)
    } finally {
      setLoading(false)
    }
  }

  const minPrice = Math.min(...variants.map((v) => v.price))
  const maxPrice = Math.max(...variants.map((v) => v.price))
  const imageUrl = images?.[0]?.url || images?.[0] || "/placeholder.svg?height=300&width=300"

console.log("Image URL in ProductCard:", imageUrl);
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${
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
    <Card className="overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 group">
      <CardContent className="p-0 relative">
        <Link href={`/products/${slug}`}>
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-4 pb-4">
        <div className="w-full">
          <h3 className="font-semibold text-base line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Rating Section */}
          {!loading && reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {renderStars(averageRating)}
                <span className="text-xs font-semibold text-foreground">{averageRating.toFixed(1)}</span>
              </div>
              <Link
                href={`/products/${slug}#reviews`}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </Link>
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-2">
            {minPrice === maxPrice ? `Rs.${minPrice.toFixed(2)}` : `Rs.${minPrice.toFixed(2)} - Rs.${maxPrice.toFixed(2)}`}
          </p>
        </div>
        <Button asChild className="w-full transition-all duration-200 group-hover:shadow-md" variant="default">
          <Link href={`/products/${slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
