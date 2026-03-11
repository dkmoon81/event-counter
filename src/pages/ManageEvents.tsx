import { useState, useEffect, useRef } from 'react'
import type { EventItem } from '../api.ts'
import { fetchEvents, createEvent, updateEvent, deleteEvent, reorderEvents } from '../api.ts'
import EventForm from '../components/EventForm.tsx'

export default function ManageEvents() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const dragItemRef = useRef<number | null>(null)

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

  function handleDragStart(e: React.DragEvent, index: number) {
    dragItemRef.current = index
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOverIndex(index)
  }

  function handleDragLeave() {
    setOverIndex(null)
  }

  async function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault()
    const fromIndex = dragItemRef.current
    if (fromIndex === null || fromIndex === dropIndex) {
      resetDragState()
      return
    }

    const reordered = [...events]
    const [removed] = reordered.splice(fromIndex, 1)
    reordered.splice(dropIndex, 0, removed)

    resetDragState()
    setEvents(reordered)

    try {
      await reorderEvents(reordered.map(ev => ev.id))
    } catch {
      setError('Failed to save order')
      await loadEvents()
    }
  }

  function resetDragState() {
    dragItemRef.current = null
    setDragIndex(null)
    setOverIndex(null)
  }

  function getRowClassName(index: number) {
    let cls = 'event-row'
    if (dragIndex === index) cls += ' dragging'
    if (overIndex === index && dragIndex !== index) cls += ' drag-over'
    return cls
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
          {events.map((event, index) => (
            <div
              key={event.id}
              className={getRowClassName(index)}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={resetDragState}
            >
              <span className="drag-handle" title="Drag to reorder">⠿</span>
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
