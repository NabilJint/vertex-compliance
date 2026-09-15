import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { TrainingHero } from "@/components/training/hero"
import { WhatYouLearn } from "@/components/training/what-you-learn"
import { Curriculum, type CurriculumModule } from "@/components/training/curriculum"
import { Instructor } from "@/components/training/instructor"
import { RelatedTraining } from "@/components/training/related-training"
import { PageTracker } from "@/components/analytics/page-tracker"
import { getTrainingProgramBySlug, getRelatedTrainingPrograms, getProgressByUser } from "@/lib/sanity"
import type { LessonStatus, LessonSummary, UserProgress } from "@/lib/types"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function TrainingProgramPage({ params }: PageProps) {
  const { slug } = await params
  const program = await getTrainingProgramBySlug(slug)

  if (!program) notFound()

  const { userId } = await auth()
  const progress: UserProgress | null = userId ? await getProgressByUser(userId) : null

  const completedIds = new Set((progress?.completedLessons ?? []).map((lesson) => lesson._id))
  const lastPositionLessonId = progress?.lastPosition?.lesson._id

  const allLessons: LessonSummary[] = program.modules.flatMap((module) => module.lessons)
  const totalLessons = allLessons.length
  const totalDurationSeconds = allLessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)
  const completedCount = allLessons.filter((lesson) => completedIds.has(lesson._id)).length
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  function statusFor(lessonId: string): LessonStatus {
    if (completedIds.has(lessonId)) return "completed"
    if (lessonId === lastPositionLessonId) return "in-progress"
    return "not-started"
  }

  const previewLesson = allLessons.find((lesson) => lesson.isFreePreview) ?? null

  const lastPositionInProgram = allLessons.find((lesson) => lesson._id === lastPositionLessonId)
  const firstIncompleteLesson = allLessons.find((lesson) => !completedIds.has(lesson._id))
  const resumeLesson = lastPositionInProgram ?? firstIncompleteLesson ?? allLessons[0] ?? null
  const resumeSeconds = lastPositionInProgram ? progress?.lastPosition?.positionSeconds : undefined

  const startLessonHref = resumeLesson
    ? resumeSeconds
      ? `/lessons/${resumeLesson.slug.current}?t=${resumeSeconds}`
      : `/lessons/${resumeLesson.slug.current}`
    : "/catalog"

  const ctaLabel = lastPositionInProgram ? "Resume training" : completedCount > 0 && completedCount === totalLessons ? "Review training" : "Start training"

  const curriculumModules: CurriculumModule[] = program.modules.map((module) => ({
    key: module._key,
    title: module.title,
    summary: module.summary,
    lessons: module.lessons.map((lesson) => ({
      id: lesson._id,
      slug: lesson.slug.current,
      title: lesson.title,
      duration: lesson.duration || 0,
      isFreePreview: Boolean(lesson.isFreePreview),
      status: statusFor(lesson._id),
      resumeSeconds: lesson._id === lastPositionLessonId ? progress?.lastPosition?.positionSeconds : undefined,
    })),
  }))

  const relatedPrograms = await getRelatedTrainingPrograms(program.category._id, program._id)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PageTracker
        event="training_program_viewed"
        properties={{
          program_id: program._id,
          program_slug: program.slug.current,
          category: program.category.slug?.current ?? "unknown",
        }}
      />
      <main className="flex-1">
        <TrainingHero
          program={program}
          totalDurationSeconds={totalDurationSeconds}
          totalLessons={totalLessons}
          previewLesson={previewLesson}
          startLessonHref={startLessonHref}
        />
        <WhatYouLearn outcomes={program.learningOutcomes ?? []} />
        <Curriculum
          modules={curriculumModules}
          totalLessons={totalLessons}
          totalDurationSeconds={totalDurationSeconds}
          completedCount={completedCount}
          percent={percent}
          resumeHref={startLessonHref}
          ctaLabel={ctaLabel}
        />
        <Instructor trainer={program.trainer} />
        <RelatedTraining programs={relatedPrograms} />
      </main>
      <Footer />
    </div>
  )
}
