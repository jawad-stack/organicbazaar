"use client"

import { useState } from "react"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readOnly?: boolean
  size?: "sm" | "md" | "lg"
  showValue?: boolean
}

export function StarRating({ value, onChange, readOnly = false, size = "md", showValue = false }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0)

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const displayValue = hoverValue || value

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            disabled={readOnly}
            className={`transition-colors ${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
          >
            <svg
              className={`${sizeClasses[size]} ${
                star <= displayValue ? "fill-amber-400 text-amber-400" : "fill-gray-300 text-gray-300"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </button>
        ))}
      </div>
      {showValue && <span className="text-sm font-medium text-foreground">{displayValue.toFixed(1)}</span>}
    </div>
  )
}
