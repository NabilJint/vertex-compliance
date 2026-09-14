import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { urlFor } from "@/sanity/lib/image"
import type { TrainerSummary } from "@/lib/types"

interface InstructorProps {
  trainer: TrainerSummary
}

function expertisePills(expertise?: string): string[] {
  if (!expertise) return []
  return expertise
    .split(/&|,|\//)
    .map((part) => part.trim())
    .filter(Boolean)
}

function bioText(bio?: TrainerSummary["bio"]): string {
  if (!bio) return ""
  return bio
    .flatMap((block) =>
      Array.isArray(block.children)
        ? (block.children as Array<{ text?: string }>).map((child) => child.text || "")
        : []
    )
    .join(" ")
}

export function Instructor({ trainer }: InstructorProps) {
  const photoUrl = trainer.photo ? urlFor(trainer.photo).width(160).height(160).url() : undefined
  const pills = expertisePills(trainer.expertise)

  return (
    <section className="py-12" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-6 text-[24px] font-bold" style={{ color: "#111827" }}>Your trainer</h2>
        <Card className="grid grid-cols-1 gap-8 p-6 md:grid-cols-[auto_1fr_auto] md:items-start">
          <div className="flex items-center gap-4 md:flex-col md:items-start">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100 md:h-20 md:w-20">
              {photoUrl && <Image src={photoUrl} alt={trainer.name} fill sizes="80px" className="object-cover" />}
            </div>
            <div>
              <p className="text-[16px] font-semibold" style={{ color: "#111827" }}>{trainer.name}</p>
              {trainer.expertise && (
                <p className="text-[13px]" style={{ color: "#94A3B8" }}>{trainer.expertise}</p>
              )}
            </div>
          </div>

          <p className="text-[14px] leading-[22px]" style={{ color: "#475569" }}>
            {bioText(trainer.bio)}
          </p>

          <div className="flex flex-col gap-3 md:min-w-[180px]">
            <p className="text-[13px] font-semibold" style={{ color: "#111827" }}>Expertise</p>
            <div className="flex flex-wrap gap-2">
              {pills.map((pill) => (
                <Badge key={pill}>{pill}</Badge>
              ))}
            </div>
            {trainer.slug && (
              <Link
                href={`/trainers/${trainer.slug.current}`}
                className="flex items-center gap-1 text-[13px] font-medium transition-colors"
                style={{ color: "#3B82F6" }}
              >
                View full profile <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </Card>
      </div>
    </section>
  )
}
