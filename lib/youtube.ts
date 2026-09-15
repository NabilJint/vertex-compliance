export function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function getYouTubeEmbedUrl(url: string, startSeconds?: number): string | null {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null
  const params = new URLSearchParams({ rel: "0" })
  if (startSeconds && startSeconds > 0) {
    params.set("start", String(Math.floor(startSeconds)))
  }
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}
