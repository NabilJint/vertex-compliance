"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Loader2, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { VideoResultCard } from "@/components/search/video-result-card"
import { LessonResultCard } from "@/components/search/lesson-result-card"
import { SearchEmptyState } from "@/components/search/search-empty-state"
import { SearchSortControl, type SortOption } from "@/components/search/search-sort-control"
import { SearchFilterTabs, type FilterTab } from "@/components/search/search-filter-tabs"
import { SearchSuggestions } from "@/components/search/search-suggestions"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { capturePostHogEvent } from "@/lib/posthog-client"
import type { SearchResult, SearchResponse } from "@/lib/search-types"

const INITIAL_VISIBLE_COUNT = 3

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
  const [filterTab, setFilterTab] = useState<FilterTab>("all")
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    setHasSearched(true)
    setFilterTab("all")
    setVisibleCount(INITIAL_VISIBLE_COUNT)

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

  function handleSuggestionSelect(term: string) {
    setQuery(term)
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  function handleSortChange(newSort: SortOption) {
    setSort(newSort)
    capturePostHogEvent("search_sort_changed", { sort_option: newSort })
  }

  function handleFilterChange(tab: FilterTab) {
    setFilterTab(tab)
    setVisibleCount(INITIAL_VISIBLE_COUNT)
    capturePostHogEvent("search_filter_changed", { filter_tab: tab })
  }

  function handleShowMore() {
    setVisibleCount((prev) => prev + INITIAL_VISIBLE_COUNT)
  }

  const sortedResults = [...results].sort((a, b) => {
    if (sort === "az") {
      return a.description.localeCompare(b.description)
    }
    return 0
  })

  const videoResults = sortedResults.filter((r) => r.type === "video")
  const lessonResults = sortedResults.filter((r) => r.type === "lesson")

  const visibleVideoResults = videoResults.slice(0, visibleCount)
  const visibleLessonResults = lessonResults.slice(0, visibleCount)
  const hasMoreResults = visibleCount < Math.max(videoResults.length, lessonResults.length)

  const uniquePrograms = new Set(results.map((r) => r.trainingProgram.name)).size

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "#F9FAFB" }}>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <form onSubmit={handleSubmit} className="mb-2">
            <div className="flex items-center gap-3 rounded-2xl border bg-white p-2 shadow-lg" style={{ borderColor: "#E5E7EB" }}>
              <div className="flex items-center pl-3">
                <Search className="h-5 w-5" style={{ color: "#94A3B8" }} />
              </div>
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

          {!hasSearched && (
            <SearchSuggestions onSelect={handleSuggestionSelect} />
          )}

          {hasSearched && !loading && !error && results.length > 0 && (
            <div className="mt-8">
              <SearchSortControl
                value={sort}
                onChange={handleSortChange}
                totalCount={totalCount}
                query={initialQuery}
                programCount={uniquePrograms}
              />

              <div className="mt-6 mb-8">
                <SearchFilterTabs
                  value={filterTab}
                  onChange={handleFilterChange}
                  videoCount={videoResults.length}
                  lessonCount={lessonResults.length}
                />
              </div>

              {(filterTab === "all" || filterTab === "video") && videoResults.length > 0 && (
                <section className="mb-10">
                  <div className="mb-5">
                    <h3 className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                      VIDEO MOMENTS
                    </h3>
                    <p className="mt-1 text-[14px]" style={{ color: "#94A3B8" }}>
                      Jump straight to the exact moment in a training video.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {(filterTab === "video" ? visibleVideoResults : visibleVideoResults).map((result, i) => (
                      <VideoResultCard key={`video-${i}`} result={result} position={i} />
                    ))}
                  </div>
                </section>
              )}

              {(filterTab === "all" || filterTab === "lesson") && lessonResults.length > 0 && (
                <section className="mb-10">
                  <div className="mb-5">
                    <h3 className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                      LESSONS
                    </h3>
                    <p className="mt-1 text-[14px]" style={{ color: "#94A3B8" }}>
                      Full lessons that match your question.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {(filterTab === "lesson" ? visibleLessonResults : visibleLessonResults).map((result, i) => (
                      <LessonResultCard key={`lesson-${i}`} result={result} position={i} />
                    ))}
                  </div>
                </section>
              )}

              {hasMoreResults && filterTab === "all" && (
                <div className="flex flex-col items-center py-6">
                  <Button
                    onClick={handleShowMore}
                    variant="secondary"
                    className="rounded-xl px-6"
                  >
                    Show {Math.min(INITIAL_VISIBLE_COUNT, Math.max(videoResults.length, lessonResults.length) - visibleCount)} more results
                  </Button>
                  <p className="mt-2 text-[13px]" style={{ color: "#94A3B8" }}>
                    Results ranked by relevance to your question
                  </p>
                </div>
              )}
            </div>
          )}

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
            <SearchEmptyState />
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
        </div>
      </main>
      <Footer />
    </div>
  )
}
