export interface EmojiEntry {
  emoji: string
  name: string
}

const CDN_URL = 'https://cdn.jsdelivr.net/npm/unicode-emoji-json@0.6.0/data-by-emoji.json'

interface CdnEmojiData {
  [emoji: string]: {
    name: string
    group: string
    emoji_version: string
    unicode_version: string
    skin_tone_support: boolean
  }
}

let cache: EmojiEntry[] | null = null
let fetchPromise: Promise<EmojiEntry[]> | null = null

export function prefetchEmojis(): void {
  if (cache || fetchPromise) return
  fetchPromise = fetch(CDN_URL)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load emoji data')
      return res.json() as Promise<CdnEmojiData>
    })
    .then(data => {
      cache = Object.entries(data).map(([emoji, info]) => ({
        emoji,
        name: info.name,
      }))
      return cache
    })
    .catch(() => {
      fetchPromise = null
      return [] as EmojiEntry[]
    })
}

export function getEmojiCache(): EmojiEntry[] {
  return cache ?? []
}

export function searchEmoji(query: string): EmojiEntry[] {
  const all = getEmojiCache()
  if (all.length === 0) return []
  if (!query.trim()) return all.slice(0, 30)
  const words = query.toLowerCase().trim().split(/\s+/)
  return all.filter(entry => {
    const name = entry.name.toLowerCase()
    return words.every(w => name.includes(w))
  }).slice(0, 30)
}
