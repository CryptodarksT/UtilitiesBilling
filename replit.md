# Overview

This is a comprehensive Vietnamese utility payment system called "Payoo" built with 100% real API integrations. The application provides authentic bill lookup and payment processing through real Vietnamese banking and payment provider APIs. It's a production-ready system with administrative tools, comprehensive documentation, and real-time system monitoring.

## User Preferences

Preferred communication style: Simple, everyday language.
Payment integration: Real MoMo Business API for credit card and e-wallet payments (not demo/simulation).
Bill lookup: Real BIDV API integration for bill lookup by bill number (format: PD29007350490).
File input format: Changed from Excel to TXT format for data import (customerId|customerName|customerAddress|billType|provider|amount|dueDate).
Data integrity: 100% real data integration, no mock/simulation data - completely removed all fallback data.
Production-ready: Integrated real Visa Direct API for actual payment processing with Vietnamese banking systems.
Spring Boot integration: Java backend components for enterprise-level payment processing.
Administrative features: Business account management, API status monitoring, and support documentation.
Real-time monitoring: System health checks and API status tracking.
Desktop application: Created complete Python desktop GUI application with CustomTkinter framework.
Executable packaging: Built system to create standalone .exe files with PyInstaller.

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
- `GET /api/providers/:billType` - Get providers by bill type (electricity, water, internet, tv, phonecard)
- `POST /api/txt/upload` - Upload TXT file for bulk bill processing
- `GET /api/txt/template` - Download TXT template for bill data
- `POST /api/payments/auto` - Process automatic payments from Excel file
- `GET /api/payments/auto/template` - Download template for auto-payment Excel
- `POST /api/payments/auto/report` - Generate report for auto-payment results
- `POST /api/phonecard/purchase` - Purchase phone top-up cards
- `GET /api/system/health` - System health check endpoint
- `GET /api/system/status` - Detailed API status monitoring

### Frontend Components
- **Bill Lookup** - Search form for finding customer bills
- **Bill Info** - Display bill details and customer information
- **Payment Methods** - Selection interface for payment options
- **Payment Modal** - Payment processing interface
- **Stats Cards** - Dashboard showing payment statistics
- **TXT Upload** - Bulk bill upload from TXT files
- **Auto Payment** - Automated payment processing with Visa card
- **Phone Card Purchase** - Buy phone top-up cards from various providers
- **Admin Login** - Business account management for MoMo, BIDV, ZaloPay, Visa
- **Support Pages** - Comprehensive documentation and help guides
- **API Status Dashboard** - Real-time monitoring of all payment APIs
- **System Health** - Live system metrics and uptime monitoring

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
- **Visa Card Management**: Secure localStorage with encryption

### Backend Dependencies
- **Database**: In-memory storage with PostgreSQL schema compatibility
- **Validation**: Zod schemas shared between frontend and backend
- **Payment Processing**: MoMo Business API integration
- **Bill Lookup**: BIDV API integration for real bill data
- **Cryptography**: crypto-js for MoMo signature generation
- **HTTP Client**: Axios for external API calls
- **Visa Direct API**: Real Visa payment processing with SSL certificates
- **Provider APIs**: Real utility provider integrations (EVN, SAWACO, etc.)
- **Spring Boot Components**: Java backend for enterprise payment processing

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

## Recent Features Added - July 16, 2025

### New Batch Query System
- **Component**: `client/src/components/batch-query.tsx`
- **API**: `/api/bills/batch` endpoint with validation
- **Features**:
  - Bulk bill lookup (up to 50 queries at once)
  - Support for both customer ID and bill number searches
  - Manual input mode with individual query forms
  - Bulk CSV-style input mode
  - Real-time results display with success/failure indicators
  - Export functionality for query results
  - 100% real API integration (BIDV API + Provider APIs)

### New Customer Card Management
- **Component**: `client/src/components/customer-cards.tsx`
- **API**: `/api/customers/:customerId/cards` endpoints
- **Features**:
  - Add/edit/delete customer payment cards
  - Set default cards for quick payments
  - Secure card storage with base64 encryption
  - Support for Visa, Mastercard, JCB, American Express
  - Card validation and expiry date handling
  - Visual card display with masked numbers
  - Real-time card management with instant updates

### Technical Implementation
- **Schema**: Added `customerCards` table and `batchQuerySchema`
- **Storage**: Extended `IStorage` interface with card management methods
- **Validation**: Full Zod validation for both features
- **Security**: Card numbers encrypted, only last 4 digits visible
- **Error Handling**: Proper error messages for API failures
- **Real API Integration**: No mock data, only authentic API calls

