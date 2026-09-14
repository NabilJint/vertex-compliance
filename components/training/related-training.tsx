import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProgramCard } from "@/components/training/program-card"
import type { RelatedTrainingProgram } from "@/lib/types"

interface RelatedTrainingProps {
  programs: RelatedTrainingProgram[]
}

export function RelatedTraining({ programs }: RelatedTrainingProps) {
  if (programs.length === 0) return null

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-[24px] font-bold" style={{ color: "#111827" }}>Related training</h2>
          <Link href="/catalog" className="flex items-center gap-1 text-[14px] font-medium transition-colors" style={{ color: "#3B82F6" }}>
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program._id} program={program} />
          ))}
        </div>
      </div>
    </section>
  )
}
