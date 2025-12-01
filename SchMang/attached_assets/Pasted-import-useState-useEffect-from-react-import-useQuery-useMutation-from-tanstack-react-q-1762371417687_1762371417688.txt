import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiRequest, queryClient } from '@/lib/queryClient'
import { LoginPage } from './pages/LoginPage'
import { ProfileSettings } from './components/ProfileSettings'
import { formatPhoneForWhatsApp } from '@/lib/formatPhone'
import type { Student, SpecialStatus, TeacherProfile } from '@shared/schema'
import {
  Home,
  Users,
  Heart,
  AlertCircle,
  UserCheck,
  LogOut,
  Settings,
  GraduationCap,
  Search,
  User as UserIcon,
  ChevronDown,
  Download,
  Upload,
  List,
  X,
  Trash2,
  Plus,
  Star,
  Clock,
  AlertTriangle,
  MoreVertical,
  CheckCircle,
  Printer,
  Edit,
  BookOpen,
  Phone,
  UserPlus,
  Send,
  PlusCircle,
  UserSearch,
  Calendar,
  Lock,
} from 'lucide-react'

type Page = 'home' | 'groups' | 'special-status' | 'absence' | 'reception' | 'permission' | 'teachers'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showSpecialStatusModal, setShowSpecialStatusModal] = useState(false)
  const [newStatusName, setNewStatusName] = useState('')
  const [showGroupsModal, setShowGroupsModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupStage, setNewGroupStage] = useState('')
  
  // تعديل المجموعة
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null)
  const [editGroupData, setEditGroupData] = useState({ name: '', stage: '' })
  const [showListSettingsModal, setShowListSettingsModal] = useState(false)
  const [showExcelImportModal, setShowExcelImportModal] = useState(false)
  const [showProfileSettingsModal, setShowProfileSettingsModal] = useState(false)
  const [showLoginSettingsModal, setShowLoginSettingsModal] = useState(false)
  
  // حقول إعدادات الملف الشخصي
  const [teacherName, setTeacherName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [teacherPhone, setTeacherPhone] = useState('')
  const [systemDescription, setSystemDescription] = useState('')
  const [openMenuStudentId, setOpenMenuStudentId] = useState<string | null>(null)
  
  // حقول إعدادات تسجيل الدخول
  const [newUsername, setNewUsername] = useState('admin')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loginSettingsError, setLoginSettingsError] = useState('')
  
  // السماح بدخول الفصل
  const [showAllowEntryModal, setShowAllowEntryModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedTeacherId, setSelectedTeacherId] = useState('')
  
  // تعديل الطالب
  const [showEditStudentModal, setShowEditStudentModal] = useState(false)
  const [selectedStage, setSelectedStage] = useState('')
  const [editStudentData, setEditStudentData] = useState({
    name: '',
    nationalId: '',
    phone: '',
    guardianPhone: '',
    grade: '',
    groupId: '',
    specialStatusId: '',
  })
  
  // طباعة بيانات الطالب
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [printStudent, setPrintStudent] = useState<Student | null>(null)
  
  // المعلمين
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false)
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null)
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    phone: '',
    specialization: '',
  })
  
  // حالة المجموعات (مفتوحة/مغلقة) - افتراضياً جميع المجموعات مفتوحة
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  
  // صفحة المجموعات
  const [showSpecialStatusColumn, setShowSpecialStatusColumn] = useState(false)
  const [expandedGroupsPage, setExpandedGroupsPage] = useState<Set<string>>(new Set())
  
  // طباعة المجموعة
  const [showGroupPrintModal, setShowGroupPrintModal] = useState(false)
  const [selectedGroupForPrint, setSelectedGroupForPrint] = useState<any | null>(null)
  
  // إعدادات القوائم - ما يظهر في الصفحة الرئيسية
  const [listSettings, setListSettings] = useState({
    showGroups: true,
    showSpecialStatus: true,
    showReception: true,
    showPermissions: true,
    showViolations: true,
    showTeachers: true,
  })
  
  // إرسال للمعلم
  const [showSendToTeacherModal, setShowSendToTeacherModal] = useState(false)
  const [selectedTeacherForSend, setSelectedTeacherForSend] = useState('')
  const [selectedStageForSend, setSelectedStageForSend] = useState('')
  const [selectedGroupsForSend, setSelectedGroupsForSend] = useState<Set<string>>(new Set())
  
  // طباعة المجموعة - الحالات الخاصة
  const [showSpecialStatusPrintModal, setShowSpecialStatusPrintModal] = useState(false)
  const [selectedGroupForSpecialPrint, setSelectedGroupForSpecialPrint] = useState<any | null>(null)
  
  // تأكيد حذف المجموعة
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<any | null>(null)
  
  // استقبال الطلاب
  const [receptionSearchTerm, setReceptionSearchTerm] = useState('')
  const [selectedStudentForReception, setSelectedStudentForReception] = useState<Student | null>(null)
  const [visitReason, setVisitReason] = useState('')
  const [actionTaken, setActionTaken] = useState('')
  const [referredTo, setReferredTo] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [showDateFilterModal, setShowDateFilterModal] = useState(false)
  const [filterDate, setFilterDate] = useState('')
  const [dateFilterError, setDateFilterError] = useState('')
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<Student | null>(null)
  const [studentSearchTerm, setStudentSearchTerm] = useState('')
  
  // الاستئذان
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('')
  const [selectedStudentForPermission, setSelectedStudentForPermission] = useState<Student | null>(null)
  const [permissionReason, setPermissionReason] = useState('')
  const [permissionNotes, setPermissionNotes] = useState('')
  const [showPermissionDateFilter, setShowPermissionDateFilter] = useState(false)
  const [permissionFilterDate, setPermissionFilterDate] = useState('')
  const [permissionDateFilterError, setPermissionDateFilterError] = useState('')
  const [selectedPermissionStudentFilter, setSelectedPermissionStudentFilter] = useState<Student | null>(null)
  const [permissionStudentSearchTerm, setPermissionStudentSearchTerm] = useState('')
  
  // المخالفات
  const [violationSearchTerm, setViolationSearchTerm] = useState('')
  const [selectedStudentForViolation, setSelectedStudentForViolation] = useState<Student | null>(null)
  const [violationType, setViolationType] = useState('')
  const [violationDescription, setViolationDescription] = useState('')
  const [violationAction, setViolationAction] = useState('')
  const [violationNotes, setViolationNotes] = useState('')
  const [showViolationDateFilter, setShowViolationDateFilter] = useState(false)
  const [violationFilterDate, setViolationFilterDate] = useState('')
  
  // فلاتر الصفحة الرئيسية
  const [homeSpecialStatusFilter, setHomeSpecialStatusFilter] = useState<string>('all')
  const [homeStageFilter, setHomeStageFilter] = useState<string>('all')
  const [homeGroupFilter, setHomeGroupFilter] = useState<string>('all')
  const [violationDateFilterError, setViolationDateFilterError] = useState('')
  const [selectedViolationStudentFilter, setSelectedViolationStudentFilter] = useState<Student | null>(null)
  const [violationStudentSearchTerm, setViolationStudentSearchTerm] = useState('')
  
  // أخطاء التحقق
  const [permissionError, setPermissionError] = useState('')
  const [violationError, setViolationError] = useState('')

  // جلب البيانات من API
  const { data: students = [], isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ['/api/students'],
    enabled: isLoggedIn,
  })

  const { data: groups = [] } = useQuery<any[]>({
    queryKey: ['/api/groups'],
    enabled: isLoggedIn,
  })

  const { data: specialStatuses = [], isLoading: statusesLoading } = useQuery<SpecialStatus[]>({
    queryKey: ['/api/special-statuses'],
    enabled: isLoggedIn,
  })

  const { data: profile, isLoading: profileLoading } = useQuery<TeacherProfile>({
    queryKey: ['/api/teacher-profile'],
    enabled: isLoggedIn,
  })

  const { data: teachers = [] } = useQuery<any[]>({
    queryKey: ['/api/teachers'],
    enabled: isLoggedIn,
  })

  const { data: studentVisits = [] } = useQuery<any[]>({
    queryKey: ['/api/student-visits'],
    enabled: isLoggedIn,
  })

  const { data: studentPermissions = [], isLoading: isLoadingPermissions } = useQuery<any[]>({
    queryKey: ['/api/student-permissions'],
    enabled: isLoggedIn,
  })

  const { data: studentViolations = [], isLoading: isLoadingViolations } = useQuery<any[]>({
    queryKey: ['/api/student-violations'],
    enabled: isLoggedIn,
  })

  // إضافة حالة خاصة جديدة
  const addSpecialStatus = useMutation({
    mutationFn: (name: string) => apiRequest('/api/special-statuses', 'POST', { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/special-statuses'] })
      setNewStatusName('')
    },
  })

  // حذف حالة خاصة
  const deleteSpecialStatus = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/special-statuses/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/special-statuses'] })
    },
  })

  // إضافة مجموعة جديدة
  const addGroup = useMutation({
    mutationFn: (data: { name: string; stage: string }) => 
      apiRequest('/api/groups', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] })
      setNewGroupName('')
      setNewGroupStage('')
    },
  })

  // تحديث مجموعة
  const updateGroup = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; stage: string } }) =>
      apiRequest(`/api/groups/${id}`, 'PATCH', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] })
      setShowEditGroupModal(false)
      setSelectedGroup(null)
    },
  })

  // حذف مجموعة
  const deleteGroup = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/groups/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] })
    },
  })

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
    
    // تحميل إعدادات القوائم من localStorage
    const savedSettings = localStorage.getItem('listSettings')
    if (savedSettings) {
      setListSettings(JSON.parse(savedSettings))
    }
  }, [])

  // تحميل بيانات الملف الشخصي في الحقول عند فتح النافذة
  useEffect(() => {
    if (showProfileSettingsModal && profile) {
      setTeacherName(profile.logoUrl || '')
      setSchoolName(profile.schoolName || '')
      setTeacherPhone('')
      setSystemDescription(profile.name || '')
    }
  }, [showProfileSettingsModal, profile])
  
  // حفظ إعدادات القوائم عند التغيير
  const updateListSettings = (newSettings: typeof listSettings) => {
    setListSettings(newSettings)
    localStorage.setItem('listSettings', JSON.stringify(newSettings))
  }

  // تحديث معلومات الملف الشخصي
  const updateProfile = useMutation({
    mutationFn: (data: { name?: string; phone?: string; schoolName?: string; logoUrl?: string }) => 
      apiRequest('/api/teacher-profile', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher-profile'] })
    },
  })

  // تصفير قاعدة البيانات
  const clearDatabase = useMutation({
    mutationFn: () => apiRequest('/api/clear-database', 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })

  // إضافة طالب جديد
  const createStudent = useMutation({
    mutationFn: (data: any) => apiRequest('/api/students', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/students'] })
      setShowEditStudentModal(false)
      setSelectedStudent(null)
    },
  })

  // تحديث بيانات الطالب
  const updateStudent = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/students/${id}`, 'PATCH', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/students'] })
      setShowEditStudentModal(false)
      setSelectedStudent(null)
    },
  })

  // حذف طالب
  const deleteStudent = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/students/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/students'] })
    },
  })

  // إضافة معلم
  const addTeacher = useMutation({
    mutationFn: (data: any) => apiRequest('/api/teachers', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teachers'] })
      setShowAddTeacherModal(false)
      setTeacherFormData({ name: '', phone: '', specialization: '' })
    },
  })

  // تحديث معلم
  const updateTeacher = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/teachers/${id}`, 'PATCH', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teachers'] })
      setShowEditTeacherModal(false)
      setSelectedTeacher(null)
    },
  })

  // حذف معلم
  const deleteTeacher = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/teachers/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teachers'] })
    },
  })

  // إضافة زيارة طالب
  const addStudentVisit = useMutation({
    mutationFn: (visitData: any) => apiRequest('/api/student-visits', 'POST', visitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/student-visits'] })
      queryClient.invalidateQueries({ queryKey: ['/api/students'] })
      // إعادة تعيين النموذج
      setSelectedStudentForReception(null)
      setVisitReason('')
      setActionTaken('')
      setReferredTo('')
      setAdditionalNotes('')
    },
  })

  // إضافة استئذان طالب
  const addStudentPermission = useMutation({
    mutationFn: (permissionData: any) => apiRequest('/api/student-permissions', 'POST', permissionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/student-permissions'] })
      queryClient.invalidateQueries({ queryKey: ['/api/students'] })
      setSelectedStudentForPermission(null)
      setPermissionReason('')
      setPermissionNotes('')
      setPermissionError('')
    },
    onError: (error: any) => {
      setPermissionError(error.message || 'حدث خطأ أثناء حفظ الاستئذان')
    },
  })

  // إضافة مخالفة طالب
  const addStudentViolation = useMutation({
    mutationFn: (violationData: any) => apiRequest('/api/student-violations', 'POST', violationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/student-violations'] })
      queryClient.invalidateQueries({ queryKey: ['/api/students'] })
      setSelectedStudentForViolation(null)
      setViolationType('')
      setViolationDescription('')
      setViolationAction('')
      setViolationNotes('')
      setViolationError('')
    },
    onError: (error: any) => {
      setViolationError(error.message || 'حدث خطأ أثناء حفظ المخالفة')
    },
  })

  // حذف زيارة طالب
  const deleteStudentVisit = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/student-visits/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/student-visits'] })
      queryClient.invalidateQueries({ queryKey: ['/api/students'] })
    },
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showSettingsMenu && !target.closest('.settings-menu-container')) {
        setShowSettingsMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSettingsMenu])

  // المجموعات في الصفحة الرئيسية تبدأ مخفية (مطوية)

  // فتح جميع المجموعات في صفحة المجموعات
  useEffect(() => {
    if (groups.length > 0 && expandedGroupsPage.size === 0) {
      const allGroupIds = new Set(groups.map(g => g.id))
      setExpandedGroupsPage(allGroupIds)
    }
  }, [groups.length])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userId')
    setIsLoggedIn(false)
    setCurrentPage('home')
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  // تسجيل الخروج التلقائي - مراقبة نشاط المستخدم
  useEffect(() => {
    if (!isLoggedIn) return

    const autoLogoutMinutes = profile?.autoLogoutMinutes || 0

    // إذا كانت الميزة معطلة، لا نفعل شيء
    if (autoLogoutMinutes === 0) return

    let logoutTimer: ReturnType<typeof setTimeout> | null = null
    let isActive = true

    const resetTimer = () => {
      if (!isActive) return
      if (logoutTimer) clearTimeout(logoutTimer)

      logoutTimer = setTimeout(() => {
        if (!isActive) return
        handleLogout()
        alert(`تم تسجيل الخروج تلقائياً بعد ${autoLogoutMinutes} دقيقة من عدم النشاط`)
      }, autoLogoutMinutes * 60 * 1000)
    }

    // مراقبة نشاط المستخدم
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true)
    })

    // بدء المؤقت
    resetTimer()

    // تنظيف عند unmount
    return () => {
      isActive = false
      if (logoutTimer) clearTimeout(logoutTimer)
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true)
      })
    }
  }, [isLoggedIn, profile?.autoLogoutMinutes])

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  // حالة التحميل
  if (studentsLoading || statusesLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  // تصفية الطلاب بناءً على البحث والفلاتر
  const filteredStudents = students.filter(student => {
    // فلتر البحث
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      const matchesSearch = (
        student.name.toLowerCase().includes(search) ||
        student.nationalId.includes(search) ||
        (student.phone && student.phone.includes(search)) ||
        (student.guardianPhone && student.guardianPhone.includes(search))
      )
      if (!matchesSearch) return false
    }
    
    // فلتر الحالة الخاصة
    if (homeSpecialStatusFilter !== 'all') {
      if (student.specialStatusId !== homeSpecialStatusFilter) return false
    }
    
    // فلتر المرحلة الدراسية
    if (homeStageFilter !== 'all') {
      const studentGroup = groups.find(g => g.id === student.groupId)
      if (!studentGroup || studentGroup.stage !== homeStageFilter) return false
    }
    
    // فلتر المجموعة
    if (homeGroupFilter !== 'all') {
      if (student.groupId !== homeGroupFilter) return false
    }
    
    return true
  })

  const totalStudents = students.length
  const totalTeachers = teachers.length
  const permissions = students.filter(s => s.status === 'استئذان').length
  const specialStatusCount = students.filter(s => s.specialStatusId !== null).length

  const allNavItems = [
    { id: 'home' as Page, label: 'الصفحة الرئيسية', icon: Home, alwaysShow: true },
    { id: 'teachers' as Page, label: 'المعلمين', icon: GraduationCap, settingKey: 'showTeachers' },
    { id: 'groups' as Page, label: 'المجموعات', icon: Users, settingKey: 'showGroups' },
    { id: 'special-status' as Page, label: 'الحالات الخاصة', icon: Heart, settingKey: 'showSpecialStatus' },
    { id: 'reception' as Page, label: 'استقبال الطلاب', icon: UserCheck, settingKey: 'showReception' },
    { id: 'permission' as Page, label: 'الاستئذان', icon: LogOut, settingKey: 'showPermissions' },
    { id: 'absence' as Page, label: 'المخالفات', icon: AlertCircle, settingKey: 'showViolations' },
  ]

  // تصفية القوائم بناءً على الإعدادات
  const navItems = allNavItems.filter(item => {
    if (item.alwaysShow) return true
    if (!item.settingKey) return true
    return listSettings[item.settingKey as keyof typeof listSettings]
  })

  // تنظيم الطلاب حسب المجموعات
  const studentsByGroup = filteredStudents.reduce((acc, student) => {
    const groupId = student.groupId || 'unassigned'
    if (!acc[groupId]) {
      acc[groupId] = []
    }
    acc[groupId].push(student)
    return acc
  }, {} as Record<string, Student[]>)

  // ألوان المجموعات (6 ألوان متناوبة)
  const groupColors = [
    { bg: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50', border: 'border-emerald-200' },
    { bg: 'from-blue-500 to-cyan-600', light: 'bg-blue-50', border: 'border-blue-200' },
    { bg: 'from-purple-500 to-pink-600', light: 'bg-purple-50', border: 'border-purple-200' },
    { bg: 'from-orange-500 to-amber-600', light: 'bg-orange-50', border: 'border-orange-200' },
    { bg: 'from-red-500 to-rose-600', light: 'bg-red-50', border: 'border-red-200' },
    { bg: 'from-indigo-500 to-blue-600', light: 'bg-indigo-50', border: 'border-indigo-200' },
  ]

  // دالة toggle للمجموعة
  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  // دالة toggle للمجموعة في صفحة المجموعات
  const toggleGroupPage = (groupId: string) => {
    const newExpanded = new Set(expandedGroupsPage)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroupsPage(newExpanded)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-2xl shadow-lg">
                <Users className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile?.schoolName || 'نظام إدارة شاملة لبيانات الطلاب'}
                </h1>
                <p className="text-base text-gray-600 mt-1 font-medium">
                  {profile?.logoUrl || 'قم بإضافة عنوان الواجهة من الإعدادات'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative settings-menu-container">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all hover:shadow-xl hover:scale-105"
                  data-testid="button-settings"
                >
                  <Settings size={20} />
                  <span>الإعدادات</span>
                </button>

                {showSettingsMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false)
                        setShowExcelImportModal(true)
                      }}
                      className="w-full text-right px-4 py-3 hover:bg-green-50 transition-colors flex items-center gap-3"
                      data-testid="button-import-excel"
                    >
                      <Download size={18} className="text-green-600" />
                      <span className="font-semibold text-gray-700">استيراد من Excel</span>
                    </button>
                    
                    <button
                      onClick={async () => {
                        setShowSettingsMenu(false)
                        try {
                          // جلب جميع البيانات
                          const [studentsData, groupsData, teachersData, visitsData, permissionsData, violationsData, profileData] = await Promise.all([
                            fetch('/api/students').then(r => r.json()),
                            fetch('/api/groups').then(r => r.json()),
                            fetch('/api/teachers').then(r => r.json()),
                            fetch('/api/student-visits').then(r => r.json()),
                            fetch('/api/student-permissions').then(r => r.json()),
                            fetch('/api/student-violations').then(r => r.json()),
                            fetch('/api/teacher-profile').then(r => r.json())
                          ])
                          
                          const exportData = {
                            version: '1.0',
                            exportDate: new Date().toISOString(),
                            data: {
                              students: studentsData,
                              groups: groupsData,
                              teachers: teachersData,
                              visits: visitsData,
                              permissions: permissionsData,
                              violations: violationsData,
                              profile: profileData
                            }
                          }
                          
                          // تحويل البيانات لـ JSON
                          const jsonStr = JSON.stringify(exportData, null, 2)
                          const blob = new Blob([jsonStr], { type: 'application/json' })
                          const url = URL.createObjectURL(blob)
                          
                          // تحميل الملف
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `erchad-backup-${new Date().toISOString().split('T')[0]}.json`
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                          
                          alert('✅ تم تصدير البيانات بنجاح!')
                        } catch (error) {
                          console.error('Error exporting data:', error)
                          alert('❌ حدث خطأ أثناء تصدير البيانات')
                        }
                      }}
                      className="w-full text-right px-4 py-3 hover:bg-purple-50 transition-colors flex items-center gap-3"
                      data-testid="button-export-data"
                    >
                      <Download size={18} className="text-purple-600" />
                      <span className="font-semibold text-gray-700">تصدير البيانات الكاملة</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false)
                        document.getElementById('import-data-file')?.click()
                      }}
                      className="w-full text-right px-4 py-3 hover:bg-indigo-50 transition-colors flex items-center gap-3"
                      data-testid="button-import-data"
                    >
                      <Upload size={18} className="text-indigo-600" />
                      <span className="font-semibold text-gray-700">استيراد البيانات الكاملة</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false)
                        setShowGroupsModal(true)
                      }}
                      className="w-full text-right px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3"
                      data-testid="button-manage-groups"
                    >
                      <Users size={18} className="text-blue-600" />
                      <span className="font-semibold text-gray-700">إدارة المجموعات</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false)
                        setShowSpecialStatusModal(true)
                      }}
                      className="w-full text-right px-4 py-3 hover:bg-pink-50 transition-colors flex items-center gap-3"
                      data-testid="button-manage-special-status"
                    >
                      <Heart size={18} className="text-pink-600" />
                      <span className="font-semibold text-gray-700">إدارة الحالات الخاصة</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowSettingsMenu(false)
                        setShowListSettingsModal(true)
                      }}
                      className="w-full text-right px-4 py-3 hover:bg-purple-50 transition-colors flex items-center gap-3"
                      data-testid="button-list-settings"
                    >
                      <List size={18} className="text-purple-600" />
                      <span className="font-semibold text-gray-700">إعدادات القوائم</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false)
                        setShowLoginSettingsModal(true)
                      }}
                      className="w-full text-right px-4 py-3 hover:bg-green-50 transition-colors flex items-center gap-3"
                      data-testid="button-login-settings"
                    >
                      <Lock size={18} className="text-green-600" />
                      <span className="font-semibold text-gray-700">إعدادات تسجيل الدخول</span>
                    </button>
                    
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    <button
                      onClick={() => {
                        handleLogout()
                        setShowSettingsMenu(false)
                      }}
                      className="w-full text-right px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3"
                      data-testid="button-logout"
                    >
                      <LogOut size={18} className="text-red-600" />
                      <span className="font-semibold text-red-600">تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowProfileSettingsModal(true)}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-bold shadow-lg border-2 border-gray-200 transition-all hover:shadow-xl"
                data-testid="button-profile"
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                  <UserIcon className="text-white" size={20} />
                </div>
                {profile?.name ? (
                  <span className="text-sm">{profile.name}</span>
                ) : (
                  <span className="text-sm">الملف الشخصي</span>
                )}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg" data-testid="card-total-students">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">إجمالي الطلاب</p>
                  <p className="text-3xl font-bold mt-1" data-testid="text-total-students">{totalStudents}</p>
                </div>
                <Users size={40} className="text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg" data-testid="card-total-teachers">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">المعلمين</p>
                  <p className="text-3xl font-bold mt-1" data-testid="text-total-teachers">{totalTeachers}</p>
                </div>
                <GraduationCap size={40} className="text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg" data-testid="card-permissions">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">استئذانات</p>
                  <p className="text-3xl font-bold mt-1" data-testid="text-permissions">{permissions}</p>
                </div>
                <LogOut size={40} className="text-orange-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg" data-testid="card-special-status">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">حالات خاصة</p>
                  <p className="text-3xl font-bold mt-1" data-testid="text-special-status">{specialStatusCount}</p>
                </div>
                <Heart size={40} className="text-purple-200" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* صفحة المعلمين */}
        {currentPage === 'teachers' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <GraduationCap className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">المعلمين</h2>
                    <p className="text-blue-100 mt-1">إجمالي المعلمين: {teachers.length}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddTeacherModal(true)}
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
                  data-testid="button-add-teacher"
                >
                  <Plus size={20} />
                  <span>إضافة معلم</span>
                </button>
              </div>
            </div>

            {/* قائمة المعلمين */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* اسم المعلم */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-center">
                    <h3 className="text-2xl font-bold text-white">{teacher.name}</h3>
                  </div>

                  {/* المعلومات */}
                  <div className="p-4 space-y-3">
                    {/* الفصل الدراسي (التخصص) */}
                    <div className="flex items-center gap-3 text-gray-700">
                      <BookOpen size={20} className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">الفصل الدراسي</p>
                        <p className="font-semibold">{teacher.specialization || 'غير محدد'}</p>
                      </div>
                    </div>

                    {/* رقم الجوال */}
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone size={20} className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">رقم الجوال</p>
                        <p className="font-semibold" dir="ltr">{teacher.phone || 'غير محدد'}</p>
                      </div>
                    </div>
                  </div>

                  {/* الأزرار */}
                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedTeacher(teacher)
                        setTeacherFormData({
                          name: teacher.name,
                          phone: teacher.phone || '',
                          specialization: teacher.specialization || '',
                        })
                        setShowEditTeacherModal(true)
                      }}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                      data-testid={`button-edit-teacher-${teacher.id}`}
                    >
                      <Edit size={18} />
                      <span>تعديل</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من حذف المعلم ${teacher.name}؟`)) {
                          deleteTeacher.mutate(teacher.id)
                        }
                      }}
                      disabled={deleteTeacher.isPending}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      data-testid={`button-delete-teacher-${teacher.id}`}
                    >
                      <Trash2 size={18} />
                      <span>{deleteTeacher.isPending ? 'جاري...' : 'حذف'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* حالة فارغة */}
            {teachers.length === 0 && (
              <div className="text-center py-16">
                <GraduationCap size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500 font-semibold">لا يوجد معلمين</p>
                <p className="text-gray-400 mt-2">ابدأ بإضافة معلم جديد</p>
              </div>
            )}
          </div>
        )}

        {/* صفحة الحالات الخاصة */}
        {currentPage === 'special-status' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                    <Heart className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">الحالات الخاصة</h2>
                    <p className="text-purple-100 mt-1">إجمالي الطلاب ذوي الحالات الخاصة: {specialStatusCount}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                    <input
                      type="checkbox"
                      id="show-special-status-details"
                      checked={showSpecialStatusColumn}
                      onChange={(e) => setShowSpecialStatusColumn(e.target.checked)}
                      className="w-5 h-5"
                      data-testid="checkbox-show-special-status-details"
                    />
                    <label htmlFor="show-special-status-details" className="text-white font-semibold cursor-pointer whitespace-nowrap">
                      إظهار تفاصيل الحالة
                    </label>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-50 transition-all shadow-md"
                    data-testid="button-print-all-special"
                  >
                    <Printer size={20} />
                    <span>طباعة الكل</span>
                  </button>
                  <button
                    onClick={() => setShowSendToTeacherModal(true)}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-50 transition-all shadow-md"
                    data-testid="button-send-to-teacher"
                  >
                    <Send size={20} />
                    <span>إرسال للمعلم</span>
                  </button>
                </div>
              </div>
            </div>

            {/* قائمة المجموعات */}
            <div className="space-y-4">
              {groups
                .filter(group => {
                  // عرض فقط المجموعات التي تحتوي على طلاب لديهم حالات خاصة
                  const groupStudents = students.filter(s => s.groupId === group.id && s.specialStatusId)
                  return groupStudents.length > 0
                })
                .map((group) => {
                  const groupStudents = students.filter(s => s.groupId === group.id && s.specialStatusId)
                  
                  return (
                    <div key={group.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      {/* رأس المجموعة */}
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 flex items-center justify-between text-white">
                        <div className="text-left">
                          <h3 className="text-2xl font-bold">
                            {group.stage} - {group.name}
                          </h3>
                          <p className="text-purple-100 mt-1">عدد الطلاب: {groupStudents.length}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedGroupForSpecialPrint(group)
                            setShowSpecialStatusPrintModal(true)
                          }}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-50 transition-all"
                          data-testid={`button-print-group-${group.id}`}
                        >
                          <Printer size={18} />
                          <span>طباعة</span>
                        </button>
                      </div>

                      {/* جدول الطلاب */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-purple-50">
                            <tr>
                              <th className="px-6 py-4 text-right text-sm font-bold text-purple-900">الاسم</th>
                              <th className="px-6 py-4 text-right text-sm font-bold text-purple-900">السجل المدني</th>
                              <th className="px-6 py-4 text-right text-sm font-bold text-purple-900">جوال الطالب</th>
                              <th className="px-6 py-4 text-right text-sm font-bold text-purple-900">جوال ولي الأمر</th>
                              <th className="px-6 py-4 text-right text-sm font-bold text-purple-900">الحالة الخاصة</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {groupStudents.map((student) => {
                              const specialStatus = specialStatuses.find(s => s.id === student.specialStatusId)
                              return (
                                <tr key={student.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-right font-semibold text-gray-900">{student.name}</td>
                                  <td className="px-6 py-4 text-right text-gray-700">{student.nationalId}</td>
                                  <td className="px-6 py-4 text-right text-gray-700" dir="ltr">{student.phone || '-'}</td>
                                  <td className="px-6 py-4 text-right text-gray-700" dir="ltr">{student.guardianPhone || '-'}</td>
                                  <td className="px-6 py-4 text-right">
                                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                                      {showSpecialStatusColumn ? (specialStatus?.name || 'غير محدد') : 'لديه حالة خاصة'}
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                })}

              {/* حالة فارغة */}
              {students.filter(s => s.specialStatusId).length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Heart size={64} className="mx-auto text-purple-300 mb-4" />
                  <p className="text-xl text-gray-500 font-semibold">لا يوجد طلاب ذوي حالات خاصة</p>
                  <p className="text-gray-400 mt-2">يمكنك إضافة حالات خاصة من تعديل بيانات الطالب</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* صفحة المجموعات */}
        {currentPage === 'groups' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show-special-status"
                    checked={showSpecialStatusColumn}
                    onChange={(e) => setShowSpecialStatusColumn(e.target.checked)}
                    className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                    data-testid="checkbox-show-special-status"
                  />
                  <label htmlFor="show-special-status" className="text-purple-600 font-semibold cursor-pointer">
                    إظهار تفاصيل الحالة
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditStudentData({
                        name: '',
                        nationalId: '',
                        phone: '',
                        guardianPhone: '',
                        grade: '',
                        groupId: '',
                        specialStatusId: '',
                      })
                      setSelectedStage('')
                      setSelectedStudent(null)
                      setShowEditStudentModal(true)
                    }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                    data-testid="button-add-student-page"
                  >
                    <UserPlus size={20} />
                    <span>إضافة طالب</span>
                  </button>
                  <button
                    onClick={() => setShowGroupsModal(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                    data-testid="button-manage-groups-page"
                  >
                    <Users size={20} />
                    <span>إدارة المجموعات</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                    data-testid="button-print-all"
                  >
                    <Printer size={20} />
                    <span>طباعة الكل</span>
                  </button>
                </div>
              </div>
            </div>

            {/* قائمة المجموعات */}
            <div className="space-y-4">
              {groups.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Users size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-xl text-gray-500 font-semibold">لا توجد مجموعات</p>
                  <p className="text-gray-400 mt-2">قم بإضافة مجموعات من الإعدادات</p>
                </div>
              ) : (
                groups.map((group, groupIndex) => {
                  const groupStudents = students.filter(s => s.groupId === group.id)
                  const colorIndex = groupIndex % groupColors.length
                  const colors = groupColors[colorIndex]
                  const isExpanded = expandedGroupsPage.has(group.id)

                  return (
                    <div key={group.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      {/* رأس المجموعة */}
                      <div className={`bg-gradient-to-r ${colors.bg} p-4 flex items-center justify-between text-white`}>
                        <button
                          onClick={() => toggleGroupPage(group.id)}
                          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
                          data-testid={`button-toggle-group-page-${group.id}`}
                        >
                          <ChevronDown 
                            size={24} 
                            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                          <h3 className="text-2xl font-bold">
                            {group.stage} - {group.name}
                          </h3>
                          <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-semibold">
                            {groupStudents.length} طالب
                          </span>
                        </button>
                      </div>

                      {/* جدول الطلاب */}
                      {isExpanded && (
                        <div>
                          {/* أزرار الإجراءات */}
                          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setSelectedGroupForPrint(group)
                                setShowGroupPrintModal(true)
                              }}
                              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                              data-testid={`button-print-group-${group.id}`}
                            >
                              <Printer size={18} />
                              <span>طباعة</span>
                            </button>
                          </div>

                          {/* الجدول */}
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">الاسم</th>
                                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">السجل المدني</th>
                                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">جوال الطالب</th>
                                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">جوال ولي الأمر</th>
                                  <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">الحالة الخاصة</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {groupStudents.length === 0 ? (
                                  <tr>
                                    <td 
                                      colSpan={5}
                                      className="px-4 py-8 text-center text-gray-500"
                                    >
                                      لا يوجد طلاب في هذه المجموعة
                                    </td>
                                  </tr>
                                ) : (
                                  groupStudents.map((student) => {
                                    const specialStatus = student.specialStatusId 
                                      ? specialStatuses.find(s => s.id === student.specialStatusId)
                                      : null

                                    return (
                                      <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{student.nationalId}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600" dir="ltr">{student.phone || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600" dir="ltr">{student.guardianPhone || '-'}</td>
                                        <td className="px-4 py-3 text-sm">
                                          {specialStatus ? (
                                            showSpecialStatusColumn ? (
                                              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                {specialStatus.name}
                                              </span>
                                            ) : (
                                              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                لديه حالة خاصة
                                              </span>
                                            )
                                          ) : (
                                            <span className="text-gray-400">-</span>
                                          )}
                                        </td>
                                      </tr>
                                    )
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* صفحة استقبال الطلاب */}
        {currentPage === 'reception' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-200 bg-opacity-50 p-3 rounded-xl">
                    <UserCheck className="text-blue-700" size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-blue-900">استقبال الطلاب</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* حقل البحث */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search size={20} className="text-gray-600" />
                <h3 className="text-lg font-bold text-gray-800">تسجيل زيارة</h3>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={receptionSearchTerm}
                  onChange={(e) => setReceptionSearchTerm(e.target.value)}
                  placeholder="ابحث بالاسم أو السجل المدني..."
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none rounded-lg bg-gray-50"
                  data-testid="input-search-reception"
                />
                
                {/* نتائج البحث */}
                {receptionSearchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                    {students
                      .filter(s => 
                        s.name.toLowerCase().includes(receptionSearchTerm.toLowerCase()) ||
                        s.nationalId.includes(receptionSearchTerm)
                      )
                      .map(student => {
                        const group = groups.find(g => g.id === student.groupId)
                        return (
                          <button
                            key={student.id}
                            onClick={() => {
                              setSelectedStudentForReception(student)
                              setReceptionSearchTerm('')
                            }}
                            className="w-full px-6 py-4 text-right hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                            data-testid={`search-result-${student.id}`}
                          >
                            <div className="font-bold text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {student.nationalId} • {group?.stage || 'غير محدد'}
                            </div>
                          </button>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* معلومات الطالب المحدد */}
            {selectedStudentForReception && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4 text-right">الطالب المحدد:</h3>
                <div className="grid grid-cols-2 gap-4 text-right">
                  <div>
                    <span className="text-gray-700">الاسم: </span>
                    <span className="font-bold text-gray-900">{selectedStudentForReception.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-700">السجل المدني: </span>
                    <span className="font-bold text-gray-900">{selectedStudentForReception.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-gray-700">الصف: </span>
                    <span className="font-bold text-gray-900">
                      {groups.find(g => g.id === selectedStudentForReception.groupId)?.stage || 'غير محدد'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700">عدد الزيارات السابقة: </span>
                    <span className="font-bold text-blue-600">{selectedStudentForReception.visitCount || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* نموذج تسجيل الزيارة */}
            {selectedStudentForReception && (
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="space-y-3">
                  {/* سبب الزيارة / المشكلة */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 text-right">
                      سبب الزيارة / المشكلة
                    </label>
                    <textarea
                      value={visitReason}
                      onChange={(e) => setVisitReason(e.target.value)}
                      placeholder="اكتب سبب الزيارة أو وصف المشكلة..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right resize-none"
                      data-testid="textarea-visit-reason"
                    />
                  </div>

                  {/* الإجراء المتخذ */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 text-right">
                      الإجراء المتخذ
                    </label>
                    <textarea
                      value={actionTaken}
                      onChange={(e) => setActionTaken(e.target.value)}
                      placeholder="اكتب الإجراء الذي تم اتخاذه..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right resize-none"
                      data-testid="textarea-action-taken"
                    />
                  </div>

                  {/* التحويل إلى */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 text-right">
                      التحويل إلى
                    </label>
                    <select
                      value={referredTo}
                      onChange={(e) => setReferredTo(e.target.value)}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      data-testid="select-referred-to"
                    >
                      <option value="">لا يوجد</option>
                      <option value="المرشد الطلابي">المرشد الطلابي</option>
                      <option value="مدير المدرسة">مدير المدرسة</option>
                      <option value="ولي الأمر">ولي الأمر</option>
                      <option value="المعلم">المعلم</option>
                    </select>
                  </div>

                  {/* ملاحظات إضافية */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 text-right">
                      ملاحظات إضافية (اختياري)
                    </label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="ملاحظات إضافية..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right resize-none"
                      data-testid="textarea-additional-notes"
                    />
                  </div>

                  {/* أزرار الإلغاء والتسجيل */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedStudentForReception(null)
                        setVisitReason('')
                        setActionTaken('')
                        setReferredTo('')
                        setAdditionalNotes('')
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2.5 rounded-lg transition-all text-sm"
                      data-testid="button-cancel-visit"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => {
                        if (!visitReason || !actionTaken) {
                          alert('الرجاء تعبئة سبب الزيارة والإجراء المتخذ')
                          return
                        }
                        
                        const now = new Date()
                        // حفظ التاريخ بصيغة ISO الميلادية (YYYY-MM-DD)
                        const isoDate = now.toISOString().split('T')[0]
                        
                        addStudentVisit.mutate({
                          studentId: selectedStudentForReception.id,
                          visitDate: isoDate,
                          reason: visitReason,
                          actionTaken: actionTaken,
                          referredTo: referredTo || 'لا يوجد',
                          notes: additionalNotes,
                        })
                      }}
                      disabled={addStudentVisit.isPending}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2.5 rounded-lg transition-all shadow-md disabled:opacity-50 text-sm"
                      data-testid="button-submit-visit"
                    >
                      {addStudentVisit.isPending ? 'جاري التسجيل...' : 'تسجيل الزيارة'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* سجل الزيارات الأخيرة */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <List size={24} className="text-green-700" />
                  <h3 className="text-2xl font-bold text-green-900">سجل الزيارات الأخيرة</h3>
                </div>
                <button 
                  onClick={() => {
                    setShowDateFilterModal(true)
                    setDateFilterError('')
                  }}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                  data-testid="button-filter-date"
                >
                  <Clock size={18} />
                  <span>فلتر بالتاريخ</span>
                </button>
              </div>

              {/* فلتر حسب طالب محدد */}
              <div className="mb-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <UserCheck size={20} className="text-purple-700" />
                  <h4 className="font-bold text-purple-900">عرض زيارات طالب محدد</h4>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو السجل المدني..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="w-full p-3 pr-10 border-2 border-purple-300 rounded-lg text-right focus:border-purple-500 focus:outline-none bg-white"
                    data-testid="input-search-student"
                  />
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                </div>
                
                {/* نتائج البحث */}
                {studentSearchTerm && (
                  <div className="mt-2 max-h-48 overflow-y-auto bg-white border-2 border-gray-200 rounded-lg">
                    {students
                      .filter(s => 
                        s.name.includes(studentSearchTerm) || 
                        s.nationalId?.includes(studentSearchTerm)
                      )
                      .slice(0, 5)
                      .map(student => (
                        <button
                          key={student.id}
                          onClick={() => {
                            setSelectedStudentFilter(student)
                            setStudentSearchTerm('')
                          }}
                          className="w-full p-3 text-right hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                          data-testid={`student-search-result-${student.id}`}
                        >
                          <div className="font-bold text-gray-900">{student.name}</div>
                          {student.nationalId && (
                            <div className="text-sm text-gray-600">السجل: {student.nationalId}</div>
                          )}
                        </button>
                      ))}
                  </div>
                )}
                
                {/* الطالب المحدد */}
                {selectedStudentFilter && (
                  <div className="mt-3 bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <div className="font-bold text-blue-900 text-lg">{selectedStudentFilter.name}</div>
                        <div className="text-sm text-blue-700">
                          عرض {studentVisits.filter((v: any) => v.studentId === selectedStudentFilter.id).length} زيارة
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedStudentForReception(selectedStudentFilter)
                            setVisitReason('')
                            setActionTaken('')
                            setReferredTo('')
                            setAdditionalNotes('')
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                          data-testid="button-add-visit-for-student"
                        >
                          <PlusCircle size={18} />
                          <span>تسجيل زيارة جديدة</span>
                        </button>
                        <button
                          onClick={() => setSelectedStudentFilter(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-bold"
                          data-testid="button-clear-student-filter"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* قائمة الزيارات */}
              {(() => {
                let filteredVisits = studentVisits
                
                // فلترة حسب الطالب المحدد
                if (selectedStudentFilter) {
                  filteredVisits = filteredVisits.filter((v: any) => v.studentId === selectedStudentFilter.id)
                }
                
                // فلترة حسب التاريخ
                if (filterDate) {
                  filteredVisits = filteredVisits.filter((v: any) => v.visitDate === filterDate)
                }
                
                if (filteredVisits.length === 0) {
                  return (
                    <div className="bg-white rounded-xl p-8 text-center">
                      <List size={64} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-xl text-gray-500 font-semibold">
                        {selectedStudentFilter && filterDate ? 'لا توجد زيارات للطالب في هذا التاريخ' :
                         selectedStudentFilter ? 'لا توجد زيارات لهذا الطالب' :
                         filterDate ? 'لا توجد زيارات في هذا التاريخ' : 
                         'لا توجد زيارات'}
                      </p>
                      <div className="flex gap-2 justify-center mt-4">
                        {filterDate && (
                          <button
                            onClick={() => setFilterDate('')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
                            data-testid="button-clear-date-filter-empty"
                          >
                            إلغاء فلتر التاريخ
                          </button>
                        )}
                        {selectedStudentFilter && (
                          <button
                            onClick={() => setSelectedStudentFilter(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-bold"
                            data-testid="button-clear-student-filter-empty"
                          >
                            إلغاء فلتر الطالب
                          </button>
                        )}
                      </div>
                    </div>
                  )
                }
                
                return (
                  <div className="space-y-4">
                    {/* بانر فلتر الطالب */}
                    {selectedStudentFilter && (
                      <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserCheck size={20} className="text-purple-600" />
                          <span className="font-bold text-purple-900">عرض زيارات الطالب: {selectedStudentFilter.name}</span>
                        </div>
                        <button
                          onClick={() => setSelectedStudentFilter(null)}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                          data-testid="button-clear-student-filter-banner"
                        >
                          <X size={16} />
                          <span>إلغاء</span>
                        </button>
                      </div>
                    )}
                    
                    {/* بانر فلتر التاريخ */}
                    {filterDate && (
                      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock size={20} className="text-blue-600" />
                          <span className="font-bold text-blue-900">عرض زيارات تاريخ: {filterDate}</span>
                        </div>
                        <button
                          onClick={() => setFilterDate('')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                          data-testid="button-clear-date-filter-banner"
                        >
                          <X size={16} />
                          <span>إلغاء</span>
                        </button>
                      </div>
                    )}
                    {filteredVisits.slice().reverse().map((visit: any) => {
                    const student = students.find(s => s.id === visit.studentId)
                    if (!student) return null
                    
                    const visitTime = new Date(visit.createdAt).toLocaleTimeString('ar-SA', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })
                    
                    return (
                      <div key={visit.id} className="bg-white rounded-xl p-6 shadow-md" data-testid={`visit-card-${visit.id}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{student.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{visit.visitDate} هـ</span>
                              <span>{visitTime}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {/* زر حذف */}
                            <button
                              onClick={() => {
                                if (window.confirm('هل أنت متأكد من حذف هذه الزيارة؟')) {
                                  deleteStudentVisit.mutate(visit.id)
                                }
                              }}
                              disabled={deleteStudentVisit.isPending}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                              data-testid={`button-delete-visit-${visit.id}`}
                            >
                              <Trash2 size={16} />
                              <span>حذف</span>
                            </button>
                            
                            {/* زر واتساب */}
                            <button
                              onClick={() => {
                                const message = `
زيارة طالب - ${student.name}
التاريخ: ${visit.visitDate}
الوقت: ${visitTime}

السبب: ${visit.reason}
الإجراء: ${visit.actionTaken}
${visit.referredTo !== 'لا يوجد' ? `التحويل إلى: ${visit.referredTo}` : ''}
${visit.notes ? `ملاحظات: ${visit.notes}` : ''}
                                `.trim()
                                
                                const phone = formatPhoneForWhatsApp(student.guardianPhone)
                                if (phone) {
                                  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
                                } else {
                                  alert('لا يوجد رقم جوال لولي الأمر')
                                }
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                              data-testid={`button-whatsapp-${visit.id}`}
                            >
                              <Phone size={16} />
                              <span>واتساب</span>
                            </button>
                            
                            {/* زر طباعة */}
                            <button
                              onClick={() => {
                                const printContent = `
                                  <div dir="rtl" style="font-family: Arial; padding: 20px;">
                                    <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 15px;">
                                      <h1 style="color: #3b82f6; font-size: 24px; margin-bottom: 5px;">${profile?.schoolName || 'المدرسة'}</h1>
                                      <p style="color: #666; font-size: 16px; margin: 5px 0;">المعلم: ${profile?.name || 'غير محدد'}</p>
                                      <h2 style="color: #333; font-size: 20px; margin-top: 15px;">تقرير زيارة طالب</h2>
                                    </div>
                                    <table style="width: 100%; border-collapse: collapse;">
                                      <tr>
                                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">اسم الطالب</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${student.name}</td>
                                      </tr>
                                      <tr>
                                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">التاريخ</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${visit.visitDate} هـ</td>
                                      </tr>
                                      <tr>
                                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">الوقت</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${visitTime}</td>
                                      </tr>
                                      <tr>
                                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">السبب</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${visit.reason}</td>
                                      </tr>
                                      <tr>
                                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">الإجراء المتخذ</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${visit.actionTaken}</td>
                                      </tr>
                                      <tr>
                                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">التحويل إلى</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${visit.referredTo}</td>
                                      </tr>
                                      ${visit.notes ? `<tr>
                                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">ملاحظات</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${visit.notes}</td>
                                      </tr>` : ''}
                                    </table>
                                    <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
                                      <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
                                    </div>
                                  </div>
                                `
                                const printWindow = window.open('', '', 'width=800,height=600')
                                if (printWindow) {
                                  printWindow.document.write(printContent)
                                  printWindow.document.close()
                                  printWindow.print()
                                }
                              }}
                              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                              data-testid={`button-print-${visit.id}`}
                            >
                              <Printer size={16} />
                              <span>طباعة</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-right">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm font-bold text-gray-700">السبب: </span>
                            <span className="text-gray-900">{visit.reason}</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm font-bold text-gray-700">الإجراء: </span>
                            <span className="text-gray-900">{visit.actionTaken}</span>
                          </div>
                          {visit.referredTo !== 'لا يوجد' && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <span className="text-sm font-bold text-blue-700">التحويل إلى: </span>
                              <span className="text-blue-900">{visit.referredTo}</span>
                            </div>
                          )}
                          {visit.notes && (
                            <div className="bg-yellow-50 p-3 rounded-lg">
                              <span className="text-sm font-bold text-yellow-700">ملاحظات: </span>
                              <span className="text-yellow-900">{visit.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {/* صفحة الاستئذان */}
        {currentPage === 'permission' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-200 bg-opacity-50 p-3 rounded-xl">
                    <LogOut className="text-orange-700" size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-orange-900">الاستئذان</h2>
                    <p className="text-orange-700 mt-1">إدارة خروج الطلاب والاستئذان</p>
                  </div>
                </div>
              </div>
            </div>

            {/* حقل البحث */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search size={20} className="text-gray-600" />
                <h3 className="text-lg font-bold text-gray-800">تسجيل استئذان</h3>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={permissionSearchTerm}
                  onChange={(e) => setPermissionSearchTerm(e.target.value)}
                  placeholder="ابحث بالاسم أو السجل المدني..."
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 focus:border-orange-400 focus:outline-none rounded-lg bg-gray-50"
                  data-testid="input-search-permission"
                />
                
                {/* نتائج البحث */}
                {permissionSearchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                    {students
                      .filter(s => 
                        s.name.toLowerCase().includes(permissionSearchTerm.toLowerCase()) ||
                        s.nationalId.includes(permissionSearchTerm)
                      )
                      .map(student => {
                        const group = groups.find(g => g.id === student.groupId)
                        return (
                          <button
                            key={student.id}
                            onClick={() => {
                              setSelectedStudentForPermission(student)
                              setPermissionSearchTerm('')
                            }}
                            className="w-full px-6 py-4 text-right hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                            data-testid={`search-result-permission-${student.id}`}
                          >
                            <div className="font-bold text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {student.nationalId} • {group?.stage || 'غير محدد'}
                            </div>
                          </button>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* معلومات الطالب المحدد */}
            {selectedStudentForPermission && (
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-orange-900 mb-4 text-right">الطالب المحدد:</h3>
                <div className="grid grid-cols-2 gap-4 text-right">
                  <div>
                    <span className="text-gray-700">الاسم: </span>
                    <span className="font-bold text-gray-900">{selectedStudentForPermission.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-700">السجل المدني: </span>
                    <span className="font-bold text-gray-900">{selectedStudentForPermission.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-gray-700">الصف: </span>
                    <span className="font-bold text-gray-900">
                      {groups.find(g => g.id === selectedStudentForPermission.groupId)?.stage || 'غير محدد'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700">عدد الاستئذانات السابقة: </span>
                    <span className="font-bold text-orange-600">{selectedStudentForPermission.permissionCount || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* نموذج تسجيل الاستئذان */}
            {selectedStudentForPermission && (
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="text-base font-bold text-orange-900 mb-3 text-right">تفاصيل الاستئذان</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 text-right">سبب الاستئذان</label>
                    <input
                      type="text"
                      value={permissionReason}
                      onChange={(e) => setPermissionReason(e.target.value)}
                      placeholder="مثال: موعد طبي، ظرف عائلي..."
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-right"
                      data-testid="input-permission-reason"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 text-right">ملاحظات (اختياري)</label>
                    <textarea
                      value={permissionNotes}
                      onChange={(e) => setPermissionNotes(e.target.value)}
                      placeholder="أي ملاحظات إضافية..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-right resize-none"
                      data-testid="textarea-permission-notes"
                    />
                  </div>

                  {/* رسالة خطأ */}
                  {permissionError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-right text-sm" data-testid="error-permission">
                      {permissionError}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedStudentForPermission(null)
                        setPermissionReason('')
                        setPermissionNotes('')
                        setPermissionError('')
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2.5 rounded-lg transition-all text-sm"
                      data-testid="button-cancel-permission"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => {
                        if (!permissionReason || !permissionReason.trim()) {
                          setPermissionError('الرجاء تعبئة سبب الاستئذان')
                          return
                        }
                        setPermissionError('')
                        
                        // تخزين التاريخ بصيغة ISO الميلادية (YYYY-MM-DD)
                        const today = new Date()
                        const permissionDate = today.toISOString().split('T')[0]
                        
                        // أخذ الوقت الحالي تلقائياً
                        const currentTime = today.toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        })
                        
                        addStudentPermission.mutate({
                          studentId: selectedStudentForPermission.id,
                          reason: permissionReason,
                          exitTime: currentTime,
                          notes: permissionNotes || null,
                          permissionDate: permissionDate
                        })
                      }}
                      disabled={addStudentPermission.isPending}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-2.5 rounded-lg transition-all shadow-md disabled:opacity-50 text-sm"
                      data-testid="button-submit-permission"
                    >
                      {addStudentPermission.isPending ? 'جاري التسجيل...' : 'تسجيل الاستئذان'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* عرض استئذانات طالب محدد */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <UserSearch size={24} className="text-purple-700" />
                  <h3 className="text-2xl font-bold text-purple-900">عرض استئذانات طالب محدد</h3>
                </div>
                <button
                  onClick={() => setShowPermissionDateFilter(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                  data-testid="button-filter-permission-date"
                >
                  <Calendar size={18} />
                  <span>فلتر بالتاريخ</span>
                </button>
              </div>

              {/* حقل البحث */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={permissionStudentSearchTerm}
                  onChange={(e) => setPermissionStudentSearchTerm(e.target.value)}
                  placeholder="ابحث بالاسم أو السجل المدني..."
                  className="w-full px-6 py-4 text-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none rounded-lg bg-white"
                  data-testid="input-search-permission-student-filter"
                />
                
                {/* نتائج البحث */}
                {permissionStudentSearchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-purple-300 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                    {students
                      .filter(s => 
                        s.name.toLowerCase().includes(permissionStudentSearchTerm.toLowerCase()) ||
                        s.nationalId.includes(permissionStudentSearchTerm)
                      )
                      .slice(0, 5)
                      .map(student => {
                        const group = groups.find(g => g.id === student.groupId)
                        return (
                          <button
                            key={student.id}
                            onClick={() => {
                              setSelectedPermissionStudentFilter(student)
                              setPermissionStudentSearchTerm('')
                            }}
                            className="w-full px-6 py-4 text-right hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                            data-testid={`search-result-permission-filter-${student.id}`}
                          >
                            <div className="font-bold text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {student.nationalId} • {group?.stage || 'غير محدد'} • {student.permissionCount || 0} استئذان
                            </div>
                          </button>
                        )
                      })}
                  </div>
                )}
              </div>

              {/* بانر الطالب المحدد */}
              {selectedPermissionStudentFilter && (
                <div className="bg-purple-200 border-2 border-purple-400 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-right flex-1">
                      <div className="text-purple-900 font-bold text-lg mb-1">
                        عرض استئذانات: {selectedPermissionStudentFilter.name}
                      </div>
                      <div className="text-purple-700 text-sm">
                        عدد الاستئذانات: {selectedPermissionStudentFilter.permissionCount || 0}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPermissionStudentFilter(null)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                      data-testid="button-clear-permission-student-filter"
                    >
                      إلغاء التصفية
                    </button>
                  </div>
                </div>
              )}

              {/* بانر فلتر التاريخ */}
              {permissionFilterDate && (
                <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-blue-900 font-bold">
                      التاريخ: {new Date(permissionFilterDate).toLocaleDateString('ar-SA-u-ca-islamic', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </div>
                    <button
                      onClick={() => setPermissionFilterDate('')}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                      data-testid="button-clear-permission-date-filter"
                    >
                      إلغاء فلتر التاريخ
                    </button>
                  </div>
                </div>
              )}

              {/* سجل الاستئذانات */}
              <div className="bg-white rounded-xl p-4">
                {isLoadingPermissions ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 font-semibold">جاري تحميل الاستئذانات...</p>
                  </div>
                ) : (() => {
                  let filteredPermissions = [...studentPermissions]
                  
                  // فلتر حسب الطالب المحدد
                  if (selectedPermissionStudentFilter) {
                    filteredPermissions = filteredPermissions.filter((p: any) => 
                      p.studentId === selectedPermissionStudentFilter.id
                    )
                  }
                  
                  // فلتر حسب التاريخ (المقارنة بصيغة ISO الميلادية)
                  if (permissionFilterDate) {
                    filteredPermissions = filteredPermissions.filter((p: any) => 
                      p.permissionDate === permissionFilterDate
                    )
                  }
                  
                  if (filteredPermissions.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <LogOut size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-xl text-gray-500 font-semibold">لا توجد استئذانات</p>
                        <p className="text-gray-400 mt-2">
                          {selectedPermissionStudentFilter || permissionFilterDate 
                            ? 'جرب فلاتر أخرى' 
                            : 'سيتم عرض الاستئذانات هنا بعد تسجيلها'}
                        </p>
                      </div>
                    )
                  }
                  
                  return (
                    <div className="space-y-3">
                    {filteredPermissions.sort((a: any, b: any) => 
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    ).map((permission: any) => {
                      const student = students.find((s: Student) => s.id === permission.studentId)
                      if (!student) return null
                      
                      // تحويل التاريخ الميلادي إلى هجري للعرض
                      const permissionDateObj = new Date(permission.permissionDate)
                      const hijriDate = permissionDateObj.toLocaleDateString('ar-SA-u-ca-islamic', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })
                      
                      return (
                        <div key={permission.id} className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="text-right flex-1">
                              <div className="font-bold text-lg text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                {hijriDate} • {permission.exitTime || 'لم يحدد الوقت'}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  if (confirm('هل أنت متأكد من حذف هذا الاستئذان؟')) {
                                    // TODO: Add delete mutation
                                    alert('سيتم إضافة وظيفة الحذف قريباً')
                                  }
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                                data-testid={`button-delete-permission-${permission.id}`}
                              >
                                <span>🗑️</span>
                                <span>حذف</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (!student.guardianPhone) {
                                    alert('رقم جوال ولي الأمر غير مسجل')
                                    return
                                  }
                                  
                                  const phone = formatPhoneForWhatsApp(student.guardianPhone)
                                  if (!phone) {
                                    alert('رقم جوال ولي الأمر غير صالح. يرجى التأكد من إدخال الرقم الصحيح في بيانات الطالب.')
                                    return
                                  }
                                  
                                  const text = `استئذان: ${student.name}\nالتاريخ: ${hijriDate}\nالسبب: ${permission.reason}\nالوقت: ${permission.exitTime || 'لم يحدد'}`
                                  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank')
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                                data-testid={`button-whatsapp-permission-${permission.id}`}
                              >
                                <span>📱</span>
                                <span>واتساب</span>
                              </button>
                              <button
                                onClick={() => {
                                  const printContent = `
                                    <div class="print-content" style="padding: 40px; font-family: Arial, sans-serif; direction: rtl;">
                                      <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #000; padding-bottom: 20px;">
                                        <h1 style="font-size: 28px; margin-bottom: 10px; font-weight: bold;">${profile?.schoolName || 'المدرسة'}</h1>
                                        <p style="font-size: 18px; color: #555;">المعلم: ${profile?.name || 'غير محدد'}</p>
                                      </div>
                                      
                                      <div style="margin-bottom: 30px;">
                                        <h2 style="font-size: 24px; text-align: center; background-color: #f97316; color: white; padding: 15px; border-radius: 8px; margin-bottom: 30px;">استئذان طالب</h2>
                                      </div>
                                      
                                      <div style="background-color: #fff3e0; padding: 25px; border-radius: 8px; border: 2px solid #f97316; margin-bottom: 20px;">
                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                          <div>
                                            <p style="font-size: 16px; color: #666; margin-bottom: 5px;">اسم الطالب:</p>
                                            <p style="font-size: 20px; font-weight: bold;">${student.name}</p>
                                          </div>
                                          <div>
                                            <p style="font-size: 16px; color: #666; margin-bottom: 5px;">السجل المدني:</p>
                                            <p style="font-size: 20px; font-weight: bold;">${student.nationalId}</p>
                                          </div>
                                        </div>
                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                          <div>
                                            <p style="font-size: 16px; color: #666; margin-bottom: 5px;">التاريخ:</p>
                                            <p style="font-size: 20px; font-weight: bold;">${hijriDate}</p>
                                          </div>
                                          <div>
                                            <p style="font-size: 16px; color: #666; margin-bottom: 5px;">وقت الخروج:</p>
                                            <p style="font-size: 20px; font-weight: bold;">${permission.exitTime || 'لم يحدد'}</p>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-right: 4px solid #f59e0b; margin-bottom: 20px;">
                                        <p style="font-size: 16px; color: #666; margin-bottom: 8px;">سبب الاستئذان:</p>
                                        <p style="font-size: 18px; line-height: 1.6;">${permission.reason}</p>
                                      </div>
                                      
                                      ${permission.notes ? `
                                        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; border-right: 4px solid #0ea5e9; margin-bottom: 30px;">
                                          <p style="font-size: 16px; color: #666; margin-bottom: 8px;">ملاحظات:</p>
                                          <p style="font-size: 18px; line-height: 1.6;">${permission.notes}</p>
                                        </div>
                                      ` : ''}
                                      
                                      <div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                                        <div style="text-align: center; border-top: 2px solid #000; padding-top: 10px;">
                                          <p style="font-size: 16px;">توقيع المعلم</p>
                                        </div>
                                        <div style="text-align: center; border-top: 2px solid #000; padding-top: 10px;">
                                          <p style="font-size: 16px;">توقيع ولي الأمر</p>
                                        </div>
                                      </div>
                                    </div>
                                  `
                                  const printWindow = window.open('', '', 'height=600,width=800')
                                  printWindow.document.write('<html><head><title>طباعة استئذان</title>')
                                  printWindow.document.write('</head><body>')
                                  printWindow.document.write(printContent)
                                  printWindow.document.write('</body></html>')
                                  printWindow.document.close()
                                  printWindow.print()
                                }}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                                data-testid={`button-print-permission-${permission.id}`}
                              >
                                <span>🖨️</span>
                                <span>طباعة</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-right">
                            <div className="bg-white p-3 rounded-lg">
                              <span className="text-sm font-bold text-gray-700">السبب: </span>
                              <span className="text-gray-900">{permission.reason}</span>
                            </div>
                            {permission.notes && (
                              <div className="bg-yellow-50 p-3 rounded-lg">
                                <span className="text-sm font-bold text-yellow-700">ملاحظات: </span>
                                <span className="text-yellow-900">{permission.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        )}

        {/* صفحة المخالفات */}
        {currentPage === 'absence' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-red-200 bg-opacity-50 p-3 rounded-xl">
                    <AlertCircle className="text-red-700" size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-red-900">المخالفات</h2>
                    <p className="text-red-700 mt-1">تسجيل ومتابعة مخالفات الطلاب</p>
                  </div>
                </div>
              </div>
            </div>

            {/* حقل البحث */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search size={20} className="text-gray-600" />
                <h3 className="text-lg font-bold text-gray-800">تسجيل مخالفة</h3>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={violationSearchTerm}
                  onChange={(e) => setViolationSearchTerm(e.target.value)}
                  placeholder="ابحث بالاسم أو السجل المدني..."
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 focus:border-red-400 focus:outline-none rounded-lg bg-gray-50"
                  data-testid="input-search-violation"
                />
                
                {/* نتائج البحث */}
                {violationSearchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                    {students
                      .filter(s => 
                        s.name.toLowerCase().includes(violationSearchTerm.toLowerCase()) ||
                        s.nationalId.includes(violationSearchTerm)
                      )
                      .map(student => {
                        const group = groups.find(g => g.id === student.groupId)
                        return (
                          <button
                            key={student.id}
                            onClick={() => {
                              setSelectedStudentForViolation(student)
                              setViolationSearchTerm('')
                            }}
                            className="w-full px-6 py-4 text-right hover:bg-red-50 transition-colors border-b border-gray-100 last:border-b-0"
                            data-testid={`search-result-violation-${student.id}`}
                          >
                            <div className="font-bold text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {student.nationalId} • {group?.stage || 'غير محدد'}
                            </div>
                          </button>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* معلومات الطالب المحدد */}
            {selectedStudentForViolation && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-red-900 mb-4 text-right">الطالب المحدد:</h3>
                <div className="grid grid-cols-2 gap-4 text-right">
                  <div>
                    <span className="text-gray-700">الاسم: </span>
                    <span className="font-bold text-gray-900">{selectedStudentForViolation.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-700">السجل المدني: </span>
                    <span className="font-bold text-gray-900">{selectedStudentForViolation.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-gray-700">الصف: </span>
                    <span className="font-bold text-gray-900">
                      {groups.find(g => g.id === selectedStudentForViolation.groupId)?.stage || 'غير محدد'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700">عدد المخالفات السابقة: </span>
                    <span className="font-bold text-red-600">{selectedStudentForViolation.violationCount || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* نموذج تسجيل المخالفة */}
            {selectedStudentForViolation && (
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="text-base font-bold text-red-900 mb-3 text-right">تفاصيل المخالفة</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 text-right">نوع المخالفة</label>
                    <select
                      value={violationType}
                      onChange={(e) => setViolationType(e.target.value)}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                      data-testid="select-violation-type"
                    >
                      <option value="">اختر نوع المخالفة</option>
                      <option value="تأخر">تأخر عن الطابور</option>
                      <option value="غياب">غياب بدون عذر</option>
                      <option value="سلوك">سلوك غير لائق</option>
                      <option value="واجب">عدم حل الواجب</option>
                      <option value="زي">مخالفة الزي المدرسي</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 text-right">وصف المخالفة</label>
                    <textarea
                      value={violationDescription}
                      onChange={(e) => setViolationDescription(e.target.value)}
                      placeholder="اكتب تفاصيل المخالفة..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-right resize-none"
                      data-testid="textarea-violation-description"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 text-right">الإجراء المتخذ</label>
                    <select
                      value={violationAction}
                      onChange={(e) => setViolationAction(e.target.value)}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                      data-testid="select-violation-action"
                    >
                      <option value="">اختر الإجراء</option>
                      <option value="إنذار شفهي">إنذار شفهي</option>
                      <option value="إنذار كتابي">إنذار كتابي</option>
                      <option value="استدعاء ولي الأمر">استدعاء ولي الأمر</option>
                      <option value="حسم درجات">حسم درجات السلوك</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 text-right">ملاحظات (اختياري)</label>
                    <textarea
                      value={violationNotes}
                      onChange={(e) => setViolationNotes(e.target.value)}
                      placeholder="أي ملاحظات إضافية..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-right resize-none"
                      data-testid="textarea-violation-notes"
                    />
                  </div>

                  {/* رسالة خطأ */}
                  {violationError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-right text-sm" data-testid="error-violation">
                      {violationError}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedStudentForViolation(null)
                        setViolationType('')
                        setViolationDescription('')
                        setViolationAction('')
                        setViolationNotes('')
                        setViolationError('')
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2.5 rounded-lg transition-all text-sm"
                      data-testid="button-cancel-violation"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => {
                        if (!violationType || !violationDescription.trim() || !violationAction) {
                          setViolationError('الرجاء تعبئة جميع الحقول المطلوبة (نوع المخالفة، الوصف، والإجراء)')
                          return
                        }
                        setViolationError('')
                        
                        // تخزين التاريخ بصيغة ISO الميلادية (YYYY-MM-DD)
                        const today = new Date()
                        const violationDate = today.toISOString().split('T')[0]
                        
                        addStudentViolation.mutate({
                          studentId: selectedStudentForViolation.id,
                          violationType: violationType,
                          description: violationDescription,
                          actionTaken: violationAction,
                          notes: violationNotes || null,
                          violationDate: violationDate
                        })
                      }}
                      disabled={addStudentViolation.isPending}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2.5 rounded-lg transition-all shadow-md disabled:opacity-50 text-sm"
                      data-testid="button-submit-violation"
                    >
                      {addStudentViolation.isPending ? 'جاري التسجيل...' : 'تسجيل المخالفة'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* عرض مخالفات طالب محدد */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <UserSearch size={24} className="text-purple-700" />
                  <h3 className="text-2xl font-bold text-purple-900">عرض مخالفات طالب محدد</h3>
                </div>
                <button
                  onClick={() => setShowViolationDateFilter(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                  data-testid="button-filter-violation-date"
                >
                  <Calendar size={18} />
                  <span>فلتر بالتاريخ</span>
                </button>
              </div>

              {/* حقل البحث */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={violationStudentSearchTerm}
                  onChange={(e) => setViolationStudentSearchTerm(e.target.value)}
                  placeholder="ابحث بالاسم أو السجل المدني..."
                  className="w-full px-6 py-4 text-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none rounded-lg bg-white"
                  data-testid="input-search-violation-student-filter"
                />
                
                {/* نتائج البحث */}
                {violationStudentSearchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-purple-300 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                    {students
                      .filter(s => 
                        s.name.toLowerCase().includes(violationStudentSearchTerm.toLowerCase()) ||
                        s.nationalId.includes(violationStudentSearchTerm)
                      )
                      .slice(0, 5)
                      .map(student => {
                        const group = groups.find(g => g.id === student.groupId)
                        return (
                          <button
                            key={student.id}
                            onClick={() => {
                              setSelectedViolationStudentFilter(student)
                              setViolationStudentSearchTerm('')
                            }}
                            className="w-full px-6 py-4 text-right hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                            data-testid={`search-result-violation-filter-${student.id}`}
                          >
                            <div className="font-bold text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {student.nationalId} • {group?.stage || 'غير محدد'} • {student.violationCount || 0} مخالفة
                            </div>
                          </button>
                        )
                      })}
                  </div>
                )}
              </div>

              {/* بانر الطالب المحدد */}
              {selectedViolationStudentFilter && (
                <div className="bg-purple-200 border-2 border-purple-400 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-right flex-1">
                      <div className="text-purple-900 font-bold text-lg mb-1">
                        عرض مخالفات: {selectedViolationStudentFilter.name}
                      </div>
                      <div className="text-purple-700 text-sm">
                        عدد المخالفات: {selectedViolationStudentFilter.violationCount || 0}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedViolationStudentFilter(null)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                      data-testid="button-clear-violation-student-filter"
                    >
                      إلغاء التصفية
                    </button>
                  </div>
                </div>
              )}

              {/* بانر فلتر التاريخ */}
              {violationFilterDate && (
                <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-blue-900 font-bold">
                      التاريخ: {new Date(violationFilterDate).toLocaleDateString('ar-SA-u-ca-islamic', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </div>
                    <button
                      onClick={() => setViolationFilterDate('')}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                      data-testid="button-clear-violation-date-filter"
                    >
                      إلغاء فلتر التاريخ
                    </button>
                  </div>
                </div>
              )}

              {/* سجل المخالفات */}
              <div className="bg-white rounded-xl p-4">
                {isLoadingViolations ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 font-semibold">جاري تحميل المخالفات...</p>
                  </div>
                ) : (() => {
                  let filteredViolations = [...studentViolations]
                  
                  // فلتر حسب الطالب المحدد
                  if (selectedViolationStudentFilter) {
                    filteredViolations = filteredViolations.filter((v: any) => 
                      v.studentId === selectedViolationStudentFilter.id
                    )
                  }
                  
                  // فلتر حسب التاريخ (المقارنة بصيغة ISO الميلادية)
                  if (violationFilterDate) {
                    filteredViolations = filteredViolations.filter((v: any) => 
                      v.violationDate === violationFilterDate
                    )
                  }
                  
                  if (filteredViolations.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <AlertCircle size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-xl text-gray-500 font-semibold">لا توجد مخالفات</p>
                        <p className="text-gray-400 mt-2">
                          {selectedViolationStudentFilter || violationFilterDate 
                            ? 'جرب فلاتر أخرى' 
                            : 'سيتم عرض المخالفات هنا بعد تسجيلها'}
                        </p>
                      </div>
                    )
                  }
                  
                  return (
                    <div className="space-y-3">
                    {filteredViolations.sort((a: any, b: any) => 
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    ).map((violation: any) => {
                      const student = students.find((s: Student) => s.id === violation.studentId)
                      if (!student) return null
                      
                      // تحويل التاريخ الميلادي إلى هجري للعرض
                      const violationDateObj = new Date(violation.violationDate)
                      const hijriDate = violationDateObj.toLocaleDateString('ar-SA-u-ca-islamic', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })
                      
                      return (
                        <div key={violation.id} className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="text-right flex-1">
                              <div className="font-bold text-lg text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                {hijriDate} • {violation.violationType}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  if (confirm('هل أنت متأكد من حذف هذه المخالفة؟')) {
                                    // TODO: Add delete mutation
                                    alert('سيتم إضافة وظيفة الحذف قريباً')
                                  }
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                                data-testid={`button-delete-violation-${violation.id}`}
                              >
                                <span>🗑️</span>
                                <span>حذف</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (!student.guardianPhone) {
                                    alert('رقم جوال ولي الأمر غير مسجل')
                                    return
                                  }
                                  
                                  const phone = formatPhoneForWhatsApp(student.guardianPhone)
                                  if (!phone) {
                                    alert('رقم جوال ولي الأمر غير صالح. يرجى التأكد من إدخال الرقم الصحيح في بيانات الطالب.')
                                    return
                                  }
                                  
                                  const text = `مخالفة: ${student.name}\nالتاريخ: ${hijriDate}\nالنوع: ${violation.violationType}\nالوصف: ${violation.description}\nالإجراء: ${violation.actionTaken}`
                                  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank')
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                                data-testid={`button-whatsapp-violation-${violation.id}`}
                              >
                                <span>📱</span>
                                <span>واتساب</span>
                              </button>
                              <button
                                onClick={() => {
                                  const printContent = `
                                    <div class="print-content" style="padding: 40px; font-family: Arial, sans-serif; direction: rtl;">
                                      <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #000; padding-bottom: 20px;">
                                        <h1 style="font-size: 28px; margin-bottom: 10px; font-weight: bold;">${profile?.schoolName || 'المدرسة'}</h1>
                                        <p style="font-size: 18px; color: #555;">المعلم: ${profile?.name || 'غير محدد'}</p>
                                      </div>
                                      
                                      <div style="margin-bottom: 30px;">
                                        <h2 style="font-size: 24px; text-align: center; background-color: #dc2626; color: white; padding: 15px; border-radius: 8px; margin-bottom: 30px;">إشعار مخالفة</h2>
                                      </div>
                                      
                                      <div style="background-color: #fee2e2; padding: 25px; border-radius: 8px; border: 2px solid #dc2626; margin-bottom: 20px;">
                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                          <div>
                                            <p style="font-size: 16px; color: #666; margin-bottom: 5px;">اسم الطالب:</p>
                                            <p style="font-size: 20px; font-weight: bold;">${student.name}</p>
                                          </div>
                                          <div>
                                            <p style="font-size: 16px; color: #666; margin-bottom: 5px;">السجل المدني:</p>
                                            <p style="font-size: 20px; font-weight: bold;">${student.nationalId}</p>
                                          </div>
                                        </div>
                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                          <div>
                                            <p style="font-size: 16px; color: #666; margin-bottom: 5px;">التاريخ:</p>
                                            <p style="font-size: 20px; font-weight: bold;">${hijriDate}</p>
                                          </div>
                                          <div>
                                            <p style="font-size: 16px; color: #666; margin-bottom: 5px;">نوع المخالفة:</p>
                                            <p style="font-size: 20px; font-weight: bold;">${violation.violationType}</p>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-right: 4px solid #f59e0b; margin-bottom: 20px;">
                                        <p style="font-size: 16px; color: #666; margin-bottom: 8px;">وصف المخالفة:</p>
                                        <p style="font-size: 18px; line-height: 1.6;">${violation.description}</p>
                                      </div>
                                      
                                      <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; border-right: 4px solid #3b82f6; margin-bottom: 20px;">
                                        <p style="font-size: 16px; color: #666; margin-bottom: 8px;">الإجراء المتخذ:</p>
                                        <p style="font-size: 18px; line-height: 1.6;">${violation.actionTaken}</p>
                                      </div>
                                      
                                      ${violation.notes ? `
                                        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; border-right: 4px solid #0ea5e9; margin-bottom: 30px;">
                                          <p style="font-size: 16px; color: #666; margin-bottom: 8px;">ملاحظات إضافية:</p>
                                          <p style="font-size: 18px; line-height: 1.6;">${violation.notes}</p>
                                        </div>
                                      ` : ''}
                                      
                                      <div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                                        <div style="text-align: center; border-top: 2px solid #000; padding-top: 10px;">
                                          <p style="font-size: 16px;">توقيع المعلم</p>
                                        </div>
                                        <div style="text-align: center; border-top: 2px solid #000; padding-top: 10px;">
                                          <p style="font-size: 16px;">توقيع ولي الأمر</p>
                                        </div>
                                      </div>
                                    </div>
                                  `
                                  const printWindow = window.open('', '', 'height=600,width=800')
                                  printWindow.document.write('<html><head><title>طباعة مخالفة</title>')
                                  printWindow.document.write('</head><body>')
                                  printWindow.document.write(printContent)
                                  printWindow.document.write('</body></html>')
                                  printWindow.document.close()
                                  printWindow.print()
                                }}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                                data-testid={`button-print-violation-${violation.id}`}
                              >
                                <span>🖨️</span>
                                <span>طباعة</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-right">
                            <div className="bg-white p-3 rounded-lg">
                              <span className="text-sm font-bold text-gray-700">الوصف: </span>
                              <span className="text-gray-900">{violation.description}</span>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <span className="text-sm font-bold text-blue-700">الإجراء المتخذ: </span>
                              <span className="text-blue-900">{violation.actionTaken}</span>
                            </div>
                            {violation.notes && (
                              <div className="bg-yellow-50 p-3 rounded-lg">
                                <span className="text-sm font-bold text-yellow-700">ملاحظات: </span>
                                <span className="text-yellow-900">{violation.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        )}

        {/* الصفحة الرئيسية */}
        {currentPage === 'home' && (
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings size={20} className="text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">التصفية</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالات الخاصة
                  </label>
                  <div className="relative">
                    <select
                      value={homeSpecialStatusFilter}
                      onChange={(e) => setHomeSpecialStatusFilter(e.target.value)}
                      className="w-full px-4 py-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center font-bold"
                      data-testid="select-special-status-filter"
                    >
                      <option value="all">الكل</option>
                      {specialStatuses.map(status => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المرحلة الدراسية
                  </label>
                  <div className="relative">
                    <select
                      value={homeStageFilter}
                      onChange={(e) => {
                        setHomeStageFilter(e.target.value)
                        setHomeGroupFilter('all')
                      }}
                      className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 text-center font-bold"
                      data-testid="select-stage-filter"
                    >
                      <option value="all">الكل</option>
                      {Array.from(new Set(groups.map(g => g.stage))).map(stage => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المجموعات
                  </label>
                  <div className="relative">
                    <select
                      value={homeGroupFilter}
                      onChange={(e) => setHomeGroupFilter(e.target.value)}
                      disabled={homeStageFilter === 'all'}
                      className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 text-center font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                      data-testid="select-group-filter"
                    >
                      <option value="all">الكل</option>
                      {groups
                        .filter(g => homeStageFilter === 'all' || g.stage === homeStageFilter)
                        .map(group => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                
                {/* زر إعادة تعيين الفلاتر */}
                {(homeSpecialStatusFilter !== 'all' || homeStageFilter !== 'all' || homeGroupFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setHomeSpecialStatusFilter('all')
                      setHomeStageFilter('all')
                      setHomeGroupFilter('all')
                    }}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-lg transition-all"
                    data-testid="button-reset-filters"
                  >
                    إعادة تعيين الفلاتر
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div className="flex-1">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Search className="text-white" size={28} />
                <h2 className="text-2xl font-bold text-white">استفسار عن طالب</h2>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن طالب بالاسم، السجل المدني، أو رقم الجوال..."
                  className="w-full px-6 py-4 text-lg border-none focus:outline-none rounded-lg"
                  data-testid="input-search"
                />
              </div>
            </div>

            {/* Students List - منظم حسب المجموعات */}
            <div className="mt-6 space-y-4">
              {filteredStudents.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <Users className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {students.length === 0 ? 'لا يوجد طلاب' : 'لا توجد نتائج'}
                  </h3>
                  <p className="text-gray-600">
                    {students.length === 0 
                      ? 'قم بإضافة طلاب من خلال استيراد Excel أو إضافة يدوية'
                      : 'لم يتم العثور على طلاب بهذا الاسم أو الرقم'}
                  </p>
                </div>
              ) : (
                Object.entries(studentsByGroup).map(([groupId, groupStudents], groupIndex) => {
                  const group = groups.find(g => g.id === groupId)
                  const colorIndex = groupIndex % groupColors.length
                  const colors = groupColors[colorIndex]
                  const isExpanded = expandedGroups.has(groupId)
                  
                  // الحصول على اسم المجموعة المخصصة من أول طالب
                  const customGroupName = groupStudents.length > 0 && groupStudents[0].grade 
                    ? groupStudents[0].grade 
                    : null

                  return (
                    <div key={groupId} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      {/* رأس المجموعة */}
                      <button
                        onClick={() => toggleGroup(groupId)}
                        className={`w-full bg-gradient-to-r ${colors.bg} p-4 flex items-center justify-between text-white hover:opacity-90 transition-opacity`}
                        data-testid={`button-toggle-group-${groupId}`}
                      >
                        <h3 className="text-xl font-bold">
                          {group 
                            ? customGroupName 
                              ? `${group.stage} - ${customGroupName}`
                              : `${group.stage}`
                            : 'بدون مجموعة'}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="bg-white bg-opacity-30 px-4 py-1 rounded-full text-sm font-bold">
                            {groupStudents.length} طالب
                          </span>
                          <ChevronDown 
                            size={24} 
                            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </button>

                      {/* قائمة الطلاب داخل المجموعة */}
                      {isExpanded && (
                        <div className="divide-y divide-gray-100 pb-64">
                          {groupStudents.map((student) => {
                            const specialStatus = student.specialStatusId 
                              ? specialStatuses.find(s => s.id === student.specialStatusId)
                              : null
                            const hasSpecialStatus = !!specialStatus

                            return (
                              <div 
                                key={student.id} 
                                className={`p-4 transition-colors ${
                                  hasSpecialStatus ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'
                                }`}
                                data-testid={`student-card-${student.id}`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h4 className="text-lg font-bold text-gray-900">{student.name}</h4>
                                      {specialStatus && (
                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                                          {specialStatus.name}
                                        </span>
                                      )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                                      <div>
                                        <span className="font-semibold">السجل:</span> {student.nationalId}
                                      </div>
                                      <div>
                                        <span className="font-semibold">الصف:</span> {student.grade || 'غير محدد'}
                                      </div>
                                      <div>
                                        <span className="font-semibold">المجموعة:</span> {group?.name || 'غير محدد'}
                                      </div>
                                      <div>
                                        <span className="font-semibold">جوال:</span> {student.phone || 'غير محدد'}
                                      </div>
                                      <div className="md:col-span-2">
                                        <span className="font-semibold">ولي أمر:</span> {student.guardianPhone || 'غير محدد'}
                                      </div>
                                    </div>

                                    {/* الإحصائيات */}
                                    <div className="flex gap-4 text-xs">
                                      <div className="flex items-center gap-1">
                                        <span className="font-semibold text-gray-700">عدد الزيارات:</span>
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">{student.visitCount || 0}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="font-semibold text-gray-700">عدد المخالفات:</span>
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold">{student.violationCount || 0}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="font-semibold text-gray-700">عدد الاستئذانات:</span>
                                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">{student.permissionCount || 0}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Three Dots Menu */}
                                  <div className="relative">
                                    <button
                                      onClick={() => setOpenMenuStudentId(openMenuStudentId === student.id ? null : student.id)}
                                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                      data-testid={`button-menu-${student.id}`}
                                    >
                                      <MoreVertical size={20} className="text-gray-600" />
                                    </button>

                                    {openMenuStudentId === student.id && (
                                      <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-300 py-1" style={{ minWidth: '300px', zIndex: 999999 }}>
                                        <button
                                          onClick={() => {
                                            setSelectedStudent(student)
                                            setShowAllowEntryModal(true)
                                            setOpenMenuStudentId(null)
                                          }}
                                          className="w-full text-right px-4 py-3 hover:bg-green-50 transition-colors flex items-center gap-3"
                                          data-testid={`button-allow-entry-${student.id}`}
                                        >
                                          <CheckCircle size={20} className="text-green-600" />
                                          <span className="text-base font-bold text-gray-800">السماح بدخول الفصل</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            setPrintStudent(student)
                                            setShowPrintModal(true)
                                            setOpenMenuStudentId(null)
                                          }}
                                          className="w-full text-right px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3"
                                          data-testid={`button-print-${student.id}`}
                                        >
                                          <Printer size={20} className="text-blue-600" />
                                          <span className="text-base font-bold text-gray-800">طباعة بيانات الطالب</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            const studentGroup = groups.find(g => g.id === student.groupId)
                                            setEditStudentData({
                                              name: student.name,
                                              nationalId: student.nationalId,
                                              phone: student.phone || '',
                                              guardianPhone: student.guardianPhone || '',
                                              grade: student.grade,
                                              groupId: student.groupId || '',
                                              specialStatusId: student.specialStatusId || '',
                                            })
                                            setSelectedStage(studentGroup?.stage || '')
                                            setSelectedStudent(student)
                                            setShowEditStudentModal(true)
                                            setOpenMenuStudentId(null)
                                          }}
                                          className="w-full text-right px-4 py-3 hover:bg-yellow-50 transition-colors flex items-center gap-3"
                                          data-testid={`button-edit-${student.id}`}
                                        >
                                          <Edit size={20} className="text-yellow-600" />
                                          <span className="text-base font-bold text-gray-800">تعديل بيانات الطالب</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            if (window.confirm(`هل أنت متأكد من حذف الطالب ${student.name}؟\n\nسيتم حذف جميع بيانات الطالب نهائياً ولا يمكن التراجع عن هذا الإجراء.`)) {
                                              deleteStudent.mutate(student.id)
                                            }
                                            setOpenMenuStudentId(null)
                                          }}
                                          disabled={deleteStudent.isPending}
                                          className="w-full text-right px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 disabled:opacity-50"
                                          data-testid={`button-delete-${student.id}`}
                                        >
                                          <Trash2 size={20} className="text-red-600" />
                                          <span className="text-base font-bold text-red-600">
                                            {deleteStudent.isPending ? 'جاري الحذف...' : 'حذف الطالب'}
                                          </span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 font-medium">
              تصميم وتطوير: الأستاذ وائل الفيفي
            </p>
            <a
              href="https://wa.me/966558890902"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 mt-1 inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>📱</span>
              <span dir="ltr" className="font-semibold">0558890902</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Modal: إرسال للمعلم */}
      {showSendToTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Send size={28} />
                إرسال للمعلم
              </h2>
              <button
                onClick={() => {
                  setShowSendToTeacherModal(false)
                  setSelectedTeacherForSend('')
                  setSelectedStageForSend('')
                  setSelectedGroupsForSend(new Set())
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                data-testid="button-close-send-modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* رسالة توضيحية */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-center">
                  سيتم إرسال بيانات الطلاب ذوي الحالات الخاصة في المجموعة المحددة إلى المعلم عبر واتساب
                </p>
              </div>

              {/* اختر المعلم */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  اختر المعلم <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedTeacherForSend}
                  onChange={(e) => setSelectedTeacherForSend(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
                  data-testid="select-teacher-for-send"
                >
                  <option value="">اختر المعلم</option>
                  {teachers.map((teacher: any) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.specialization || 'غير محدد'}
                    </option>
                  ))}
                </select>
              </div>

              {/* اختر المرحلة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  اختر المرحلة <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedStageForSend}
                  onChange={(e) => {
                    setSelectedStageForSend(e.target.value)
                    setSelectedGroupsForSend(new Set())
                  }}
                  className="w-full px-4 py-3 border-2 border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
                  data-testid="select-stage-for-send"
                >
                  <option value="">اختر المرحلة</option>
                  {Array.from(new Set(groups.map((g: any) => g.stage))).map((stage: string) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              {/* اختر المجموعة */}
              {selectedStageForSend && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    اختر المجموعة <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3 max-h-64 overflow-y-auto border-2 border-gray-300 rounded-lg p-4">
                    {groups
                      .filter((group: any) => group.stage === selectedStageForSend)
                      .filter((group: any) => {
                        const groupStudents = students.filter(s => s.groupId === group.id && s.specialStatusId)
                        return groupStudents.length > 0
                      })
                      .map((group: any) => {
                        const groupStudents = students.filter(s => s.groupId === group.id && s.specialStatusId)
                        const isChecked = selectedGroupsForSend.has(group.id)
                        
                        return (
                          <div
                            key={group.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <input
                              type="checkbox"
                              id={`group-${group.id}`}
                              checked={isChecked}
                              onChange={(e) => {
                                const newSet = new Set(selectedGroupsForSend)
                                if (e.target.checked) {
                                  newSet.add(group.id)
                                } else {
                                  newSet.delete(group.id)
                                }
                                setSelectedGroupsForSend(newSet)
                              }}
                              className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                              data-testid={`checkbox-group-${group.id}`}
                            />
                            <label
                              htmlFor={`group-${group.id}`}
                              className="flex-1 text-right mr-3 cursor-pointer"
                            >
                              <span className="font-semibold text-gray-900">{group.name}</span>
                              <span className="text-gray-500 mr-2">({groupStudents.length} طالب)</span>
                            </label>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Buttons */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowSendToTeacherModal(false)
                  setSelectedTeacherForSend('')
                  setSelectedStageForSend('')
                  setSelectedGroupsForSend(new Set())
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors"
                data-testid="button-cancel-send"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (!selectedTeacherForSend || !selectedStageForSend || selectedGroupsForSend.size === 0) {
                    alert('الرجاء تحديد المعلم والمرحلة والمجموعات')
                    return
                  }

                  const selectedTeacher = teachers.find((t: any) => t.id === selectedTeacherForSend)
                  if (!selectedTeacher || !selectedTeacher.phone) {
                    alert('المعلم المحدد لا يحتوي على رقم جوال')
                    return
                  }

                  // جمع بيانات الطلاب من المجموعات المحددة
                  const selectedStudents = students.filter(s => 
                    s.groupId && selectedGroupsForSend.has(s.groupId) && s.specialStatusId
                  )

                  if (selectedStudents.length === 0) {
                    alert('لا يوجد طلاب ذوي حالات خاصة في المجموعات المحددة')
                    return
                  }

                  // تنسيق الرسالة
                  const selectedTeacherName = teachers.find((t: any) => t.id === selectedTeacherForSend)?.name || 'المعلم'
                  
                  let message = `*اسم المعلم المرسل له:* ${selectedTeacherName}\n\n`
                  
                  Array.from(selectedGroupsForSend).forEach(groupId => {
                    const group = groups.find((g: any) => g.id === groupId)
                    const groupStudents = selectedStudents.filter(s => s.groupId === groupId)
                    
                    if (groupStudents.length > 0) {
                      message += `*${selectedStageForSend} (${group?.name})*\n`
                      message += `*الحالات الخاصة:*\n`
                      
                      groupStudents.forEach((student, index) => {
                        message += `${index + 1} - ${student.name}\n`
                      })
                      message += '\n'
                    }
                  })

                  // إرسال عبر واتساب
                  const phoneNumber = formatPhoneForWhatsApp(selectedTeacher.phone)
                  if (!phoneNumber) {
                    alert('رقم جوال المعلم غير صالح. يرجى التأكد من إدخال الرقم الصحيح.')
                    return
                  }
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
                  window.open(whatsappUrl, '_blank')

                  // إغلاق النافذة
                  setShowSendToTeacherModal(false)
                  setSelectedTeacherForSend('')
                  setSelectedStageForSend('')
                  setSelectedGroupsForSend(new Set())
                }}
                disabled={!selectedTeacherForSend || !selectedStageForSend || selectedGroupsForSend.size === 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-testid="button-confirm-send"
              >
                <Send size={20} />
                إرسال عبر واتساب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: طباعة المجموعة - الحالات الخاصة */}
      {showSpecialStatusPrintModal && selectedGroupForSpecialPrint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl flex items-center justify-between print:hidden">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Printer size={28} />
                طباعة الحالات الخاصة
              </h2>
              <button
                onClick={() => {
                  setShowSpecialStatusPrintModal(false)
                  setSelectedGroupForSpecialPrint(null)
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                data-testid="button-close-special-print-modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content - للطباعة */}
            <div className="flex-1 overflow-y-auto p-8">
              {/* معلومات المدرسة والمعلم */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.schoolName || 'المدرسة'}
                </h1>
                <p className="text-lg text-gray-700 mt-2">
                  المعلم: {profile?.name || 'غير محدد'}
                </p>
              </div>

              {/* عدد الطلاب */}
              <div className="text-right mb-4">
                <p className="text-lg font-bold text-gray-900">
                  عدد الطلاب: {students.filter(s => s.groupId === selectedGroupForSpecialPrint.id && s.specialStatusId).length}
                </p>
              </div>

              {/* الجدول */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                      <th className="border border-purple-600 px-4 py-3 text-right font-bold">الاسم</th>
                      <th className="border border-purple-600 px-4 py-3 text-right font-bold">السجل المدني</th>
                      <th className="border border-purple-600 px-4 py-3 text-right font-bold">جوال الطالب</th>
                      <th className="border border-purple-600 px-4 py-3 text-right font-bold">جوال ولي الأمر</th>
                      <th className="border border-purple-600 px-4 py-3 text-right font-bold">الحالة الخاصة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students
                      .filter(s => s.groupId === selectedGroupForSpecialPrint.id && s.specialStatusId)
                      .map((student, index) => {
                        const specialStatus = specialStatuses.find(s => s.id === student.specialStatusId)
                        return (
                          <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-purple-50'}>
                            <td className="border border-purple-300 px-4 py-3 text-right font-semibold text-gray-900">
                              {student.name}
                            </td>
                            <td className="border border-purple-300 px-4 py-3 text-right text-gray-700">
                              {student.nationalId}
                            </td>
                            <td className="border border-purple-300 px-4 py-3 text-right text-gray-700" dir="ltr">
                              {student.phone || '-'}
                            </td>
                            <td className="border border-purple-300 px-4 py-3 text-right text-gray-700" dir="ltr">
                              {student.guardianPhone || '-'}
                            </td>
                            <td className="border border-purple-300 px-4 py-3 text-right">
                              <span className="text-purple-700 font-semibold">
                                {showSpecialStatusColumn ? (specialStatus?.name || 'غير محدد') : 'لديه حالة خاصة'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer - Buttons */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 print:hidden">
              <button
                onClick={() => {
                  setShowSpecialStatusPrintModal(false)
                  setSelectedGroupForSpecialPrint(null)
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-colors"
                data-testid="button-cancel-special-print"
              >
                إلغاء
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                data-testid="button-confirm-special-print"
              >
                <Printer size={20} />
                طباعة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: إعدادات تسجيل الدخول */}
      {showLoginSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock size={28} className="text-white" />
                <h2 className="text-2xl font-bold text-white">إعدادات تسجيل الدخول</h2>
              </div>
              <button
                onClick={() => {
                  setShowLoginSettingsModal(false)
                  setNewUsername('admin')
                  setNewPassword('')
                  setConfirmPassword('')
                  setLoginSettingsError('')
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                data-testid="button-close-login-settings"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-gray-600 mb-6 text-center text-sm">
                يمكنك تغيير اسم المستخدم وكلمة المرور من هنا
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    اسم المستخدم الجديد
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                    data-testid="input-new-username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                    data-testid="input-new-password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد إدخال كلمة المرور"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                    data-testid="input-confirm-password"
                  />
                </div>

                {loginSettingsError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-right text-sm" data-testid="error-login-settings">
                    {loginSettingsError}
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Buttons */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowLoginSettingsModal(false)
                  setNewUsername('admin')
                  setNewPassword('')
                  setConfirmPassword('')
                  setLoginSettingsError('')
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
                data-testid="button-cancel-login-settings"
              >
                إلغاء
              </button>
              <button
                onClick={async () => {
                  // التحقق من البيانات
                  if (!newUsername || !newUsername.trim()) {
                    setLoginSettingsError('الرجاء إدخال اسم المستخدم')
                    return
                  }
                  if (!newPassword || !newPassword.trim()) {
                    setLoginSettingsError('الرجاء إدخال كلمة المرور')
                    return
                  }
                  if (newPassword !== confirmPassword) {
                    setLoginSettingsError('كلمة المرور غير متطابقة')
                    return
                  }
                  
                  setLoginSettingsError('')
                  
                  try {
                    await apiRequest('/api/update-login-credentials', 'POST', {
                      currentUsername: 'admin',
                      newUsername: newUsername,
                      newPassword: newPassword
                    })
                    
                    alert('✅ تم تحديث بيانات تسجيل الدخول بنجاح!')
                    setShowLoginSettingsModal(false)
                    setNewUsername('admin')
                    setNewPassword('')
                    setConfirmPassword('')
                  } catch (error) {
                    setLoginSettingsError('حدث خطأ أثناء تحديث البيانات')
                  }
                }}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 rounded-lg transition-all shadow-md"
                data-testid="button-save-login-settings"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: إعدادات الملف الشخصي */}
      {showProfileSettingsModal && (
        <ProfileSettings onClose={() => setShowProfileSettingsModal(false)} />
      )}

      {/* Modal: استيراد من Excel */}
      {showExcelImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">استيراد من Excel</h2>
              <button
                onClick={() => setShowExcelImportModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                data-testid="button-close-excel-import"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* استيراد بيانات الطلاب */}
              <div className="border-2 border-blue-200 rounded-2xl p-6 bg-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">استيراد بيانات الطلاب</h3>
                  <Users className="text-blue-600" size={24} />
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-gray-700 mb-3">الأعمدة المطلوبة:</h4>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li><strong>اسم الطالب</strong> - اسم الطالب الكامل</li>
                    <li><strong>السجل المدني</strong> - رقم الهوية الوطنية</li>
                    <li><strong>الصف</strong> - مثال: الصف الأول الثانوي</li>
                    <li><strong>المجموعة</strong> - اسم المجموعة، مثال: مجموعة 1</li>
                    <li><strong>جوال الطالب</strong> - رقم جوال الطالب (اختياري)</li>
                    <li><strong>جوال ولي الأمر</strong> - رقم جوال ولي الأمر (اختياري)</li>
                    <li><strong>الحالة</strong> - نشط أو استئذان (اختياري)</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-gray-800 mb-2">ملاحظات مهمة:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• المجموعات غير موجودة إذا لم تكن موجودة</li>
                    <li>• إذا كان السجل المدني موجود، يتم تحديث بيانات الطالب</li>
                    <li>• عمود "جوال" وولي الأمر اختياري، يمكن إضافة "جوال" وولي الأمر أو "جوال ولي الأمر"</li>
                  </ul>
                </div>

                <input
                  type="file"
                  accept=".xlsx,.xls"
                  id="students-file-input"
                  className="hidden"
                  data-testid="input-students-file"
                />
                <label
                  htmlFor="students-file-input"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  <span>استيراد ملف الطلاب</span>
                </label>
              </div>

              {/* استيراد بيانات المعلمين */}
              <div className="border-2 border-orange-200 rounded-2xl p-6 bg-orange-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">استيراد بيانات المعلمين</h3>
                  <GraduationCap className="text-orange-600" size={24} />
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-gray-700 mb-3">الأعمدة المطلوبة:</h4>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li><strong>اسم المعلم</strong> - اسم المعلم الكامل</li>
                    <li><strong>رقم جوال المعلم</strong> - رقم جوال المعلم</li>
                    <li><strong>التخصص</strong> - مثال: رياضيات، علوم، لغة عربية (اختياري)</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-gray-800 mb-2">ملاحظات مهمة:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• إذا كان رقم الجوال موجود، يتم تحديث بيانات المعلم</li>
                    <li>• يتم تخطي المعلمين المكررين في الملف</li>
                  </ul>
                </div>

                <input
                  type="file"
                  accept=".xlsx,.xls"
                  id="teachers-file-input"
                  className="hidden"
                  data-testid="input-teachers-file"
                />
                <label
                  htmlFor="teachers-file-input"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-4 rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  <span>استيراد ملف المعلمين</span>
                </label>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modal: إعدادات القوائم */}
      {showListSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">إعدادات القوائم</h2>
              <button
                onClick={() => setShowListSettingsModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                data-testid="button-close-list-settings-modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-gray-600 mb-6 text-right">
                اختر الأقسام التي تريد إظهارها في الصفحة الرئيسية
              </p>

              <div className="space-y-4">
                {/* المجموعات */}
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={listSettings.showGroups}
                      onChange={(e) => updateListSettings({ ...listSettings, showGroups: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      data-testid="checkbox-show-groups"
                    />
                    <Users className="text-blue-600" size={20} />
                    <span className="text-lg font-semibold text-gray-800">المجموعات</span>
                  </div>
                </label>

                {/* الحالات الخاصة */}
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={listSettings.showSpecialStatus}
                      onChange={(e) => updateListSettings({ ...listSettings, showSpecialStatus: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      data-testid="checkbox-show-special-status"
                    />
                    <Star className="text-yellow-600" size={20} />
                    <span className="text-lg font-semibold text-gray-800">الحالات الخاصة</span>
                  </div>
                </label>

                {/* استقبال الطلاب */}
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={listSettings.showReception}
                      onChange={(e) => updateListSettings({ ...listSettings, showReception: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      data-testid="checkbox-show-reception"
                    />
                    <UserCheck className="text-green-600" size={20} />
                    <span className="text-lg font-semibold text-gray-800">استقبال الطلاب</span>
                  </div>
                </label>

                {/* الاستئذان */}
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={listSettings.showPermissions}
                      onChange={(e) => updateListSettings({ ...listSettings, showPermissions: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      data-testid="checkbox-show-permissions"
                    />
                    <Clock className="text-orange-600" size={20} />
                    <span className="text-lg font-semibold text-gray-800">الاستئذان</span>
                  </div>
                </label>

                {/* المخالفات */}
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={listSettings.showViolations}
                      onChange={(e) => updateListSettings({ ...listSettings, showViolations: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      data-testid="checkbox-show-violations"
                    />
                    <AlertTriangle className="text-red-600" size={20} />
                    <span className="text-lg font-semibold text-gray-800">المخالفات</span>
                  </div>
                </label>

                {/* المعلمين */}
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={listSettings.showTeachers}
                      onChange={(e) => updateListSettings({ ...listSettings, showTeachers: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      data-testid="checkbox-show-teachers"
                    />
                    <Users className="text-indigo-600" size={20} />
                    <span className="text-lg font-semibold text-gray-800">المعلمين</span>
                  </div>
                </label>
              </div>

              {/* زر الإغلاق */}
              <button
                onClick={() => setShowListSettingsModal(false)}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-lg transition-all shadow-md"
                data-testid="button-close-list-settings"
              >
                حفظ وإغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: إدارة المراحل والمجموعات */}
      {showGroupsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">إدارة المراحل والمجموعات</h2>
              <button
                onClick={() => setShowGroupsModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                data-testid="button-close-groups-modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* إضافة مجموعة جديدة */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">إضافة مجموعة جديدة</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* الصف (المرحلة) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      الصف (المرحلة)
                    </label>
                    <select
                      value={newGroupStage}
                      onChange={(e) => setNewGroupStage(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                      data-testid="select-group-stage"
                    >
                      <option value="">مثال: الصف الأول الثانوي</option>
                      <option value="الصف الأول الابتدائي">الصف الأول الابتدائي</option>
                      <option value="الصف الثاني الابتدائي">الصف الثاني الابتدائي</option>
                      <option value="الصف الثالث الابتدائي">الصف الثالث الابتدائي</option>
                      <option value="الصف الرابع الابتدائي">الصف الرابع الابتدائي</option>
                      <option value="الصف الخامس الابتدائي">الصف الخامس الابتدائي</option>
                      <option value="الصف السادس الابتدائي">الصف السادس الابتدائي</option>
                      <option value="الصف الأول المتوسط">الصف الأول المتوسط</option>
                      <option value="الصف الثاني المتوسط">الصف الثاني المتوسط</option>
                      <option value="الصف الثالث المتوسط">الصف الثالث المتوسط</option>
                      <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                      <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                      <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                    </select>
                  </div>

                  {/* اسم المجموعة */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      اسم المجموعة
                    </label>
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="مثال: مجموعة 1"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                      data-testid="input-group-name"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (newGroupName.trim() && newGroupStage) {
                      addGroup.mutate({ name: newGroupName.trim(), stage: newGroupStage })
                    }
                  }}
                  disabled={!newGroupName.trim() || !newGroupStage || addGroup.isPending}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="button-add-group"
                >
                  <Plus size={20} />
                  <span>{addGroup.isPending ? 'جاري الإضافة...' : 'إضافة المجموعة'}</span>
                </button>
              </div>

              {/* قائمة المجموعات الموجودة - مجمعة حسب المراحل */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">المجموعات الحالية</h3>
                {groups.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">لا توجد مجموعات</p>
                ) : (
                  <div className="space-y-4">
                    {/* تجميع المجموعات حسب المراحل */}
                    {Object.entries(
                      groups.reduce((acc: any, group: any) => {
                        if (!acc[group.stage]) {
                          acc[group.stage] = []
                        }
                        acc[group.stage].push(group)
                        return acc
                      }, {})
                    ).map(([stage, stageGroups]: [string, any], stageIndex) => {
                      // ألوان مختلفة للمراحل
                      const stageColors = [
                        'from-emerald-500 to-teal-500',
                        'from-blue-500 to-cyan-500',
                        'from-purple-500 to-pink-500',
                        'from-orange-500 to-amber-500',
                        'from-red-500 to-rose-500',
                        'from-indigo-500 to-blue-500',
                      ]
                      const colorClass = stageColors[stageIndex % stageColors.length]
                      
                      // عدد الطلاب في هذه المرحلة
                      const stageStudentCount = students.filter((s: any) => 
                        stageGroups.some((g: any) => g.id === s.groupId)
                      ).length

                      return (
                        <div key={stage} className="space-y-2">
                          {/* عنوان المرحلة */}
                          <div className={`bg-gradient-to-r ${colorClass} rounded-lg p-4 flex items-center justify-between shadow-lg`}>
                            <div className="flex items-center gap-3">
                              <Users className="text-white" size={24} />
                              <h4 className="text-xl font-bold text-white">{stage}</h4>
                            </div>
                            <span className="text-white text-sm font-medium">
                              {stageStudentCount} طالب
                            </span>
                          </div>

                          {/* المجموعات في هذه المرحلة */}
                          <div className="space-y-2 pr-4">
                            {stageGroups.map((group: any) => {
                              const groupStudentCount = students.filter((s: any) => s.groupId === group.id).length
                              
                              return (
                                <div
                                  key={group.id}
                                  className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 hover:border-green-300 transition-all"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="text-lg font-bold text-gray-800">{group.name}</p>
                                      <p className="text-sm text-gray-600">{groupStudentCount} طالب</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => {
                                          setSelectedGroup(group)
                                          setEditGroupData({ name: group.name, stage: group.stage })
                                          setShowEditGroupModal(true)
                                        }}
                                        className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-all"
                                        data-testid={`button-edit-group-${group.id}`}
                                      >
                                        <Edit size={18} />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setGroupToDelete(group)
                                          setShowDeleteGroupConfirm(true)
                                        }}
                                        className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-all"
                                        data-testid={`button-delete-group-${group.id}`}
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: إدارة الحالات الخاصة */}
      {showSpecialStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">إدارة الحالات الخاصة</h2>
              <button
                onClick={() => setShowSpecialStatusModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                data-testid="button-close-modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* قائمة الحالات الخاصة */}
              <div className="space-y-3 mb-6">
                {specialStatuses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">لا توجد حالات خاصة</p>
                ) : (
                  specialStatuses.map(status => (
                    <div
                      key={status.id}
                      className="flex items-center justify-between bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all"
                    >
                      <span className="text-lg font-medium text-gray-800">{status.name}</span>
                      <button
                        onClick={() => deleteSpecialStatus.mutate(status.id)}
                        disabled={deleteSpecialStatus.isPending}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all disabled:opacity-50"
                        data-testid={`button-delete-status-${status.id}`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* إضافة حالة جديدة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  اسم الحالة الخاصة
                </label>
                <input
                  type="text"
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newStatusName.trim()) {
                      addSpecialStatus.mutate(newStatusName.trim())
                    }
                  }}
                  placeholder="أضف حالة جديدة..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  data-testid="input-new-status-name"
                />
              </div>

              <button
                onClick={() => {
                  if (newStatusName.trim()) {
                    addSpecialStatus.mutate(newStatusName.trim())
                  }
                }}
                disabled={!newStatusName.trim() || addSpecialStatus.isPending}
                className="w-full mt-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-testid="button-add-status"
              >
                <Plus size={20} />
                <span>{addSpecialStatus.isPending ? 'جاري الإضافة...' : 'إضافة'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: طباعة بيانات الطالب */}
      {showPrintModal && printStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between print:hidden">
              <div className="flex items-center gap-3">
                <Printer size={28} />
                <h2 className="text-2xl font-bold">طباعة بيانات الطالب</h2>
              </div>
              <button
                onClick={() => {
                  setShowPrintModal(false)
                  setPrintStudent(null)
                }}
                className="text-white hover:bg-gray-900 rounded-lg p-2 transition-all"
                data-testid="button-close-print"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content - Print Area */}
            <div id="print-area" className="flex-1 overflow-y-auto p-4" style={{ pageBreakAfter: 'avoid' }}>
              {/* Header للطباعة */}
              <div className="text-center mb-3 border-b-2 border-blue-500 pb-2">
                <p className="text-sm text-gray-600">المعلم: {profile?.logoUrl || teacherName || 'غير محدد'}</p>
                <h1 className="text-xl font-bold text-gray-800 mt-1">
                  {profile?.schoolName || schoolName || 'المدرسة'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {profile?.name || systemDescription || 'نظام الإرشاد الطلابي'}
                </p>
              </div>

              {/* بيانات الطالب الأساسية */}
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-2 mb-2" style={{ pageBreakInside: 'avoid' }}>
                <h2 className="text-sm font-bold text-blue-800 mb-1 flex items-center gap-1">
                  <UserIcon size={14} />
                  البيانات الأساسية
                </h2>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex justify-between border-b border-blue-200 pb-1">
                    <span className="font-bold text-gray-900">{printStudent.name}</span>
                    <span className="text-gray-600">اسم الطالب:</span>
                  </div>
                  <div className="flex justify-between border-b border-blue-200 pb-1">
                    <span className="font-bold text-gray-900">{printStudent.nationalId}</span>
                    <span className="text-gray-600">السجل المدني:</span>
                  </div>
                  <div className="flex justify-between border-b border-blue-200 pb-1">
                    <span className="font-bold text-gray-900">{printStudent.phone || 'غير محدد'}</span>
                    <span className="text-gray-600">جوال الطالب:</span>
                  </div>
                  <div className="flex justify-between border-b border-blue-200 pb-1">
                    <span className="font-bold text-gray-900">{printStudent.guardianPhone || 'غير محدد'}</span>
                    <span className="text-gray-600">جوال ولي الأمر:</span>
                  </div>
                </div>
              </div>

              {/* المعلومات الدراسية */}
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-2 mb-2" style={{ pageBreakInside: 'avoid' }}>
                <h2 className="text-sm font-bold text-green-800 mb-1 flex items-center gap-1">
                  <GraduationCap size={14} />
                  المعلومات الدراسية
                </h2>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex justify-between border-b border-green-200 pb-1">
                    <span className="font-bold text-gray-900">{printStudent.grade}</span>
                    <span className="text-gray-600">الصف:</span>
                  </div>
                  <div className="flex justify-between border-b border-green-200 pb-1">
                    <span className="font-bold text-gray-900">
                      {groups.find(g => g.id === printStudent.groupId)?.name || 'غير محدد'}
                    </span>
                    <span className="text-gray-600">المجموعة:</span>
                  </div>
                  <div className="flex justify-between border-b border-green-200 pb-1 col-span-2">
                    <span className="font-bold text-gray-900">
                      {printStudent.specialStatusId 
                        ? specialStatuses.find(s => s.id === printStudent.specialStatusId)?.name 
                        : 'لا يوجد'}
                    </span>
                    <span className="text-gray-600">الحالة الخاصة:</span>
                  </div>
                </div>
              </div>

              {/* الإحصائيات */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-2 mb-2" style={{ pageBreakInside: 'avoid' }}>
                <h2 className="text-sm font-bold text-yellow-800 mb-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  إحصائيات الطالب
                </h2>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white rounded-lg p-1 border-2 border-blue-200">
                    <div className="text-xl font-bold text-blue-600">
                      {printStudent.visitCount || 0}
                    </div>
                    <div className="text-xs text-gray-600 font-semibold">عدد مرات الزيارة</div>
                  </div>
                  <div className="bg-white rounded-lg p-1 border-2 border-red-200">
                    <div className="text-xl font-bold text-red-600">
                      {printStudent.violationCount || 0}
                    </div>
                    <div className="text-xs text-gray-600 font-semibold">عدد المخالفات</div>
                  </div>
                  <div className="bg-white rounded-lg p-1 border-2 border-green-200">
                    <div className="text-xl font-bold text-green-600">
                      {printStudent.permissionCount || 0}
                    </div>
                    <div className="text-xs text-gray-600 font-semibold">عدد مرات الاستئذان</div>
                  </div>
                </div>
              </div>

              {/* Footer للطباعة */}
              <div className="mt-2 pt-2 border-t-2 border-gray-300 text-center text-xs text-gray-500" style={{ pageBreakInside: 'avoid' }}>
                <p>تاريخ الطباعة: {new Date().toLocaleDateString('ar-SA')}</p>
                <p className="mt-1">نظام الإرشاد الطلابي - جميع الحقوق محفوظة</p>
              </div>
            </div>

            {/* Footer - Buttons */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 print:hidden">
              <button
                onClick={() => {
                  setShowPrintModal(false)
                  setPrintStudent(null)
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
                data-testid="button-cancel-print"
              >
                إلغاء
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                data-testid="button-do-print"
              >
                <Printer size={20} />
                <span>طباعة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: تعديل/إضافة الطالب */}
      {showEditStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedStudent ? 'تعديل الطالب' : 'إضافة طالب جديد'}</h2>
              <button
                onClick={() => {
                  setShowEditStudentModal(false)
                  setSelectedStudent(null)
                }}
                className="text-white hover:bg-blue-700 rounded-lg p-2 transition-all"
                data-testid="button-close-edit-student"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* اسم الطالب */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    اسم الطالب
                  </label>
                  <input
                    type="text"
                    value={editStudentData.name}
                    onChange={(e) => setEditStudentData({ ...editStudentData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    placeholder="الياس"
                    data-testid="input-edit-student-name"
                  />
                </div>

                {/* السجل المدني */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    السجل المدني
                  </label>
                  <input
                    type="text"
                    value={editStudentData.nationalId}
                    onChange={(e) => setEditStudentData({ ...editStudentData, nationalId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    placeholder="12564646"
                    data-testid="input-edit-student-national-id"
                  />
                </div>

                {/* جوال الطالب */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    جوال الطالب
                  </label>
                  <input
                    type="text"
                    value={editStudentData.phone}
                    onChange={(e) => setEditStudentData({ ...editStudentData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    placeholder="555555465"
                    data-testid="input-edit-student-phone"
                  />
                </div>

                {/* جوال ولي الأمر */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    جوال ولي الأمر
                  </label>
                  <input
                    type="text"
                    value={editStudentData.guardianPhone}
                    onChange={(e) => setEditStudentData({ ...editStudentData, guardianPhone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    placeholder="565464644"
                    data-testid="input-edit-student-guardian-phone"
                  />
                </div>

                {/* الصف */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    الصف
                  </label>
                  <div className="relative">
                    <select
                      value={selectedStage}
                      onChange={(e) => {
                        setSelectedStage(e.target.value)
                        // إعادة تعيين المجموعة عند تغيير الصف
                        setEditStudentData({ 
                          ...editStudentData, 
                          groupId: '',
                          grade: ''
                        })
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      data-testid="select-edit-student-stage"
                    >
                      <option value="">-- اختر الصف --</option>
                      {/* عرض المراحل الفريدة فقط */}
                      {Array.from(new Set(groups.map((g: any) => g.stage))).map((stage: string) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* المجموعة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    المجموعة
                  </label>
                  <div className="relative">
                    <select
                      value={editStudentData.groupId}
                      onChange={(e) => {
                        const selectedGroup = groups.find((g: any) => g.id === e.target.value)
                        setEditStudentData({ 
                          ...editStudentData, 
                          groupId: e.target.value,
                          grade: selectedGroup?.name || ''
                        })
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      data-testid="select-edit-student-group"
                      disabled={!selectedStage}
                    >
                      <option value="">-- اختر المجموعة --</option>
                      {/* عرض فقط المجموعات التي تطابق المرحلة المختارة */}
                      {groups
                        .filter((group: any) => group.stage === selectedStage)
                        .map((group: any) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>

              {/* الحالة الخاصة (اختياري) */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  الحالة الخاصة (اختياري)
                </label>
                <div className="relative">
                  <select
                    value={editStudentData.specialStatusId}
                    onChange={(e) => setEditStudentData({ ...editStudentData, specialStatusId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    data-testid="select-edit-student-special-status"
                  >
                    <option value="">بدون حالة خاصة</option>
                    {specialStatuses.map(status => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowEditStudentModal(false)
                  setSelectedStudent(null)
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
                data-testid="button-cancel-edit-student"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (!editStudentData.name.trim() || !editStudentData.nationalId.trim()) {
                    alert('الرجاء إدخال اسم الطالب والسجل المدني')
                    return
                  }

                  const studentData = {
                    name: editStudentData.name,
                    nationalId: editStudentData.nationalId,
                    phone: editStudentData.phone || '',
                    guardianPhone: editStudentData.guardianPhone,
                    grade: editStudentData.grade,
                    groupId: editStudentData.groupId || null,
                    specialStatusId: editStudentData.specialStatusId || null,
                  }

                  if (selectedStudent) {
                    // تعديل طالب موجود
                    updateStudent.mutate({
                      id: selectedStudent.id,
                      data: studentData
                    })
                  } else {
                    // إضافة طالب جديد
                    createStudent.mutate(studentData)
                  }
                }}
                disabled={updateStudent.isPending || createStudent.isPending}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-save-edit-student"
              >
                {updateStudent.isPending || createStudent.isPending 
                  ? 'جاري الحفظ...' 
                  : selectedStudent ? 'تحديث الطالب' : 'حفظ الطالب'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: السماح بدخول الفصل */}
      {showAllowEntryModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle size={28} />
                <h2 className="text-2xl font-bold">السماح بدخول الفصل</h2>
              </div>
              <button
                onClick={() => {
                  setShowAllowEntryModal(false)
                  setSelectedStudent(null)
                  setSelectedTeacherId('')
                }}
                className="text-white hover:bg-blue-700 rounded-lg p-2 transition-all"
                data-testid="button-close-allow-entry"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* معلومات الطالب */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3 text-right">معلومات الطالب:</h3>
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-semibold">{selectedStudent.name}</span>
                    <span className="text-gray-600">الاسم:</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-semibold">{selectedStudent.nationalId}</span>
                    <span className="text-gray-600">السجل المدني:</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-semibold">
                      {groups.find(g => g.id === selectedStudent.groupId)?.name || '-'}
                    </span>
                    <span className="text-gray-600">الصف:</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-semibold">-</span>
                    <span className="text-gray-600">المجموعة:</span>
                  </div>
                </div>
              </div>

              {/* ملاحظة */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-gray-700">سيتم إرسال رسالة للسماح بدخول الطالب للفصل إلى المعلم المختار عبر واتساب</p>
              </div>

              {/* اختر المعلم */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3 text-right">اختر المعلم</label>
                <div className="relative">
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full px-4 py-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center font-bold text-lg"
                    data-testid="select-teacher-allow-entry"
                  >
                    <option value="">-- اختر المعلم --</option>
                    {teachers.map((teacher: any) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* معاينة الرسالة */}
              {selectedTeacherId && (
                <div className="bg-gray-50 border border-gray-300 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 text-right">معاينة الرسالة:</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-right space-y-1">
                    <p className="flex items-center gap-2 text-blue-600 font-bold">
                      <CheckCircle size={18} />
                      السماح بدخول الطالب للفصل
                    </p>
                    <p>
                      <span className="text-gray-700">اسم الطالب: </span>
                      <span className="font-bold text-gray-900">{selectedStudent.name}</span>
                    </p>
                    <p>
                      <span className="text-gray-700">المرسل: </span>
                      <span className="font-bold text-gray-900">
                        {profile?.name || teacherName} - {teacherPhone}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowAllowEntryModal(false)
                  setSelectedStudent(null)
                  setSelectedTeacherId('')
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
                data-testid="button-cancel-allow-entry"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (!selectedTeacherId) {
                    alert('الرجاء اختيار المعلم')
                    return
                  }

                  const selectedTeacher = teachers.find((t: any) => t.id === selectedTeacherId)
                  if (!selectedTeacher || !selectedTeacher.phone) {
                    alert('رقم جوال المعلم غير متوفر')
                    return
                  }

                  // بناء رسالة واتساب
                  const message = `📚 *السماح بدخول الطالب للفصل*\n\nاسم الطالب: *${selectedStudent.name}*\n\nالمرسل: ${profile?.name || teacherName} - ${teacherPhone}`
                  
                  const phoneNumber = formatPhoneForWhatsApp(selectedTeacher.phone)
                  if (!phoneNumber) {
                    alert('رقم جوال المعلم غير صالح. يرجى التأكد من إدخال الرقم الصحيح.')
                    return
                  }
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
                  window.open(whatsappUrl, '_blank')

                  setShowAllowEntryModal(false)
                  setSelectedStudent(null)
                  setSelectedTeacherId('')
                }}
                disabled={!selectedTeacherId}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-testid="button-send-whatsapp"
              >
                <span>إرسال عبر واتساب</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: إضافة معلم */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">إضافة معلم جديد</h2>
              <button
                onClick={() => {
                  setShowAddTeacherModal(false)
                  setTeacherFormData({ name: '', phone: '', specialization: '' })
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                data-testid="button-close-add-teacher"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المعلم
                </label>
                <input
                  type="text"
                  value={teacherFormData.name}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل اسم المعلم"
                  data-testid="input-teacher-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التخصص / المادة
                </label>
                <input
                  type="text"
                  value={teacherFormData.specialization}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, specialization: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: رياضيات، فيزياء، لغة عربية"
                  data-testid="input-teacher-specialization"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  value={teacherFormData.phone}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  data-testid="input-teacher-phone"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => {
                  setShowAddTeacherModal(false)
                  setTeacherFormData({ name: '', phone: '', specialization: '' })
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg transition-all"
                data-testid="button-cancel-add-teacher"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (!teacherFormData.name.trim()) {
                    alert('الرجاء إدخال اسم المعلم')
                    return
                  }
                  addTeacher.mutate({
                    name: teacherFormData.name.trim(),
                    phone: teacherFormData.phone.trim() || null,
                    specialization: teacherFormData.specialization.trim() || null,
                  })
                }}
                disabled={addTeacher.isPending || !teacherFormData.name.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-submit-add-teacher"
              >
                {addTeacher.isPending ? 'جاري الإضافة...' : 'إضافة المعلم'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: تعديل معلم */}
      {showEditTeacherModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">تعديل بيانات المعلم</h2>
              <button
                onClick={() => {
                  setShowEditTeacherModal(false)
                  setSelectedTeacher(null)
                  setTeacherFormData({ name: '', phone: '', specialization: '' })
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                data-testid="button-close-edit-teacher"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المعلم
                </label>
                <input
                  type="text"
                  value={teacherFormData.name}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="أدخل اسم المعلم"
                  data-testid="input-edit-teacher-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التخصص / المادة
                </label>
                <input
                  type="text"
                  value={teacherFormData.specialization}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, specialization: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="مثال: رياضيات، فيزياء، لغة عربية"
                  data-testid="input-edit-teacher-specialization"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  value={teacherFormData.phone}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  data-testid="input-edit-teacher-phone"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => {
                  setShowEditTeacherModal(false)
                  setSelectedTeacher(null)
                  setTeacherFormData({ name: '', phone: '', specialization: '' })
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg transition-all"
                data-testid="button-cancel-edit-teacher"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (!teacherFormData.name.trim()) {
                    alert('الرجاء إدخال اسم المعلم')
                    return
                  }
                  updateTeacher.mutate({
                    id: selectedTeacher.id,
                    data: {
                      name: teacherFormData.name.trim(),
                      phone: teacherFormData.phone.trim() || null,
                      specialization: teacherFormData.specialization.trim() || null,
                    },
                  })
                }}
                disabled={updateTeacher.isPending || !teacherFormData.name.trim()}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-submit-edit-teacher"
              >
                {updateTeacher.isPending ? 'جاري التحديث...' : 'حفظ التعديلات'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: تعديل المجموعة */}
      {showEditGroupModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">تعديل المجموعة</h2>
              <button
                onClick={() => {
                  setShowEditGroupModal(false)
                  setSelectedGroup(null)
                }}
                className="text-white hover:bg-blue-700 rounded-lg p-2 transition-all"
                data-testid="button-close-edit-group"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  اسم المجموعة
                </label>
                <input
                  type="text"
                  value={editGroupData.name}
                  onChange={(e) => setEditGroupData({ ...editGroupData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  placeholder="مثال: الأول الابتدائي"
                  data-testid="input-edit-group-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  المرحلة الدراسية
                </label>
                <input
                  type="text"
                  value={editGroupData.stage}
                  onChange={(e) => setEditGroupData({ ...editGroupData, stage: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  placeholder="مثال: الابتدائي"
                  data-testid="input-edit-group-stage"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowEditGroupModal(false)
                  setSelectedGroup(null)
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
                data-testid="button-cancel-edit-group"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (editGroupData.name.trim() && editGroupData.stage.trim()) {
                    updateGroup.mutate({
                      id: selectedGroup.id,
                      data: {
                        name: editGroupData.name.trim(),
                        stage: editGroupData.stage.trim()
                      }
                    })
                  }
                }}
                disabled={!editGroupData.name.trim() || !editGroupData.stage.trim() || updateGroup.isPending}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-save-edit-group"
              >
                {updateGroup.isPending ? 'جاري التحديث...' : 'حفظ التعديلات'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: فلتر الزيارات بالتاريخ */}
      {showDateFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={24} />
                <h2 className="text-2xl font-bold">فلتر بالتاريخ</h2>
              </div>
              <button
                onClick={() => {
                  setShowDateFilterModal(false)
                  setDateFilterError('')
                }}
                className="text-white hover:bg-blue-700 rounded-lg p-2 transition-all"
                data-testid="button-close-date-filter"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-700 text-center mb-4">
                اختر التاريخ لعرض زيارات ذلك اليوم
              </p>
              
              {/* Date Picker */}
              <div className="space-y-3">
                <label className="block text-right font-bold text-gray-700">
                  اختر التاريخ من التقويم:
                </label>
                <input
                  type="date"
                  onChange={(e) => {
                    if (e.target.value) {
                      // Parse date locally to avoid timezone issues
                      const [year, month, day] = e.target.value.split('-').map(Number)
                      const selectedDate = new Date(year, month - 1, day)
                      
                      // Convert to Hijri with Arabic locale
                      let hijriDate = selectedDate.toLocaleDateString('ar-SA-u-ca-islamic', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })
                      
                      // Normalize to ASCII digits for comparison
                      const normalizeDigits = (str: string) => {
                        return str.replace(/[٠-٩]/g, (d) => 
                          String.fromCharCode(d.charCodeAt(0) - 1632 + 48)
                        )
                      }
                      
                      hijriDate = normalizeDigits(hijriDate)
                      
                      // Check if any visits match this date
                      const matchingVisits = studentVisits.filter((v: any) => {
                        const normalizedVisitDate = normalizeDigits(v.visitDate)
                        return normalizedVisitDate === hijriDate
                      })
                      
                      if (matchingVisits.length > 0) {
                        setFilterDate(matchingVisits[0].visitDate)
                        setDateFilterError('')
                        setShowDateFilterModal(false)
                      } else {
                        // Show feedback but keep modal open
                        setDateFilterError(`لا توجد زيارات في تاريخ ${hijriDate}. جرب تاريخ آخر أو اختر من القائمة أدناه.`)
                      }
                    }
                  }}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg"
                  style={{ direction: 'ltr' }}
                  data-testid="input-date-picker"
                />
                
                {/* رسالة الخطأ */}
                {dateFilterError && (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 text-right" data-testid="error-no-visits-found">
                    <p className="text-yellow-800 font-semibold">{dateFilterError}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">أو اختر من التواريخ المتاحة</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              
              {/* قائمة التواريخ المتاحة */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {Array.from(new Set(studentVisits.map((v: any) => v.visitDate))).sort().reverse().map((date: string) => {
                  const visitsCount = studentVisits.filter((v: any) => v.visitDate === date).length
                  return (
                    <button
                      key={date}
                      onClick={() => {
                        setFilterDate(date)
                        setShowDateFilterModal(false)
                      }}
                      className={`w-full p-4 rounded-lg text-right transition-all border-2 ${
                        filterDate === date
                          ? 'bg-blue-50 border-blue-500 text-blue-900'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      data-testid={`date-option-${date}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg">{date}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {visitsCount} {visitsCount === 1 ? 'زيارة' : visitsCount === 2 ? 'زيارتان' : 'زيارات'}
                          </div>
                        </div>
                        {filterDate === date && (
                          <CheckCircle size={24} className="text-blue-600" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {filterDate && (
                <button
                  onClick={() => {
                    setFilterDate('')
                    setShowDateFilterModal(false)
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
                  data-testid="button-clear-filter"
                >
                  إلغاء الفلتر وعرض الكل
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: فلتر الاستئذانات بالتاريخ */}
      {showPermissionDateFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={24} />
                <h2 className="text-2xl font-bold">فلتر الاستئذانات بالتاريخ</h2>
              </div>
              <button
                onClick={() => {
                  setShowPermissionDateFilter(false)
                  setPermissionDateFilterError('')
                }}
                className="text-white hover:bg-orange-700 rounded-lg p-2 transition-all"
                data-testid="button-close-permission-date-filter"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700 text-center mb-4">
                اختر التاريخ لعرض استئذانات ذلك اليوم
              </p>
              
              <div className="space-y-3">
                <label className="block text-right font-bold text-gray-700">
                  اختر التاريخ من التقويم:
                </label>
                <input
                  type="date"
                  onChange={(e) => {
                    if (e.target.value) {
                      // حفظ التاريخ بصيغة ISO الميلادية مباشرة للمقارنة
                      setPermissionFilterDate(e.target.value)
                      setPermissionDateFilterError('')
                      setShowPermissionDateFilter(false)
                    }
                  }}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg"
                  style={{ direction: 'ltr' }}
                  data-testid="input-permission-date-picker"
                />
                
                {permissionDateFilterError && (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 text-right" data-testid="error-no-permissions-found">
                    <p className="text-yellow-800 font-semibold">{permissionDateFilterError}</p>
                  </div>
                )}
              </div>

              {permissionFilterDate && (
                <button
                  onClick={() => {
                    setPermissionFilterDate('')
                    setShowPermissionDateFilter(false)
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
                  data-testid="button-clear-permission-filter"
                >
                  إلغاء الفلتر وعرض الكل
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: فلتر المخالفات بالتاريخ */}
      {showViolationDateFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={24} />
                <h2 className="text-2xl font-bold">فلتر المخالفات بالتاريخ</h2>
              </div>
              <button
                onClick={() => {
                  setShowViolationDateFilter(false)
                  setViolationDateFilterError('')
                }}
                className="text-white hover:bg-red-700 rounded-lg p-2 transition-all"
                data-testid="button-close-violation-date-filter"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700 text-center mb-4">
                اختر التاريخ لعرض مخالفات ذلك اليوم
              </p>
              
              <div className="space-y-3">
                <label className="block text-right font-bold text-gray-700">
                  اختر التاريخ من التقويم:
                </label>
                <input
                  type="date"
                  onChange={(e) => {
                    if (e.target.value) {
                      // حفظ التاريخ بصيغة ISO الميلادية مباشرة للمقارنة
                      setViolationFilterDate(e.target.value)
                      setViolationDateFilterError('')
                      setShowViolationDateFilter(false)
                    }
                  }}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg"
                  style={{ direction: 'ltr' }}
                  data-testid="input-violation-date-picker"
                />
                
                {violationDateFilterError && (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 text-right" data-testid="error-no-violations-found">
                    <p className="text-yellow-800 font-semibold">{violationDateFilterError}</p>
                  </div>
                )}
              </div>

              {violationFilterDate && (
                <button
                  onClick={() => {
                    setViolationFilterDate('')
                    setShowViolationDateFilter(false)
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
                  data-testid="button-clear-violation-filter"
                >
                  إلغاء الفلتر وعرض الكل
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: تأكيد حذف المجموعة */}
      {showDeleteGroupConfirm && groupToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">تأكيد الحذف</h2>
              <button
                onClick={() => {
                  setShowDeleteGroupConfirm(false)
                  setGroupToDelete(null)
                }}
                className="text-white hover:bg-red-700 rounded-lg p-2 transition-all"
                data-testid="button-close-delete-confirm"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
                  <AlertTriangle size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  هل أنت متأكد من حذف هذه المجموعة؟
                </h3>
                <p className="text-gray-700 mb-4">
                  <span className="font-bold text-red-600">{groupToDelete.stage} - {groupToDelete.name}</span>
                </p>
                
                {(() => {
                  const studentsInGroup = students.filter(s => s.groupId === groupToDelete.id)
                  if (studentsInGroup.length > 0) {
                    return (
                      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 w-full">
                        <p className="text-yellow-900 font-bold mb-2">
                          ⚠️ تحذير: هذه المجموعة تحتوي على {studentsInGroup.length} طالب/طلاب
                        </p>
                        <p className="text-yellow-800 text-sm">
                          سيتم نقل الطلاب إلى "بدون مجموعة" ولن يتم حذفهم
                        </p>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteGroupConfirm(false)
                  setGroupToDelete(null)
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
                data-testid="button-cancel-delete-group"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  deleteGroup.mutate(groupToDelete.id)
                  setShowDeleteGroupConfirm(false)
                  setGroupToDelete(null)
                }}
                disabled={deleteGroup.isPending}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-confirm-delete-group"
              >
                {deleteGroup.isPending ? 'جاري الحذف...' : 'نعم، احذف المجموعة'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: طباعة المجموعة */}
      {showGroupPrintModal && selectedGroupForPrint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:bg-white print:block print:relative print:p-0" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col print:max-h-none print:shadow-none print:rounded-none print:max-w-none">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between print:hidden">
              <div className="flex items-center gap-3">
                <Printer size={28} />
                <h2 className="text-2xl font-bold">طباعة بيانات المجموعة</h2>
              </div>
              <button
                onClick={() => {
                  setShowGroupPrintModal(false)
                  setSelectedGroupForPrint(null)
                }}
                className="text-white hover:bg-blue-700 rounded-lg p-2 transition-all"
                data-testid="button-close-group-print"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 print:overflow-visible print:p-4">
              {/* Header للطباعة */}
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">
                  {profile?.schoolName || 'المدرسة'}
                </h1>
                <h2 className="text-xl font-semibold text-gray-700 mb-1">
                  {selectedGroupForPrint.stage} - {selectedGroupForPrint.name}
                </h2>
                <p className="text-gray-600">
                  المعلم: {profile?.name || 'غير محدد'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  تاريخ الطباعة: {new Date().toLocaleDateString('ar-SA')}
                </p>
              </div>

              {/* الجدول */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <th className="px-4 py-3 text-right font-bold border border-blue-400">الاسم</th>
                      <th className="px-4 py-3 text-right font-bold border border-blue-400">السجل المدني</th>
                      <th className="px-4 py-3 text-right font-bold border border-blue-400">جوال الطالب</th>
                      <th className="px-4 py-3 text-right font-bold border border-blue-400">جوال ولي الأمر</th>
                      <th className="px-4 py-3 text-right font-bold border border-blue-400">الحالة الخاصة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students
                      .filter(s => s.groupId === selectedGroupForPrint.id)
                      .map((student, index) => {
                        const specialStatus = specialStatuses.find(ss => ss.id === student.specialStatusId)
                        return (
                          <tr
                            key={student.id}
                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            data-testid={`print-row-${student.id}`}
                          >
                            <td className="px-4 py-3 border border-gray-300">{student.name}</td>
                            <td className="px-4 py-3 border border-gray-300" dir="ltr">{student.nationalId}</td>
                            <td className="px-4 py-3 border border-gray-300" dir="ltr">{student.phone || '-'}</td>
                            <td className="px-4 py-3 border border-gray-300" dir="ltr">{student.guardianPhone || '-'}</td>
                            <td className="px-4 py-3 border border-gray-300">
                              {specialStatus ? specialStatus.name : '-'}
                            </td>
                          </tr>
                        )
                      })}
                    {students.filter(s => s.groupId === selectedGroupForPrint.id).length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500 border border-gray-300">
                          لا يوجد طلاب في هذه المجموعة
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer للطباعة */}
              <div className="mt-6 pt-4 border-t-2 border-gray-300 text-center text-sm text-gray-600">
                <p>نظام الإرشاد الطلابي - جميع الحقوق محفوظة</p>
              </div>
            </div>

            {/* Footer - Buttons */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3 print:hidden">
              <button
                onClick={() => {
                  setShowGroupPrintModal(false)
                  setSelectedGroupForPrint(null)
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
                data-testid="button-cancel-group-print"
              >
                إلغاء
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                data-testid="button-do-group-print"
              >
                <Printer size={20} />
                <span>طباعة</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Input مخفي لاستيراد البيانات */}
      <input
        type="file"
        id="import-data-file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          
          try {
            const text = await file.text()
            const importData = JSON.parse(text)
            
            if (!importData.version || !importData.data) {
              alert('❌ ملف غير صحيح! الرجاء اختيار ملف نسخة احتياطية صحيح')
              return
            }
            
            const confirmed = confirm(
              '⚠️ تحذير: سيتم استبدال جميع البيانات الحالية بالبيانات المستوردة.\n\nهل أنت متأكد من المتابعة؟'
            )
            
            if (!confirmed) return
            
            // استيراد البيانات
            const { data } = importData
            
            // إضافة البيانات عبر API
            try {
              // حذف البيانات الحالية أولاً (سيتم إضافة endpoints للحذف لاحقاً)
              
              // استيراد الملف الشخصي
              if (data.profile) {
                await apiRequest('/api/teacher-profile', 'POST', data.profile)
              }
              
              // استيراد المجموعات
              if (data.groups && data.groups.length > 0) {
                for (const group of data.groups) {
                  await apiRequest('/api/groups', 'POST', group)
                }
              }
              
              // استيراد الطلاب
              if (data.students && data.students.length > 0) {
                for (const student of data.students) {
                  await apiRequest('/api/students', 'POST', student)
                }
              }
              
              // استيراد المعلمين
              if (data.teachers && data.teachers.length > 0) {
                for (const teacher of data.teachers) {
                  await apiRequest('/api/teachers', 'POST', teacher)
                }
              }
              
              // استيراد الزيارات
              if (data.visits && data.visits.length > 0) {
                for (const visit of data.visits) {
                  await apiRequest('/api/student-visits', 'POST', visit)
                }
              }
              
              // استيراد الاستئذانات
              if (data.permissions && data.permissions.length > 0) {
                for (const permission of data.permissions) {
                  await apiRequest('/api/student-permissions', 'POST', permission)
                }
              }
              
              // استيراد المخالفات
              if (data.violations && data.violations.length > 0) {
                for (const violation of data.violations) {
                  await apiRequest('/api/student-violations', 'POST', violation)
                }
              }
              
              // تحديث الكاش
              queryClient.invalidateQueries()
              
              alert('✅ تم استيراد البيانات بنجاح!\n\nسيتم تحديث الصفحة الآن.')
              window.location.reload()
            } catch (error) {
              console.error('Error importing data:', error)
              alert('❌ حدث خطأ أثناء استيراد البيانات. قد تكون بعض البيانات مكررة.')
            }
          } catch (error) {
            console.error('Error reading file:', error)
            alert('❌ خطأ في قراءة الملف. تأكد من أنه ملف JSON صحيح')
          }
          
          // إعادة تعيين input
          e.target.value = ''
        }}
      />
    </div>
  )
}

export default App
