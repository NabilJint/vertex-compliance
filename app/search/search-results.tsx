"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Sparkles, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { VideoResultCard } from "@/components/search/video-result-card"
import { LessonResultCard } from "@/components/search/lesson-result-card"
import { SearchEmptyState } from "@/components/search/search-empty-state"
import { SearchSortControl, type SortOption } from "@/components/search/search-sort-control"
import { Header } from "@/components/home/header"
import { capturePostHogEvent } from "@/lib/posthog-client"
import type { SearchResult, SearchResponse } from "@/lib/search-types"

export function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialSearchDone = useRef(false)

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>("relevant")
  const [hasSearched, setHasSearched] = useState(false)

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    setHasSearched(true)

    capturePostHogEvent("search_submitted", { query: searchQuery, location: "search_page" })

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      })

      if (!res.ok) {
        throw new Error("Search failed")
      }

      const data: SearchResponse = await res.json()
      setResults(data.results)
      setTotalCount(data.totalCount)

      capturePostHogEvent("search_completed", {
        query: searchQuery,
        resultCount: data.totalCount,
      })
    } catch {
      setError("Something went wrong. Please try again.")
      setResults([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialQuery && !initialSearchDone.current) {
      initialSearchDone.current = true
      performSearch(initialQuery)
    }
  }, [initialQuery, performSearch])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  function handleSortChange(newSort: SortOption) {
    setSort(newSort)
  }

  const sortedResults = [...results].sort((a, b) => {
    if (sort === "az") {
      return a.description.localeCompare(b.description)
    }
    return 0
  })

  const videoResults = sortedResults.filter((r) => r.type === "video")
  const lessonResults = sortedResults.filter((r) => r.type === "lesson")

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center gap-3 rounded-2xl border bg-white p-2 shadow-lg" style={{ borderColor: "#E5E7EB" }}>
            <div className="flex-1">
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Ask anything — e.g. "How do I report a data breach?"'
                className="border-0 bg-transparent text-[16px] leading-[24px] shadow-none focus:ring-0 focus:ring-offset-0"
              />
            </div>
            <Button type="submit" size="lg" className="rounded-xl px-6" style={{ backgroundColor: "#3B82F6", color: "#FFFFFF" }} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>
        </form>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" style={{ color: "#3B82F6" }} />
            <p className="text-[15px]" style={{ color: "#6B7280" }}>Searching through training content...</p>
          </div>
        )}

        {error && (
          <div className="py-20 text-center">
            <p className="text-[15px]" style={{ color: "#EF4444" }}>{error}</p>
          </div>
        )}

        {!loading && !error && hasSearched && results.length === 0 && (
          <SearchEmptyState query={initialQuery} />
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <div className="mb-6">
              <SearchSortControl
                value={sort}
                onChange={handleSortChange}
                totalCount={totalCount}
                query={initialQuery}
              />
            </div>

            {videoResults.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-4 flex items-center gap-2 text-[18px] font-semibold" style={{ color: "#111827" }}>
                  <Search className="h-5 w-5" style={{ color: "#3B82F6" }} />
                  Video Moments
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {videoResults.map((result, i) => (
                    <VideoResultCard key={`video-${i}`} result={result} />
                  ))}
                </div>
              </section>
            )}

            {lessonResults.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-4 flex items-center gap-2 text-[18px] font-semibold" style={{ color: "#111827" }}>
                  <Search className="h-5 w-5" style={{ color: "#3B82F6" }} />
                  Lessons
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {lessonResults.map((result, i) => (
                    <LessonResultCard key={`lesson-${i}`} result={result} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {!loading && !hasSearched && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: "#EEF2FF" }}>
              <Search className="h-8 w-8" style={{ color: "#3B82F6" }} />
            </div>
            <h2 className="mb-2 text-[20px] font-semibold" style={{ color: "#111827" }}>
              Search your training content
            </h2>
            <p className="max-w-md text-[15px]" style={{ color: "#6B7280" }}>
              Find specific moments in training videos, lessons, and courses. Ask anything about compliance, data handling, security, and more.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
