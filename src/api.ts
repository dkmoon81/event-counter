export interface EventItem {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

const BASE = '/api/events';

export async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function createEvent(name: string, icon: string): Promise<EventItem> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, icon }),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
}

export async function updateEvent(id: string, name: string, icon: string): Promise<EventItem> {
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, icon }),
  });
  if (!res.ok) throw new Error('Failed to update event');
  return res.json();
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete event');
}

export async function incrementEvent(id: string): Promise<EventItem> {
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}/increment`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to increment');
  return res.json();
}

export async function decrementEvent(id: string): Promise<EventItem> {
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}/decrement`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to decrement');
  return res.json();
}

export async function fetchEventHistory(id: string): Promise<DailyCount[]> {
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}
