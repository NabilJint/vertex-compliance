import { CheckCircle2, Circle } from "lucide-react"
import type { LessonStatus } from "@/lib/types"

export function StatusIcon({ status }: { status: LessonStatus }) {
  if (status === "completed") {
    return <CheckCircle2 className="h-5 w-5" style={{ color: "#10B981" }} />
  }
  if (status === "in-progress") {
    return (
      <span className="relative flex h-5 w-5 items-center justify-center">
        <svg width={20} height={20} className="-rotate-90">
          <circle cx={10} cy={10} r={8} fill="none" stroke="#DBEAFE" strokeWidth={2.5} />
          <circle
            cx={10}
            cy={10}
            r={8}
            fill="none"
            stroke="#3B82F6"
            strokeWidth={2.5}
            strokeDasharray={2 * Math.PI * 8}
            strokeDashoffset={2 * Math.PI * 8 * 0.5}
            strokeLinecap="round"
          />
        </svg>
      </span>
    )
  }
  return <Circle className="h-5 w-5" style={{ color: "#E5E7EB" }} />
}
