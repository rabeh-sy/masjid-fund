import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const mosques = pgTable("mosques", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  city: text("city").notNull(),
  area: text("area"),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  size: text("size", { enum: ["صغير", "متوسط", "كبير"] }).notNull(),
  description: text("description").notNull(),
  cover_image: text("cover_image").notNull(),
  gallery: text("gallery").array().default([]),
  capacity: integer("capacity"),
  establish_year: integer("established_year"),
  phone: text("phone"),
  email: text("email"),
});

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mosqueId: varchar("mosque_id").references(() => mosques.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  target_amount: integer("target_amount").notNull(),
  current_amount: integer("current_amount").default(0),
  priority: text("priority", { enum: ["عاجل", "مستمر", "جديد"] }).default("جديد"),
  isActive: boolean("is_active").default(true),
  images: text("images").array().default([]),
  is_verified: boolean("is_verified").default(false),
});

export const insertMosqueSchema = createInsertSchema(mosques).omit({
  id: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  current_amount: true,
});

export type InsertMosque = z.infer<typeof insertMosqueSchema>;
export type Mosque = typeof mosques.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;

export type MosqueWithDonations = Mosque & {
  donations: Donation[];
  donations_count: number;
};
