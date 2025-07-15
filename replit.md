# Overview

This is a full-stack web application built with React on the frontend and Express.js on the backend. It's a Vietnamese utility payment system called "Payoo" that allows users to search for bills (electricity, water, internet, TV) and make payments through various methods (QR code, bank transfer, e-wallet). The application uses TypeScript throughout and follows modern web development practices.

## User Preferences

Preferred communication style: Simple, everyday language.
Communication language: Vietnamese (always reply in Vietnamese).
Payment integration: Real MoMo Business API for credit card and e-wallet payments (not demo/simulation).
Bill lookup: Real BIDV API integration for bill lookup by bill number (format: PD29007350490).
Excel functionality: Added Excel file upload capability for bulk bill processing.
Data integrity: 100% real data integration, no mock/simulation data.
Authentication: API key-based authentication system (replaced Firebase completely).
Card management: Encrypted card storage with database integration for business customers.
3DS verification: Full 3D Secure verification for Visa cards via VNPay integration (implemented with popup/redirect flow).
Deployment: VPS Windows deployment on IP 160.30.44.141 with Administrator account.

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
The application uses six main tables:
- **customers** - Store customer information (ID, name, address, phone, email)
- **bills** - Store bill information (customer ID, bill type, provider, amount, status, due date)
- **payments** - Store payment records (bill ID, amount, payment method, transaction ID, status)
- **userAccounts** - Business user accounts with API key authentication
- **linkedCards** - Encrypted card storage with 3DS verification (cardToken, is3DSVerified, verifiedAt, lastUsed)
- **customerTokens** - Secure tokens for auto-payment functionality

### API Endpoints
- `POST /api/bills/lookup` - Search for bills by customer ID and bill type
- `POST /api/bills/lookup-by-number` - Search for bills by bill number using BIDV API
- `POST /api/payments` - Create a new payment record with MoMo integration
- `POST /api/payments/momo/ipn` - MoMo IPN (Instant Payment Notification) endpoint
- `GET /api/payments/:transactionId` - Get payment status
- `GET /api/payments/history/:customerId` - Get payment history
- `GET /api/providers/:billType` - Get providers by bill type (electricity, water, internet, tv, phonecard)
- `POST /api/excel/upload` - Upload Excel file for bulk bill processing
- `GET /api/excel/template` - Download Excel template for bill data
- `POST /api/payments/auto` - Process automatic payments from Excel file
- `GET /api/payments/auto/template` - Download template for auto-payment Excel
- `POST /api/payments/auto/report` - Generate report for auto-payment results
- `POST /api/phonecard/purchase` - Purchase phone top-up cards
- `POST /api/auth/register` - Register new business user with API key authentication
- `GET /api/auth/profile` - Get authenticated user profile
- `POST /api/cards/link` - Link payment card to customer account
- `GET /api/cards` - Get user's linked payment cards
- `PATCH /api/cards/:cardId/default` - Set default payment card
- `DELETE /api/cards/:cardId` - Remove linked payment card
- `POST /api/tokens/generate` - Generate customer token for auto-payment
- `POST /api/payments/auto-card` - Process payment with linked card
- `GET /api/cards/3ds-callback` - 3DS verification callback for Visa cards
- `POST /api/payments/visa-card` - Process payment with 3DS verified Visa card
- `POST /api/payments/3ds-url` - Create 3DS payment URL for web-based flow

### Frontend Components
- **Bill Lookup** - Search form for finding customer bills
- **Bill Info** - Display bill details and customer information
- **Payment Methods** - Selection interface for payment options
- **Payment Modal** - Payment processing interface
- **Stats Cards** - Dashboard showing payment statistics
- **Excel Upload** - Bulk bill upload from Excel files
- **Auto Payment** - Automated payment processing with Visa card
- **Phone Card Purchase** - Buy phone top-up cards from various providers

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
- **3DS Verification**: VNPay integration for Visa card 3D Secure authentication
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

## Recent Changes (2024)

### December 2024 - API Key Authentication Migration
- **Completed:** Replaced Firebase authentication with API key-based system
- **Changes:** Updated database schema, removed Firebase dependencies, created AuthService
- **Impact:** Simplified authentication flow, better suited for business API integration
- **Files:** `server/auth-service.ts`, `server/auth-middleware.ts`, `shared/schema.ts`

### VPS Windows Deployment Setup
- **Target:** VPS Windows Server on IP 160.30.44.141
- **Created:** Complete deployment scripts and documentation
- **Files:** `deploy.ps1`, `build.bat`, `start.bat`, `DEPLOYMENT_COMPLETE.md`
- **Features:** PM2 process management, PostgreSQL setup, automated deployment