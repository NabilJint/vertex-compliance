import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const columns = [
  {
    title: "Product",
    links: ["Features", "Catalog", "Integrations", "Pricing"],
  },
  {
    title: "Company",
    links: ["About us", "Careers", "Blog", "Contact"],
  },
  {
    title: "Resources",
    links: ["Help center", "Compliance guide", "Case studies", "Status"],
  },
  {
    title: "Legal",
    links: ["Privacy policy", "Terms of service", "Security", "GDPR"],
  },
]

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#1E1B4B" }}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <div className="mb-4 flex items-center">
              <Image src="/logo.png" alt="Vertex Compliance" width={163} height={54} className="h-8 w-auto brightness-0 invert" />
            </div>
            <p className="text-[14px] text-white/50">Smarter training. Stronger compliance.</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[13px] font-semibold text-white">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-[13px] text-white/50 transition-colors hover:text-white/80">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="mb-2 text-[13px] font-medium text-white/70">Get the latest updates</p>
            <p className="mb-3 text-[12px] text-white/40">Subscribe to our newsletter for product updates and compliance insights.</p>
            <div className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
              />
              <Button size="sm" className="bg-[#3B82F6] text-white hover:bg-[#2563EB]">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-[12px] text-white/40">&copy; 2025 Vertex Compliance. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {["in", "X", "G", "H"].map((s) => (
              <Link key={s} href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white/60 transition-colors hover:bg-white/20 hover:text-white">
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
