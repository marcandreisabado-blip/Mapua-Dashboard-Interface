import { createInsertSchema } from "drizzle-zod";
import { date, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const foundItemsTable = pgTable("found_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  publicDescription: text("public_description").notNull(),
  location: text("location").notNull(),
  foundAt: date("found_at", { mode: "string" }).notNull(),
  status: text("status").notNull().default("available"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertFoundItemSchema = createInsertSchema(foundItemsTable).omit({
  id: true,
  status: true,
  createdAt: true,
});

export type InsertFoundItem = z.infer<typeof insertFoundItemSchema>;
export type FoundItem = typeof foundItemsTable.$inferSelect;
