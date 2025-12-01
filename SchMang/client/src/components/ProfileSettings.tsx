import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiRequest, queryClient } from '@/lib/queryClient'
import type { TeacherProfile } from '@shared/schema'
import { X, Save, User, Trash2, AlertTriangle, Lock, Key, Clock } from 'lucide-react'

interface ProfileSettingsProps {
  onClose: () => void
}

export function ProfileSettings({ onClose }: ProfileSettingsProps) {
  const [teacherName, setTeacherName] = useState('')
  const [teacherPhone, setTeacherPhone] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [systemTitle, setSystemTitle] = useState('')
  const [autoLogoutMinutes, setAutoLogoutMinutes] = useState(0)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  // خيارات تصفير البيانات
  const [clearOptions, setClearOptions] = useState({
    all: true,
    students: false,
    teachers: false,
    specialStatuses: false,
    visits: false,
    permissions: false,
    violations: false
  })

  const { data: profile } = useQuery<TeacherProfile>({
    queryKey: ['/api/teacher-profile'],
  })

  useEffect(() => {
    if (profile) {
      setTeacherName(profile.name || '')
      setTeacherPhone(profile.phone || '')
      setSchoolName(profile.schoolName || '')
      setSystemTitle(profile.systemTitle || '')
      setAutoLogoutMinutes(profile.autoLogoutMinutes || 0)
    }
  }, [profile])

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<TeacherProfile>) => {
      return apiRequest('/api/teacher-profile', 'POST', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher-profile'] })
      alert('تم حفظ البيانات بنجاح')
      window.location.reload()
    },
    onError: () => {
      alert('حدث خطأ في حفظ البيانات')
    }
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate({
      name: teacherName,
      phone: teacherPhone,
      schoolName: schoolName,
      systemTitle: systemTitle,
      autoLogoutMinutes: autoLogoutMinutes,
    })
  }

  const changePassword = useMutation({
    mutationFn: async (data: { currentUsername: string; newUsername: string; newPassword: string }) => {
      return apiRequest('/api/update-login-credentials', 'POST', data)
    },
    onSuccess: () => {
      alert('تم تغيير بيانات الدخول بنجاح!')
      setShowPasswordSection(false)
      setNewPassword('')
      setConfirmPassword('')
    },
    onError: () => {
      setPasswordError('حدث خطأ أثناء تغيير بيانات الدخول')
    }
  })

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (newPassword !== confirmPassword) {
      setPasswordError('كلمة المرور غير متطابقة')
      return
    }

    if (newPassword.length < 4) {
      setPasswordError('كلمة المرور يجب أن تكون 4 أحرف على الأقل')
      return
    }

    changePassword.mutate({
      currentUsername: 'admin',
      newUsername: newUsername,
      newPassword: newPassword
    })
  }

  const clearDatabase = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/clear-database-selective', 'POST', clearOptions)
    },
    onSuccess: () => {
      alert('تم حذف البيانات المحددة بنجاح!')
      setShowResetConfirm(false)
      onClose()
      window.location.reload()
    },
    onError: () => {
      alert('حدث خطأ أثناء حذف البيانات')
      setShowResetConfirm(false)
    }
  })
  
  const handleClearOptionChange = (option: string) => {
    if (option === 'all') {
      const newValue = !clearOptions.all
      setClearOptions({
        all: newValue,
        students: !newValue,
        teachers: !newValue,
        specialStatuses: !newValue,
        visits: !newValue,
        permissions: !newValue,
        violations: !newValue
      })
    } else {
      setClearOptions(prev => {
        const updated = { ...prev, [option]: !prev[option as keyof typeof prev] }
        // إذا تم إلغاء تحديد كل شي، تأكد من إلغاء "الكل"
        updated.all = false
        return updated
      })
    }
  }

  const handleResetDatabase = async () => {
    clearDatabase.mutate()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">الإعدادات</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              معلومات النظام
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم مسؤول النظام
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل اسم مسؤول النظام"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الجوال
              </label>
              <input
                type="tel"
                value={teacherPhone}
                onChange={(e) => setTeacherPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="05xxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف النظام
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: نظام إدارة شاملة لبيانات الطلاب"
                data-testid="input-system-description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المدرسة
              </label>
              <input
                type="text"
                value={systemTitle}
                onChange={(e) => setSystemTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: مدرسة الملك عبدالله الابتدائية"
                data-testid="input-school-name"
              />
            </div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="text-purple-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-900 mb-2">
                  تسجيل الخروج التلقائي
                </h3>
                <p className="text-sm text-purple-700 mb-4">
                  حدد المدة الزمنية التي يتم بعدها تسجيل الخروج تلقائياً في حالة عدم النشاط لحماية بيانات الطلاب
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مدة عدم النشاط قبل تسجيل الخروج
              </label>
              <select
                value={autoLogoutMinutes}
                onChange={(e) => setAutoLogoutMinutes(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                data-testid="select-auto-logout"
              >
                <option value={0}>معطل - عدم تسجيل الخروج التلقائي</option>
                <option value={5}>5 دقائق</option>
                <option value={10}>10 دقائق</option>
                <option value={15}>15 دقيقة</option>
                <option value={30}>30 دقيقة</option>
                <option value={60}>ساعة واحدة</option>
                <option value={120}>ساعتان</option>
              </select>
              {autoLogoutMinutes > 0 && (
                <p className="text-sm text-purple-700 mt-2">
                  ⏱️ سيتم تسجيل الخروج تلقائياً بعد {autoLogoutMinutes} دقيقة من عدم النشاط
                </p>
              )}
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Lock className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  إعدادات تسجيل الدخول
                </h3>
                <p className="text-sm text-green-700 mb-4">
                  يمكنك تغيير اسم المستخدم وكلمة المرور من هنا
                </p>

                {!showPasswordSection ? (
                  <button
                    type="button"
                    onClick={() => setShowPasswordSection(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    <Key size={18} />
                    تغيير بيانات الدخول
                  </button>
                ) : (
                  <div className="space-y-4 bg-white rounded-lg p-4 border border-green-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم المستخدم الجديد
                      </label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="أدخل اسم المستخدم الجديد"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        كلمة المرور الجديدة
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="أدخل كلمة المرور الجديدة"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تأكيد كلمة المرور
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="أعد إدخال كلمة المرور"
                        required
                      />
                    </div>

                    {passwordError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">{passwordError}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        disabled={changePassword.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
                      >
                        {changePassword.isPending ? 'جاري التغيير...' : 'حفظ التغييرات'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordSection(false)
                          setPasswordError('')
                          setNewPassword('')
                          setConfirmPassword('')
                          setNewUsername('')
                        }}
                        className="px-4 py-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-semibold"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  تصفير قاعدة البيانات
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  تحذير: سيتم حذف البيانات بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه!
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  استخدم هذا الخيار في نهاية العام الدراسي لتصفير النظام والبدء من جديد.
                </p>
              </div>
            </div>

            {!showResetConfirm ? (
              <>
                <div className="bg-white rounded-lg p-4 mb-4 space-y-3">
                  <p className="font-semibold text-gray-800 mb-3">اختر البيانات المراد حذفها:</p>
                  
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={clearOptions.all}
                      onChange={() => handleClearOptionChange('all')}
                      className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                    />
                    <span className="font-bold text-gray-900">جميع البيانات</span>
                  </label>
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={clearOptions.students}
                      onChange={() => handleClearOptionChange('students')}
                      disabled={clearOptions.all}
                      className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    />
                    <span className={clearOptions.all ? 'text-gray-400' : 'text-gray-800'}>الطلاب</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={clearOptions.teachers}
                      onChange={() => handleClearOptionChange('teachers')}
                      disabled={clearOptions.all}
                      className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    />
                    <span className={clearOptions.all ? 'text-gray-400' : 'text-gray-800'}>المعلمين</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={clearOptions.specialStatuses}
                      onChange={() => handleClearOptionChange('specialStatuses')}
                      disabled={clearOptions.all}
                      className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    />
                    <span className={clearOptions.all ? 'text-gray-400' : 'text-gray-800'}>الحالات الخاصة</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={clearOptions.visits}
                      onChange={() => handleClearOptionChange('visits')}
                      disabled={clearOptions.all}
                      className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    />
                    <span className={clearOptions.all ? 'text-gray-400' : 'text-gray-800'}>استقبال الطلاب</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={clearOptions.permissions}
                      onChange={() => handleClearOptionChange('permissions')}
                      disabled={clearOptions.all}
                      className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    />
                    <span className={clearOptions.all ? 'text-gray-400' : 'text-gray-800'}>الاستئذانات</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={clearOptions.violations}
                      onChange={() => handleClearOptionChange('violations')}
                      disabled={clearOptions.all}
                      className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    />
                    <span className={clearOptions.all ? 'text-gray-400' : 'text-gray-800'}>المخالفات</span>
                  </label>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 size={20} />
                  تصفير قاعدة البيانات
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3">
                  <p className="text-sm font-bold text-yellow-900 text-center">
                    هل أنت متأكد من حذف البيانات المحددة؟
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleResetDatabase}
                    disabled={clearDatabase.isPending}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    {clearDatabase.isPending ? 'جاري الحذف...' : 'نعم، احذف البيانات المحددة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={20} />
              {updateProfile.isPending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
