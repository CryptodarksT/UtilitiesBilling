# Overview

This is a full-stack web application built with React on the frontend and Express.js on the backend. It's a Vietnamese utility payment system called "Payoo" that allows users to search for bills (electricity, water, internet, TV) and make payments through various methods (QR code, bank transfer, e-wallet). The application uses TypeScript throughout and follows modern web development practices.

## User Preferences

Preferred communication style: Simple, everyday language.
Payment integration: Real MoMo Business API for credit card and e-wallet payments (not demo/simulation).
Bill lookup: Real BIDV API integration for bill lookup by bill number (format: PD29007350490).

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state
- **Build Tool**: Vite for development and building
- **Styling**: Tailwind CSS with shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Connect-pg-simple for PostgreSQL sessions
- **API Structure**: RESTful API with JSON responses

### Project Structure
The application follows a monorepo structure with shared code:
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and schemas

## Key Components

### Database Schema
The application uses three main tables:
- **customers** - Store customer information (ID, name, address, phone, email)
- **bills** - Store bill information (customer ID, bill type, provider, amount, status, due date)
- **payments** - Store payment records (bill ID, amount, payment method, transaction ID, status)

### API Endpoints
- `POST /api/bills/lookup` - Search for bills by customer ID and bill type
- `POST /api/bills/lookup-by-number` - Search for bills by bill number using BIDV API
- `POST /api/payments` - Create a new payment record with MoMo integration
- `POST /api/payments/momo/ipn` - MoMo IPN (Instant Payment Notification) endpoint
- `GET /api/payments/:transactionId` - Get payment status
- `GET /api/payments/history/:customerId` - Get payment history
- `GET /api/providers/:billType` - Get providers by bill type

### Frontend Components
- **Bill Lookup** - Search form for finding customer bills
- **Bill Info** - Display bill details and customer information
- **Payment Methods** - Selection interface for payment options
- **Payment Modal** - Payment processing interface
- **Stats Cards** - Dashboard showing payment statistics

## Data Flow

1. User searches for a bill using customer ID and bill type
2. System queries the database for matching bills and customer information
3. Bill details are displayed with available payment methods
4. User selects payment method and initiates payment
5. Payment record is created and processed
6. Payment status is updated and confirmed

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Form Validation**: Zod for schema validation
- **HTTP Client**: Fetch API with React Query
- **Icons**: Lucide React icons
- **Date Handling**: date-fns library

### Backend Dependencies
- **Database**: In-memory storage with PostgreSQL schema compatibility
- **Validation**: Zod schemas shared between frontend and backend
- **Payment Processing**: MoMo Business API integration
- **Bill Lookup**: BIDV API integration for real bill data
- **Cryptography**: crypto-js for MoMo signature generation
- **HTTP Client**: Axios for external API calls

## Deployment Strategy

### Development
- Vite dev server for frontend with hot module replacement
- Express server with TypeScript compilation via tsx
- Database migrations handled by Drizzle Kit

### Production Build
- Frontend builds to static files in `dist/public`
- Backend compiles to `dist/index.js` using esbuild
- Database schema deployment via `npm run db:push`

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development and production build scripts configured
- TypeScript configuration covers all source directories

The application demonstrates modern full-stack development practices with type safety, proper separation of concerns, and a clean architecture that supports both development and production deployment.