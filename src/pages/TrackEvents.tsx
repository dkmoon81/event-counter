import { useState, useEffect } from 'react'
import type { EventItem } from '../api.ts'
import { fetchEvents, incrementEvent, decrementEvent } from '../api.ts'
import WeekChart from '../components/WeekChart.tsx'

export default function TrackEvents() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [chartKey, setChartKey] = useState(0)

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

  async function handleIncrement(id: string) {
    try {
      const updated = await incrementEvent(id)
      setEvents(prev => prev.map(e => e.id === id ? updated : e))
      setChartKey(k => k + 1)
    } catch {
      setError('Failed to increment')
    }
  }

  async function handleDecrement(id: string) {
    try {
      const updated = await decrementEvent(id)
      setEvents(prev => prev.map(e => e.id === id ? updated : e))
      setChartKey(k => k + 1)
    } catch {
      setError('Failed to decrement')
    }
  }

  function toggleChart(id: string) {
    setExpandedId(prev => prev === id ? null : id)
  }

  if (loading) return <p className="center">Loading...</p>

  return (
    <div className="track-page">
      <h2>Track Events</h2>
      {error && <p className="error">{error}</p>}
      {events.length === 0 ? (
        <p className="center">No events yet. Go to Manage to create one!</p>
      ) : (
        <div className="event-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-icon">
                {event.icon ? (
                  <span className="icon-display">{event.icon}</span>
                ) : (
                  <span className="icon-placeholder">📊</span>
                )}
              </div>
              <h3>{event.name}</h3>
              <div className="today-label">Today</div>
              <div className="counter">
                <button
                  className="btn btn-decrement"
                  onClick={() => handleDecrement(event.id)}
                  disabled={event.count === 0}
                >
                  −
                </button>
                <span className="count">{event.count}</span>
                <button
                  className="btn btn-increment"
                  onClick={() => handleIncrement(event.id)}
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-chart-toggle"
                onClick={() => toggleChart(event.id)}
              >
                {expandedId === event.id ? 'Hide 7-Day History' : 'Show 7-Day History'}
              </button>
              {expandedId === event.id && (
                <WeekChart key={`${event.id}-${chartKey}`} eventId={event.id} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
