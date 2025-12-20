"use client"

import Image from "next/image"
import { useState } from "react"

export function ProductGallery({ images = [], productName }: any) {
  const normalizedImages = images
    .map((img: any) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean)

  const [imageUrl, setImageUrl] = useState(normalizedImages[0])

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={productName}
          fill
          className="object-cover"
          priority
        />
      </div>

      {normalizedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {normalizedImages.slice(0, 5).map((src: string, i: number) => (
            <div
              key={i}
              className="relative w-16 h-16 cursor-pointer rounded"
              onClick={() => setImageUrl(src)}
            >
              <Image
                src={src}
                alt={`${productName} view ${i + 1}`}
                fill
                className="object-cover rounded pointer-events-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
