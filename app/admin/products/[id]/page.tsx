"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    status: "active",
    variants: [{ price: 0, stock: 0 }],
  })

  useEffect(() => {
    if (id !== "new") {
      fetchProduct()
    } else {
      setLoading(false)
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()
      if (data) {
        setFormData(data)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const method = id === "new" ? "POST" : "PUT"
      const endpoint = id === "new" ? "/api/admin/products" : `/api/admin/products/${id}`

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/products")
      } else {
        alert("Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Error saving product")
    } finally {
      setSaving(false)
    }
  }

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { price: 0, stock: 0 }],
    })
  }

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    })
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setFormData({ ...formData, variants: newVariants })
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground">{id === "new" ? "New Product" : "Edit Product"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border/50 rounded-lg p-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-foreground">Basic Information</h2>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Wellness"
                className="bg-background"
              />
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
        </div>

        {/* Variants Section */}
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`price-${index}`}>Price (Rs.) *</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, "price", Number.parseFloat(e.target.value))}
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
                      onChange={(e) => updateVariant(index, "stock", Number.parseInt(e.target.value))}
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button disabled={saving} className="bg-gradient-to-r from-primary to-primary/90">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>

      {/* Image Management */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h2 className="font-semibold text-lg text-foreground mb-4">Manage Images</h2>
        <Button asChild className="bg-gradient-to-r from-accent to-accent/90">
          <Link href={`/admin/upload?product=${formData.slug}`}>Upload Images</Link>
        </Button>
        <p className="text-sm text-muted-foreground mt-3">
          Use the dedicated image upload tool to manage product images for this product.
        </p>
      </div>
    </div>
  )
}
