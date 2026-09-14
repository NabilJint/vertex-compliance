import Link from "next/link"
import Image from "next/image"
import { Clock, BookOpen, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { getFeaturedTrainingPrograms } from "@/lib/sanity"
import { urlFor } from "@/sanity/lib/image"
import { formatDuration } from "@/lib/utils"
import { getCategoryColor } from "@/lib/category-colors"
import type { FeaturedTrainingProgram } from "@/lib/types"

function TrainingCard({ program }: { program: FeaturedTrainingProgram }) {
  const coverUrl = program.coverImage ? urlFor(program.coverImage).width(400).height(200).url() : undefined
  const trainerPhotoUrl = program.trainer.photo ? urlFor(program.trainer.photo).width(64).height(64).url() : undefined
  const totalSeconds = program.lessonDurations.reduce((sum: number, d) => sum + (d || 0), 0)
  const lessonCount = program.lessonDurations.length
  const categoryColor = getCategoryColor(program.category.slug?.current)

  return (
    <Link href={`/catalog/${program.slug.current}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative h-44 overflow-hidden bg-gray-100">
          {coverUrl && (
            <Image src={coverUrl} alt={program.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
          )}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
          <Badge
            variant="default"
            className="absolute left-3 top-3 border-0"
            style={{ backgroundColor: categoryColor, color: "#FFFFFF" }}
          >
            {program.category.title}
          </Badge>
        </div>
        <div className="p-5">
          <h3 className="mb-3 text-[16px] font-semibold leading-[22px]" style={{ color: "#111827" }}>
            {program.title}
          </h3>
          <div className="mb-4 flex items-center gap-2">
            <Avatar src={trainerPhotoUrl} alt={program.trainer.name} size="sm" />
            <p className="text-[13px] font-medium" style={{ color: "#111827" }}>{program.trainer.name}</p>
          </div>
          <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: "#F1F5F9" }}>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[12px]" style={{ color: "#94A3B8" }}>
                <Clock className="h-3 w-3" /> {formatDuration(totalSeconds)}
              </span>
              <span className="flex items-center gap-1 text-[12px]" style={{ color: "#94A3B8" }}>
                <BookOpen className="h-3 w-3" /> {lessonCount} lessons
              </span>
            </div>
            <Progress value={0} variant="circular" size="sm" showLabel />
          </div>
        </div>
      </Card>
    </Link>
  )
}

export async function FeaturedTraining() {
  const programs = await getFeaturedTrainingPrograms()

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="mb-1 text-[28px] font-bold" style={{ color: "#111827" }}>Featured Training</h2>
            <p className="text-[15px]" style={{ color: "#475569" }}>Required and recommended this quarter</p>
          </div>
          <Link href="/catalog" className="flex items-center gap-1 text-[14px] font-medium transition-colors" style={{ color: "#3B82F6" }}>
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program) => (
            <TrainingCard key={program._id} program={program} />
          ))}
        </div>
      </div>
    </section>
  )
}
