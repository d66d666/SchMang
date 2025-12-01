# Overview

Erchad is a comprehensive student information management system designed for Arabic-speaking schools. The application enables teachers and administrators to manage student data, groups/classes, attendance, permissions, violations, and special status tracking. The system is designed with an RTL (right-to-left) interface and supports bilingual date handling (Gregorian for storage, Hijri for display). **The system works completely offline using IndexedDB (browser-based local database) with permanent data storage - no internet or external database required.**

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack:** React 18 with TypeScript, built using Vite as the build tool and development server. Wouter is used for client-side routing.

**State Management:** The application uses React Query (`@tanstack/react-query`) for server state management, providing automatic caching, background refetching, and optimistic updates. The query client is configured with a 5-minute stale time and disabled window focus refetching.

**UI Framework:** Tailwind CSS provides utility-first styling with RTL support. Lucide-react supplies iconography. The design uses color-coded pages (blue for students, orange for permissions, red for violations) for visual organization.

**Form Handling:** React Hook Form with Zod validation via `@hookform/resolvers` manages form state and validation.

**Data Layer:** The application uses IndexedDB exclusively for data storage via a custom Supabase-compatible wrapper (`client/src/lib/indexedDBWrapper.ts`). This allows the application to work 100% offline while maintaining compatibility with existing Supabase-style API calls throughout the codebase. All data is stored permanently in the browser's IndexedDB until explicitly deleted by the user.

**Date Handling:** All dates are stored in ISO Gregorian format (`YYYY-MM-DD`) and displayed to users in Hijri calendar format.

**Problem Addressed:** Managing student data in Arabic-speaking educational institutions with complete offline capability and permanent local storage without requiring external databases or internet connectivity.

**Chosen Solution:** IndexedDB with Supabase-compatible API wrapper provides permanent offline storage while maintaining code compatibility and simplicity.

## Backend Architecture

**Server Framework:** Express 5.x running on Node.js serves the Vite development server and static assets. The server provides API endpoints primarily for potential future enhancements, but the application currently operates entirely client-side using IndexedDB.

**Storage Implementation:** The application uses an in-memory storage implementation (`server/memStorage.ts`) that implements the `IStorage` interface from `server/storage.ts`. This server-side storage is temporary and resets on server restart, as the primary data persistence happens in the browser's IndexedDB.

**API Design:** RESTful endpoints follow standard conventions with Zod schema validation. The API provides CRUD operations for all entities, but these are currently not used by the frontend which operates directly on IndexedDB.

**Request Logging:** Custom middleware logs all API requests with method, path, status code, duration, and truncated response body for debugging.

**Development Integration:** Vite middleware is integrated into Express for HMR support and single-port development workflow.

**Problem Addressed:** Providing a simple local development server for the frontend while maintaining flexibility for potential future server-side features.

**Chosen Solution:** Express with in-memory storage provides a lightweight server for development without requiring external database setup.

**Trade-offs:** Server-side data is temporary and resets on restart. Primary data persistence is in the browser's IndexedDB.

## Database Schema (IndexedDB)

**Core Entities:**
- `students` - Student records with name, IDs, contact info, group assignment, special status, and activity counters
- `groups` - Class/group definitions with stage and display order
- `special_statuses` - Custom status categories (e.g., medical conditions, special needs)
- `teachers` - Teacher records with contact information
- `teacher_groups` - Junction table mapping teachers to groups they oversee

**Activity Tracking Tables:**
- `student_visits` - Records of student visits to counselor/administration
- `student_permissions` - Permission/leave requests with guardian notification tracking
- `student_violations` - Disciplinary incidents and actions taken

**System Tables:**
- `teacher_profile` - Single-row table for counselor/administrator profile and school settings
- `login_credentials` - Authentication credentials with password reset token support

**Indexing Strategy:** IndexedDB indexes are defined in `client/src/lib/db.ts` using Dexie schema. Indexes enable efficient querying by ID, student_id, group_id, dates, and other frequently accessed fields.

**Problem Addressed:** Need for local data persistence with support for Arabic text and complex querying without requiring external database setup.

**Chosen Solution:** IndexedDB via Dexie provides permanent browser-based storage with a SQL-like query interface, supporting all necessary data operations offline.

