import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertEventSchema, insertTicketTypeSchema, insertGuestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Auth Middleware
  await setupAuth(app);

  // Auth User Route
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Event Routes
  app.get("/api/events", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const events = await storage.getEventsByUserId(userId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const eventData = insertEventSchema.parse({
        ...req.body,
        userId
      });
      
      const newEvent = await storage.createEvent(eventData);
      res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put("/api/events/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const userId = req.user.claims.sub;
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      if (event.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this event" });
      }
      
      const updatedEvent = await storage.updateEvent(eventId, req.body);
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const userId = req.user.claims.sub;
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      if (event.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this event" });
      }
      
      await storage.deleteEvent(eventId);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Ticket Type Routes
  app.get("/api/events/:eventId/ticket-types", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const ticketTypes = await storage.getTicketTypes(eventId);
      res.json(ticketTypes);
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      res.status(500).json({ message: "Failed to fetch ticket types" });
    }
  });

  app.post("/api/events/:eventId/ticket-types", isAuthenticated, async (req: any, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      if (event.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to add ticket types to this event" });
      }
      
      const ticketTypeData = insertTicketTypeSchema.parse({
        ...req.body,
        eventId
      });
      
      const newTicketType = await storage.createTicketType(ticketTypeData);
      res.status(201).json(newTicketType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket type data", errors: error.errors });
      }
      console.error("Error creating ticket type:", error);
      res.status(500).json({ message: "Failed to create ticket type" });
    }
  });

  app.put("/api/ticket-types/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const ticketTypeId = parseInt(req.params.id);
      if (isNaN(ticketTypeId)) {
        return res.status(400).json({ message: "Invalid ticket type ID" });
      }
      
      const ticketType = await storage.getTicketType(ticketTypeId);
      if (!ticketType) {
        return res.status(404).json({ message: "Ticket type not found" });
      }
      
      const event = await storage.getEvent(ticketType.eventId);
      if (event?.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to update this ticket type" });
      }
      
      const updatedTicketType = await storage.updateTicketType(ticketTypeId, req.body);
      res.json(updatedTicketType);
    } catch (error) {
      console.error("Error updating ticket type:", error);
      res.status(500).json({ message: "Failed to update ticket type" });
    }
  });

  app.delete("/api/ticket-types/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const ticketTypeId = parseInt(req.params.id);
      if (isNaN(ticketTypeId)) {
        return res.status(400).json({ message: "Invalid ticket type ID" });
      }
      
      const ticketType = await storage.getTicketType(ticketTypeId);
      if (!ticketType) {
        return res.status(404).json({ message: "Ticket type not found" });
      }
      
      const event = await storage.getEvent(ticketType.eventId);
      if (event?.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to delete this ticket type" });
      }
      
      await storage.deleteTicketType(ticketTypeId);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting ticket type:", error);
      res.status(500).json({ message: "Failed to delete ticket type" });
    }
  });

  // Guest Routes
  app.get("/api/events/:eventId/guests", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const guests = await storage.getGuests(eventId);
      res.json(guests);
    } catch (error) {
      console.error("Error fetching guests:", error);
      res.status(500).json({ message: "Failed to fetch guests" });
    }
  });

  app.post("/api/events/:eventId/guests", isAuthenticated, async (req: any, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      if (event.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to add guests to this event" });
      }
      
      const guestData = insertGuestSchema.parse({
        ...req.body,
        eventId
      });
      
      const newGuest = await storage.createGuest(guestData);
      res.status(201).json(newGuest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid guest data", errors: error.errors });
      }
      console.error("Error creating guest:", error);
      res.status(500).json({ message: "Failed to create guest" });
    }
  });

  app.put("/api/guests/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const guestId = parseInt(req.params.id);
      if (isNaN(guestId)) {
        return res.status(400).json({ message: "Invalid guest ID" });
      }
      
      const guest = await storage.getGuest(guestId);
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }
      
      const event = await storage.getEvent(guest.eventId);
      if (event?.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to update this guest" });
      }
      
      const updatedGuest = await storage.updateGuest(guestId, req.body);
      res.json(updatedGuest);
    } catch (error) {
      console.error("Error updating guest:", error);
      res.status(500).json({ message: "Failed to update guest" });
    }
  });

  app.post("/api/guests/:id/check-in", isAuthenticated, async (req: any, res: Response) => {
    try {
      const guestId = parseInt(req.params.id);
      if (isNaN(guestId)) {
        return res.status(400).json({ message: "Invalid guest ID" });
      }
      
      const guest = await storage.getGuest(guestId);
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }
      
      const event = await storage.getEvent(guest.eventId);
      if (event?.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to check in this guest" });
      }
      
      if (guest.entered) {
        return res.status(400).json({ message: "Guest has already entered" });
      }
      
      const updatedGuest = await storage.checkInGuest(guestId);
      res.json(updatedGuest);
    } catch (error) {
      console.error("Error checking in guest:", error);
      res.status(500).json({ message: "Failed to check in guest" });
    }
  });

  app.delete("/api/guests/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const guestId = parseInt(req.params.id);
      if (isNaN(guestId)) {
        return res.status(400).json({ message: "Invalid guest ID" });
      }
      
      const guest = await storage.getGuest(guestId);
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }
      
      const event = await storage.getEvent(guest.eventId);
      if (event?.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to delete this guest" });
      }
      
      await storage.deleteGuest(guestId);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting guest:", error);
      res.status(500).json({ message: "Failed to delete guest" });
    }
  });

  // Statistics
  app.get("/api/events/:eventId/stats", isAuthenticated, async (req: any, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      if (event.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Not authorized to view stats for this event" });
      }
      
      const stats = await storage.getEventStats(eventId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching event stats:", error);
      res.status(500).json({ message: "Failed to fetch event stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
