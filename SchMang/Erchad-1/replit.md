# Overview

Erchad is a comprehensive student information management system designed for Arabic-speaking schools. It enables teachers and administrators to manage student data, groups/classes, attendance, permissions, violations, and generate reports. The system supports RTL layout, student reception tracking, absence management, special status monitoring, and teacher coordination. It aims to streamline administrative tasks and provide robust data management for educational institutions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack:** React 18 with TypeScript, Vite, Wouter for routing, and React Query for server state management.
**UI/UX:** Tailwind CSS for styling and Lucide-react for iconography. The design emphasizes consistency with professional, color-coded pages for different functionalities (e.g., orange for permissions, red for violations).
**Form Handling:** React Hook Form with Zod for validation.
**Data Layer:** Dual storage pattern using Supabase for real-time backend connectivity and Dexie (IndexedDB) for offline-first capabilities and local caching, implementing a sync pattern.
**Date Handling:** All dates are stored in ISO Gregorian format (`YYYY-MM-DD`) and displayed to the user in Hijri calendar format. Date filtering is performed using ISO Gregorian dates.

## Backend Architecture

**Server Framework:** Express 5 on Node.js, serving API endpoints and integrating with Vite for development.
**Database ORM:** Drizzle ORM for type-safe queries with Zod schema validation.
**API Design:** RESTful endpoints with Zod schema validation for incoming requests.
**Storage Abstraction:** An `IStorage` interface with `DbStorage` implementation allows for flexible storage backend changes.

## Database Schema

**Core Entities:** Students, Groups, Special Statuses, Teachers, and Teacher Groups (junction table).
**Activity Tracking:** `student_visits`, `student_permissions`, `student_violations` tables.
**System Tables:** `teacher_profile` and `login_credentials`.
**Indexing:** Foreign keys, `created_at` timestamps, and `display_order` for sorting.

## Authentication & Authorization

**Authentication:** Credential-based login using the `login_credentials` table.
**Session Management:** `localStorage` for login state.
**Password Reset:** Token-based mechanism with a time-limited 6-digit code.
**Auto-Logout:** Configurable automatic logout based on user inactivity, with options for various durations.
**Security Note:** Current password handling needs enhancement (proper hashing).

## Key Features

- **Advanced Filtering:** Dynamic filters on the main page for special statuses, academic stages, and groups, with intelligent dependencies and a reset option.
- **Database Management:** API endpoint and UI for clearing all student, teacher, and group data. Backup and restore functionality for exporting/importing all system data as JSON.
- **Permission and Violation Management:** Dedicated pages for recording and viewing student permissions and violations, including student search, details display, and historical data filtering.
- **WhatsApp Integration:** Standardized phone number formatting (`formatPhoneForWhatsApp` utility) for seamless WhatsApp communication. All WhatsApp links use the format `https://wa.me/966XXXXXXXXX?text=...` with double validation: checks for phone number presence and validates formatted output. Clear error messages guide users to correct invalid phone numbers in student data. Supports various input formats: 0555..., 966555..., +966..., 00966..., 9660555...

# External Dependencies

## Database Services

**Neon PostgreSQL:** Primary production database for serverless PostgreSQL.
**Supabase:** Used by frontend components for real-time subscriptions and authentication.
**IndexedDB (via Dexie):** Browser-based storage for offline functionality and local caching.

## Third-Party Libraries

**Data Management:** `xlsx` for Excel import/export.
**UI Components:** Lucide-react for icons.
**Form Management:** React Hook Form with Hookform Resolvers and Zod.
**Development Tools:** TypeScript, ESLint, Vite, tsx.

## Environment Variables

- `DATABASE_URL`: Neon PostgreSQL connection string.
- `VITE_SUPABASE_URL`: Supabase project URL (frontend).
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key (frontend).