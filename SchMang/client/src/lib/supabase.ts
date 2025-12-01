// النظام يعمل بالكامل على IndexedDB (قاعدة بيانات محلية في المتصفح)
// لا يحتاج إنترنت أو Supabase - البيانات محفوظة بشكل دائم في جهازك
import { indexedDBClient } from './indexedDBWrapper'

// تصدير IndexedDB client كـ "supabase" للحفاظ على التوافق مع الكود الموجود
export const supabase = indexedDBClient
