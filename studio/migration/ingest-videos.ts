#!/usr/bin/env npx tsx
/**
 * Video ingestion pipeline: fetches real YouTube transcripts and chapter markers,
 * then creates/updates video documents in Sanity.
 *
 * Usage:
 *   npx tsx migration/ingest-videos.ts --all
 *   npx tsx migration/ingest-videos.ts --video-url "https://youtube.com/watch?v=..."
 *   npx tsx migration/ingest-videos.ts --all --dry-run
 *   npx tsx migration/ingest-videos.ts --all --limit 5
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@sanity/client'
import { YoutubeTranscript, type TranscriptResponse } from 'youtube-transcript'
import { projectId, dataset, apiVersion } from '../env'

// ---------------------------------------------------------------------------
// Load .env.local (tsx doesn't load it like Next.js does)
// ---------------------------------------------------------------------------

function loadEnvLocal() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const envPath = path.resolve(__dirname, '../../.env.local')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let value = trimmed.slice(eqIdx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvLocal()

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const WRITE_TOKEN = process.env.SANITY_API_TOKEN
const CHUNK_DURATION_SECONDS = 120
const SYNTHETIC_CHAPTER_SECONDS = 300

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface IngestedChapter {
  startSeconds: number
  label: string
}

interface IngestedChunk {
  startSeconds: number
  text: string
}

interface ParsedArgs {
  all: boolean
  videoUrl: string | null
  dryRun: boolean
  limit: number | null
}

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2)
  const result: ParsedArgs = { all: false, videoUrl: null, dryRun: false, limit: null }

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--all') result.all = true
    else if (args[i] === '--dry-run') result.dryRun = true
    else if (args[i] === '--video-url' && args[i + 1]) result.videoUrl = args[++i]
    else if (args[i] === '--limit' && args[i + 1]) result.limit = parseInt(args[++i], 10)
  }

  if (!result.all && !result.videoUrl) {
    console.error('Usage: npx tsx ingest-videos.ts --all [--dry-run] [--limit N]')
    console.error('       npx tsx ingest-videos.ts --video-url <url> [--dry-run]')
    process.exit(1)
  }

  return result
}

// ---------------------------------------------------------------------------
// YouTube helpers
// ---------------------------------------------------------------------------

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

async function fetchTranscript(videoId: string): Promise<TranscriptResponse[]> {
  try {
    return await YoutubeTranscript.fetchTranscript(videoId)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('disabled') || msg.includes('not available')) {
      console.warn(`  Transcript not available for ${videoId}`)
      return []
    }
    console.warn(`  Transcript fetch error for ${videoId}: ${msg}`)
    return []
  }
}

async function fetchChaptersFromPage(videoId: string): Promise<IngestedChapter[]> {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })
    if (!res.ok) return []
    const html = await res.text()

    // YouTube embeds chapter data in a microformat or playerOverlays JSON blob.
    // Look for chapterRenderer objects in the page source.
    const chapters: IngestedChapter[] = []
    const chapterRegex =
      /"chapterRenderer":\s*\{[^}]*"title":\s*\{[^}]*"simpleText":\s*"([^"]*)"[^}]*\}[^}]*"timeRangeStartMillis":\s*(\d+)/g
    let match: RegExpExecArray | null
    while ((match = chapterRegex.exec(html)) !== null) {
      const label = match[1]
      const startMs = parseInt(match[2], 10)
      if (label && !isNaN(startMs)) {
        chapters.push({ startSeconds: Math.floor(startMs / 1000), label })
      }
    }

    // Deduplicate by startSeconds
    const seen = new Set<number>()
    return chapters.filter((c) => {
      if (seen.has(c.startSeconds)) return false
      seen.add(c.startSeconds)
      return true
    })
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Transcript processing
// ---------------------------------------------------------------------------

function chunkTranscript(
  entries: TranscriptResponse[],
  chunkDurationSeconds: number = CHUNK_DURATION_SECONDS
): IngestedChunk[] {
  if (entries.length === 0) return []

  const chunks: IngestedChunk[] = []
  let currentChunkStart = 0
  let currentTexts: string[] = []

  for (const entry of entries) {
    const entryStartSeconds = entry.offset / 1000

    // If this entry starts beyond the current chunk boundary, flush
    if (entryStartSeconds >= currentChunkStart + chunkDurationSeconds && currentTexts.length > 0) {
      chunks.push({
        startSeconds: currentChunkStart,
        text: currentTexts.join(' ').trim(),
      })
      currentChunkStart = Math.floor(entryStartSeconds / chunkDurationSeconds) * chunkDurationSeconds
      currentTexts = []
    }

    // If there's a gap, start a new chunk at the entry's position
    if (entryStartSeconds >= currentChunkStart + chunkDurationSeconds) {
      currentChunkStart = Math.floor(entryStartSeconds / chunkDurationSeconds) * chunkDurationSeconds
      currentTexts = []
    }

    currentTexts.push(entry.text)
  }

  // Flush remaining
  if (currentTexts.length > 0) {
    chunks.push({
      startSeconds: currentChunkStart,
      text: currentTexts.join(' ').trim(),
    })
  }

  return chunks
}

function normalizeChapters(rawChapters: IngestedChapter[]): IngestedChapter[] {
  if (rawChapters.length === 0) return []

  // Sort by start time
  const sorted = [...rawChapters].sort((a, b) => a.startSeconds - b.startSeconds)

  // Filter out chapters with empty or whitespace-only labels
  return sorted.filter((c) => c.label.trim().length > 0)
}

function generateSyntheticChapters(totalDurationSeconds: number): IngestedChapter[] {
  const chapters: IngestedChapter[] = []
  let t = 0
  let section = 1
  while (t < totalDurationSeconds) {
    chapters.push({ startSeconds: t, label: `Section ${section}` })
    t += SYNTHETIC_CHAPTER_SECONDS
    section++
  }
  return chapters
}

// ---------------------------------------------------------------------------
// Sanity operations
// ---------------------------------------------------------------------------

function getSanityClient() {
  if (!WRITE_TOKEN) {
    console.error('Error: SANITY_API_TOKEN env var is required for ingestion.')
    console.error('Create a token at https://sanity.io/manage → Project → API → Tokens')
    process.exit(1)
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: WRITE_TOKEN,
  })
}

async function fetchAllLessons(client: ReturnType<typeof getSanityClient>) {
  return client.fetch<Array<{ _id: string; videoUrl: string; title: string }>>(
    `*[_type == "lesson" && defined(videoUrl)]{ _id, videoUrl, title }`
  )
}

async function createOrUpdateVideo(
  client: ReturnType<typeof getSanityClient>,
  videoId: string,
  videoUrl: string,
  chapters: IngestedChapter[],
  chunks: IngestedChunk[],
  dryRun: boolean
): Promise<string> {
  if (dryRun) {
    console.log(`  [DRY RUN] Would create/update video "${videoId}" with ${chapters.length} chapters, ${chunks.length} chunks`)
    return videoId
  }

  // Check if video already exists with transcript data — don't overwrite good data with empty
  const existing = await client.fetch<{ _id: string; chunks?: Array<{ text: string }> } | null>(
    `*[_type == "video" && videoId == $videoId][0]{ _id, chunks }`,
    { videoId }
  )

  if (existing && existing.chunks && existing.chunks.length > 0 && chunks.length === 0) {
    console.log(`  Skipping ${videoId}: already has ${existing.chunks.length} chunks, new fetch has 0`)
    return videoId
  }

  const doc = {
    _id: videoId,
    _type: 'video' as const,
    videoId,
    videoUrl,
    chapters: chapters.map((c, i) => ({
      _key: `ch-${i}`,
      startSeconds: c.startSeconds,
      label: c.label,
    })),
    chunks: chunks.map((c, i) => ({
      _key: `ck-${i}`,
      startSeconds: c.startSeconds,
      text: c.text,
    })),
  }

  await client.createOrReplace(doc)
  return videoId
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function ingestSingleVideo(
  client: ReturnType<typeof getSanityClient>,
  videoUrl: string,
  dryRun: boolean
): Promise<{ success: boolean; videoId: string; chapters: number; chunks: number }> {
  const videoId = extractVideoId(videoUrl)
  if (!videoId) {
    console.warn(`  Could not extract video ID from: ${videoUrl}`)
    return { success: false, videoId: '', chapters: 0, chunks: 0 }
  }

  console.log(`  Processing ${videoId}...`)

  // Fetch transcript and chapters in parallel
  const [transcriptEntries, rawChapters] = await Promise.all([
    fetchTranscript(videoId),
    fetchChaptersFromPage(videoId),
  ])

  const chapters = normalizeChapters(rawChapters)
  const chunks = chunkTranscript(transcriptEntries)

  if (chapters.length === 0 && chunks.length === 0) {
    console.warn(`  Skipping ${videoId}: no transcript and no chapters available`)
    return { success: false, videoId, chapters: 0, chunks: 0 }
  }

  // If no chapters but we have transcript, generate synthetic chapters
  let finalChapters = chapters
  if (chapters.length === 0 && chunks.length > 0) {
    const lastChunk = chunks[chunks.length - 1]
    const estimatedDuration = lastChunk.startSeconds + CHUNK_DURATION_SECONDS
    finalChapters = generateSyntheticChapters(estimatedDuration)
    console.log(`  Generated ${finalChapters.length} synthetic chapters (no YouTube chapters found)`)
  }

  await createOrUpdateVideo(client, videoId, videoUrl, finalChapters, chunks, dryRun)

  console.log(`  ✓ ${videoId}: ${finalChapters.length} chapters, ${chunks.length} chunks`)
  return { success: true, videoId, chapters: finalChapters.length, chunks: chunks.length }
}

async function main() {
  const args = parseArgs()
  const client = getSanityClient()

  console.log('Video Ingestion Pipeline')
  console.log(`Project: ${projectId}, Dataset: ${dataset}`)
  if (args.dryRun) console.log('Mode: DRY RUN (no changes will be written)')
  console.log('')

  let videoUrls: string[] = []

  if (args.videoUrl) {
    videoUrls = [args.videoUrl]
  } else if (args.all) {
    console.log('Fetching lessons from Sanity...')
    const lessons = await fetchAllLessons(client)
    console.log(`Found ${lessons.length} lessons with video URLs`)

    // Deduplicate by URL
    const seen = new Set<string>()
    for (const lesson of lessons) {
      if (!seen.has(lesson.videoUrl)) {
        seen.add(lesson.videoUrl)
        videoUrls.push(lesson.videoUrl)
      }
    }
    console.log(`Unique video URLs: ${videoUrls.length}`)
  }

  if (args.limit && args.limit > 0) {
    videoUrls = videoUrls.slice(0, args.limit)
    console.log(`Limited to ${videoUrls.length} videos`)
  }

  console.log('')
  console.log('Processing videos...')
  console.log('─'.repeat(50))

  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  for (let i = 0; i < videoUrls.length; i++) {
    const url = videoUrls[i]
    console.log(`[${i + 1}/${videoUrls.length}] ${url}`)

    try {
      const result = await ingestSingleVideo(client, url, args.dryRun)
      if (result.success) successCount++
      else skipCount++
    } catch (err) {
      console.error(`  ✗ Error: ${err instanceof Error ? err.message : err}`)
      errorCount++
    }

    // Delay between requests to avoid YouTube rate limiting
    if (i < videoUrls.length - 1) {
      await sleep(5000)
    }
  }

  console.log('')
  console.log('─'.repeat(50))
  console.log('Summary:')
  console.log(`  Processed: ${successCount}`)
  console.log(`  Skipped:   ${skipCount}`)
  console.log(`  Errors:    ${errorCount}`)
  console.log(`  Total:     ${videoUrls.length}`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
