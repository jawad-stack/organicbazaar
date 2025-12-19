import { Suspense } from "react"
import { OrderConfirmationContent } from "@/components/order-confirmation-content"
import OrderConfirmationLoading from "./loading"

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationLoading />}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
