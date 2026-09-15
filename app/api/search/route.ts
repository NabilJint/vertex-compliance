import { NextRequest, NextResponse } from "next/server"
import { SEARCH_SYSTEM_PROMPT } from "@/lib/search-prompts"
import type { SearchResponse, SearchResult } from "@/lib/search-types"

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const SANITY_TOKEN = process.env.SANITY_API_TOKEN
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL

let cachedInitialContext: string | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 5 * 60 * 1000

async function fetchInitialContext(): Promise<string> {
  const now = Date.now()
  if (cachedInitialContext && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedInitialContext
  }
  const mcpUrl = process.env.SANITY_CONTEXT_MCP_URL
  if (!mcpUrl || !SANITY_TOKEN) return ""
  const res = await fetch(`${mcpUrl}/initial-context`, {
    headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
  })
  if (!res.ok) return ""
  const text = await res.text()
  cachedInitialContext = text
  cacheTimestamp = now
  return text
}

async function sanityFetch(query: string): Promise<unknown> {
  if (!PROJECT_ID || !DATASET || !SANITY_TOKEN) {
    throw new Error("Sanity not configured")
  }
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2026-09-13/data/query/${DATASET}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SANITY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    console.error("GROQ failed:", err)
    return []
  }
  const data = await res.json()
  return data.result
}

async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!OPENAI_API_KEY || !OPENAI_BASE_URL) {
    throw new Error("LLM not configured")
  }
  const res = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LLM error ${res.status}: ${err.substring(0, 200)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ""
}

function extractKeywords(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)
}

function buildLessonQuery(keywords: string[]): string {
  const matchClauses = keywords
    .map((k) => `title match "*${k}*" || pt::text(notes) match "*${k}*"`)
    .join(" || ")
  return `*[_type == "lesson" && (${matchClauses})] {
    _id, title, slug, duration, keyPoints, videoUrl,
    "program": *[_type == "trainingProgram" && references(^._id)][0] {
      title, slug,
      modules[] {
        title,
        lessons[]-> { _id, title, slug, duration }
      }
    }
  }[0...20]`
}

function buildVideoQuery(keywords: string[]): string {
  const chapterMatch = keywords.map((k) => `label match "*${k}*"`).join(" || ")
  const chunkMatch = keywords.map((k) => `text match "*${k}*"`).join(" || ")
  return `*[_type == "video"] {
    _id, videoUrl,
    chapters[${chapterMatch}] { startSeconds, label },
    chunks[${chunkMatch}] { startSeconds, text }
  }[0...10]`
}

function findModulePosition(
  modules: Array<{ title: string; lessons: Array<{ _id: string }> }>,
  lessonId: string
): { moduleLabel: string; lessonLabel: string } {
  for (let mi = 0; mi < modules.length; mi++) {
    const mod = modules[mi]
    const idx = mod.lessons.findIndex((l) => l._id === lessonId)
    if (idx >= 0) {
      return {
        moduleLabel: `Module ${mi + 1}`,
        lessonLabel: `Lesson ${mi + 1}.${idx + 1}`,
      }
    }
  }
  return { moduleLabel: "", lessonLabel: "" }
}

