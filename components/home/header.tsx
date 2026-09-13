import Link from "next/link"
import Image from "next/image"
import { Search, Bell, ChevronDown } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Catalog", href: "/catalog" },
  { label: "My Training", href: "/my-training" },
  { label: "Search", href: "/search" },
  { label: "Dashboard", href: "/dashboard" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white" style={{ borderColor: "#E5E7EB" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Vertex Compliance" width={163} height={54} className="h-9 w-auto" priority />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] font-medium transition-colors hover:text-[#3B82F6]"
                style={{ color: "#475569" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: "#EF4444" }} />
          </Button>
          <div className="flex items-center gap-2 ml-2">
            <Avatar fallback="JY" size="sm" />
            <span className="hidden text-[14px] font-medium md:block" style={{ color: "#111827" }}>
              Jintoro Yusuf
            </span>
            <ChevronDown className="hidden h-4 w-4 md:block" style={{ color: "#94A3B8" }} />
          </div>
        </div>
      </div>
    </header>
  )
}
