import { Avatar } from "@/components/ui/avatar"

export function Testimonial() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-8 text-[24px] leading-[36px] font-medium italic" style={{ color: "#111827" }}>
          &ldquo;Vertex Compliance has transformed how we handle training. We&apos;re more confident, more efficient, and fully audit-ready.&rdquo;
        </p>
        <div className="flex items-center justify-center gap-3">
          <Avatar fallback="PN" size="md" />
          <div className="text-left">
            <p className="text-[14px] font-semibold" style={{ color: "#111827" }}>Priya Nair</p>
            <p className="text-[13px]" style={{ color: "#94A3B8" }}>Head of Compliance, Acme Corp</p>
          </div>
        </div>
      </div>
    </section>
  )
}
