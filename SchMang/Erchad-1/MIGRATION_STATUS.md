# Migration Status - Bolt to Replit

## ✅ Completed

### Backend Infrastructure
1. **Database Schema** - All tables defined in `shared/schema.ts`:
   - students, groups, special_statuses, teachers, teacher_groups
   - student_visits, student_permissions, student_violations
   - teacher_profile, login_credentials

2. **Database Setup** - Neon PostgreSQL configured and schema pushed successfully

3. **Storage Layer** - `server/dbStorage.ts` implements all CRUD operations for:
   - Students (including bulk import)
   - Groups
   - Special Statuses
   - Teachers & Teacher Groups
   - Student Visits, Permissions, Violations
   - Teacher Profile
   - Login Credentials

4. **API Routes** - `server/routes.ts` provides REST endpoints:
   - `/api/groups` - GET, POST, PATCH, DELETE
   - `/api/special-statuses` - GET, POST, DELETE
   - `/api/students` - GET, POST, PATCH, DELETE, bulk POST
   - `/api/teachers` - GET, POST, PATCH, DELETE
   - `/api/teacher-groups` - GET, POST, DELETE
   - `/api/student-visits` - GET, POST, DELETE
   - `/api/student-permissions` - GET, POST, DELETE
   - `/api/student_violations` - GET, POST, DELETE
   - `/api/teacher-profile` - GET, POST
   - `/api/login` - POST
   - `/api/init-login` - POST

5. **Server Setup** - Express server running on port 5000
   - Vite dev server integrated
   - Hot Module Replacement (HMR) working
   - Request logging enabled

6. **Client Infrastructure**
   - React Query setup with `@tanstack/react-query`
   - Query client configured in `client/src/lib/queryClient.ts`
   - Default fetcher and mutation helper (apiRequest) ready

## 🔨 Next Steps (User Action Required)

### Frontend Component Migration

The existing components in `client/src/components/` and `client/src/pages/` still use:
- Supabase client (`client/src/lib/supabase.ts`)
- IndexedDB (Dexie) (`client/src/lib/db.ts`)

These need to be updated to use the new API routes. For each component:

1. **Replace Supabase calls** with React Query hooks:
   ```typescript
   // Old (Supabase)
   const { data } = await supabase.from('students').select('*')
   
   // New (React Query)
   const { data, isLoading } = useQuery({ queryKey: ['/api/students'] })
   ```

2. **Replace IndexedDB** with API mutations:
   ```typescript
   // Old (IndexedDB)
   await db.students.add(student)
   
   // New (API)
   await apiRequest('/api/students', 'POST', student)
   ```

3. **Update imports**:
   ```typescript
   // Remove
   import { supabase } from '@/lib/supabase'
   import { db } from '@/lib/db'
   
   // Add
   import { useQuery, useMutation } from '@tanstack/react-query'
   import { apiRequest, queryClient } from '@/lib/queryClient'
   ```

### Files to Update

**Main App**: `client/src/App.tsx`
- Remove Supabase fetchData function
- Use React Query to fetch groups, statuses, students, teachers, profile
- Update all state management to use server data

**Components**:
- `StudentForm.tsx` - Use mutations for creating/updating students
- `StudentsList.tsx` - Use queries for students, mutations for delete
- `ExcelImport.tsx` - Use bulk students endpoint
- `EditStudentModal.tsx` - Use student mutation
- `ManageModal.tsx` - Use groups/statuses mutations
- `ProfileSettings.tsx` - Use teacher profile endpoint
- `SendToTeacherModal.tsx` - Use teachers endpoint

**Pages**:
- `TeachersPage.tsx` - Use teachers API
- `GroupsPage.tsx` - Use groups API
- `GroupsManagementPage.tsx` - Use groups API
- `SpecialStatusPage.tsx` - Use special statuses + students API
- `AbsencePage.tsx` - Use violations API
- `ReceptionPage.tsx` - Use visits API
- `PermissionPage.tsx` - Use permissions API
- `LoginPage.tsx` - Use login API

### Clean Up

After migration:
1. Remove `client/src/lib/supabase.ts`
2. Remove `client/src/lib/db.ts` (Dexie)
3. Remove `@supabase/supabase-js` dependency
4. Remove `dexie` dependency
5. Remove `supabase/` directory

## 📝 Example Migration Pattern

Here's a complete example for the Groups page:

```typescript
// client/src/pages/GroupsPage.tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Group } from '@shared/schema';

export function GroupsPage() {
  // Fetch groups
  const { data: groups = [], isLoading } = useQuery<Group[]>({
    queryKey: ['/api/groups']
  });

  // Create group mutation
  const createGroup = useMutation({
    mutationFn: (group: { name: string; stage: string; displayOrder?: number }) =>
      apiRequest('/api/groups', 'POST', group),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] });
    }
  });

  // Delete group mutation
  const deleteGroup = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/groups/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {groups.map(group => (
        <div key={group.id}>
          {group.name} - {group.stage}
          <button onClick={() => deleteGroup.mutate(group.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🚀 Running the Project

```bash
# Development
npm run dev

# Production build
npm run build

# Production start
npm run start

# Database push (after schema changes)
npm run db:push
```

## 📦 Technology Stack

- **Frontend**: React + Vite + TanStack Query
- **Backend**: Express.js + TypeScript
- **Database**: Neon PostgreSQL (via Replit)
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Styling**: Tailwind CSS

## 🔐 Environment Variables

The following are automatically configured by Replit:
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

## ⚠️ Important Notes

1. **Default Login Credentials**: The system initializes with username `admin` and password `admin123`. You should change this in production.

2. **Port Configuration**: The server runs on port 5000 to work with Replit's webview.

3. **Path Aliases**: Use `@/` for client code, `@shared/` for shared types.

4. **TypeScript**: All types are inferred from the Drizzle schema for type safety.
