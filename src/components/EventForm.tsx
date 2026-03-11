import { useState, useRef, useEffect } from 'react'
import type { EmojiEntry } from '../emojiData.ts'
import { loadEmojiData, searchEmoji } from '../emojiData.ts'

interface EventFormProps {
  initialName: string
  initialIcon: string
  submitLabel: string
  onSubmit: (name: string, icon: string) => void
  onCancel?: () => void
}

export default function EventForm({ initialName, initialIcon, submitLabel, onSubmit, onCancel }: EventFormProps) {
  const [name, setName] = useState(initialName)
  const [icon, setIcon] = useState(initialIcon)
  const [search, setSearch] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [allEmojis, setAllEmojis] = useState<EmojiEntry[]>([])
  const [emojiLoading, setEmojiLoading] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  const results = allEmojis.length > 0 ? searchEmoji(allEmojis, search) : []

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function ensureEmojisLoaded() {
    if (allEmojis.length > 0) return
    setEmojiLoading(true)
    try {
      const data = await loadEmojiData()
      setAllEmojis(data)
    } catch {
      // Silently fail — picker will show empty
    } finally {
      setEmojiLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit(name.trim(), icon)
    if (submitLabel === 'Create') {
      setName('')
      setIcon('')
      setSearch('')
    }
  }

  function selectEmoji(emoji: string) {
    setIcon(emoji)
    setShowPicker(false)
    setSearch('')
  }

  function clearIcon() {
    setIcon('')
    setSearch('')
  }

  async function openPicker() {
    setShowPicker(true)
    await ensureEmojisLoaded()
  }

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="event-name">Event Name *</label>
        <input
          id="event-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Push-ups, Coffee cups"
          required
        />
      </div>
      <div className="form-group" ref={pickerRef}>
        <label>Icon</label>
        {icon ? (
          <div className="emoji-selected">
            <span className="emoji-selected-icon">{icon}</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setIcon(''); openPicker(); }}>Change</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={clearIcon}>Remove</button>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); openPicker(); }}
              onFocus={() => openPicker()}
              placeholder="Search emoji... (e.g. coffee, run, book)"
              autoComplete="off"
            />
            {showPicker && (
              <div className="emoji-picker">
                {emojiLoading ? (
                  <p className="emoji-picker-empty">Loading emoji...</p>
                ) : results.length === 0 ? (
                  <p className="emoji-picker-empty">No matching emoji</p>
                ) : (
                  <div className="emoji-picker-grid">
                    {results.map(entry => (
                      <button
                        key={entry.emoji}
                        type="button"
                        className="emoji-picker-item"
                        onClick={() => selectEmoji(entry.emoji)}
                        title={entry.name}
                      >
                        {entry.emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