## Authentication & Authorization

**Authentication Method:** Simple credential-based login using `login_credentials` table. Username and password are validated against stored credentials.

**Session Management:** Login state is persisted in `localStorage` with keys `isLoggedIn` and `userId`.

**Hidden Account:** A hardcoded "master admin" account exists (username: `Wael`, password: `0558890902`) that bypasses database authentication.

**Password Reset:** Token-based password reset mechanism generates a 6-digit code with time-limited validity stored in `reset_token` and `reset_token_expires` fields.

**Auto-Logout:** Configurable automatic logout based on user inactivity duration (stored in `teacher_profile.autoLogoutMinutes`), with options for various time periods.

**Security Considerations:** Current implementation stores passwords in plain text or simple hashing. This needs enhancement with proper password hashing (bcrypt/argon2) before production use.

**Problem Addressed:** Need for simple, Arabic-friendly authentication for single-school deployment.

**Chosen Solution:** Credential-based auth with localStorage persistence provides simplicity for small-scale deployment.

**Limitations:** No role-based access control, weak password security, client-side session management vulnerable to XSS.

## Key Features

**Advanced Filtering:** Dynamic filtering on main page by special status, student status, academic stage, and group with intelligent dependency management and reset functionality.

**Database Management:** API endpoint and UI for clearing all student, teacher, and group data. Backup and restore functionality exports/imports all system data as JSON.

**Permission and Violation Tracking:** Dedicated pages for recording and viewing student permissions and violations with student search, detail display, date filtering, and historical data views.

**WhatsApp Integration:** Standardized phone number formatting (`formatPhoneForWhatsApp` utility) for seamless WhatsApp communication. All WhatsApp links use format `https://wa.me/966XXXXXXXXX?text=...` with pre-filled messages.

**Excel Import/Export:** Bulk student and teacher import from Excel files using `xlsx` library with column validation and error reporting.

**Print Functionality:** Print-optimized views for student lists, special status reports, and activity records with RTL layout support.

**Migration Pattern:** Components should use `useQuery` for data fetching and `useMutation` for data modifications, replacing direct Supabase/IndexedDB calls. The `apiRequest` helper function in `queryClient.ts` simplifies API calls with automatic error handling.

# External Dependencies

## Local Storage Only

**No External Database Required:** The application does not require PostgreSQL, Supabase, or any external database. All packages related to Neon PostgreSQL (`@neondatabase/serverless`) and Drizzle are installed but not actively used - the application operates entirely on IndexedDB in the browser.

**Environment Variables:** The system does not require `DATABASE_URL`, `VITE_SUPABASE_URL`, or `VITE_SUPABASE_ANON_KEY`. The application will work with default placeholder values.

**Data Persistence:** All data persists permanently in the browser's IndexedDB storage until manually deleted through the application's "Clear Database" feature.

## Primary Data Storage

**IndexedDB via Dexie:** The application uses Dexie (IndexedDB wrapper) as the primary and only data storage mechanism. All data is stored permanently in the browser's IndexedDB until explicitly deleted.

**Supabase Compatibility Layer:** `client/src/lib/indexedDBWrapper.ts` provides a Supabase-compatible API that translates Supabase-style queries into IndexedDB operations. This allows existing code to work without modification while using only local storage. The `@supabase/supabase-js` package is still installed but not used - the application redirects all "Supabase" calls to IndexedDB through the wrapper.

## File Processing

**XLSX:** `xlsx` library handles Excel file parsing and generation for student/teacher bulk import/export features.

## UI & Utilities

**Lucide React:** Icon library providing consistent iconography throughout the application.

**React Hook Form:** Form state management with `@hookform/resolvers` for Zod schema integration.

**Zod:** Runtime type validation for forms, API requests, and database schemas via `drizzle-zod`.

## Development Tools

**TypeScript:** Strict type checking enabled with separate tsconfig files for client (`tsconfig.app.json`) and server (`tsconfig.node.json`).

**ESLint:** Code linting with React-specific rules and TypeScript support.

**TSX:** TypeScript execution environment for running server code directly without compilation step.

**Path Aliases:** Configured in both tsconfig files - `@/*` for client source, `@shared/*` for shared schema, `@assets/*` for attached assets.