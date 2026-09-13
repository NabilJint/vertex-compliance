import {
  Search,
  Play,
  CheckCircle2,
  Clock,
  Shield,
  BookOpen,
  User,
  Bell,
  BarChart3,
  Home,
  FolderOpen,
  GraduationCap,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, SearchInput, Textarea, Select } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Toast } from "@/components/ui/toast"
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

function Swatch({ color, name, hex }: { color: string; name: string; hex: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-16 w-full rounded-[10px] border" style={{ backgroundColor: color, borderColor: "#E5E7EB" }} />
      <div>
        <p className="text-[14px] leading-[20px] font-medium" style={{ color: "#111827" }}>{name}</p>
        <p className="text-[12px] leading-[16px]" style={{ color: "#475569" }}>{hex}</p>
      </div>
    </div>
  )
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <h2 className="text-[32px] leading-[40px] font-semibold" style={{ color: "#111827" }}>
        {number}. {title}
      </h2>
      {children}
    </section>
  )
}

export default function DesignSystemShowcase() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
      <header className="border-b bg-white" style={{ borderColor: "#E5E7EB" }}>
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px]" style={{ backgroundColor: "#1E1B4B" }}>
            <Shield className="h-5 w-5" style={{ color: "#FFFFFF" }} />
          </div>
          <div>
            <h1 className="text-[20px] leading-[28px] font-semibold" style={{ color: "#111827" }}>Vertex Compliance</h1>
            <p className="text-[12px] leading-[16px]" style={{ color: "#475569" }}>Design System</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] space-y-16 px-6 py-12">
        {/* 01. Color Palette */}
        <Section number="01" title="Color Palette">
          <div>
            <h3 className="mb-3 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Primary</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              <Swatch color="#1E1B4B" name="Primary" hex="#1E1B4B" />
              <Swatch color="#3B82F6" name="Primary Accent" hex="#3B82F6" />
              <Swatch color="#10B981" name="Success" hex="#10B981" />
              <Swatch color="#F59E0B" name="Warning" hex="#F59E0B" />
              <Swatch color="#EF4444" name="Danger" hex="#EF4444" />
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Neutrals (Gray Scale)</h3>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
              <Swatch color="#F9FAFB" name="Gray 50" hex="#F9FAFB" />
              <Swatch color="#E5E7EB" name="Gray 100" hex="#E5E7EB" />
              <Swatch color="#CBD5E1" name="Gray 200" hex="#CBD5E1" />
              <Swatch color="#94A3B8" name="Gray 300" hex="#94A3B8" />
              <Swatch color="#475569" name="Gray 400" hex="#475569" />
              <Swatch color="#111827" name="Gray 900" hex="#111827" />
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Surface</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Swatch color="#FFFFFF" name="White" hex="#FFFFFF" />
              <Swatch color="#F8FAFC" name="Off-white" hex="#F8FAFC" />
            </div>
          </div>
        </Section>

        {/* 02. Typography */}
        <Section number="02" title="Typography">
          <div className="space-y-6">
            <div>
              <p className="mb-1 text-[12px] leading-[16px]" style={{ color: "#475569" }}>Display / H1 — 48px / 56px — Bold</p>
              <p style={{ fontSize: 48, lineHeight: "56px", fontWeight: 700, color: "#111827" }}>Vertex Compliance</p>
            </div>
            <div>
              <p className="mb-1 text-[12px] leading-[16px]" style={{ color: "#475569" }}>H2 — 32px / 40px — Semibold</p>
              <p style={{ fontSize: 32, lineHeight: "40px", fontWeight: 600, color: "#111827" }}>Build a culture of compliance</p>
            </div>
            <div>
              <p className="mb-1 text-[12px] leading-[16px]" style={{ color: "#475569" }}>H3 — 24px / 32px — Semibold</p>
              <p style={{ fontSize: 24, lineHeight: "32px", fontWeight: 600, color: "#111827" }}>Training for a safer tomorrow</p>
            </div>
            <div>
              <p className="mb-1 text-[12px] leading-[16px]" style={{ color: "#475569" }}>H4 — 20px / 28px — Medium</p>
              <p style={{ fontSize: 20, lineHeight: "28px", fontWeight: 500, color: "#111827" }}>Measure. Train. Stay Compliant.</p>
            </div>
            <div>
              <p className="mb-1 text-[12px] leading-[16px]" style={{ color: "#475569" }}>Body Large — 18px / 28px — Regular</p>
              <p style={{ fontSize: 18, lineHeight: "28px", color: "#111827" }}>The right training, at the right time, for every team.</p>
            </div>
            <div>
              <p className="mb-1 text-[12px] leading-[16px]" style={{ color: "#475569" }}>Body — 16px / 24px — Regular</p>
              <p style={{ fontSize: 16, lineHeight: "24px", color: "#111827" }}>Search, watch, and complete compliance training with AI.</p>
            </div>
            <div>
              <p className="mb-1 text-[12px] leading-[16px]" style={{ color: "#475569" }}>Body Small — 14px / 20px — Regular</p>
              <p style={{ fontSize: 14, lineHeight: "20px", color: "#111827" }}>Easy to follow. Audit ready.</p>
            </div>
            <div>
              <p className="mb-1 text-[12px] leading-[16px]" style={{ color: "#475569" }}>Caption — 12px / 16px — Regular</p>
              <p style={{ fontSize: 12, lineHeight: "16px", color: "#111827" }}>Last updated 2h ago</p>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Font Weights</h3>
            <div className="flex flex-wrap gap-6">
              <span style={{ fontSize: 16, color: "#111827", fontWeight: 400 }}>Regular 400</span>
              <span style={{ fontSize: 16, color: "#111827", fontWeight: 500 }}>Medium 500</span>
              <span style={{ fontSize: 16, color: "#111827", fontWeight: 600 }}>Semibold 600</span>
              <span style={{ fontSize: 16, color: "#111827", fontWeight: 700 }}>Bold 700</span>
            </div>
          </div>
        </Section>

        {/* 03. Spacing, Radius & Shadows */}
        <Section number="03" title="Spacing, Radius & Shadows">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-3 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Spacing Scale</h3>
              <div className="flex flex-wrap items-end gap-3">
                {[4, 8, 12, 16, 24, 32, 48, 64].map((px) => (
                  <div key={px} className="flex flex-col items-center gap-1">
                    <div style={{ width: 16, height: px, backgroundColor: "#3B82F6" }} />
                    <span className="text-[12px] leading-[16px]" style={{ color: "#475569" }}>{px}px</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Corner Radius</h3>
              <div className="flex flex-wrap items-end gap-4">
                {[
                  { label: "sm", value: "6px" },
                  { label: "md", value: "10px" },
                  { label: "lg", value: "16px" },
                  { label: "full", value: "9999px" },
                ].map((r) => (
                  <div key={r.label} className="flex flex-col items-center gap-1">
                    <div className="h-10 w-10 border-2" style={{ borderRadius: r.value, borderColor: "#3B82F6" }} />
                    <span className="text-[12px] leading-[16px]" style={{ color: "#475569" }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Shadow Tokens</h3>
              <div className="space-y-3">
                <div className="rounded-[16px] bg-white p-4" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                  <p className="text-[14px] leading-[20px] font-medium" style={{ color: "#111827" }}>Subtle Card</p>
                  <p className="text-[12px] leading-[16px]" style={{ color: "#475569" }}>0 1px 2px rgba(0,0,0,0.05)</p>
                </div>
                <div className="rounded-[16px] bg-white p-4" style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                  <p className="text-[14px] leading-[20px] font-medium" style={{ color: "#111827" }}>Elevated Modal</p>
                  <p className="text-[12px] leading-[16px]" style={{ color: "#475569" }}>0 10px 30px rgba(0,0,0,0.08)</p>
                </div>
                <div className="rounded-[16px] bg-white p-4" style={{ boxShadow: "0 0 0 3px rgba(59,130,246,0.3)" }}>
                  <p className="text-[14px] leading-[20px] font-medium" style={{ color: "#111827" }}>Focus Ring</p>
                  <p className="text-[12px] leading-[16px]" style={{ color: "#475569" }}>0 0 0 3px rgba(59,130,246,0.3)</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 04. Components */}
        <Section number="04" title="Components">
          <div>
            <h3 className="mb-4 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Buttons</h3>
            <div className="space-y-4">
              {(["primary", "secondary", "ghost", "destructive"] as const).map((v) => (
                <div key={v}>
                  <p className="mb-2 text-[12px] leading-[16px]" style={{ color: "#475569" }}>{v.charAt(0).toUpperCase() + v.slice(1)}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant={v}>Button</Button>
                    <Button variant={v}>Button</Button>
                    <Button variant={v} disabled>Button</Button>
                    <Button variant={v} loading>Loading...</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Inputs</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Input label="Text field" placeholder="Enter your email" />
              <SearchInput placeholder="Search courses, videos, topics..." />
              <Textarea label="Textarea" placeholder="Add notes..." />
              <Select label="Select" placeholder="Choose an option" options={[{ value: "1", label: "Option 1" }, { value: "2", label: "Option 2" }]} />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Search Bar (Hero)</h3>
            <Card elevated className="p-6">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5" style={{ color: "#3B82F6" }} />
                <p className="text-[16px] leading-[24px]" style={{ color: "#111827" }}>Search for courses, videos, or topics...</p>
              </div>
            </Card>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Result Cards</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="flex gap-4 p-4">
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-[10px]" style={{ backgroundColor: "#E5E7EB" }}>
                    <div className="flex h-full items-center justify-center">
                      <Play className="h-6 w-6" style={{ color: "#94A3B8" }} />
                    </div>
                    <span className="absolute bottom-1 right-1 rounded px-1 text-[12px] leading-[16px]" style={{ backgroundColor: "rgba(0,0,0,0.7)", color: "#FFFFFF" }}>12:34</span>
                  </div>
                  <div className="min-w-0">
                    <Badge variant="completed" className="mb-1">Compliance Training</Badge>
                    <p className="text-[14px] leading-[20px] font-semibold line-clamp-1" style={{ color: "#111827" }}>Data Privacy & GDPR — Key Principles</p>
                    <p className="text-[12px] leading-[16px] line-clamp-2" style={{ color: "#475569" }}>Learn the core principles of GDPR and how to apply them in your daily work.</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex gap-4 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px]" style={{ backgroundColor: "#DBEAFE" }}>
                    <BookOpen className="h-6 w-6" style={{ color: "#3B82F6" }} />
                  </div>
                  <div className="min-w-0">
                    <Badge variant="in-progress" className="mb-1">Information Security</Badge>
                    <p className="text-[14px] leading-[20px] font-semibold" style={{ color: "#111827" }}>Access Control & Authentication</p>
                    <ul className="mt-1 space-y-0.5 text-[12px] leading-[16px]" style={{ color: "#475569" }}>
                      <li>• Understand authentication methods</li>
                      <li>• Learn access control policies</li>
                      <li>• Apply best practices in your organization</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Progress</h3>
            <div className="flex flex-wrap items-center gap-8">
              <div className="text-center">
                <Progress variant="circular" value={68} size="lg" showLabel />
                <p className="mt-2 text-[14px] leading-[20px]" style={{ color: "#475569" }}>Course Completion</p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="mb-1 text-[14px] leading-[20px]" style={{ color: "#475569" }}>3 of 5 lessons</p>
                <Progress value={60} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Badges / Pills</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="completed">Completed</Badge>
              <Badge variant="in-progress">In Progress</Badge>
              <Badge variant="recertification-due">Recertification Due</Badge>
              <Badge variant="free-preview">Free Preview</Badge>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Avatar + Trainer Card</h3>
            <Card className="inline-block">
              <CardContent className="flex flex-col items-center gap-3 p-6">
                <Avatar size="lg" fallback="DO" />
                <div className="text-center">
                  <p className="text-[14px] leading-[20px] font-semibold" style={{ color: "#111827" }}>David Oklor</p>
                  <p className="text-[12px] leading-[16px]" style={{ color: "#475569" }}>Compliance Trainer</p>
                  <p className="text-[12px] leading-[16px]" style={{ color: "#475569" }}>5+ years experience</p>
                </div>
                <Button variant="secondary" size="sm">View Profile</Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Toast / Alert</h3>
            <div className="space-y-3">
              <Toast variant="success" title="Training completed!" description="You've earned 1 credit." />
              <Toast variant="warning" title="Recertification due soon" description="Your policy training expires in 7 days." />
              <Toast variant="error" title="Something went wrong" description="Please try again or contact support." />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Tabs</h3>
            <Card>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="transcript">Transcript</TabsTrigger>
                </TabsList>
                <CardContent>
                  <TabsContent value="overview"><p className="text-[16px] leading-[24px]" style={{ color: "#475569" }}>Course overview and key information about this training program.</p></TabsContent>
                  <TabsContent value="notes"><p className="text-[16px] leading-[24px]" style={{ color: "#475569" }}>Personal notes for this lesson.</p></TabsContent>
                  <TabsContent value="resources"><p className="text-[16px] leading-[24px]" style={{ color: "#475569" }}>Supplementary resources and links.</p></TabsContent>
                  <TabsContent value="transcript"><p className="text-[16px] leading-[24px]" style={{ color: "#475569" }}>Video transcript with timestamps.</p></TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Modal / Dialog</h3>
            <Card className="inline-block">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-[24px] leading-[32px] font-semibold" style={{ color: "#111827" }}>Complete Lesson</h3>
                  <button style={{ color: "#94A3B8" }}>✕</button>
                </div>
                <p className="text-[16px] leading-[24px]" style={{ color: "#475569" }}>You&apos;re about to mark this lesson as complete. This will update your progress and records.</p>
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="secondary">Cancel</Button>
                  <Button variant="primary">Complete</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* 05. Iconography */}
        <Section number="05" title="Iconography (Lucide-style)">
          <div className="flex flex-wrap gap-6">
            {[
              { icon: Search, label: "Search" },
              { icon: Play, label: "Play" },
              { icon: CheckCircle2, label: "Check" },
              { icon: Clock, label: "Clock" },
              { icon: Shield, label: "Shield" },
              { icon: BookOpen, label: "Book" },
              { icon: User, label: "User" },
              { icon: Bell, label: "Bell" },
              { icon: BarChart3, label: "Chart" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-[10px]" style={{ backgroundColor: "#F9FAFB" }}>
                  <Icon className="h-6 w-6" style={{ color: "#111827" }} />
                </div>
                <span className="text-[12px] leading-[16px]" style={{ color: "#475569" }}>{label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 06. Layout Patterns */}
        <Section number="06" title="Layout Patterns (Wireframes)">
          <div className="grid gap-4 md:grid-cols-4">
            {["Catalog Page", "Lesson Page", "Search Results Page", "Compliance Dashboard"].map((name) => (
              <div key={name} className="rounded-[16px] border border-dashed bg-white p-6 text-center" style={{ borderColor: "#E5E7EB" }}>
                <div className="mb-3 flex justify-center gap-1">
                  {[40, 60, 50, 45, 55].map((w, i) => (
                    <div key={i} className="h-2 rounded-full" style={{ width: w, backgroundColor: "#E5E7EB" }} />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded" style={{ backgroundColor: "#E5E7EB" }} />
                  <div className="h-3 w-3/4 rounded" style={{ backgroundColor: "#E5E7EB" }} />
                  <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "#E5E7EB" }} />
                </div>
                <p className="mt-4 text-[12px] leading-[16px]" style={{ color: "#475569" }}>{name}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 07. Grid & Container */}
        <Section number="07" title="Grid & Container">
          <div>
            <h3 className="mb-3 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>12 Column Grid</h3>
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="flex h-8 items-center justify-center rounded text-[12px] leading-[16px]" style={{ backgroundColor: "#DBEAFE", color: "#3B82F6" }}>
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-6 text-[12px] leading-[16px]" style={{ color: "#475569" }}>
              <span>Max Width: 1280px</span>
              <span>Gutters: 24px</span>
            </div>
          </div>
        </Section>

        {/* 08. States & Motion */}
        <Section number="08" title="States & Motion">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-3 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Focus State</h3>
              <Input placeholder="Enter your email" className="ring-2" style={{ borderColor: "#3B82F6", boxShadow: "0 0 0 3px rgba(59,130,246,0.3)" }} />
              <p className="mt-1 text-[12px] leading-[16px]" style={{ color: "#475569" }}>Visible focus ring for accessibility</p>
            </div>
            <div>
              <h3 className="mb-3 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Hover Elevation</h3>
              <Card className="transition-shadow duration-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <CardContent className="p-4">
                  <p className="text-[14px] leading-[20px] font-semibold" style={{ color: "#111827" }}>Card title</p>
                  <p className="text-[12px] leading-[16px]" style={{ color: "#475569" }}>Short description goes here about this item.</p>
                </CardContent>
              </Card>
            </div>
            <div>
              <h3 className="mb-3 text-[14px] leading-[20px] font-medium" style={{ color: "#475569" }}>Motion</h3>
              <p className="text-[12px] leading-[16px]" style={{ color: "#475569" }}>Subtle, professional transitions (150-200ms ease-out)</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-[12px] leading-[16px]" style={{ color: "#111827" }}>
                  <Clock className="h-4 w-4" style={{ color: "#3B82F6" }} /> Transitions — 150ms
                </div>
                <div className="flex items-center gap-2 text-[12px] leading-[16px]" style={{ color: "#111827" }}>
                  <Clock className="h-4 w-4" style={{ color: "#3B82F6" }} /> Cards — 200ms
                </div>
                <div className="flex items-center gap-2 text-[12px] leading-[16px]" style={{ color: "#111827" }}>
                  <Clock className="h-4 w-4" style={{ color: "#3B82F6" }} /> Modals — 200ms
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 09. Sidebar Navigation */}
        <Section number="09" title="Sidebar Navigation">
          <Card className="inline-block">
            <CardContent className="p-4">
              <nav className="space-y-1">
                {[
                  { icon: Home, label: "Home" },
                  { icon: FolderOpen, label: "Catalog" },
                  { icon: GraduationCap, label: "My Learning" },
                  { icon: Shield, label: "Compliance" },
                  { icon: BarChart3, label: "Reports" },
                  { icon: Settings, label: "Settings" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="flex items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] leading-[20px] transition-colors hover:bg-[#F9FAFB]"
                    style={{ color: "#475569" }}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </a>
                ))}
              </nav>
            </CardContent>
          </Card>
        </Section>
      </main>
    </div>
  )
}
