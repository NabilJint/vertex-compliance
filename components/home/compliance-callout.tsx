import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const bullets = [
  "Real-time completion tracking",
  "Identify and close compliance gaps",
  "Export reports for audits and regulators",
]

const teams = [
  { name: "Engineering", rate: "96%", status: "Audit-ready", statusColor: "#10B981" },
  { name: "Product", rate: "91%", status: "Audit-ready", statusColor: "#10B981" },
  { name: "Sales", rate: "87%", status: "Needs attention", statusColor: "#F59E0B" },
  { name: "Marketing", rate: "94%", status: "Audit-ready", statusColor: "#10B981" },
]

export function ComplianceCallout() {
  return (
    <section className="border-y bg-gray-50 py-16" style={{ borderColor: "#E5E7EB" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge variant="default" className="mb-4 border-[#BFDBFE] bg-[#EFF6FF] text-[#3B82F6]">
              For compliance teams
            </Badge>
            <h2 className="mb-6 text-[32px] font-bold leading-[40px]" style={{ color: "#111827" }}>
              See exactly who&apos;s compliant — and who isn&apos;t.
            </h2>
            <ul className="mb-8 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "#10B981" }} />
                  <span className="text-[15px] leading-[24px]" style={{ color: "#475569" }}>{b}</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard">
              <Button size="lg">
                Explore the dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[18px] font-semibold" style={{ color: "#111827" }}>Compliance Overview</h3>
              <Badge variant="completed">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#10B981" }} />
                Audit-ready
              </Badge>
            </div>
            <div className="mb-6 flex items-center gap-6">
              <Progress value={92} variant="circular" size="lg" showLabel />
              <div>
                <p className="text-[14px] font-medium" style={{ color: "#111827" }}>Overall completion rate</p>
                <p className="text-[13px]" style={{ color: "#94A3B8" }}>1,104 / 1,200 employees</p>
              </div>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[13px] font-medium" style={{ color: "#111827" }}>Completion trend</p>
              <div className="flex items-end gap-1.5">
                {[40, 55, 50, 65, 70, 80, 75, 90, 85, 95, 88, 92].map((h, i) => (
                  <div key={i} className="w-2 rounded-t" style={{ height: `${h * 0.4}px`, backgroundColor: "#3B82F6" }} />
                ))}
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-t" style={{ borderColor: "#F1F5F9" }}>
                  <th className="py-2.5 text-[12px] font-medium" style={{ color: "#94A3B8" }}>Teams</th>
                  <th className="py-2.5 text-[12px] font-medium" style={{ color: "#94A3B8" }}>Completion Rate</th>
                  <th className="py-2.5 text-[12px] font-medium" style={{ color: "#94A3B8" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr key={t.name} className="border-t" style={{ borderColor: "#F1F5F9" }}>
                    <td className="py-2.5 text-[13px] font-medium" style={{ color: "#111827" }}>{t.name}</td>
                    <td className="py-2.5 text-[13px]" style={{ color: "#475569" }}>{t.rate}</td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: t.statusColor }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.statusColor }} />
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </section>
  )
}
