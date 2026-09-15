"use client"

import { useState } from "react"
import { Lightbulb, ExternalLink, FileText, BookOpen } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { PortableText } from "@portabletext/react"
import { formatTimestamp } from "@/lib/utils"
import { capturePostHogEvent } from "@/lib/posthog-client"
import type { PortableTextBlock, LessonResource, VideoChunk } from "@/lib/types"

interface LessonTabsProps {
  keyPoints?: string[]
  notes?: PortableTextBlock[]
  proTip?: string
  resources?: LessonResource[]
  chunks?: VideoChunk[]
  onSeekTo?: (seconds: number) => void
}

export function LessonTabs({ keyPoints, notes, proTip, resources, chunks, onSeekTo }: LessonTabsProps) {
  const [localNotes, setLocalNotes] = useState("")

  function handleTabChange(value: string) {
    capturePostHogEvent("lesson_tab_changed", { tab_name: value })
  }

  return (
    <Tabs defaultValue="overview" onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="transcript">Transcript</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="pt-4">
        {keyPoints && keyPoints.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-[16px] font-semibold" style={{ color: "#111827" }}>
              In this lesson you will learn
            </h3>
            <ul className="flex flex-col gap-2">
              {keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[22px]" style={{ color: "#475569" }}>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "#DCFCE7" }}>
                    <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#16A34A" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {notes && notes.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-[16px] font-semibold" style={{ color: "#111827" }}>
              Lesson notes
            </h3>
            <div className="prose prose-sm max-w-none text-[14px] leading-[24px]" style={{ color: "#475569" }}>
              <PortableText value={notes} />
            </div>
          </div>
        )}

        {proTip && (
          <Card className="p-5" style={{ backgroundColor: "#F8FAFC", borderLeft: "3px solid #3B82F6" }}>
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "#F59E0B" }} />
              <div>
                <p className="mb-1 text-[14px] font-semibold" style={{ color: "#111827" }}>Pro tip</p>
                <p className="text-[14px] leading-[22px]" style={{ color: "#475569" }}>{proTip}</p>
              </div>
            </div>
          </Card>
        )}

        {!keyPoints?.length && !notes?.length && !proTip && (
          <p className="py-8 text-center text-[14px]" style={{ color: "#94A3B8" }}>
            No overview content available for this lesson.
          </p>
        )}
      </TabsContent>

      <TabsContent value="notes" className="pt-4">
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" style={{ color: "#94A3B8" }} />
          <span className="text-[13px]" style={{ color: "#94A3B8" }}>
            Personal notes (saved locally in your browser)
          </span>
        </div>
        <textarea
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          placeholder="Add your personal notes for this lesson..."
          className="min-h-[200px] w-full rounded-[10px] border px-4 py-3 text-[14px] leading-[22px] outline-none transition-colors focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          style={{ borderColor: "#E5E7EB", color: "#111827", backgroundColor: "#FFFFFF" }}
        />
      </TabsContent>

      <TabsContent value="resources" className="pt-4">
        {resources && resources.length > 0 ? (
          <div className="flex flex-col gap-3">
            {resources.map((resource) => (
              <Card key={resource._key} className="flex items-start gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]" style={{ backgroundColor: "#EFF6FF" }}>
                  <BookOpen className="h-5 w-5" style={{ color: "#3B82F6" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[14px] font-semibold" style={{ color: "#111827" }}>
                      {resource.title}
                    </h4>
                    {resource.type && (
                      <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: "#F1F5F9", color: "#94A3B8" }}>
                        {resource.type}
                      </span>
                    )}
                  </div>
                  {resource.description && (
                    <p className="mt-1 text-[13px] leading-[20px]" style={{ color: "#475569" }}>
                      {resource.description}
                    </p>
                  )}
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        capturePostHogEvent("resource_link_clicked", {
                          resource_title: resource.title,
                          resource_type: resource.type ?? "unknown",
                        })
                      }
                      className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium transition-colors hover:underline"
                      style={{ color: "#3B82F6" }}
                    >
                      Open resource <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-[14px]" style={{ color: "#94A3B8" }}>
            No resources available for this lesson.
          </p>
        )}
      </TabsContent>

      <TabsContent value="transcript" className="pt-4">
        {chunks && chunks.length > 0 ? (
          <div className="flex flex-col gap-1">
            {chunks.map((chunk) => (
              <button
                key={chunk._key}
                onClick={() => onSeekTo?.(chunk.startSeconds)}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
              >
                <span
                  className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[12px] font-mono font-medium"
                  style={{ backgroundColor: "#EFF6FF", color: "#3B82F6" }}
                >
                  {formatTimestamp(chunk.startSeconds)}
                </span>
                <span className="text-[14px] leading-[22px]" style={{ color: "#475569" }}>
                  {chunk.text}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-[14px]" style={{ color: "#94A3B8" }}>
            No transcript available for this video.
          </p>
        )}
      </TabsContent>
    </Tabs>
  )
}
