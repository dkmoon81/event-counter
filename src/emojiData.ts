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

export async function loadEmojiData(): Promise<EmojiEntry[]> {
  if (cache) return cache

  const res = await fetch(CDN_URL)
  if (!res.ok) throw new Error('Failed to load emoji data')
  const data: CdnEmojiData = await res.json()

  cache = Object.entries(data).map(([emoji, info]) => ({
    emoji,
    name: info.name,
  }))
  return cache
}

export function searchEmoji(allEmojis: EmojiEntry[], query: string): EmojiEntry[] {
  if (!query.trim()) return allEmojis.slice(0, 30)
  const words = query.toLowerCase().trim().split(/\s+/)
  return allEmojis.filter(entry => {
    const name = entry.name.toLowerCase()
    return words.every(w => name.includes(w))
  }).slice(0, 30)
}
