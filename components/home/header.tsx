"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Bell } from "lucide-react"
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { capturePostHogEvent } from "@/lib/posthog-client"

const navLinks = [
  { label: "Catalog", href: "/catalog" },
  { label: "My Training", href: "/my-training" },
  { label: "Search", href: "/search" },
  { label: "Dashboard", href: "/dashboard" },
]

export function Header() {
  const { isSignedIn } = useAuth()

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
          {isSignedIn ? (
            <>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: "#EF4444" }} />
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => capturePostHogEvent("auth_cta_clicked", { action: "sign_in", location: "header" })}
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  onClick={() => capturePostHogEvent("auth_cta_clicked", { action: "sign_up", location: "header" })}
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
