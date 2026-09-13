import { Search, Play, CheckCircle } from "lucide-react"

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Search in plain language",
    description: "Ask a question the way you'd ask a colleague.",
  },
  {
    num: "02",
    icon: Play,
    title: "Jump to the exact moment",
    description: "Every result links to the second in the video.",
  },
  {
    num: "03",
    icon: CheckCircle,
    title: "Prove compliance",
    description: "Track completions and stay audit-ready.",
  },
]

export function HowItWorks() {
  return (
    <section className="border-y bg-gray-50 py-16" style={{ borderColor: "#E5E7EB" }}>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-[28px] font-bold" style={{ color: "#111827" }}>How Vertex works</h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-[15px] font-bold" style={{ backgroundColor: "#EEF2FF", color: "#1E1B4B" }}>
                  {step.num}
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-white" style={{ borderColor: "#E5E7EB" }}>
                  <step.icon className="h-6 w-6" style={{ color: "#3B82F6" }} />
                </div>
              </div>
              <h3 className="mb-2 text-[18px] font-semibold" style={{ color: "#111827" }}>{step.title}</h3>
              <p className="text-[15px] leading-[24px]" style={{ color: "#475569" }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
