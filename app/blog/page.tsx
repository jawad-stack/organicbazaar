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
    // CHANGE: Fixed fetch URL syntax error - proper template literal and protocol
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_METADATA_BASE || "http://localhost:3000"}/api/blog?limit=12`,
      {
        next: { revalidate: 3600 },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch posts")
    }

    const data = await response.json()
    const { posts, categories } = data

    return (
      <main className="bg-background">
        {/* CHANGE: Tightened hero section with better spacing */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                Organic Living Guide
              </h1>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Expert insights, tips, and stories to help you live more sustainably and healthily
              </p>

              {/* Search Bar - CHANGE: Improved styling */}
              <div className="flex items-center gap-2 bg-card border border-border/50 rounded-lg p-2.5 max-w-md mx-auto mt-6">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-1" />
                <input
                  type="search"
                  placeholder="Search articles..."
                  className="flex-1 bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories - CHANGE: Tighter button layout */}
        <section className="py-6 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <Button
                asChild
                variant="outline"
                className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 text-sm"
              >
                <Link href="/blog">All Posts</Link>
              </Button>
              {categories?.map((cat: string) => (
                <Button
                  key={cat}
                  asChild
                  variant="outline"
                  className="border-border/50 hover:bg-muted/50 bg-transparent text-sm"
                >
                  <Link href={`/blog?category=${cat}`}>{cat}</Link>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid - CHANGE: Improved card density and typography */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any) => (
                  <Link key={post._id} href={`/blog/${post.slug}`}>
                    <article className="group flex flex-col h-full rounded-lg border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-300">
                      {/* Image */}
                      <div className="relative h-40 bg-muted overflow-hidden">
                        <Image
                          src={post.image || "/placeholder.svg?height=400&width=600&query=organic+lifestyle"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-grow p-4">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            {post.category}
                          </span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                          </span>
                        </div>

                        <h2 className="text-lg font-bold text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-sm text-muted-foreground mb-3 flex-grow line-clamp-2">{post.excerpt}</p>

                        <div className="flex items-center text-primary font-semibold text-xs group-hover:translate-x-1 transition-transform">
                          Read More <ArrowRight className="w-3 h-3 ml-1.5" />
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
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Unable to Load Blog</h1>
          <p className="text-muted-foreground mb-6">
            We're having trouble loading the blog at the moment. Please try again later.
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </main>
    )
  }
}
