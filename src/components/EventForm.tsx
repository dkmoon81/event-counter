import { useState, useRef, useEffect } from 'react'
import { searchEmoji } from '../emojiData.ts'

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
  const pickerRef = useRef<HTMLDivElement>(null)

  const results = searchEmoji(search)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setIcon(''); setShowPicker(true); }}>Change</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={clearIcon}>Remove</button>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setShowPicker(true); }}
              onFocus={() => setShowPicker(true)}
              placeholder="Search emoji... (e.g. coffee, run, book)"
              autoComplete="off"
            />
            {showPicker && (
              <div className="emoji-picker">
                {results.length === 0 ? (
                  <p className="emoji-picker-empty">No matching emoji</p>
                ) : (
                  <div className="emoji-picker-grid">
                    {results.map(entry => (
                      <button
                        key={entry.emoji}
                        type="button"
                        className="emoji-picker-item"
                        onClick={() => selectEmoji(entry.emoji)}
                        title={entry.keywords.join(', ')}
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
