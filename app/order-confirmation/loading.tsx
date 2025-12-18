export default function OrderConfirmationLoading() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-muted border-t-primary rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    </main>
  )
}
