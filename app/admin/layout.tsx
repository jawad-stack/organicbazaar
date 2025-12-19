import type React from "react"
import { AdminAuthWrapper } from "@/components/admin-auth-wrapper"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthWrapper>
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </AdminAuthWrapper>
  )
}
