import { TableClient } from "@azure/data-tables";

export interface EventItem {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface EventEntity {
  partitionKey: string;
  rowKey: string;
  name: string;
  icon: string;
  count: number;
}

const PARTITION_KEY = "events";
const TABLE_NAME = "events";

function getTableClient(): TableClient {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING is not configured");
  }
  return TableClient.fromConnectionString(connectionString, TABLE_NAME);
}

function toEventItem(entity: EventEntity): EventItem {
  return {
    id: entity.rowKey,
    name: entity.name,
    icon: entity.icon,
    count: entity.count,
  };
}

export async function ensureTable(): Promise<void> {
  const client = getTableClient();
  await client.createTable();
}

export async function getAllEvents(): Promise<EventItem[]> {
  const client = getTableClient();
  const items: EventItem[] = [];
  for await (const entity of client.listEntities<EventEntity>({
    queryOptions: { filter: `PartitionKey eq '${PARTITION_KEY}'` },
  })) {
    items.push(toEventItem(entity));
  }
  return items;
}

export async function getEvent(id: string): Promise<EventItem | undefined> {
  const client = getTableClient();
  try {
    const entity = await client.getEntity<EventEntity>(PARTITION_KEY, id);
    return toEventItem(entity);
  } catch {
    return undefined;
  }
}

export async function createEvent(event: EventItem): Promise<void> {
  const client = getTableClient();
  await client.createEntity<EventEntity>({
    partitionKey: PARTITION_KEY,
    rowKey: event.id,
    name: event.name,
    icon: event.icon,
    count: event.count,
  });
}

export async function updateEvent(id: string, updates: Partial<Pick<EventItem, "name" | "icon">>): Promise<EventItem | undefined> {
  const existing = await getEvent(id);
  if (!existing) return undefined;

  const client = getTableClient();
  const updated: EventEntity = {
    partitionKey: PARTITION_KEY,
    rowKey: id,
    name: updates.name !== undefined ? updates.name : existing.name,
    icon: updates.icon !== undefined ? updates.icon : existing.icon,
    count: existing.count,
  };
  await client.updateEntity(updated, "Replace");
  return toEventItem(updated);
}

export async function deleteEvent(id: string): Promise<boolean> {
  const client = getTableClient();
  try {
    await client.deleteEntity(PARTITION_KEY, id);
    return true;
  } catch {
    return false;
  }
}

export async function incrementEvent(id: string): Promise<EventItem | undefined> {
  const existing = await getEvent(id);
  if (!existing) return undefined;

  const client = getTableClient();
  const updated: EventEntity = {
    partitionKey: PARTITION_KEY,
    rowKey: id,
    name: existing.name,
    icon: existing.icon,
    count: existing.count + 1,
  };
  await client.updateEntity(updated, "Replace");
  return toEventItem(updated);
}

export async function decrementEvent(id: string): Promise<EventItem | undefined> {
  const existing = await getEvent(id);
  if (!existing) return undefined;

  const client = getTableClient();
  const newCount = existing.count > 0 ? existing.count - 1 : 0;
  const updated: EventEntity = {
    partitionKey: PARTITION_KEY,
    rowKey: id,
    name: existing.name,
    icon: existing.icon,
    count: newCount,
  };
  await client.updateEntity(updated, "Replace");
  return toEventItem(updated);
}