function buildRawResults(
  lessonResults: Array<Record<string, unknown>>,
  videoResults: Array<Record<string, unknown>>
): SearchResult[] {
  const results: SearchResult[] = []

  for (const lesson of lessonResults) {
    const slug = lesson.slug as { current: string } | undefined
    const program = lesson.program as Record<string, unknown> | undefined
    if (!slug?.current || !program) continue
    const modules = (program.modules as Array<{ title: string; lessons: Array<{ _id: string }> }>) || []
    const { moduleLabel, lessonLabel } = findModulePosition(modules, lesson._id as string)
    results.push({
      type: "lesson",
      trainingProgram: {
        name: (program.title as string) || "",
        slug: ((program.slug as { current: string })?.current) || "",
      },
      moduleLabel,
      lessonLabel,
      lessonSlug: slug.current,
      keyPoints: ((lesson.keyPoints as string[]) || []).slice(0, 4),
      description: lesson.title as string,
    })
  }

  for (const video of videoResults) {
    const videoUrl = video.videoUrl as string
    const chapters = (video.chapters as Array<{ startSeconds: number; label: string }>) || []
    const chunks = (video.chunks as Array<{ startSeconds: number; text: string }>) || []
    const linkedLesson = lessonResults.find((l) => l.videoUrl === videoUrl)
    if (!linkedLesson) continue
    const slug = linkedLesson.slug as { current: string } | undefined
    const program = linkedLesson.program as Record<string, unknown> | undefined
    if (!slug?.current || !program) continue
    const modules = (program.modules as Array<{ title: string; lessons: Array<{ _id: string }> }>) || []
    const { moduleLabel, lessonLabel } = findModulePosition(modules, linkedLesson._id as string)

    for (const chapter of chapters) {
      results.push({
        type: "video",
        trainingProgram: {
          name: (program.title as string) || "",
          slug: ((program.slug as { current: string })?.current) || "",
        },
        moduleLabel,
        lessonLabel,
        lessonSlug: slug.current,
        clipLength: "2:00",
        description: `${chapter.label} — ${linkedLesson.title}`,
        matchedSecond: chapter.startSeconds,
      })
    }

    for (const chunk of chunks.slice(0, 3)) {
      const alreadyHasVideo = results.some(
        (r) =>
          r.type === "video" &&
          r.lessonSlug === slug.current &&
          Math.abs(r.matchedSecond - chunk.startSeconds) < 10
      )
      if (alreadyHasVideo) continue
      results.push({
        type: "video",
        trainingProgram: {
          name: (program.title as string) || "",
          slug: ((program.slug as { current: string })?.current) || "",
        },
        moduleLabel,
        lessonLabel,
        lessonSlug: slug.current,
        clipLength: "2:00",
        description: chunk.text.substring(0, 120) + (chunk.text.length > 120 ? "..." : ""),
        matchedSecond: chunk.startSeconds,
      })
    }
  }

  return results
}

function parseSearchResponse(text: string, query: string): SearchResponse {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return { query, totalCount: 0, results: [] }
  }
  const jsonStr = jsonMatch[1] || jsonMatch[0]
  try {
    const parsed = JSON.parse(jsonStr)
    return {
      query: parsed.query || query,
      totalCount: parsed.totalCount ?? parsed.results?.length ?? 0,
      results: Array.isArray(parsed.results) ? parsed.results : [],
    }
  } catch {
    return { query, totalCount: 0, results: [] }
  }
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { query } = body as { query?: string }

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 })
  }

  if (query.length > 500) {
    return NextResponse.json({ error: "Query too long (max 500 characters)" }, { status: 400 })
  }

  try {
    const keywords = extractKeywords(query.trim())
    if (keywords.length === 0) {
      return NextResponse.json({ query: query.trim(), totalCount: 0, results: [] })
    }

    const lessonQuery = buildLessonQuery(keywords)
    const videoQuery = buildVideoQuery(keywords)

    const [lessonResults, videoResults, initialContext] = await Promise.all([
      sanityFetch(lessonQuery) as Promise<Array<Record<string, unknown>>>,
      sanityFetch(videoQuery) as Promise<Array<Record<string, unknown>>>,
      fetchInitialContext(),
    ])

    const rawResults = buildRawResults(lessonResults, videoResults)

    if (rawResults.length === 0) {
      return NextResponse.json({ query: query.trim(), totalCount: 0, results: [] })
    }

    const rawJson = JSON.stringify(rawResults, null, 2)

    const systemPrompt = `${SEARCH_SYSTEM_PROMPT}\n\n## Schema Context\n${initialContext}`

    const llmPrompt = `The user searched for: "${query.trim()}"

Here are the raw search results from the training content database:
${rawJson}

Your task:
1. Review these results and rank them by relevance to the query
2. Improve the descriptions to be more informative and specific to the query
3. Remove any results that are not actually relevant
4. Keep the exact same data structure — do not invent new training programs, lessons, or timestamps
5. Return a JSON object with this exact structure:

{
  "query": "${query.trim()}",
  "totalCount": <number of results after your filtering>,
  "results": [ ...filtered and improved results... ]
}

Rules:
- Keep ALL lesson results that are genuinely relevant
- Keep video results that match the query topic
- Improve descriptions to be specific to the user's search intent
- Do NOT change slugs, timestamps, or structural data
- Do NOT invent data that isn't in the raw results
- Return ONLY the JSON object, nothing else`

    const llmResponse = await callLLM(systemPrompt, llmPrompt)
    const searchResponse = parseSearchResponse(llmResponse, query.trim())

    return NextResponse.json(searchResponse)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    )
  }
}
