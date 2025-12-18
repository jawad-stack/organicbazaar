import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Blog - Organic Living Tips & Insights | Organic Bazaar",
  description:
    "Discover expert tips, guides, and insights on organic living, sustainable practices, and wellness at Organic Bazaar blog.",
  keywords: ["organic blog", "sustainability tips", "wellness guide", "organic living"],
  openGraph: {
    title: "Blog - Organic Living Tips & Insights | Organic Bazaar",
    description: "Discover expert tips, guides, and insights on organic living, sustainable practices, and wellness.",
    type: "website",
  },
}

export default async function BlogPage() {
  try {
    const response = await fetch("http://localhost:3000/api/blog?limit=9", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch posts")
    }

    const data = await response.json()
    const { posts, categories } = data

    return (
      <main className="bg-background">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
                Organic Living Guide
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Expert insights, tips, and stories to help you live more sustainably and healthily
              </p>

              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-card border border-border/50 rounded-lg p-2 max-w-md mx-auto mt-8">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                <input
                  type="search"
                  placeholder="Search articles..."
                  className="flex-1 bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <Button
                asChild
                variant="outline"
                className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
              >
                <Link href="/blog">All Posts</Link>
              </Button>
              {categories?.map((cat: string) => (
                <Button
                  key={cat}
                  asChild
                  variant="outline"
                  className="border-border/50 hover:bg-muted/50 bg-transparent"
                >
                  <Link href={`/blog?category=${cat}`}>{cat}</Link>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post: any) => (
                  <Link key={post._id} href={`/blog/${post.slug}`}>
                    <article className="group flex flex-col h-full rounded-lg border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-300">
                      {/* Image */}
                      <div className="relative h-48 bg-muted overflow-hidden">
                        <Image
                          src={post.image || "/placeholder.svg?height=400&width=600&query=organic+blog+image"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-grow p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            {post.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                          </span>
                        </div>

                        <h2 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">{post.excerpt}</p>

                        <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                          Read More <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No blog posts found yet.</p>
                <Button asChild variant="outline">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    )
  } catch (error) {
    console.error("Error loading blog page:", error)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Failed to load blog. Please try again later.</p>
      </main>
    )
  }
}
