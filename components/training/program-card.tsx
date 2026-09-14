import Link from "next/link"
import Image from "next/image"
import { Clock, BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { urlFor } from "@/sanity/lib/image"
import { formatDuration } from "@/lib/utils"
import { getCategoryColor } from "@/lib/category-colors"
import type { RelatedTrainingProgram } from "@/lib/types"

interface ProgramCardProps {
  program: RelatedTrainingProgram
}

export function ProgramCard({ program }: ProgramCardProps) {
  const coverUrl = program.coverImage ? urlFor(program.coverImage).width(400).height(200).url() : undefined
  const trainerPhotoUrl = program.trainer.photo ? urlFor(program.trainer.photo).width(64).height(64).url() : undefined
  const totalSeconds = program.lessonDurations.reduce((sum: number, d) => sum + (d || 0), 0)
  const lessonCount = program.lessonDurations.length
  const categoryColor = getCategoryColor(program.category.slug?.current)

  return (
    <Link href={`/catalog/${program.slug.current}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative h-40 overflow-hidden bg-gray-100">
          {coverUrl && (
            <Image src={coverUrl} alt={program.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          )}
          <Badge
            variant="default"
            className="absolute left-3 top-3 border-0 bg-white/95 shadow-sm"
            style={{ color: categoryColor }}
          >
            {program.category.title}
          </Badge>
        </div>
        <div className="p-5">
          <h3 className="mb-3 text-[15px] font-semibold leading-[22px]" style={{ color: "#111827" }}>{program.title}</h3>
          <div className="mb-4 flex items-center gap-2">
            <Avatar src={trainerPhotoUrl} alt={program.trainer.name} size="sm" />
            <p className="text-[13px] font-medium" style={{ color: "#111827" }}>{program.trainer.name}</p>
          </div>
          <div className="flex items-center gap-3 border-t pt-3" style={{ borderColor: "#F1F5F9" }}>
            <span className="flex items-center gap-1 text-[12px]" style={{ color: "#94A3B8" }}>
              <Clock className="h-3 w-3" /> {formatDuration(totalSeconds)}
            </span>
            <span className="flex items-center gap-1 text-[12px]" style={{ color: "#94A3B8" }}>
              <BookOpen className="h-3 w-3" /> {lessonCount} lessons
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
