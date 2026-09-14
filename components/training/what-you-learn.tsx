import { Card } from "@/components/ui/card"
import { getLearningOutcomeIcon } from "@/lib/learning-outcome-icons"
import type { LearningOutcome } from "@/lib/types"

interface WhatYouLearnProps {
  outcomes: LearningOutcome[]
}

export function WhatYouLearn({ outcomes }: WhatYouLearnProps) {
  if (outcomes.length === 0) return null

  return (
    <section className="py-12" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-6 text-[24px] font-bold" style={{ color: "#111827" }}>What you&rsquo;ll learn</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {outcomes.map((outcome) => {
            const Icon = getLearningOutcomeIcon(outcome.icon)
            return (
            <Card key={outcome._key} className="flex items-start gap-4 p-5">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
                style={{ backgroundColor: "#EFF6FF" }}
              >
                <Icon className="h-5 w-5" style={{ color: "#3B82F6" }} />
              </div>
              <div>
                <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "#111827" }}>{outcome.title}</h3>
                {outcome.description && (
                  <p className="text-[13px] leading-[20px]" style={{ color: "#64748B" }}>{outcome.description}</p>
                )}
              </div>
            </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
