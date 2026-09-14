"use client"

import Link from "next/link"
import { Shield, Lock, Users, DollarSign, Heart, FileText, ChevronRight, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { capturePostHogEvent } from "@/lib/posthog-client"

const categories = [
  { name: "Security", count: "2,480 videos", icon: Shield },
  { name: "Privacy", count: "1,920 videos", icon: Lock },
  { name: "HR & Conduct", count: "1,540 videos", icon: Users },
  { name: "Finance", count: "1,210 videos", icon: DollarSign },
  { name: "Safety", count: "980 videos", icon: Heart },
  { name: "Regulatory", count: "760 videos", icon: FileText },
]

export function BrowseCategory() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-[28px] font-bold" style={{ color: "#111827" }}>Browse by category</h2>
          <Link href="/catalog" className="flex items-center gap-1 text-[14px] font-medium transition-colors" style={{ color: "#3B82F6" }}>
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/catalog?category=${c.name.toLowerCase()}`}
              onClick={() => capturePostHogEvent("category_selected", {
                category: c.name.toLowerCase(),
                location: "homepage",
              })}
            >
              <Card className="group flex items-center justify-between p-5 transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "#EEF2FF" }}>
                    <c.icon className="h-5 w-5" style={{ color: "#1E1B4B" }} />
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold" style={{ color: "#111827" }}>{c.name}</p>
                    <p className="text-[13px]" style={{ color: "#94A3B8" }}>{c.count}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" style={{ color: "#CBD5E1" }} />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
