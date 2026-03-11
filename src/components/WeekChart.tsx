import { useState, useEffect } from 'react'
import type { DailyCount } from '../api.ts'
import { fetchEventHistory } from '../api.ts'

interface WeekChartProps {
  eventId: string
}

function formatDay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

export default function WeekChart({ eventId }: WeekChartProps) {
  const [history, setHistory] = useState<DailyCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventHistory(eventId)
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [eventId])

  if (loading) return <div className="week-chart-loading">Loading...</div>
  if (history.length === 0) return null

  const maxCount = Math.max(...history.map(h => h.count), 1)

  return (
    <div className="week-chart">
      <div className="week-chart-bars">
        {history.map(day => (
          <div key={day.date} className="week-chart-col">
            <span className="week-chart-value">{day.count}</span>
            <div className="week-chart-bar-track">
              <div
                className="week-chart-bar-fill"
                style={{ height: `${(day.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="week-chart-label">{formatDay(day.date)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
