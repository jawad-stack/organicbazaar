# Organic E-Commerce Store

A production-ready, SEO-optimized e-commerce application for organic products built with Next.js 15, MongoDB, and TypeScript.

## Features

### Core E-Commerce
- **Product Management**: Complete product catalog with multiple variants (size, type, etc.)
- **Variant System**: Each product can have multiple SKU-tracked variants with independent pricing and stock
- **Collections**: Products organized into multiple collections for better browsing
- **Shopping Cart**: Persistent cart using Zustand with localStorage
- **Order Management**: Complete order flow with customer email

### SEO & Performance
- **Dynamic Metadata**: Automatic metadata generation for all pages
- **JSON-LD Structured Data**: Product schema for rich search results
- **Sitemap Generation**: Automated XML sitemap for all products/collections
- **Robots.txt**: Configured for optimal search engine crawling
- **Image Optimization**: Next.js Image component for automatic optimization
- **Server Components**: Optimized rendering strategy

### Design System
- **Organic Theme**: Cream, sage green, and warm accent colors
- **Centralized Colors**: All colors defined in CSS variables for easy theming
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessible Components**: ARIA labels and semantic HTML

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19
- **Backend**: Next.js Route Handlers & Server Actions
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (client-side cart)
- **Type Safety**: TypeScript

## Project Structure

\`\`\`
├── app/
│   ├── api/              # Route handlers
│   ├── products/         # Product pages
│   ├── collections/      # Collection pages
│   ├── cart/            # Cart page
│   ├── layout.tsx       # Root layout with header/footer
│   ├── page.tsx         # Home page
│   ├── globals.css      # Theme tokens
│   ├── sitemap.ts       # Dynamic sitemap
│   └── robots.ts        # Robots configuration
├── components/
│   ├── product-card.tsx
│   ├── variant-selector.tsx
│   ├── add-to-cart-button.tsx
│   ├── cart-icon.tsx
│   └── ui/              # shadcn components
├── lib/
│   ├── db/
│   │   ├── models/      # Mongoose schemas
│   │   └── connection.ts
│   ├── cart-context.ts  # Zustand store
│   └── seo/             # SEO utilities
└── scripts/
    └── seed-db.ts       # Database seeding script
\`\`\`

## Environment Variables

\`\`\`env
MONGODB_URI=your_mongodb_connection_string
\`\`\`

## Getting Started

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Set Environment Variables
Create a \`.env.local\` file:
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/organic-store
\`\`\`

### 3. Seed the Database
\`\`\`bash
npx tsx scripts/seed-db.ts
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:3000\` to see your store.

## Data Models

### Product
\`\`\`
- name
- slug (indexed, unique)
- description
- images
- collections (references to Collection)
- variants:
  - name
  - attributes (e.g., {size: "250g"})
  - sku (indexed)
  - price
  - stock
  - image (optional)
- status (active/inactive)
- seoTitle, seoDescription, seoKeywords
\`\`\`

### Collection
\`\`\`
- name
- slug (indexed, unique)
- description
- image
- seoDescription, seoKeywords
\`\`\`

### Order
\`\`\`
- lineItems (snapshots of product + variant at purchase)
- total
- status (pending/completed/cancelled)
- customerEmail
- createdAt, updatedAt
\`\`\`

## SEO Features

- **Dynamic Page Titles & Descriptions**: Automatically generated from product/collection data
- **Open Graph Tags**: Optimized for social media sharing
- **Twitter Cards**: Enhanced Twitter sharing with images
- **JSON-LD Schema**: Structured data for products
- **Canonical URLs**: Prevent duplicate content issues
- **Mobile Optimized**: Responsive design and proper viewport settings
- **Fast Performance**: Optimized Core Web Vitals

## Customization

### Change Theme Colors
Edit \`app/globals.css\` CSS variables:
- \`--primary\`: Sage green
- \`--secondary\`: Warm yellow
- \`--accent\`: Golden orange
- \`--background\`: Cream
- All changes apply app-wide automatically

### Add Products
Run \`npm run dev\`, then make requests to \`POST /api/products\` or use MongoDB directly.

### Customize Collections
Modify or add collections in \`scripts/seed-db.ts\` and re-run the seed script.

## Performance Optimizations

- Server-side rendering for static pages
- Incremental Static Regeneration (ISR) ready
- Image optimization with Next.js Image
- CSS variables for efficient theming
- Database indexing on frequently queried fields
- Cart persistence with Zustand + localStorage

## Future Enhancements

- Payment integration (Stripe)
- User authentication & accounts
- Wishlist functionality
- Product reviews & ratings
- Advanced filtering & search
- Admin dashboard
- Email notifications
- Inventory management

## License

MIT
