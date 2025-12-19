"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Trash2, Zap } from "lucide-react"
import Link from "next/link"

const CATEGORIES = ["Wellness", "Beauty", "Food", "Lifestyle", "Supplements"]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    categories: [] as string[],
    status: "active",
    variants: [{ name: "", price: 0, stock: 0 }],
  })

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${id}`)
      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Failed to load product")
        return
      }

      const data = await response.json()
      if (data.product) {
        setFormData({
          name: data.product.name || "",
          slug: data.product.slug || "",
          description: data.product.description || "",
          categories: data.product.categories || [],
          status: data.product.status || "active",
          variants:
            data.product.variants && data.product.variants.length > 0
              ? data.product.variants
              : [{ name: "", price: 0, stock: 0 }],
        })
      }
    } catch (error) {
      console.error("[v0] Error fetching product:", error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAIGenerate = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a product name first")
      return
    }

    setAiLoading(true)
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
        alert("Content generated successfully!")
      } else {
        alert(`AI Error: ${data.error || "Failed to generate"}`)
      }
    } catch (error) {
      console.error("[v0] Error generating content:", error)
      alert("Network error. Please try again.")
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Product updated successfully!")
        router.push("/admin/products")
      } else {
        alert(`Failed to update: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Error saving product:", error)
      alert("Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: "", price: 0, stock: 0 }],
    })
  }

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData({
        ...formData,
        variants: formData.variants.filter((_, i) => i !== index),
      })
    }
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setFormData({ ...formData, variants: newVariants })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-destructive text-lg">{error}</p>
        <Button asChild variant="outline">
          <Link href="/admin/products">Back to Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border/50 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg text-foreground">Basic Information</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="product-slug"
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="flex gap-2">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description"
              rows={4}
              className="bg-background"
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger id="status" className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 border-t border-border/50 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg text-foreground">Variants & Pricing</h2>
            <Button type="button" variant="outline" size="sm" onClick={addVariant} className="bg-transparent gap-2">
              <Plus className="w-4 h-4" />
              Add Variant
            </Button>
          </div>

          <div className="space-y-4">
            {formData.variants.map((variant, index) => (
              <div key={index} className="border border-border/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Variant {index + 1}</span>
                  {formData.variants.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(index)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={variant.name || ""}
                      onChange={(e) => updateVariant(index, "name", e.target.value)}
                      placeholder="e.g., 500g"
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`price-${index}`}>Price (Rs.) *</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={variant.price || 0}
                      onChange={(e) => updateVariant(index, "price", Number.parseFloat(e.target.value) || 0)}
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`stock-${index}`}>Stock</Label>
                    <Input
                      id={`stock-${index}`}
                      type="number"
                      min="0"
                      value={variant.stock || 0}
                      onChange={(e) => updateVariant(index, "stock", Number.parseInt(e.target.value) || 0)}
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button disabled={saving} className="bg-gradient-to-r from-primary to-primary/90">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Update Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
