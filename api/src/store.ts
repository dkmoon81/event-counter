export interface EventItem {
  id: string;
  name: string;
  icon: string;
  count: number;
}

const events: Map<string, EventItem> = new Map();

export function getAllEvents(): EventItem[] {
  return Array.from(events.values());
}

export function getEvent(id: string): EventItem | undefined {
  return events.get(id);
}

export function createEvent(event: EventItem): void {
  events.set(event.id, event);
}

export function updateEvent(id: string, updates: Partial<Pick<EventItem, 'name' | 'icon'>>): EventItem | undefined {
  const event = events.get(id);
  if (!event) return undefined;
  if (updates.name !== undefined) event.name = updates.name;
  if (updates.icon !== undefined) event.icon = updates.icon;
  events.set(id, event);
  return event;
}

export function deleteEvent(id: string): boolean {
  return events.delete(id);
}

export function incrementEvent(id: string): EventItem | undefined {
  const event = events.get(id);
  if (!event) return undefined;
  event.count++;
  events.set(id, event);
  return event;
}

export function decrementEvent(id: string): EventItem | undefined {
  const event = events.get(id);
  if (!event) return undefined;
  if (event.count > 0) event.count--;
  events.set(id, event);
  return event;
}
