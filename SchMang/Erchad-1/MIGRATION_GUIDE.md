# دليل ترحيل المكونات - من Supabase إلى API

## النمط الأساسي للترحيل

### 1. استبدال Supabase بـ React Query

**قبل (Supabase):**
```typescript
import { supabase } from './lib/supabase'

const { data } = await supabase.from('students').select('*')
```

**بعد (React Query):**
```typescript
import { useQuery } from '@tanstack/react-query'

const { data: students = [] } = useQuery({
  queryKey: ['/api/students']
})
```

### 2. استبدال IndexedDB بـ API Mutations

**قبل (IndexedDB):**
```typescript
import { db } from './lib/db'

await db.students.add(student)
```

**بعد (API):**
```typescript
import { useMutation } from '@tanstack/react-query'
import { apiRequest, queryClient } from '@/lib/queryClient'

const createStudent = useMutation({
  mutationFn: (student) => apiRequest('/api/students', 'POST', student),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/students'] })
  }
})

createStudent.mutate(student)
```

### 3. النمط الكامل لمكون

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiRequest, queryClient } from '@/lib/queryClient'

export function MyComponent() {
  // جلب البيانات
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['/api/items']
  })

  // إضافة عنصر
  const createItem = useMutation({
    mutationFn: (item) => apiRequest('/api/items', 'POST', item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] })
    }
  })

  // تحديث عنصر
  const updateItem = useMutation({
    mutationFn: ({ id, data }) => apiRequest(`/api/items/${id}`, 'PATCH', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] })
    }
  })

  // حذف عنصر
  const deleteItem = useMutation({
    mutationFn: (id) => apiRequest(`/api/items/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] })
    }
  })

  if (isLoading) return <div>جاري التحميل...</div>

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => deleteItem.mutate(item.id)}>حذف</button>
        </div>
      ))}
    </div>
  )
}
```

## المكونات التي تم ترحيلها

- ✅ LoginPage
- ✅ App.tsx (الهيكل الأساسي)

## المكونات التي تحتاج للترحيل

### المكونات الفرعية (Components)
- [ ] StudentForm.tsx
- [ ] StudentsList.tsx
- [ ] ExcelImport.tsx
- [ ] EditStudentModal.tsx
- [ ] ManageModal.tsx
- [ ] ProfileSettings.tsx
- [ ] SendToTeacherModal.tsx
- [ ] SearchBar.tsx (لا يحتاج ترحيل)
- [ ] GroupSelector.tsx (لا يحتاج ترحيل)
- [ ] FiltersPanel.tsx (لا يحتاج ترحيل)
- [ ] AllowClassEntryModal.tsx

### الصفحات (Pages)
- [ ] TeachersPage.tsx
- [ ] GroupsPage.tsx
- [ ] GroupsManagementPage.tsx
- [ ] SpecialStatusPage.tsx
- [ ] AbsencePage.tsx
- [ ] ReceptionPage.tsx
- [ ] PermissionPage.tsx

## أمثلة محددة

### مثال 1: ترحيل StudentsList

**الأجزاء التي تحتاج تغيير:**
1. حذف السطر: `await db.students.delete(id)`
2. استخدام mutation للحذف:
```typescript
const deleteStudent = useMutation({
  mutationFn: (id: string) => apiRequest(`/api/students/${id}`, 'DELETE'),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/students'] })
    // استدعاء onStudentDeleted إذا كان موجوداً
  }
})
```

### مثال 2: ترحيل ExcelImport

**التغييرات المطلوبة:**
1. بدلاً من `db.students.bulkAdd(students)`:
```typescript
const importStudents = useMutation({
  mutationFn: (students) => apiRequest('/api/students/bulk', 'POST', { students }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/students'] })
  }
})
```

### مثال 3: ترحيل ProfileSettings

**التغييرات:**
1. جلب البروفايل:
```typescript
const { data: profile } = useQuery({
  queryKey: ['/api/teacher-profile']
})
```

2. حفظ البروفايل:
```typescript
const saveProfile = useMutation({
  mutationFn: (data) => apiRequest('/api/teacher-profile', 'POST', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/teacher-profile'] })
  }
})
```

## نصائح مهمة

1. **دائماً استخدم `invalidateQueries` بعد التعديلات**
2. **استخدم `isLoading` و `isPending` لعرض حالات التحميل**
3. **تعامل مع الأخطاء باستخدام `onError`**
4. **احذف جميع استيرادات Supabase و IndexedDB**

## الخطوات التالية

1. افتح ملف المكون الذي تريد ترحيله
2. ابحث عن `supabase.from` و `db.`
3. استبدلها بـ `useQuery` أو `useMutation`
4. تأكد من استيراد `useQuery, useMutation` من `@tanstack/react-query`
5. تأكد من استيراد `apiRequest, queryClient` من `@/lib/queryClient`
6. جرب المكون وتأكد من عمله
