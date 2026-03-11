import { useState, useEffect } from 'react'
import type { EventItem } from '../api.ts'
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../api.ts'
import EventForm from '../components/EventForm.tsx'

export default function ManageEvents() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      setLoading(true)
      setError('')
      const data = await fetchEvents()
      setEvents(data)
    } catch {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(name: string, icon: string) {
    try {
      setError('')
      const event = await createEvent(name, icon)
      setEvents(prev => [...prev, event])
    } catch {
      setError('Failed to create event')
    }
  }

  async function handleUpdate(name: string, icon: string) {
    if (!editingEvent) return
    try {
      setError('')
      const updated = await updateEvent(editingEvent.id, name, icon)
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? updated : e))
      setEditingEvent(null)
    } catch {
      setError('Failed to update event')
    }
  }

  async function handleDelete(id: string) {
    try {
      setError('')
      await deleteEvent(id)
      setEvents(prev => prev.filter(e => e.id !== id))
      if (editingEvent?.id === id) setEditingEvent(null)
    } catch {
      setError('Failed to delete event')
    }
  }

  if (loading) return <p className="center">Loading...</p>

  return (
    <div className="manage-page">
      <h2>{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
      {error && <p className="error">{error}</p>}
      <EventForm
        key={editingEvent?.id ?? 'new'}
        initialName={editingEvent?.name ?? ''}
        initialIcon={editingEvent?.icon ?? ''}
        submitLabel={editingEvent ? 'Update' : 'Create'}
        onSubmit={editingEvent ? handleUpdate : handleCreate}
        onCancel={editingEvent ? () => setEditingEvent(null) : undefined}
      />

      <h2>Your Events</h2>
      {events.length === 0 ? (
        <p className="center">No events yet. Create one above!</p>
      ) : (
        <div className="event-list">
          {events.map(event => (
            <div key={event.id} className="event-row">
              <span className="event-row-icon">
                {event.icon || '📊'}
              </span>
              <span className="event-row-name">{event.name}</span>
              <span className="event-row-count">Count: {event.count}</span>
              <div className="event-row-actions">
                <button className="btn btn-edit" onClick={() => setEditingEvent(event)}>Edit</button>
                <button className="btn btn-delete" onClick={() => handleDelete(event.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
