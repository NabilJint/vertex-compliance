"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type SortOption = "relevant" | "newest" | "az"

interface SearchSortControlProps {
  value: SortOption
  onChange: (value: SortOption) => void
  totalCount: number
  query: string
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevant", label: "Most Relevant" },
  { value: "newest", label: "Newest" },
  { value: "az", label: "A-Z" },
]

export function SearchSortControl({ value, onChange, totalCount, query }: SearchSortControlProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[15px]" style={{ color: "#475569" }}>
        Found <span className="font-semibold" style={{ color: "#111827" }}>{totalCount}</span> results
        {query && (
          <>
            {" "}for &ldquo;<span className="font-semibold" style={{ color: "#111827" }}>{query}</span>&rdquo;
          </>
        )}
      </p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className={cn(
            "appearance-none rounded-xl border bg-white py-2 pl-3 pr-8 text-[14px] font-medium",
            "focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
          )}
          style={{ borderColor: "#E5E7EB", color: "#475569" }}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: "#94A3B8" }}
        />
      </div>
    </div>
  )
}
