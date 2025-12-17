"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Variant {
  _id: string
  name: string
  attributes: Record<string, string>
  price: number
  stock: number
  sku: string
  image?: string
}

interface VariantSelectorProps {
  variants: Variant[]
  onVariantSelect?: (variant: Variant) => void
}

export function VariantSelector({ variants, onVariantSelect }: VariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?._id || "")

  const selectedVariant = variants.find((v) => v._id === selectedVariantId)

  const attributeKeys = selectedVariant ? Object.keys(selectedVariant.attributes).filter((key) => key !== "_id") : []

  return (
    <div className="space-y-6">
      {attributeKeys.map((key) => (
        <div key={key}>
          <h3 className="font-semibold text-sm mb-4 capitalize text-foreground">{key}</h3>
          <div className="flex gap-3 flex-wrap">
            {Array.from(new Set(variants.map((v) => v.attributes[key]))).map((value) => {
              const variantWithValue = variants.find((v) => v.attributes[key] === value)
              const isSelected = selectedVariant?.attributes[key] === value

              return (
                <Button
                  key={`${key}-${value}`}
                  variant={isSelected ? "default" : "outline"}
                    onClick={() => {
                    if (variantWithValue) {
                      setSelectedVariantId(variantWithValue._id)
                      onVariantSelect?.(variantWithValue)
                    }
                  }}
                  className="capitalize transition-all duration-200 hover:border-primary"
                >
                  {value}
                </Button>
              )
            })}
          </div>
        </div>
      ))}

      {selectedVariant && (
        <div className="pt-4 border-t space-y-3 animate-fade-in">
          <p className="text-sm text-muted-foreground">SKU: {selectedVariant.sku}</p>
          <p className="text-2xl font-bold text-primary">${selectedVariant.price.toFixed(2)}</p>
          <p
            className={`text-sm font-medium ${selectedVariant.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : "Out of stock"}
          </p>
        </div>
      )}
    </div>
  )
}
