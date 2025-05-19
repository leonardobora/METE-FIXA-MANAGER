import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
  boolean,
  primaryKey,
  varchar,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
}));

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull(), // in hours
  description: text("description"),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
  ticketTypes: many(ticketTypes),
  guests: many(guests),
}));

export const insertEventSchema = createInsertSchema(events)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    date: z.string()
      .refine((date) => new Date(date) > new Date(), {
        message: "A data do evento deve ser no futuro"
      })
      .transform((str) => new Date(str)),
    duration: z.number()
      .min(1, "A duração deve ser de pelo menos 1 hora")
      .max(72, "A duração máxima é de 72 horas"),
    name: z.string()
      .min(3, "O nome deve ter pelo menos 3 caracteres")
      .max(100, "O nome deve ter no máximo 100 caracteres"),
  });

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Ticket Types table
export const ticketTypes = pgTable("ticket_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ticketTypesRelations = relations(ticketTypes, ({ one, many }) => ({
  event: one(events, {
    fields: [ticketTypes.eventId],
    references: [events.id],
  }),
  guests: many(guests),
}));

export const insertTicketTypeSchema = createInsertSchema(ticketTypes).omit({
  id: true,
  createdAt: true,
});

export type InsertTicketType = z.infer<typeof insertTicketTypeSchema>;
export type TicketType = typeof ticketTypes.$inferSelect;

// Guests table for persistent storage
export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ticketTypeId: integer("ticket_type_id")
    .notNull()
    .references(() => ticketTypes.id, { onDelete: "cascade" }),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  observations: text("observations"),
  entered: boolean("entered").default(false),
  entryTime: timestamp("entry_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guestsRelations = relations(guests, ({ one }) => ({
  event: one(events, {
    fields: [guests.eventId],
    references: [events.id],
  }),
  ticketType: one(ticketTypes, {
    fields: [guests.ticketTypeId],
    references: [ticketTypes.id],
  }),
}));

export const insertGuestSchema = createInsertSchema(guests).omit({
  id: true,
  entered: true,
  entryTime: true,
  createdAt: true,
});

export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type Guest = typeof guests.$inferSelect;

// For client-side temporary storage compatibility
export const clientGuestSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  ticketType: z.string().min(1, "Tipo de ingresso é obrigatório"),
  ticketTypeId: z.number().optional(),
  eventId: z.number().optional(),
  observations: z.string().optional(),
  entered: z.boolean().default(false),
  createdAt: z.number(),
  entryTime: z.union([z.number(), z.null()]),
});

export type ClientGuest = z.infer<typeof clientGuestSchema>;

// Statistics view type
export const eventStatSchema = z.object({
  totalGuests: z.number(),
  enteredGuests: z.number(),
  ticketTypeCounts: z.record(z.string(), z.number()),
  entryTimeline: z.array(
    z.object({
      hour: z.number(),
      count: z.number(),
    })
  ),
});

export type EventStats = z.infer<typeof eventStatSchema>;
