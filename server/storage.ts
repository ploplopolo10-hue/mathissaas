import {
  users,
  userProfiles,
  trainingSessions,
  nutritionEntries,
  mentalSessions,
  productivitySessions,
  aiRecommendations,
  type User,
  type UpsertUser,
  type UserProfile,
  type InsertUserProfile,
  type TrainingSession,
  type InsertTrainingSession,
  type NutritionEntry,
  type InsertNutritionEntry,
  type MentalSession,
  type InsertMentalSession,
  type ProductivitySession,
  type InsertProductivitySession,
  type AiRecommendation,
  type InsertAiRecommendation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeCustomerId(userId: string, customerId: string): Promise<User>;
  updateUserSubscription(userId: string, subscriptionId: string, tier: string): Promise<User>;
  
  // User profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createOrUpdateUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  
  // Training operations
  getTrainingSessions(userId: string): Promise<TrainingSession[]>;
  createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession>;
  
  // Nutrition operations
  getNutritionEntries(userId: string): Promise<NutritionEntry[]>;
  createNutritionEntry(entry: InsertNutritionEntry): Promise<NutritionEntry>;
  
  // Mental wellness operations
  getMentalSessions(userId: string): Promise<MentalSession[]>;
  createMentalSession(session: InsertMentalSession): Promise<MentalSession>;
  
  // Productivity operations
  getProductivitySessions(userId: string): Promise<ProductivitySession[]>;
  createProductivitySession(session: InsertProductivitySession): Promise<ProductivitySession>;
  
  // AI recommendations operations
  getAiRecommendations(userId: string): Promise<AiRecommendation[]>;
  createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;
  updateAiRecommendation(id: string, userId: string, updates: Partial<AiRecommendation>): Promise<AiRecommendation>;
  
  // Analytics and insights
  getDashboardAnalytics(userId: string): Promise<any>;
  
  // AI coaching recommendation generators
  generateTrainingRecommendations(userId: string, session: TrainingSession): Promise<void>;
  generateNutritionRecommendations(userId: string, entry: NutritionEntry): Promise<void>;
  generateMentalRecommendations(userId: string, session: MentalSession): Promise<void>;
  generateProductivityRecommendations(userId: string, session: ProductivitySession): Promise<void>;
  
  // Stripe webhook handlers
  handleSuccessfulPayment(customerId: string): Promise<void>;
  handleFailedPayment(customerId: string): Promise<void>;
  handleCancelledSubscription(customerId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
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

  async updateUserStripeCustomerId(userId: string, customerId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId: customerId, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserSubscription(userId: string, subscriptionId: string, tier: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeSubscriptionId: subscriptionId,
        subscriptionTier: tier,
        subscriptionStatus: 'active',
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // User profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createOrUpdateUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [existingProfile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, profile.userId));

    if (existingProfile) {
      const [updatedProfile] = await db
        .update(userProfiles)
        .set({ ...profile, updatedAt: new Date() })
        .where(eq(userProfiles.userId, profile.userId))
        .returning();
      return updatedProfile;
    } else {
      const [newProfile] = await db
        .insert(userProfiles)
        .values(profile)
        .returning();
      return newProfile;
    }
  }

  // Training operations
  async getTrainingSessions(userId: string): Promise<TrainingSession[]> {
    return await db
      .select()
      .from(trainingSessions)
      .where(eq(trainingSessions.userId, userId))
      .orderBy(desc(trainingSessions.completedAt));
  }

  async createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession> {
    const [newSession] = await db
      .insert(trainingSessions)
      .values(session)
      .returning();
    return newSession;
  }

  // Nutrition operations
  async getNutritionEntries(userId: string): Promise<NutritionEntry[]> {
    return await db
      .select()
      .from(nutritionEntries)
      .where(eq(nutritionEntries.userId, userId))
      .orderBy(desc(nutritionEntries.loggedAt));
  }

  async createNutritionEntry(entry: InsertNutritionEntry): Promise<NutritionEntry> {
    const [newEntry] = await db
      .insert(nutritionEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  // Mental wellness operations
  async getMentalSessions(userId: string): Promise<MentalSession[]> {
    return await db
      .select()
      .from(mentalSessions)
      .where(eq(mentalSessions.userId, userId))
      .orderBy(desc(mentalSessions.completedAt));
  }

  async createMentalSession(session: InsertMentalSession): Promise<MentalSession> {
    const [newSession] = await db
      .insert(mentalSessions)
      .values(session)
      .returning();
    return newSession;
  }

  // Productivity operations
  async getProductivitySessions(userId: string): Promise<ProductivitySession[]> {
    return await db
      .select()
      .from(productivitySessions)
      .where(eq(productivitySessions.userId, userId))
      .orderBy(desc(productivitySessions.completedAt));
  }

  async createProductivitySession(session: InsertProductivitySession): Promise<ProductivitySession> {
    const [newSession] = await db
      .insert(productivitySessions)
      .values(session)
      .returning();
    return newSession;
  }

  // AI recommendations operations
  async getAiRecommendations(userId: string): Promise<AiRecommendation[]> {
    return await db
      .select()
      .from(aiRecommendations)
      .where(and(
        eq(aiRecommendations.userId, userId),
        eq(aiRecommendations.isCompleted, false)
      ))
      .orderBy(desc(aiRecommendations.priority), desc(aiRecommendations.createdAt));
  }

  async createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const [newRecommendation] = await db
      .insert(aiRecommendations)
      .values(recommendation)
      .returning();
    return newRecommendation;
  }

  async updateAiRecommendation(id: string, userId: string, updates: Partial<AiRecommendation>): Promise<AiRecommendation> {
    const [updatedRecommendation] = await db
      .update(aiRecommendations)
      .set(updates)
      .where(and(
        eq(aiRecommendations.id, id),
        eq(aiRecommendations.userId, userId)
      ))
      .returning();
    return updatedRecommendation;
  }

  // Analytics and insights
  async getDashboardAnalytics(userId: string): Promise<any> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get training analytics
    const trainingData = await db
      .select()
      .from(trainingSessions)
      .where(and(
        eq(trainingSessions.userId, userId),
        gte(trainingSessions.completedAt, oneWeekAgo)
      ));

    // Get nutrition analytics
    const nutritionData = await db
      .select()
      .from(nutritionEntries)
      .where(and(
        eq(nutritionEntries.userId, userId),
        gte(nutritionEntries.loggedAt, today)
      ));

    // Get mental wellness analytics
    const mentalData = await db
      .select()
      .from(mentalSessions)
      .where(and(
        eq(mentalSessions.userId, userId),
        gte(mentalSessions.completedAt, oneWeekAgo)
      ));

    // Get productivity analytics
    const productivityData = await db
      .select()
      .from(productivitySessions)
      .where(and(
        eq(productivitySessions.userId, userId),
        gte(productivitySessions.completedAt, oneWeekAgo)
      ));

    // Calculate analytics
    const training = {
      weeklyGoal: 5,
      completed: trainingData.length,
      caloriesBurned: trainingData.reduce((sum, session) => sum + (session.caloriesBurned || 0), 0),
      avgDuration: trainingData.length > 0 ? trainingData.reduce((sum, session) => sum + session.duration, 0) / trainingData.length : 0,
    };

    const nutrition = {
      dailyCalorieGoal: 2000,
      consumed: nutritionData.reduce((sum, entry) => sum + entry.totalCalories, 0),
      mealsLogged: nutritionData.length,
      waterIntake: 2.5, // Placeholder - would be tracked separately
    };

    const mental = {
      weeklyMeditationGoal: 7,
      completed: mentalData.length,
      avgMoodBefore: mentalData.length > 0 ? mentalData.reduce((sum, session) => sum + session.moodBefore, 0) / mentalData.length : 5,
      avgMoodAfter: mentalData.length > 0 ? mentalData.reduce((sum, session) => sum + session.moodAfter, 0) / mentalData.length : 5,
    };

    const productivity = {
      dailyFocusGoal: 240, // 4 hours in minutes
      achieved: productivityData.reduce((sum, session) => sum + session.duration, 0),
      tasksCompleted: productivityData.reduce((sum, session) => sum + session.tasksCompleted, 0),
      avgFocusScore: productivityData.length > 0 ? productivityData.reduce((sum, session) => sum + session.focusScore, 0) / productivityData.length : 0,
    };

    // Calculate overall weekly score
    const trainingScore = Math.min((training.completed / training.weeklyGoal) * 100, 100);
    const nutritionScore = Math.min((nutrition.consumed / nutrition.dailyCalorieGoal) * 100, 100);
    const mentalScore = Math.min((mental.completed / mental.weeklyMeditationGoal) * 100, 100);
    const productivityScore = Math.min((productivity.achieved / productivity.dailyFocusGoal) * 100, 100);
    
    const weeklyScore = Math.round((trainingScore + nutritionScore + mentalScore + productivityScore) / 4);

    const streakDays = 7; // Placeholder - would calculate actual streak

    return {
      training,
      nutrition,
      mental,
      productivity,
      streakDays,
      weeklyScore,
    };
  }

  // AI coaching recommendation generators
  async generateTrainingRecommendations(userId: string, session: TrainingSession): Promise<void> {
    const recommendations: InsertAiRecommendation[] = [];

    // Generate recommendations based on training session
    if (session.caloriesBurned && session.caloriesBurned < 200) {
      recommendations.push({
        userId,
        module: 'training',
        recommendationType: 'intensity_boost',
        title: 'Augmentez l\'intensité',
        description: 'Votre dernière séance a brûlé peu de calories. Essayez d\'augmenter l\'intensité de 15%.',
        actionData: { targetCalories: session.caloriesBurned * 1.15 },
        priority: 7,
      });
    }

    if (session.duration < 20) {
      recommendations.push({
        userId,
        module: 'training',
        recommendationType: 'duration_increase',
        title: 'Prolongez vos séances',
        description: 'Des séances plus longues amélioreront votre endurance. Visez 30 minutes minimum.',
        actionData: { targetDuration: 30 },
        priority: 6,
      });
    }

    // Insert recommendations
    if (recommendations.length > 0) {
      await db.insert(aiRecommendations).values(recommendations);
    }
  }

  async generateNutritionRecommendations(userId: string, entry: NutritionEntry): Promise<void> {
    const recommendations: InsertAiRecommendation[] = [];

    // Get user's daily entries to analyze patterns
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEntries = await db
      .select()
      .from(nutritionEntries)
      .where(and(
        eq(nutritionEntries.userId, userId),
        gte(nutritionEntries.loggedAt, today)
      ));

    const totalCalories = todayEntries.reduce((sum, e) => sum + e.totalCalories, 0);
    const totalProtein = todayEntries.reduce((sum, e) => sum + (e.macros?.protein || 0), 0);

    if (totalCalories > 2500) {
      recommendations.push({
        userId,
        module: 'nutrition',
        recommendationType: 'calorie_reduction',
        title: 'Réduisez les calories',
        description: 'Vous avez dépassé votre objectif calorique. Privilégiez les légumes pour le prochain repas.',
        actionData: { currentCalories: totalCalories, targetCalories: 2000 },
        priority: 8,
      });
    }

    if (totalProtein < 100) {
      recommendations.push({
        userId,
        module: 'nutrition',
        recommendationType: 'protein_boost',
        title: 'Augmentez les protéines',
        description: 'Votre apport en protéines est insuffisant. Ajoutez des œufs, du poulet ou des légumineuses.',
        actionData: { currentProtein: totalProtein, targetProtein: 120 },
        priority: 7,
      });
    }

    if (recommendations.length > 0) {
      await db.insert(aiRecommendations).values(recommendations);
    }
  }

  async generateMentalRecommendations(userId: string, session: MentalSession): Promise<void> {
    const recommendations: InsertAiRecommendation[] = [];

    if (session.moodBefore < 5) {
      recommendations.push({
        userId,
        module: 'mental',
        recommendationType: 'mood_boost',
        title: 'Session de bien-être supplémentaire',
        description: 'Votre humeur était basse. Une méditation de 10 minutes pourrait vous aider.',
        actionData: { recommendedDuration: 10, technique: 'breathing' },
        priority: 9,
      });
    }

    if (session.moodAfter - session.moodBefore > 3) {
      recommendations.push({
        userId,
        module: 'mental',
        recommendationType: 'technique_success',
        title: 'Technique efficace !',
        description: 'Cette technique a bien fonctionné pour vous. Répétez-la régulièrement.',
        actionData: { successfulTechnique: session.sessionType },
        priority: 5,
      });
    }

    if (recommendations.length > 0) {
      await db.insert(aiRecommendations).values(recommendations);
    }
  }

  async generateProductivityRecommendations(userId: string, session: ProductivitySession): Promise<void> {
    const recommendations: InsertAiRecommendation[] = [];

    if (session.focusScore < 6) {
      recommendations.push({
        userId,
        module: 'productivity',
        recommendationType: 'focus_improvement',
        title: 'Améliorez votre concentration',
        description: 'Votre score de focus était faible. Essayez la technique Pomodoro.',
        actionData: { recommendedTechnique: 'pomodoro', targetScore: 8 },
        priority: 7,
      });
    }

    if (session.tasksCompleted === 0) {
      recommendations.push({
        userId,
        module: 'productivity',
        recommendationType: 'task_completion',
        title: 'Définissez des objectifs plus petits',
        description: 'Aucune tâche terminée. Divisez vos objectifs en sous-tâches plus simples.',
        actionData: { strategy: 'break_down_tasks' },
        priority: 8,
      });
    }

    if (recommendations.length > 0) {
      await db.insert(aiRecommendations).values(recommendations);
    }
  }

  // Stripe webhook handlers
  async handleSuccessfulPayment(customerId: string): Promise<void> {
    await db
      .update(users)
      .set({ subscriptionStatus: 'active', updatedAt: new Date() })
      .where(eq(users.stripeCustomerId, customerId));
  }

  async handleFailedPayment(customerId: string): Promise<void> {
    await db
      .update(users)
      .set({ subscriptionStatus: 'past_due', updatedAt: new Date() })
      .where(eq(users.stripeCustomerId, customerId));
  }

  async handleCancelledSubscription(customerId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        subscriptionStatus: 'canceled',
        subscriptionTier: 'free',
        stripeSubscriptionId: null,
        updatedAt: new Date() 
      })
      .where(eq(users.stripeCustomerId, customerId));
  }
}

export const storage = new DatabaseStorage();
