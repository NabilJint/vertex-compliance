import Link from "next/link"
import Image from "next/image"
import { Play, Clock, BookOpen, ShieldCheck, Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { urlFor } from "@/sanity/lib/image"
import { formatDuration, formatFullDate, formatMonthYear } from "@/lib/utils"
import { getCategoryColor } from "@/lib/category-colors"
import type { LessonSummary, TrainingProgram } from "@/lib/types"

interface HeroProps {
  program: TrainingProgram
  totalDurationSeconds: number
  totalLessons: number
  previewLesson: LessonSummary | null
  startLessonHref: string
}

export function TrainingHero({ program, totalDurationSeconds, totalLessons, previewLesson, startLessonHref }: HeroProps) {
  const trainerPhotoUrl = program.trainer.photo ? urlFor(program.trainer.photo).width(96).height(96).url() : undefined
  const coverImageUrl = program.coverImage ? urlFor(program.coverImage).width(960).height(540).url() : undefined
  const categoryColor = getCategoryColor(program.category.slug?.current)

  return (
    <section className="border-b bg-white" style={{ borderColor: "#E5E7EB" }}>
      <div className="mx-auto max-w-7xl px-6 py-6">
        <nav className="mb-6 flex items-center gap-2 text-[13px]" style={{ color: "#94A3B8" }}>
          <Link href="/catalog" className="transition-colors hover:text-[#3B82F6]">Catalog</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span style={{ color: "#111827" }}>{program.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Badge
                variant="default"
                className="border-0"
                style={{ backgroundColor: `${categoryColor}1A`, color: categoryColor }}
              >
                {program.category.title.toUpperCase()}
              </Badge>
              {program.isPopular && (
                <Badge variant="default" className="gap-1">
                  <Star className="h-3 w-3" /> Popular
                </Badge>
              )}
            </div>

            <h1 className="mb-3 text-[36px] font-bold leading-[42px] sm:text-[44px] sm:leading-[50px]" style={{ color: "#111827" }}>
              {program.title}
            </h1>

            {program.summary && (
              <p className="mb-6 text-[16px] leading-[26px]" style={{ color: "#475569" }}>
                {program.summary}
              </p>
            )}

            <div className="mb-6 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Avatar src={trainerPhotoUrl} alt={program.trainer.name} size="sm" />
                <div>
                  <p className="text-[13px] font-medium" style={{ color: "#111827" }}>{program.trainer.name}</p>
                  <p className="text-[12px]" style={{ color: "#94A3B8" }}>Trainer</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[13px]" style={{ color: "#475569" }}>
                <Clock className="h-4 w-4" style={{ color: "#94A3B8" }} />
                <div className="flex flex-col leading-tight">
                  <span className="font-medium" style={{ color: "#111827" }}>{formatDuration(totalDurationSeconds)}</span>
                  <span className="text-[11px]" style={{ color: "#94A3B8" }}>total</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[13px]" style={{ color: "#475569" }}>
                <BookOpen className="h-4 w-4" style={{ color: "#94A3B8" }} />
                <div className="flex flex-col leading-tight">
                  <span className="font-medium" style={{ color: "#111827" }}>{totalLessons}</span>
                  <span className="text-[11px]" style={{ color: "#94A3B8" }}>lessons</span>
                </div>
              </div>
              {program.requiredBy && (
                <div className="flex items-center gap-1.5 text-[13px]" style={{ color: "#475569" }}>
                  <ShieldCheck className="h-4 w-4" style={{ color: "#94A3B8" }} />
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium" style={{ color: "#111827" }}>Required</span>
                    <span className="text-[11px]" style={{ color: "#94A3B8" }}>by {formatFullDate(program.requiredBy)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href={startLessonHref}>
                <Button size="lg">Start training</Button>
              </Link>
              {previewLesson && (
                <Link href={`/lessons/${previewLesson.slug.current}`}>
                  <Button variant="secondary" size="lg" className="gap-2">
                    <Play className="h-4 w-4" /> Preview first lesson
                  </Button>
                </Link>
              )}
            </div>

            <p className="mt-4 text-[12px]" style={{ color: "#94A3B8" }}>
              Last updated: {formatMonthYear(program._updatedAt)}
            </p>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-[16px] bg-gray-100">
            {coverImageUrl && (
              <Image src={coverImageUrl} alt={program.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <Link
              href={startLessonHref}
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-105"
            >
              <Play className="ml-1 h-6 w-6" style={{ color: "#1E1B4B" }} fill="#1E1B4B" />
            </Link>
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[12px] font-medium text-white">
              <Clock className="h-3 w-3" /> {formatDuration(totalDurationSeconds)}
            </div>
            <Badge variant="default" className="absolute bottom-3 right-3 border-0 bg-white/95">
              Certificate on completion
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
