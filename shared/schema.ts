import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionTier: varchar("subscription_tier").default("free"), // free, premium, pro
  subscriptionStatus: varchar("subscription_status").default("active"), // active, canceled, past_due
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User goals and preferences
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  primaryGoal: varchar("primary_goal"), // fitness, nutrition, mental, productivity
  fitnessLevel: varchar("fitness_level"), // beginner, intermediate, advanced
  dietaryRestrictions: text("dietary_restrictions"),
  healthConditions: text("health_conditions"),
  weeklyGoals: jsonb("weekly_goals"), // JSON object with module-specific goals
  preferences: jsonb("preferences"), // JSON object with user preferences
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Training sessions and workouts
export const trainingSessions = pgTable("training_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  workoutType: varchar("workout_type").notNull(), // cardio, strength, flexibility, sports
  duration: integer("duration"), // in minutes
  caloriesBurned: integer("calories_burned"),
  exercises: jsonb("exercises"), // JSON array of exercises performed
  notes: text("notes"),
  rating: integer("rating"), // 1-5 user satisfaction rating
  completedAt: timestamp("completed_at").defaultNow(),
});

// Nutrition tracking
export const nutritionEntries = pgTable("nutrition_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  mealType: varchar("meal_type").notNull(), // breakfast, lunch, dinner, snack
  foodItems: jsonb("food_items"), // JSON array of food items with quantities
  totalCalories: integer("total_calories"),
  macros: jsonb("macros"), // {protein, carbs, fat, fiber}
  loggedAt: timestamp("logged_at").defaultNow(),
});

// Mental wellness sessions
export const mentalSessions = pgTable("mental_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionType: varchar("session_type").notNull(), // meditation, breathing, journaling, mood_check
  duration: integer("duration"), // in minutes
  moodBefore: integer("mood_before"), // 1-10 scale
  moodAfter: integer("mood_after"), // 1-10 scale
  notes: text("notes"),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Productivity tracking
export const productivitySessions = pgTable("productivity_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionType: varchar("session_type").notNull(), // focus, pomodoro, task_completion, planning
  duration: integer("duration"), // in minutes
  tasksCompleted: integer("tasks_completed"),
  focusScore: integer("focus_score"), // 1-10 self-reported focus level
  productivity: jsonb("productivity"), // JSON object with detailed metrics
  completedAt: timestamp("completed_at").defaultNow(),
});

// AI coaching recommendations and insights
export const aiRecommendations = pgTable("ai_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  module: varchar("module").notNull(), // training, nutrition, mental, productivity
  recommendationType: varchar("recommendation_type").notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  actionData: jsonb("action_data"), // JSON with specific recommendation data
  priority: integer("priority").default(5), // 1-10 priority level
  isRead: boolean("is_read").default(false),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Export types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertUserProfile = typeof userProfiles.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;

export type InsertTrainingSession = typeof trainingSessions.$inferInsert;
export type TrainingSession = typeof trainingSessions.$inferSelect;

export type InsertNutritionEntry = typeof nutritionEntries.$inferInsert;
export type NutritionEntry = typeof nutritionEntries.$inferSelect;

export type InsertMentalSession = typeof mentalSessions.$inferInsert;
export type MentalSession = typeof mentalSessions.$inferSelect;

export type InsertProductivitySession = typeof productivitySessions.$inferInsert;
export type ProductivitySession = typeof productivitySessions.$inferSelect;

export type InsertAiRecommendation = typeof aiRecommendations.$inferInsert;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;

// Zod schemas for validation
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrainingSessionSchema = createInsertSchema(trainingSessions).omit({
  id: true,
  completedAt: true,
});

export const insertNutritionEntrySchema = createInsertSchema(nutritionEntries).omit({
  id: true,
  loggedAt: true,
});

export const insertMentalSessionSchema = createInsertSchema(mentalSessions).omit({
  id: true,
  completedAt: true,
});

export const insertProductivitySessionSchema = createInsertSchema(productivitySessions).omit({
  id: true,
  completedAt: true,
});
