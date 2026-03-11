import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from "@azure/functions";
import { v4 as uuidv4 } from "uuid";
import { ensureTable, getAllEvents, createEvent, updateEvent, deleteEvent, incrementEvent, decrementEvent } from "../store.js";

let tableReady: Promise<void> | null = null;
function initTable() {
  if (!tableReady) tableReady = ensureTable();
  return tableReady;
}

// GET /api/events - list all events
// POST /api/events - create a new event
app.http("events", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "events",
  handler: async (request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> => {
    await initTable();

    if (request.method === "GET") {
      return { jsonBody: await getAllEvents() };
    }

    // POST - create event
    const body = await request.json() as { name?: string; icon?: string };
    if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
      return { status: 400, jsonBody: { error: "Event name is required" } };
    }

    const event = {
      id: uuidv4(),
      name: body.name.trim(),
      icon: typeof body.icon === "string" ? body.icon : "",
      count: 0,
    };
    await createEvent(event);
    return { status: 201, jsonBody: event };
  },
});

// PUT /api/events/{id} - update an event
// DELETE /api/events/{id} - delete an event
app.http("eventById", {
  methods: ["PUT", "DELETE"],
  authLevel: "anonymous",
  route: "events/{id}",
  handler: async (request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> => {
    await initTable();

    const id = request.params.id;
    if (!id) {
      return { status: 400, jsonBody: { error: "Event ID is required" } };
    }

    if (request.method === "DELETE") {
      const deleted = await deleteEvent(id);
      if (!deleted) {
        return { status: 404, jsonBody: { error: "Event not found" } };
      }
      return { status: 204 };
    }

    // PUT - update event
    const body = await request.json() as { name?: string; icon?: string };
    const updated = await updateEvent(id, {
      name: body.name?.trim(),
      icon: body.icon,
    });
    if (!updated) {
      return { status: 404, jsonBody: { error: "Event not found" } };
    }
    return { jsonBody: updated };
  },
});

// POST /api/events/{id}/increment
app.http("eventIncrement", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "events/{id}/increment",
  handler: async (request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> => {
    await initTable();
    const id = request.params.id;
    if (!id) return { status: 400, jsonBody: { error: "Event ID is required" } };

    const event = await incrementEvent(id);
    if (!event) return { status: 404, jsonBody: { error: "Event not found" } };
    return { jsonBody: event };
  },
});

// POST /api/events/{id}/decrement
app.http("eventDecrement", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "events/{id}/decrement",
  handler: async (request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> => {
    await initTable();
    const id = request.params.id;
    if (!id) return { status: 400, jsonBody: { error: "Event ID is required" } };

    const event = await decrementEvent(id);
    if (!event) return { status: 404, jsonBody: { error: "Event not found" } };
    return { jsonBody: event };
  },
});
