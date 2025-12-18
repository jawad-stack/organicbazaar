"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

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

  // CHANGE: Handle image carousel with fallback
  const imageList = images?.filter((img) => img?.url || typeof img === "string") || []
  const hasMultipleImages = imageList.length > 1

  const currentImage =
    imageList[currentImageIndex]?.url || imageList[currentImageIndex] || "/placeholder.svg?height=300&width=300"

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1))
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 ${
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
      <CardContent
        className="p-0 relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Link href={`/products/${slug}`}>
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={currentImage || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

            {/* CHANGE: Image carousel controls - show on hover or multi-image products */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>

                {/* Image indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {imageList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentImageIndex(idx)
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-3 pb-3">
        <div className="w-full">
          <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Rating Section */}
          {!loading && reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-0.5">{renderStars(averageRating)}</div>
              <span className="text-xs font-semibold text-foreground">{averageRating.toFixed(1)}</span>
              <Link
                href={`/products/${slug}#reviews`}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                ({reviewCount})
              </Link>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-2">
            {minPrice === maxPrice
              ? `Rs.${minPrice.toFixed(2)}`
              : `Rs.${minPrice.toFixed(2)} - Rs.${maxPrice.toFixed(2)}`}
          </p>
        </div>
        <Button
          asChild
          className="w-full transition-all duration-200 group-hover:shadow-md"
          variant="default"
          size="sm"
        >
          <Link href={`/products/${slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
