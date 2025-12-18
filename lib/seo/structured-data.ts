export function generateProductSchema(product: any, imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.seoDescription,
    image: imageUrl,
    url: `https://organicbazaar.online/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "Organic Bazaar",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "PKR",
      lowPrice: Math.min(...product.variants.map((v: any) => v.price)),
      highPrice: Math.max(...product.variants.map((v: any) => v.price)),
      offerCount: product.variants.length,
      availability: "https://schema.org/InStock",
    },
    aggregateRating:
      product.averageRating && product.reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: product.averageRating,
            ratingCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  }
}

export function generateBlogPostSchema(post: any, imageUrl: string, authorName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Organic Bazaar",
      logo: {
        "@type": "ImageObject",
        url: "https://organicbazaar.online/logo.png",
      },
    },
    url: `https://organicbazaar.online/blog/${post.slug}`,
    keywords: post.seoKeywords?.join(", "),
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Organic Bazaar",
    description: "Premium 100% organic, sustainably sourced products",
    url: "https://organicbazaar.online",
    logo: "https://organicbazaar.online/logo.png",
    sameAs: [
      "https://facebook.com/organicbazaar",
      "https://instagram.com/organicbazaar",
      "https://twitter.com/organicbazaar",
      "https://youtube.com/@organicbazaar",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@organicbazaar.online",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
    },
  }
}

export function generateCollectionSchema(collection: any, imageUrl: string, productCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Collection",
    name: collection.name,
    description: collection.description,
    image: imageUrl,
    url: `https://organicbazaar.online/collections/${collection.slug}`,
    numberOfItems: productCount,
  }
}
