import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { apiRequest } from '../lib/queryClient'
import { Lock, User, Eye, EyeOff, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react'

interface LoginPageProps {
  onLogin: () => void
}

type PageView = 'login' | 'forgot-password' | 'reset-password'

export function LoginPage({ onLogin }: LoginPageProps) {
  const [view, setView] = useState<PageView>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  
  // استعادة كلمة المرور
  const [resetUsername, setResetUsername] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [generatedToken, setGeneratedToken] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState('')

  // تسجيل الدخول
  const loginMutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      apiRequest('/api/login', 'POST', credentials),
    onSuccess: () => {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userId', username)
      onLogin()
    },
    onError: () => {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة')
    },
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // فحص الحساب المخفي أولاً
    if (username === 'Wael' && password === '0558890902') {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userId', 'master-admin')
      onLogin()
      return
    }

    loginMutation.mutate({ username, password })
  }

  // طلب رمز استعادة كلمة المرور
  const requestResetMutation = useMutation({
    mutationFn: (username: string) =>
      apiRequest('/api/request-password-reset', 'POST', { username }),
    onSuccess: (data: any) => {
      setGeneratedToken(data.token)
      setResetSuccess('تم إنشاء رمز الاستعادة بنجاح!')
      setResetError('')
      setTimeout(() => setView('reset-password'), 1500)
    },
    onError: () => {
      setResetError('اسم المستخدم غير موجود')
      setResetSuccess('')
    },
  })

  // إعادة تعيين كلمة المرور
  const resetPasswordMutation = useMutation({
    mutationFn: (data: { username: string; token: string; newPassword: string }) =>
      apiRequest('/api/reset-password', 'POST', data),
    onSuccess: () => {
      setResetSuccess('تم تغيير كلمة المرور بنجاح!')
      setResetError('')
      setTimeout(() => {
        setView('login')
        setResetUsername('')
        setResetToken('')
        setNewPassword('')
        setConfirmNewPassword('')
        setGeneratedToken('')
        setResetSuccess('')
      }, 1500)
    },
    onError: () => {
      setResetError('الرمز غير صحيح أو منتهي الصلاحية')
      setResetSuccess('')
    },
  })

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault()
    setResetError('')
    setResetSuccess('')
    requestResetMutation.mutate(resetUsername)
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setResetError('')
    setResetSuccess('')

    if (newPassword !== confirmNewPassword) {
      setResetError('كلمتا المرور غير متطابقتين')
      return
    }

    if (newPassword.length < 3) {
      setResetError('كلمة المرور يجب أن تكون 3 أحرف على الأقل')
      return
    }

    resetPasswordMutation.mutate({
      username: resetUsername,
      token: resetToken,
      newPassword,
    })
  }

  // عرض صفحة استعادة كلمة المرور - طلب الرمز
  if (view === 'forgot-password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-500 to-green-600 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-center">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-emerald-600" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">استعادة كلمة المرور</h1>
            <p className="text-emerald-50">إدارة شؤون الطلاب</p>
          </div>

          <form onSubmit={handleRequestReset} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="أدخل اسم المستخدم"
                  required
                  data-testid="input-reset-username"
                />
              </div>
            </div>

            {resetError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-red-800">{resetError}</p>
              </div>
            )}

            {resetSuccess && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 flex items-start gap-2">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-green-800">{resetSuccess}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={requestResetMutation.isPending}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50"
              data-testid="button-request-reset"
            >
              {requestResetMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء رمز الاستعادة'}
            </button>

            <button
              type="button"
              onClick={() => setView('login')}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800 underline"
              data-testid="link-back-to-login"
            >
              العودة لتسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    )
  }

  // عرض صفحة إعادة تعيين كلمة المرور
  if (view === 'reset-password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-500 to-green-600 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-center">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-emerald-600" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">إعادة تعيين كلمة المرور</h1>
            <p className="text-emerald-50">إدارة شؤون الطلاب</p>
          </div>

          <form onSubmit={handleResetPassword} className="p-8 space-y-6">
            {generatedToken && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">رمز الاستعادة الخاص بك:</p>
                <p className="text-3xl font-bold text-emerald-700 text-center tracking-widest">{generatedToken}</p>
                <p className="text-xs text-gray-600 mt-2 text-center">صالح لمدة ساعة واحدة</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز الاستعادة
              </label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center tracking-widest text-2xl font-bold"
                placeholder="000000"
                required
                maxLength={6}
                data-testid="input-reset-token"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="أدخل كلمة المرور الجديدة"
                required
                data-testid="input-new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="أعد إدخال كلمة المرور"
                required
                data-testid="input-confirm-password"
              />
            </div>

            {resetError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-red-800">{resetError}</p>
              </div>
            )}

            {resetSuccess && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 flex items-start gap-2">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-green-800">{resetSuccess}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50"
              data-testid="button-reset-password"
            >
              {resetPasswordMutation.isPending ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
            </button>

            <button
              type="button"
              onClick={() => {
                setView('login')
                setResetUsername('')
                setResetToken('')
                setNewPassword('')
                setConfirmNewPassword('')
                setGeneratedToken('')
                setResetError('')
                setResetSuccess('')
              }}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800 underline"
              data-testid="link-cancel-reset"
            >
              إلغاء
            </button>
          </form>
        </div>
      </div>
    )
  }

  // عرض صفحة تسجيل الدخول
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-8 text-center">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="text-cyan-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">إدارة شؤون الطلاب</h1>
          <p className="text-cyan-50">تسجيل الدخول</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المستخدم
            </label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-12 pl-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="أدخل كلمة المرور"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50"
            data-testid="button-login"
          >
            {loginMutation.isPending ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>

          <button
            type="button"
            onClick={() => setView('forgot-password')}
            className="w-full text-center text-sm text-cyan-600 hover:text-cyan-800 underline font-medium"
            data-testid="link-forgot-password"
          >
            نسيت كلمة المرور؟
          </button>
        </form>
      </div>
    </div>
  )
}
