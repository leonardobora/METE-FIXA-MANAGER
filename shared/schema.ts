import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Guest schema for the Mete Ficha app
export const guestSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  ticketType: z.enum(["pista", "vip", "cortesia"]),
  observations: z.string().optional(),
  entered: z.boolean().default(false),
  createdAt: z.number(),
  entryTime: z.number().nullable(),
});

export type Guest = z.infer<typeof guestSchema>;

export const insertGuestSchema = guestSchema.omit({ 
  id: true, 
  entered: true, 
  createdAt: true, 
  entryTime: true 
});

export type InsertGuest = z.infer<typeof insertGuestSchema>;
