import {
  users,
  type User,
  type UpsertUser,
  type Event,
  type InsertEvent,
  events,
  ticketTypes,
  type TicketType,
  type InsertTicketType,
  guests,
  type Guest,
  type InsertGuest,
  type EventStats
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, count, isNull, isNotNull } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getEventsByUserId(userId: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Ticket Type operations
  getTicketTypes(eventId: number): Promise<TicketType[]>;
  getTicketType(id: number): Promise<TicketType | undefined>;
  createTicketType(ticketType: InsertTicketType): Promise<TicketType>;
  updateTicketType(id: number, data: Partial<InsertTicketType>): Promise<TicketType | undefined>;
  deleteTicketType(id: number): Promise<boolean>;
  
  // Guest operations
  getGuests(eventId: number): Promise<Guest[]>;
  getGuest(id: number): Promise<Guest | undefined>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: number, data: Partial<InsertGuest>): Promise<Guest | undefined>;
  checkInGuest(id: number): Promise<Guest | undefined>;
  deleteGuest(id: number): Promise<boolean>;
  
  // Statistics operations
  getEventStats(eventId: number): Promise<EventStats>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(eq(events.userId, userId))
      .orderBy(desc(events.date));
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(eventData)
      .returning();
    return event;
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event | undefined> {
    const [event] = await db
      .update(events)
      .set({
        ...eventData,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();
    return event;
  }

  async deleteEvent(id: number): Promise<boolean> {
    await db.delete(events).where(eq(events.id, id));
    return true;
  }

  // Ticket Type operations
  async getTicketTypes(eventId: number): Promise<TicketType[]> {
    return await db
      .select()
      .from(ticketTypes)
      .where(eq(ticketTypes.eventId, eventId));
  }

  async getTicketType(id: number): Promise<TicketType | undefined> {
    const [ticketType] = await db
      .select()
      .from(ticketTypes)
      .where(eq(ticketTypes.id, id));
    return ticketType;
  }

  async createTicketType(ticketTypeData: InsertTicketType): Promise<TicketType> {
    const [ticketType] = await db
      .insert(ticketTypes)
      .values(ticketTypeData)
      .returning();
    return ticketType;
  }

  async updateTicketType(id: number, data: Partial<InsertTicketType>): Promise<TicketType | undefined> {
    const [ticketType] = await db
      .update(ticketTypes)
      .set(data)
      .where(eq(ticketTypes.id, id))
      .returning();
    return ticketType;
  }

  async deleteTicketType(id: number): Promise<boolean> {
    await db.delete(ticketTypes).where(eq(ticketTypes.id, id));
    return true;
  }

  // Guest operations
  async getGuests(eventId: number): Promise<Guest[]> {
    return await db
      .select()
      .from(guests)
      .where(eq(guests.eventId, eventId))
      .orderBy(desc(guests.createdAt));
  }

  async getGuest(id: number): Promise<Guest | undefined> {
    const [guest] = await db
      .select()
      .from(guests)
      .where(eq(guests.id, id));
    return guest;
  }

  async createGuest(guestData: InsertGuest): Promise<Guest> {
    const [guest] = await db
      .insert(guests)
      .values(guestData)
      .returning();
    return guest;
  }

  async updateGuest(id: number, data: Partial<InsertGuest>): Promise<Guest | undefined> {
    const [guest] = await db
      .update(guests)
      .set(data)
      .where(eq(guests.id, id))
      .returning();
    return guest;
  }

  async checkInGuest(id: number): Promise<Guest | undefined> {
    const [guest] = await db
      .update(guests)
      .set({
        entered: true,
        entryTime: new Date(),
      })
      .where(eq(guests.id, id))
      .returning();
    return guest;
  }

  async deleteGuest(id: number): Promise<boolean> {
    await db.delete(guests).where(eq(guests.id, id));
    return true;
  }

  // Statistics operations
  async getEventStats(eventId: number): Promise<EventStats> {
    // Get total count of guests
    const [totalResult] = await db
      .select({ count: count() })
      .from(guests)
      .where(eq(guests.eventId, eventId));
      
    // Get entered guests count
    const [enteredResult] = await db
      .select({ count: count() })
      .from(guests)
      .where(and(
        eq(guests.eventId, eventId),
        eq(guests.entered, true)
      ));
      
    // Get ticket type counts
    const ticketTypesWithCount = await db
      .select({
        id: ticketTypes.id,
        name: ticketTypes.name,
        count: count(guests.id),
      })
      .from(ticketTypes)
      .leftJoin(guests, and(
        eq(guests.ticketTypeId, ticketTypes.id),
        eq(guests.eventId, eventId)
      ))
      .where(eq(ticketTypes.eventId, eventId))
      .groupBy(ticketTypes.id, ticketTypes.name);
      
    // Format for return
    const ticketTypeCounts: Record<string, number> = {};
    ticketTypesWithCount.forEach(tt => {
      ticketTypeCounts[tt.name] = Number(tt.count);
    });
    
    // Get entry timeline by hour (for entered guests)
    const entryTimeline = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${guests.entryTime})::int`,
        count: count(),
      })
      .from(guests)
      .where(and(
        eq(guests.eventId, eventId),
        isNotNull(guests.entryTime)
      ))
      .groupBy(sql`EXTRACT(HOUR FROM ${guests.entryTime})::int`)
      .orderBy(sql`EXTRACT(HOUR FROM ${guests.entryTime})::int`);
      
    return {
      totalGuests: Number(totalResult.count),
      enteredGuests: Number(enteredResult.count),
      ticketTypeCounts,
      entryTimeline,
    };
  }
}

export const storage = new DatabaseStorage();
