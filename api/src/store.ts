import { TableClient } from "@azure/data-tables";

export interface EventItem {
  id: string;
  name: string;
  icon: string;
  count: number;
  order: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

interface EventEntity {
  partitionKey: string;
  rowKey: string;
  name: string;
  icon: string;
  order: number;
}

interface DailyCountEntity {
  partitionKey: string;
  rowKey: string;
  count: number;
}

const PARTITION_KEY = "events";
const EVENTS_TABLE = "events";
const DAILY_TABLE = "dailycounts";

function getConnectionString(): string {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING is not configured");
  }
  return connectionString;
}

function getEventsClient(): TableClient {
  return TableClient.fromConnectionString(getConnectionString(), EVENTS_TABLE);
}

function getDailyClient(): TableClient {
  return TableClient.fromConnectionString(getConnectionString(), DAILY_TABLE);
}

export function getTodayPacific(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
}

function toEventItem(entity: EventEntity, todayCount: number): EventItem {
  return {
    id: entity.rowKey,
    name: entity.name,
    icon: entity.icon,
    count: todayCount,
    order: entity.order ?? 0,
  };
}

export async function ensureTable(): Promise<void> {
  await Promise.all([
    getEventsClient().createTable(),
    getDailyClient().createTable(),
  ]);
}

async function getDailyCount(eventId: string, date: string): Promise<number> {
  const client = getDailyClient();
  try {
    const entity = await client.getEntity<DailyCountEntity>(eventId, date);
    return entity.count;
  } catch {
    return 0;
  }
}

async function setDailyCount(eventId: string, date: string, count: number): Promise<void> {
  const client = getDailyClient();
  await client.upsertEntity<DailyCountEntity>({
    partitionKey: eventId,
    rowKey: date,
    count,
  }, "Replace");
}

export async function getAllEvents(): Promise<EventItem[]> {
  const client = getEventsClient();
  const today = getTodayPacific();
  const items: EventItem[] = [];
  for await (const entity of client.listEntities<EventEntity>({
    queryOptions: { filter: `PartitionKey eq '${PARTITION_KEY}'` },
  })) {
    const todayCount = await getDailyCount(entity.rowKey, today);
    items.push(toEventItem(entity, todayCount));
  }
  items.sort((a, b) => a.order - b.order);
  return items;
}

export async function getEvent(id: string): Promise<EventItem | undefined> {
  const client = getEventsClient();
  const today = getTodayPacific();
  try {
    const entity = await client.getEntity<EventEntity>(PARTITION_KEY, id);
    const todayCount = await getDailyCount(id, today);
    return toEventItem(entity, todayCount);
  } catch {
    return undefined;
  }
}

export async function createEvent(event: EventItem): Promise<void> {
  const client = getEventsClient();
  await client.createEntity<EventEntity>({
    partitionKey: PARTITION_KEY,
    rowKey: event.id,
    name: event.name,
    icon: event.icon,
    order: event.order,
  });
}

export async function updateEvent(id: string, updates: Partial<Pick<EventItem, "name" | "icon">>): Promise<EventItem | undefined> {
  const client = getEventsClient();
  const today = getTodayPacific();
  let existing: EventEntity;
  try {
    existing = await client.getEntity<EventEntity>(PARTITION_KEY, id);
  } catch {
    return undefined;
  }

  const updated: EventEntity = {
    partitionKey: PARTITION_KEY,
    rowKey: id,
    name: updates.name !== undefined ? updates.name : existing.name,
    icon: updates.icon !== undefined ? updates.icon : existing.icon,
    order: existing.order ?? 0,
  };
  await client.updateEntity(updated, "Replace");
  const todayCount = await getDailyCount(id, today);
  return toEventItem(updated, todayCount);
}

export async function deleteEvent(id: string): Promise<boolean> {
  const client = getEventsClient();
  try {
    await client.deleteEntity(PARTITION_KEY, id);
  } catch {
    return false;
  }

  // Clean up daily counts for this event
  const dailyClient = getDailyClient();
  try {
    for await (const entity of dailyClient.listEntities<DailyCountEntity>({
      queryOptions: { filter: `PartitionKey eq '${id}'` },
    })) {
      await dailyClient.deleteEntity(entity.partitionKey, entity.rowKey);
    }
  } catch {
    // Best-effort cleanup
  }
  return true;
}

export async function incrementEvent(id: string): Promise<EventItem | undefined> {
  const event = await getEvent(id);
  if (!event) return undefined;

  const today = getTodayPacific();
  const currentCount = await getDailyCount(id, today);
  await setDailyCount(id, today, currentCount + 1);
  return { ...event, count: currentCount + 1 };
}

export async function decrementEvent(id: string): Promise<EventItem | undefined> {
  const event = await getEvent(id);
  if (!event) return undefined;

  const today = getTodayPacific();
  const currentCount = await getDailyCount(id, today);
  const newCount = currentCount > 0 ? currentCount - 1 : 0;
  await setDailyCount(id, today, newCount);
  return { ...event, count: newCount };
}

export async function getEventHistory(id: string, days: number = 7): Promise<DailyCount[]> {
  // Check event exists
  const client = getEventsClient();
  try {
    await client.getEntity(PARTITION_KEY, id);
  } catch {
    return [];
  }

  // Build list of dates for last N days in Pacific Time
  const dates: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" }));
  }

  // Fetch counts for each date
  const history: DailyCount[] = [];
  for (const date of dates) {
    const count = await getDailyCount(id, date);
    history.push({ date, count });
  }
  return history;
}

export async function reorderEvents(orderedIds: string[]): Promise<void> {
  const client = getEventsClient();
  for (let i = 0; i < orderedIds.length; i++) {
    try {
      const entity = await client.getEntity<EventEntity>(PARTITION_KEY, orderedIds[i]);
      await client.updateEntity<EventEntity>({
        partitionKey: PARTITION_KEY,
        rowKey: orderedIds[i],
        name: entity.name,
        icon: entity.icon,
        order: i,
      }, "Replace");
    } catch {
      // Skip missing events
    }
  }
}
