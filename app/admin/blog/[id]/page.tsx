"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Zap } from "lucide-react"
import Link from "next/link"

const CATEGORIES = ["Wellness", "Sustainability", "Education", "Recipe", "Lifestyle"]

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    image: "",
    status: "draft",
    seoDescription: "",
    seoKeywords: "",
  })

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`)
      const data = await response.json()
      if (data.post) {
        setFormData({
          ...data.post,
          seoKeywords: data.post.seoKeywords?.join(", ") || "",
        })
      }
    } catch (error) {
      console.error("[v0] Error fetching post:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAIGenerate = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a post title first")
      return
    }

    setAiLoading(true)
    try {
      const response = await fetch("/api/ai/generate-blog-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogTitle: formData.title,
          category: formData.category,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setFormData((prev) => ({
          ...prev,
          excerpt: data.excerpt || prev.excerpt,
          content: data.content || prev.content,
          seoDescription: data.seoDescription || prev.seoDescription,
          seoKeywords: (Array.isArray(data.keywords) ? data.keywords : []).join(", "),
        }))
        alert("Content generated successfully!")
      } else {
        alert(`AI Error: ${data.error || "Failed to generate content"}`)
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
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          seoKeywords: formData.seoKeywords.split(",").map((k) => k.trim()),
        }),
      })

      if (response.ok) {
        router.push("/admin/blog")
      } else {
        alert("Failed to update post")
      }
    } catch (error) {
      console.error("[v0] Error updating post:", error)
      alert("Error updating post")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/blog">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border/50 rounded-lg p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Post title"
            required
            className="bg-background"
          />
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
          <Label htmlFor="excerpt">Excerpt *</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Brief description"
            required
            rows={3}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Full blog post content"
            required
            rows={8}
            className="bg-background font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger id="category" className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Author name"
              required
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Featured Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
            type="url"
            className="bg-background"
          />
        </div>

        <div className="space-y-4 border-t border-border/50 pt-4">
          <h3 className="font-semibold text-foreground">SEO Settings</h3>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">Meta Description</Label>
            <Textarea
              id="seoDescription"
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder="SEO meta description"
              rows={2}
              className="bg-background text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoKeywords">Keywords (comma-separated)</Label>
            <Input
              id="seoKeywords"
              value={formData.seoKeywords}
              onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
              placeholder="keyword1, keyword2"
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
            <SelectTrigger id="status" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/admin/blog">Cancel</Link>
          </Button>
          <Button disabled={saving} className="bg-gradient-to-r from-primary to-primary/90">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Update Post"}
          </Button>
        </div>
      </form>
    </div>
  )
}
