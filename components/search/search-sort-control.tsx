"use client"

import { ChevronDown, LayoutList, Grid3X3, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export type SortOption = "relevant" | "newest" | "az"

interface SearchSortControlProps {
  value: SortOption
  onChange: (value: SortOption) => void
  totalCount: number
  query: string
  programCount?: number
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevant", label: "Most Relevant" },
  { value: "newest", label: "Newest" },
  { value: "az", label: "A-Z" },
]

export function SearchSortControl({ value, onChange, totalCount, query, programCount = 0 }: SearchSortControlProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-[24px] font-bold" style={{ color: "#111827" }}>
          Results for &ldquo;{query}&rdquo;
        </h2>
        <p className="mt-1 text-[14px]" style={{ color: "#6B7280" }}>
          Found <span className="font-semibold" style={{ color: "#111827" }}>{totalCount}</span> results across{" "}
          <span className="font-semibold" style={{ color: "#111827" }}>{programCount}</span> training programs
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value as SortOption)}
            className={cn(
              "appearance-none rounded-xl border bg-white py-2 pl-3 pr-8 text-[13px] font-medium",
              "focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
            )}
            style={{ borderColor: "#E5E7EB", color: "#475569" }}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "#94A3B8" }}
          />
        </div>

        <div className="flex items-center rounded-xl border p-1" style={{ borderColor: "#E5E7EB" }}>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "#1E1B4B", color: "#FFFFFF" }}
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: "#94A3B8" }}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
        </div>

        <button
          className="flex items-center gap-2 rounded-xl border px-3 py-2 text-[13px] font-medium transition-colors hover:bg-gray-50"
          style={{ borderColor: "#E5E7EB", color: "#475569" }}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>
    </div>
  )
}
