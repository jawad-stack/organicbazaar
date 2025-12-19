"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2, Zap } from "lucide-react"
import Link from "next/link"

const CATEGORIES = ["Wellness", "Beauty", "Food", "Lifestyle", "Supplements"]

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    categories: [] as string[],
    status: "active",
    variants: [{ name: "", price: 0, stock: 0 }],
  })

  const handleAIGenerate = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a product name first")
      return
    }

    setAiLoading(true)
    setAiError("")

    try {
      const response = await fetch("/api/ai/generate-product-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productTitle: formData.name,
          productCategory: formData.categories[0] || "",
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setFormData((prev) => ({
          ...prev,
          description: data.description || prev.description,
        }))
        if (data.keywords && data.keywords.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categories: data.keywords.slice(0, 3),
          }))
        }
        alert("Content generated successfully!")
      } else {
        setAiError(data.error || "Failed to generate content")
        alert(`AI Generation Error: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Error generating content:", error)
      setAiError("Network error. Please try again.")
      alert("Network error. Please check your connection and try again.")
    } finally {
      setAiLoading(false)
    }
  }

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", price: 0, stock: 0 }],
    }))
  }

  const handleRemoveVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/products")
      } else {
        alert("Failed to create product")
      }
    } catch (error) {
      console.error("[v0] Error creating product:", error)
      alert("Error creating product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Create New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border/50 rounded-lg p-6">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Product name"
            required
            className="bg-background"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated-slug"
            className="bg-background"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleAIGenerate}
            disabled={aiLoading}
            className="bg-transparent"
          >
            <Zap className="w-4 h-4 mr-2" />
            {aiLoading ? "Generating..." : "AI Generate"}
          </Button>
          {aiError && <p className="text-sm text-destructive">{aiError}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Product description"
            required
            rows={6}
            className="bg-background"
          />
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    categories: prev.categories.includes(cat)
                      ? prev.categories.filter((c) => c !== cat)
                      : [...prev.categories, cat],
                  }))
                }}
                className={`px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium ${
                  formData.categories.includes(cat)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/50 bg-background text-foreground hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4 border-t border-border/50 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Variants</h3>
            <Button type="button" size="sm" variant="outline" onClick={handleAddVariant} className="bg-transparent">
              <Plus className="w-4 h-4 mr-1" />
              Add Variant
            </Button>
          </div>

          {formData.variants.map((variant, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
              <Input
                value={variant.name}
                onChange={(e) => {
                  const newVariants = [...formData.variants]
                  newVariants[idx].name = e.target.value
                  setFormData({ ...formData, variants: newVariants })
                }}
                placeholder="Variant name"
                className="bg-background text-sm"
              />
              <Input
                type="number"
                value={variant.price}
                onChange={(e) => {
                  const newVariants = [...formData.variants]
                  newVariants[idx].price = Number(e.target.value)
                  setFormData({ ...formData, variants: newVariants })
                }}
                placeholder="Price"
                className="bg-background text-sm"
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => {
                    const newVariants = [...formData.variants]
                    newVariants[idx].stock = Number(e.target.value)
                    setFormData({ ...formData, variants: newVariants })
                  }}
                  placeholder="Stock"
                  className="bg-background text-sm flex-1"
                />
                {formData.variants.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveVariant(idx)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="space-y-2 border-t border-border/50 pt-4">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border/50 bg-background text-foreground"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button disabled={loading} className="bg-gradient-to-r from-primary to-primary/90">
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
