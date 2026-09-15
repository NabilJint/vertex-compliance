import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { VideoPlayer } from "@/components/lesson/video-player"
import { LessonSidebar } from "@/components/lesson/lesson-sidebar"
import { LessonNavigation } from "@/components/lesson/lesson-navigation"
import { LessonPageClient } from "./lesson-page-client"
import { getLessonPageBySlug, getVideoDocByUrl, getProgressByUser } from "@/lib/sanity"
import type { UserProgress, VideoDoc } from "@/lib/types"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ t?: string }>
}

export default async function LessonPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { t } = await searchParams
  const lesson = await getLessonPageBySlug(slug)

  if (!lesson) notFound()

  const program = lesson.program
  if (!program) notFound()

  const { userId } = await auth()
  const progress: UserProgress | null = userId ? await getProgressByUser(userId) : null

  const videoDoc: VideoDoc | null = lesson.videoUrl ? await getVideoDocByUrl(lesson.videoUrl) : null

  const completedIds = new Set((progress?.completedLessons ?? []).map((l) => l._id))
  const isCompleted = completedIds.has(lesson._id)

  const allLessons = program.modules.flatMap((m) => m.lessons)
  const totalLessons = allLessons.length
  const completedCount = allLessons.filter((l) => completedIds.has(l._id)).length
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  let currentModuleIdx = -1
  let currentLessonIdx = -1
  for (let mi = 0; mi < program.modules.length; mi++) {
    const li = program.modules[mi].lessons.findIndex((l) => l._id === lesson._id)
    if (li >= 0) {
      currentModuleIdx = mi
      currentLessonIdx = li
      break
    }
  }

  const moduleNumber = currentModuleIdx + 1
  const lessonNumber = currentLessonIdx + 1
  const moduleLessonLabel = `${lessonNumber} of ${program.modules[currentModuleIdx]?.lessons.length ?? 0} in this module`

  const lastPositionLessonId = progress?.lastPosition?.lesson._id
  const resumeSeconds = lesson._id === lastPositionLessonId
    ? progress?.lastPosition?.positionSeconds
    : t
      ? parseInt(t, 10)
      : undefined

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <nav className="mb-6 flex items-center gap-2 text-[13px]" style={{ color: "#94A3B8" }}>
            <Link href="/catalog" className="transition-colors hover:text-[#3B82F6]">Catalog</Link>
            <span>/</span>
            <Link href={`/catalog/${program.slug.current}`} className="transition-colors hover:text-[#3B82F6]">{program.title}</Link>
            <span>/</span>
            <span style={{ color: "#111827" }}>{lesson.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
            <div className="min-w-0">
              <VideoPlayer
                videoUrl={lesson.videoUrl ?? ""}
                posterImage={lesson.posterImage}
                title={lesson.title}
                duration={lesson.duration}
                moduleLessonLabel={moduleLessonLabel}
                positionInSeconds={resumeSeconds}
                lessonId={lesson._id}
              />

              <div className="mt-2 h-1 w-full overflow-hidden rounded-full" style={{ backgroundColor: "#E5E7EB" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${resumeSeconds && lesson.duration ? Math.min((resumeSeconds / lesson.duration) * 100, 100) : 0}%`,
                    backgroundColor: "#3B82F6",
                  }}
                />
              </div>
              {resumeSeconds && lesson.duration && (
                <p className="mt-1 text-[12px]" style={{ color: "#3B82F6" }}>
                  {Math.round((resumeSeconds / lesson.duration) * 100)}% watched
                </p>
              )}

              <div className="mt-6">
              <LessonPageClient
                lessonId={lesson._id}
                lessonTitle={lesson.title}
                moduleNumber={moduleNumber}
                lessonNumber={lessonNumber}
                duration={lesson.duration}
                employeeCount={lesson.employeeCount}
                requiredBy={program.requiredBy}
                isCompleted={isCompleted}
                resumeSeconds={resumeSeconds}
                keyPoints={lesson.keyPoints}
                notes={lesson.notes}
                proTip={lesson.proTip}
                resources={lesson.resources}
                chunks={videoDoc?.chunks}
              />
              </div>

              <LessonNavigation program={program} currentLessonId={lesson._id} />
            </div>

            <aside className="hidden lg:block">
              <LessonSidebar
                program={program}
                currentLessonId={lesson._id}
                completedIds={completedIds}
                lastPositionLessonId={lastPositionLessonId}
                percent={percent}
                completedCount={completedCount}
                totalLessons={totalLessons}
              />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
