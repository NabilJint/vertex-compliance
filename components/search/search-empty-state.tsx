"use client"

import Link from "next/link"
import { Search, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchEmptyStateProps {
  query: string
}

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: "#F3F4F6" }}>
        <Search className="h-8 w-8" style={{ color: "#94A3B8" }} />
      </div>
      <h2 className="mb-2 text-[20px] font-semibold" style={{ color: "#111827" }}>
        No results found for &ldquo;{query}&rdquo;
      </h2>
      <p className="mb-6 max-w-md text-[15px]" style={{ color: "#6B7280" }}>
        Try different keywords or browse the full catalog to find the training you need.
      </p>
      <Link href="/catalog">
        <Button className="rounded-xl" style={{ backgroundColor: "#3B82F6", color: "#FFFFFF" }}>
          <BookOpen className="h-4 w-4" />
          Browse Catalog
        </Button>
      </Link>
    </div>
  )
}
