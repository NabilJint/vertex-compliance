import Link from "next/link"
import Image from "next/image"
import { Clock, BookOpen, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface TrainingCardProps {
  title: string
  trainer: string
  role: string
  duration: string
  lessons: number
  progress: number
  badgeLabel: string
  badgeColor: string
  popular?: boolean
  thumbnailSeed: string
}

function Thumbnail({ seed, alt }: { seed: string; alt: string }) {
  return (
    <div className="relative h-44 overflow-hidden bg-gray-100">
      <Image
        src={`https://picsum.photos/seed/${seed}/400/200`}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        className="object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  )
}

function TrainingCard({ title, trainer, role, duration, lessons, progress, badgeLabel, badgeColor, popular, thumbnailSeed }: TrainingCardProps) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative">
        <Thumbnail seed={thumbnailSeed} alt={title} />
        <Badge variant="default" className="absolute left-3 top-3 border-0 bg-opacity-90 text-white" style={{ backgroundColor: badgeColor }}>
          {badgeLabel}
        </Badge>
        {popular && (
          <Badge variant="default" className="absolute right-3 top-3 border-0 bg-[#F97316] text-white">
            Popular
          </Badge>
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-3 text-[16px] font-semibold leading-[22px]" style={{ color: "#111827" }}>
          {title}
        </h3>
        <div className="mb-4 flex items-center gap-2">
          <Avatar fallback={trainer.charAt(0)} size="sm" />
          <div>
            <p className="text-[13px] font-medium" style={{ color: "#111827" }}>{trainer}</p>
            <p className="text-[11px]" style={{ color: "#94A3B8" }}>{role}</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: "#F1F5F9" }}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[12px]" style={{ color: "#94A3B8" }}>
              <Clock className="h-3 w-3" /> {duration}
            </span>
            <span className="flex items-center gap-1 text-[12px]" style={{ color: "#94A3B8" }}>
              <BookOpen className="h-3 w-3" /> {lessons} lessons
            </span>
          </div>
          <Progress value={progress} variant="circular" size="sm" showLabel />
        </div>
      </div>
    </Card>
  )
}

const trainings: TrainingCardProps[] = [
  { title: "Data Security & Incident Response", trainer: "Sarah Mitchell", role: "Security Expert", duration: "1h 20m", lessons: 12, progress: 0, badgeLabel: "Security", badgeColor: "#3B82F6", thumbnailSeed: "vertex-security-2" },
  { title: "Workplace Conduct & Anti-Harassment", trainer: "James Carter", role: "HR Director", duration: "1h 10m", lessons: 10, progress: 0, badgeLabel: "HR", badgeColor: "#8B5CF6", popular: true, thumbnailSeed: "vertex-hr-2" },
  { title: "Data Privacy & GDPR Fundamentals", trainer: "Emily Chen", role: "Privacy Officer", duration: "1h 45m", lessons: 14, progress: 0, badgeLabel: "Privacy", badgeColor: "#10B981", thumbnailSeed: "vertex-privacy-2" },
  { title: "Regulatory Basics for Business", trainer: "Michael Brooks", role: "Compliance Lead", duration: "1h 30m", lessons: 11, progress: 0, badgeLabel: "Compliance", badgeColor: "#F59E0B", thumbnailSeed: "vertex-compliance-2" },
]

export function FeaturedTraining() {
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
          {trainings.map((t) => (
            <TrainingCard key={t.title} {...t} />
          ))}
        </div>
      </div>
    </section>
  )
}
