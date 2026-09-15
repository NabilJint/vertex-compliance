"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { capturePostHogEvent } from "@/lib/posthog-client"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const suggestions = ["Data handling rules", "Incident reporting", "Annual security training"]

export function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    capturePostHogEvent("search_submitted", { location: "homepage_hero", query })
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  function handleSuggestionClick(suggestion: string) {
    capturePostHogEvent("search_submitted", { location: "homepage_hero_suggestion", query: suggestion })
    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F4FF] to-white py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg className="absolute -right-20 -top-20 h-[600px] w-[600px] opacity-[0.03]" viewBox="0 0 600 600" fill="none">
          <path d="M0 300L300 0L600 300L300 600L0 300Z" stroke="#1E1B4B" strokeWidth="1" />
          <path d="M100 300L300 100L500 300L300 500L100 300Z" stroke="#1E1B4B" strokeWidth="1" />
          <path d="M200 300L300 200L400 300L300 400L200 300Z" stroke="#1E1B4B" strokeWidth="1" />
        </svg>
        <svg className="absolute -left-20 top-0 h-[500px] w-[500px] opacity-[0.03]" viewBox="0 0 500 500" fill="none">
          <path d="M0 0L500 0L500 500" stroke="#1E1B4B" strokeWidth="1" />
          <path d="M0 100L400 100L400 500" stroke="#1E1B4B" strokeWidth="1" />
          <path d="M0 200L300 200L300 500" stroke="#1E1B4B" strokeWidth="1" />
        </svg>
      </div>
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <Badge variant="default" className="mb-6 border-[#C7D2FE] bg-[#EEF2FF] text-[#3B82F6]">
          <Sparkles className="h-3.5 w-3.5" />
          AI-POWERED COMPLIANCE TRAINING
        </Badge>
        <h1 className="mx-auto mb-6 max-w-3xl text-[48px] leading-[56px] font-bold tracking-tight" style={{ color: "#111827" }}>
          Find the exact moment.{" "}
          <br />
          Stay compliant.
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-[18px] leading-[28px]" style={{ color: "#475569" }}>
          Search thousands of training videos and jump straight to the answer — in seconds.
        </p>
        <form
          onSubmit={handleSearch}
          className="mx-auto mb-6 flex max-w-2xl items-center gap-3 rounded-2xl border bg-white p-2 shadow-lg"
          style={{ borderColor: "#E5E7EB" }}
        >
          <div className="flex-1">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Ask anything — e.g. "How do I report a data breach?"'
              className="border-0 bg-transparent text-[16px] leading-[24px] shadow-none focus:ring-0 focus:ring-offset-0"
            />
          </div>
          <Button type="submit" size="lg" className="rounded-xl px-6" style={{ backgroundColor: "#3B82F6", color: "#FFFFFF" }}>
            <Sparkles className="h-4 w-4" />
            Search
          </Button>
        </form>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {suggestions.map((s) => (
            <Badge
              key={s}
              variant="default"
              className="cursor-pointer border-[#E5E7EB] bg-white text-[#475569] hover:bg-gray-50"
              onClick={() => handleSuggestionClick(s)}
            >
              {s}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
