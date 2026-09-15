"use client"

import Link from "next/link"
import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-16 text-center" style={{ borderColor: "#E5E7EB" }}>
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: "#F3F4F6" }}>
        <SearchX className="h-8 w-8" style={{ color: "#94A3B8" }} />
      </div>
      <h2 className="mb-2 text-[20px] font-semibold" style={{ color: "#111827" }}>
        No results for that question
      </h2>
      <p className="mb-6 max-w-md text-[15px]" style={{ color: "#6B7280" }}>
        Try rephrasing, or browse the full catalog.
      </p>
      <Link href="/catalog">
        <Button className="rounded-xl" style={{ backgroundColor: "#1E1B4B", color: "#FFFFFF" }}>
          Browse catalog
        </Button>
      </Link>
    </div>
  )
}
