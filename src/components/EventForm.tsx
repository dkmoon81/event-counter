import { useState } from 'react'

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit(name.trim(), icon)
    if (submitLabel === 'Create') {
      setName('')
      setIcon('')
    }
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
      <div className="form-group">
        <label htmlFor="event-icon">Icon (emoji)</label>
        <input
          id="event-icon"
          type="text"
          value={icon}
          onChange={e => setIcon(e.target.value)}
          placeholder="e.g. 💪 ☕ 🏃"
          maxLength={4}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
