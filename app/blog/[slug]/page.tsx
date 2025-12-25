import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { connectDB } from "@/lib/db/connection"
import { BlogPost } from "@/lib/db/models/blog"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    await connectDB()
    const post = await BlogPost.findOne({ slug, status: "published" }).lean()

    if (!post) {
      return {
        title: "Post Not Found",
      }
    }

    return {
      title: post.title,
      description: post.seoDescription || post.excerpt,
      keywords: post.seoKeywords,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        publishedTime: post.publishedAt?.toISOString(),
        authors: [post.author],
        images: post.image
          ? [
              {
                url: post.image,
                width: 1200,
                height: 630,
              },
            ]
          : [],
      },
    }
  } catch (error) {
    return {
      title: "Blog Post",
    }
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params

  try {
    await connectDB()

    const post = await BlogPost.findOne({ slug, status: "published" }).lean()

    if (!post) {
      notFound()
    }

    // Increment views
    await BlogPost.updateOne({ _id: post._id }, { $inc: { views: 1 } })

    // Get related posts from same category
    const relatedPosts = await BlogPost.find({
      category: post.category,
      _id: { $ne: post._id },
      status: "published",
    })
      .limit(3)
      .lean()

    // Serialize the data
    const serializedPost = {
      ...post,
      _id: String(post._id),
      publishedAt: post.publishedAt?.toISOString(),
      createdAt: post.createdAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
    }

    const serializedRelated = relatedPosts.map((p: any) => ({
      ...p,
      _id: String(p._id),
      publishedAt: p.publishedAt?.toISOString(),
    }))

    return (
      <main className="bg-background">
        {/* Back Link */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link href="/blog" className="flex items-center text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          <Image
            src={serializedPost.image || "/placeholder.svg?height=800&width=1200&query=organic+blog+hero"}
            alt={serializedPost.title}
            fill
            className="object-cover"
            priority
            width="100vw"
            // sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </section>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded-full">
                  {serializedPost.category}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(serializedPost.publishedAt), { addSuffix: true })}
                </span>
              </div>
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
              {serializedPost.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>By {serializedPost.author}</span>
              <span>•</span>
              <span>{serializedPost.views} views</span>
            </div>
          </div>

          {/* Meta divider */}
          <div className="h-px bg-border/50 my-8" />

          {/* Excerpt */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{serializedPost.excerpt}</p>

          {/* Content - Rich text rendering */}
          <div className="prose prose-invert max-w-none mb-12">
            <div
              className="text-foreground leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{
                __html: serializedPost.content.replace(/\n/g, "<br/>"),
              }}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50 my-12" />

          {/* Author Info */}
          <div className="bg-muted/30 rounded-lg p-6 mb-12">
            <p className="text-sm text-muted-foreground mb-2">Written by</p>
            <p className="text-lg font-semibold text-foreground">{serializedPost.author}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Expert in sustainable living and organic product development.
            </p>
          </div>

          {/* Related Posts */}
          {serializedRelated && serializedRelated.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold text-foreground mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {serializedRelated.map((relatedPost: any) => (
                  <Link key={relatedPost._id} href={`/blog/${relatedPost.slug}`}>
                    <div className="group flex flex-col h-full rounded-lg border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-300">
                      <div className="relative h-32 bg-muted overflow-hidden">
                        <Image
                          src={relatedPost.image || "/placeholder.svg?height=300&width=400"}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* CTA Section */}
        <section className="py-12 border-t border-border/50 bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Explore Organic Products</h2>
            <p className="text-muted-foreground mb-6">
              Ready to live more sustainably? Check out our curated collection of organic products.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/90">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </section>

        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: serializedPost.title,
              description: serializedPost.excerpt,
              image: serializedPost.image,
              author: {
                "@type": "Person",
                name: serializedPost.author,
              },
              publisher: {
                "@type": "Organization",
                name: "Organic Bazaar",
                logo: {
                  "@type": "ImageObject",
                  url: "https://organicbazaar.online/logo.png",
                },
              },
              datePublished: serializedPost.publishedAt,
              dateModified: serializedPost.updatedAt || serializedPost.publishedAt,
            }),
          }}
        />
      </main>
    )
  } catch (error) {
    console.error("[v0] Error loading blog post:", error)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Unable to Load Post</h1>
          <p className="text-muted-foreground mb-6">Failed to load this post. Please try again later.</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </main>
    )
  }
}
