import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertTrainingSessionSchema, 
  insertNutritionEntrySchema,
  insertMentalSessionSchema,
  insertProductivitySessionSchema,
  insertUserProfileSchema
} from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
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

  // User profile routes
  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertUserProfileSchema.parse({ ...req.body, userId });
      const profile = await storage.createOrUpdateUserProfile(profileData);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      console.error("Error creating/updating profile:", error);
      res.status(500).json({ message: "Failed to create/update profile" });
    }
  });

  // Training module routes
  app.get('/api/training/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getTrainingSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching training sessions:", error);
      res.status(500).json({ message: "Failed to fetch training sessions" });
    }
  });

  app.post('/api/training/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertTrainingSessionSchema.parse({ ...req.body, userId });
      const session = await storage.createTrainingSession(sessionData);
      
      // Generate AI recommendations based on the session
      await storage.generateTrainingRecommendations(userId, session);
      
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      console.error("Error creating training session:", error);
      res.status(500).json({ message: "Failed to create training session" });
    }
  });

  // Nutrition module routes
  app.get('/api/nutrition/entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getNutritionEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching nutrition entries:", error);
      res.status(500).json({ message: "Failed to fetch nutrition entries" });
    }
  });

  app.post('/api/nutrition/entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entryData = insertNutritionEntrySchema.parse({ ...req.body, userId });
      const entry = await storage.createNutritionEntry(entryData);
      
      // Generate AI recommendations based on nutrition
      await storage.generateNutritionRecommendations(userId, entry);
      
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid nutrition data", errors: error.errors });
      }
      console.error("Error creating nutrition entry:", error);
      res.status(500).json({ message: "Failed to create nutrition entry" });
    }
  });

  // Mental wellness module routes
  app.get('/api/mental/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getMentalSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching mental sessions:", error);
      res.status(500).json({ message: "Failed to fetch mental sessions" });
    }
  });

  app.post('/api/mental/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertMentalSessionSchema.parse({ ...req.body, userId });
      const session = await storage.createMentalSession(sessionData);
      
      // Generate AI recommendations based on mental wellness
      await storage.generateMentalRecommendations(userId, session);
      
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      console.error("Error creating mental session:", error);
      res.status(500).json({ message: "Failed to create mental session" });
    }
  });

  // Productivity module routes
  app.get('/api/productivity/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getProductivitySessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching productivity sessions:", error);
      res.status(500).json({ message: "Failed to fetch productivity sessions" });
    }
  });

  app.post('/api/productivity/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertProductivitySessionSchema.parse({ ...req.body, userId });
      const session = await storage.createProductivitySession(sessionData);
      
      // Generate AI recommendations based on productivity
      await storage.generateProductivityRecommendations(userId, session);
      
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      console.error("Error creating productivity session:", error);
      res.status(500).json({ message: "Failed to create productivity session" });
    }
  });

  // AI recommendations routes
  app.get('/api/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recommendations = await storage.getAiRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.patch('/api/recommendations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { isRead, isCompleted } = req.body;
      
      const recommendation = await storage.updateAiRecommendation(id, userId, { isRead, isCompleted });
      res.json(recommendation);
    } catch (error) {
      console.error("Error updating recommendation:", error);
      res.status(500).json({ message: "Failed to update recommendation" });
    }
  });

  // Dashboard analytics route
  app.get('/api/dashboard/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analytics = await storage.getDashboardAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard analytics" });
    }
  });

  // Stripe subscription routes
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { priceId, tier } = req.body;
      
      if (!priceId || !tier) {
        return res.status(400).json({ message: "Missing priceId or tier" });
      }

      let user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If user already has a subscription, return existing
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string, {
          expand: ['payment_intent']
        });
        
        return res.json({
          subscriptionId: subscription.id,
          clientSecret: (invoice.payment_intent as any)?.client_secret,
        });
      }

      // Create Stripe customer if doesn't exist
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
        });
        customerId = customer.id;
        await storage.updateUserStripeCustomerId(userId, customerId);
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription info
      await storage.updateUserSubscription(userId, subscription.id, tier);

      const invoice = subscription.latest_invoice as any;
      const paymentIntent = invoice?.payment_intent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription", error: error.message });
    }
  });

  // Stripe webhook for handling subscription updates
  app.post('/api/webhook/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await storage.handleSuccessfulPayment(invoice.customer as string);
        break;
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        await storage.handleFailedPayment(failedInvoice.customer as string);
        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await storage.handleCancelledSubscription(subscription.customer as string);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
