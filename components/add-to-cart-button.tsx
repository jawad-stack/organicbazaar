"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddToCartButtonProps {
  productId: string
  productName: string
  variant: {
    _id: string
    name: string
    price: number
    stock: number
    sku: string
  }
}

export function AddToCartButton({ productId, productName, variant }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCart((state) => state.addItem)
  const isAdded = added // Declare isAdded variable

  const handleAddToCart = () => {
    if (quantity > 0 && variant.stock > 0) {
      addItem({
        productId,
        productName,
        variantId: variant._id,
        variantName: variant.name,
        price: variant.price,
        quantity,
        sku: variant.sku,
      })

      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Quantity:</label>
        <Input
          type="number"
          min="1"
          max={variant.stock}
          value={quantity}
          onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
          className="w-20"
        />
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={variant.stock === 0 || isAdded}
        className="w-full"
        size="lg"
        variant={added ? "secondary" : "default"}
      >
        {added ? "Added to Cart!" : variant.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  )
}
