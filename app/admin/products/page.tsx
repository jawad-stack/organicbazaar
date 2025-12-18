"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react"

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  status: "active" | "inactive"
  categories: string[]
  variants: Array<{ price: number }>
  images: any[]
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState("all")
  const [search, setSearch] = useState("")

  const limit = 10

  useEffect(() => {
    fetchProducts()
  }, [page, status])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status !== "all" && { status }),
        ...(search && { search }),
      })

      const response = await fetch(`/api/admin/products?${query}`)
      const data = await response.json()
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
      if (response.ok) {
        setProducts(products.filter((p) => p._id !== id))
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const toggleStatus = async (id: string, newStatus: "active" | "inactive") => {
    try {
      const product = products.find((p) => p._id === id)
      if (!product) return

      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, status: newStatus }),
      })

      if (response.ok) {
        setProducts(products.map((p) => (p._id === id ? { ...p, status: newStatus } : p)))
      }
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  const pages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <Button asChild className="bg-gradient-to-r from-primary to-primary/90">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              setPage(1)
              fetchProducts()
            }
          }}
          className="flex-1"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="px-4 py-2 rounded-lg border border-border/50 bg-background text-foreground"
        >
          <option value="all">All Products</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="border border-border/50 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price Range</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Images</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const priceVariants = product.variants?.filter((v: any) => v && typeof v.price === "number") || []
                  if (priceVariants.length === 0) {
                    return null // Skip products with no valid variants
                  }

                  const minPrice = Math.min(...priceVariants.map((v) => v.price))
                  const maxPrice = Math.max(...priceVariants.map((v) => v.price))

                  return (
                    <tr key={product._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">/{product.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {minPrice === maxPrice
                          ? `Rs.${minPrice.toFixed(2)}`
                          : `Rs.${minPrice.toFixed(2)} - Rs.${maxPrice.toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">{product.images?.length || 0} images</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              toggleStatus(product._id, product.status === "active" ? "inactive" : "active")
                            }
                            title={product.status === "active" ? "Deactivate" : "Activate"}
                          >
                            {product.status === "active" ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button asChild size="sm" variant="ghost">
                            <Link href={`/admin/products/${product._id}`}>
                              <Edit2 className="w-4 h-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                              <div className="flex gap-4 justify-end">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product._id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="bg-transparent"
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pages) }).map((_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={page === pageNum ? "" : "bg-transparent"}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(pages, page + 1))}
            disabled={page === pages}
            className="bg-transparent"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
