# NOVAIA - AI-Powered Coaching Platform

## Overview

NOVAIA is a comprehensive AI-powered coaching platform that helps users improve their physical fitness, nutrition, mental wellness, and productivity. The platform combines modern web technologies with AI-driven personalized coaching across four core modules. Built as a full-stack SaaS application, it features a sleek glass morphism design with an electric blue, black, and white color scheme, targeting users who want to transform their lives through structured, AI-assisted guidance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based architecture
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: TailwindCSS with custom CSS variables for consistent theming
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state management
- **Design System**: Glass morphism aesthetic with custom color palette (electric blue, deep black, white)

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the stack
- **API Design**: RESTful API with structured route organization
- **Session Management**: Express session middleware with PostgreSQL session store
- **Error Handling**: Centralized error handling middleware with structured error responses

### Authentication System
- **Provider**: Replit Authentication (OpenID Connect)
- **Strategy**: Passport.js with OpenID Connect strategy
- **Session Storage**: PostgreSQL-backed session store with configurable TTL
- **Security**: HTTP-only cookies, secure flag for production, CSRF protection

### Database Architecture
- **Database**: PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Design**: 
  - User management (users, user_profiles)
  - Module-specific data (training_sessions, nutrition_entries, mental_sessions, productivity_sessions)
  - AI recommendations and analytics
  - Session storage for authentication
- **Migrations**: Drizzle-kit for schema migrations and management

### Application Modules
1. **Training Module**: Workout tracking, exercise logging, progress analytics
2. **Nutrition Module**: Food logging, calorie tracking, macro analysis, meal planning
3. **Mental Wellness Module**: Meditation sessions, mood tracking, breathing exercises
4. **Productivity Module**: Task management, focus sessions, routine building

### Payment Integration
- **Provider**: Stripe for subscription management
- **Tiers**: Free (limited), Premium (€19/month), Pro+ (€39/month)
- **Implementation**: Stripe Elements for secure payment processing
- **Webhook Handling**: Subscription status updates and payment confirmations

### Build and Development
- **Bundler**: Vite for fast development and optimized production builds
- **Development**: Hot module replacement with Vite middleware integration
- **Production**: ESBuild for server bundling, optimized client build
- **Type Checking**: TypeScript compiler with strict mode enabled

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL (serverless PostgreSQL with connection pooling)
- **Authentication**: Replit Auth service (OpenID Connect provider)
- **Payment Processing**: Stripe (payment gateway and subscription management)

### Development and Build Tools
- **Package Manager**: npm with lockfile for consistent dependencies
- **Bundler**: Vite for development server and build optimization
- **TypeScript**: Strict type checking across frontend and backend
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

### UI and Styling Libraries
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Styling**: TailwindCSS with custom configuration and CSS variables
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx and tailwind-merge for conditional styling

### State Management and API
- **Data Fetching**: TanStack Query for server state, caching, and synchronization
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Native fetch API with credential handling

### Monitoring and Development
- **Error Tracking**: Replit-specific development tools and runtime error overlay
- **Session Storage**: connect-pg-simple for PostgreSQL session management
- **Development Banner**: Replit development environment integration