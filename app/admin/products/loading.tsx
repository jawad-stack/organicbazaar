export default function ProductsLoadingPage() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    </div>
  )
}
