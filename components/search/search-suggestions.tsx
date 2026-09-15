"use client"

import { capturePostHogEvent } from "@/lib/posthog-client"

interface SearchSuggestionsProps {
  onSelect: (term: string) => void
}

const suggestions = [
  "Incident reporting timeline",
  "Who to notify",
  "What counts as a breach",
]

export function SearchSuggestions({ onSelect }: SearchSuggestionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
      {suggestions.map((term) => (
        <button
          key={term}
          onClick={() => {
            capturePostHogEvent("search_suggestion_clicked", { suggestion_text: term })
            onSelect(term)
          }}
          className="rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors hover:bg-gray-50"
          style={{ borderColor: "#E5E7EB", color: "#475569" }}
        >
          {term}
        </button>
      ))}
    </div>
  )
}
