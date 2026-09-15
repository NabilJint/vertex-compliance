import { Suspense } from "react"
import type { Metadata } from "next"
import { SearchResults } from "./search-results"

export const metadata: Metadata = {
  title: "Search | Vertex Compliance",
  description: "Search through compliance training videos and lessons",
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#F9FAFB" }}>
          <div className="text-[15px]" style={{ color: "#6B7280" }}>Loading search...</div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  )
}
