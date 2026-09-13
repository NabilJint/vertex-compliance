const stats = [
  { value: "12,000+", label: "training videos indexed" },
  { value: "94%", label: "on-time completion rate" },
  { value: "3 sec", label: "average time to answer" },
  { value: "SOC 2", label: "audit-ready by default" },
]

export function StatsBand() {
  return (
    <section className="py-16" style={{ backgroundColor: "#1E1B4B" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <p className="mb-1 text-[36px] font-bold text-white md:text-[42px]">{s.value}</p>
              <p className="text-[14px] text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