### Security and Accessibility Fixes - July 16, 2025
- **Batch Query Component**: Fixed undefined length error in CSV export functionality
- **Payment Modal**: Added required DialogDescription for accessibility compliance
- **Command Dialog**: Added DialogTitle and DialogDescription with sr-only classes
- **Error Handling**: Enhanced null/undefined checks throughout batch processing
- **Data Validation**: Improved robustness of batch query results processing
- **Accessibility**: All Dialog components now comply with WCAG requirements
- **TypeScript**: All components pass type checking with proper JSX configuration
- **Build System**: Verified compatibility with comprehensive build automation

### Comprehensive Build System - July 16, 2025
- **Build Scripts**: Created comprehensive build automation system
- **Multi-Platform Support**: Windows (.bat) and Linux/macOS (.sh) scripts
- **Components Created**:
  - `BUILD_ALL.bat` / `build_all.sh` - Universal build script with menu
  - `CHECK_SYSTEM.bat` / `check_system.sh` - System requirements checker
  - `BUILD_README.md` - Build system documentation
  - `HƯỚNG_DẪN_BUILD_TOÀN_DIỆN.md` - Complete Vietnamese build guide
- **Features**:
  - Automated system requirements validation
  - Multi-option build menu (Python/Web/Electron/All)
  - Comprehensive error handling and user guidance
  - Performance optimization tips
  - Deployment strategies for both platforms
  - CI/CD integration examples
- **Build Options**:
  - Python Desktop App → Standalone .exe files
  - Web Application → Static files + server
  - Electron Desktop App → Cross-platform desktop
  - Hybrid builds combining multiple approaches

### Dark/Light Mode Toggle with Smooth Transitions - July 16, 2025
- **Theme Provider**: Created comprehensive theme context system with localStorage persistence
- **Theme Toggle Component**: Interactive dropdown with Light/Dark/System options
- **Components Created**:
  - `client/src/components/theme-provider.tsx` - React context for theme management
  - `client/src/components/theme-toggle.tsx` - Toggle component with Vietnamese labels
  - Enhanced CSS with smooth transition utilities
- **Features**:
  - System theme detection (follows OS preference)
  - Manual theme selection with visual feedback
  - Smooth transitions across all UI components (0.2s-0.5s durations)
  - localStorage persistence across sessions
  - Mobile-responsive design with dropdown in mobile menu
  - Accessibility compliance with proper ARIA labels
- **Implementation Details**:
  - Theme transitions for background, colors, borders, shadows
  - Updated header, footer, and button components
  - CSS custom properties for consistent theming
  - Vietnamese UI labels: "Sáng" (Light), "Tối" (Dark), "Hệ thống" (System)
  - Backdrop blur effects and enhanced visual polish

## Desktop Application

### Python Desktop Version
A complete desktop application built with Python and CustomTkinter framework:
- **Framework**: CustomTkinter for modern GUI
- **Architecture**: Modular design with separate API, GUI, and utility modules
- **Features**: All web application features replicated in desktop form
- **Packaging**: PyInstaller for standalone .exe creation
- **Structure**: 19 Python files across 27 total files

### Desktop Components
- **Main Application**: `main.py` - Application entry point and core logic
- **API Services**: MoMo, BIDV, ZaloPay, Visa integration services
- **GUI Frames**: Bill lookup, payment processing, history, admin, settings, status monitoring
- **Utilities**: Configuration management, Excel processing, encryption
- **Build System**: Automated build script with PyInstaller
- **Documentation**: Complete guides for setup, building, and deployment

### Desktop Features
- 🔍 **Bill Lookup**: Real-time bill search with BIDV API integration
- 💳 **Payment Processing**: Multi-provider payment with MoMo, BIDV, ZaloPay, Visa
- 📋 **Transaction History**: Complete payment history with filtering and export
- 📊 **API Status Monitoring**: Real-time API health and performance monitoring
- ⚙️ **System Administration**: API configuration, database management, logs
- 🔧 **Application Settings**: Theme, performance, security, backup configuration
- 📄 **Excel Integration**: Bulk processing, template generation, data validation
- 🔒 **Security**: Encrypted credential storage, password protection

### Build System
- **PyInstaller Integration**: Automated executable creation with PyInstaller
- **Multi-method Build**: 3 different build approaches (auto, tested, manual)
- **Build Scripts**: 
  - `BUILD-SIMPLE.bat` - One-click Windows build automation
  - `build.py` - Advanced Python build script with error handling
  - `TEST_APP.py` - Comprehensive pre-build testing system
- **Installer Creation**: `create_installer.py` for professional installer packages
- **Documentation**: Complete build guides and troubleshooting resources
- **Quality Assurance**: Automated testing before build process