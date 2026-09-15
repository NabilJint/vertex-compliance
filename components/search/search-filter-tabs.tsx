"use client"

import { cn } from "@/lib/utils"

export type FilterTab = "all" | "video" | "lesson" | "program"

interface SearchFilterTabsProps {
  value: FilterTab
  onChange: (value: FilterTab) => void
  videoCount: number
  lessonCount: number
}

const tabs: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All results" },
  { value: "video", label: "Video moments" },
  { value: "lesson", label: "Lessons" },
  { value: "program", label: "Programs" },
]

export function SearchFilterTabs({ value, onChange, videoCount, lessonCount }: SearchFilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => {
        const isActive = value === tab.value
        const count = tab.value === "video" ? videoCount : tab.value === "lesson" ? lessonCount : undefined
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
              isActive
                ? "bg-[#1E1B4B] text-white"
                : "border bg-white text-[#475569] hover:bg-gray-50"
            )}
            style={!isActive ? { borderColor: "#E5E7EB" } : undefined}
          >
            {tab.label}
            {count !== undefined && count > 0 && (
              <span className="ml-1.5 text-[11px] opacity-70">({count})</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
