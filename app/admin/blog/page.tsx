"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface BlogPost {
  _id: string
  title: string
  slug: string
  author: string
  category: string
  status: "draft" | "published"
  publishedAt: string
  views: number
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState("all")
  const [search, setSearch] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])

  const limit = 10

  const filterPosts = useCallback(() => {
    let filtered = posts

    if (status !== "all") {
      filtered = filtered.filter((p) => p.status === status)
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.author.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower),
      )
    }

    setFilteredPosts(filtered)
  }, [posts, status, search])

  useEffect(() => {
    filterPosts()
  }, [filterPosts])

  useEffect(() => {
    fetchPosts()
  }, [page, status])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/blog?page=${page}&limit=${limit}&status=${status}`)
      const data = await response.json()
      setPosts(data.posts || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error("[v0] Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" })
      const data = await response.json()

      if (response.ok) {
        setPosts(posts.filter((p) => p._id !== id))
        alert("Post deleted successfully!")
        fetchPosts()
      } else {
        alert(`Failed to delete: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Error deleting post:", error)
      alert("Network error. Please try again.")
    }
  }

  const pages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
        <Button asChild className="bg-gradient-to-r from-primary to-primary/90">
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, author, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="px-4 py-2 rounded-lg border border-border/50 bg-card text-foreground min-w-40"
        >
          <option value="all">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      <div className="border border-border/50 rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border/50">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                <th className="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Category
                </th>
                <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Author
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Published
                </th>
                <th className="px-4 sm:px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 sm:px-6 py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 sm:px-6 py-8 text-center text-muted-foreground">
                    {search || status !== "all" ? "No posts match your filters" : "No posts yet"}
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground text-sm line-clamp-1">{post.title}</p>
                        <p className="text-xs text-muted-foreground">/{post.slug}</p>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-foreground">{post.category}</td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-foreground">{post.author}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <Badge variant={post.status === "published" ? "default" : "secondary"} className="text-xs">
                        {post.status}
                      </Badge>
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/admin/blog/${post._id}`}>
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
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{post.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                            <div className="flex gap-4 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(post._id)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto">
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
            {Array.from({ length: pages }).map((_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "" : "bg-transparent"}
              >
                {i + 1}
              </Button>
            ))}
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
