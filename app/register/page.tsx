'use client'; // Quan trọng khi dùng onClick trong component app/
import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation'
import { useState,useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiCheck, FiChevronRight,FiType } from 'react-icons/fi';
import { apiService } from '../utils/api';
import { useAuth } from '../context/AuthContext'
export default function Register() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const { isLoggedIn, loading: authLoading } = useAuth()
  const router = useRouter()
  // ✅ Nếu đã đăng nhập, chuyển hướng sang dashboard
    useEffect(() => {
      if (!authLoading && isLoggedIn) {
        router.push('/home')
      }
    }, [authLoading, isLoggedIn])
  // useEffect(() => {
  //   const checkLogin = async () => {
  //       try {
  //         await apiService.get('/api/user/me') // hoặc /users/me
  //         router.push('/home')
  //       } catch (err) {
  //         return null
  //       }
  //     }
  
  //     checkLogin()
  //   }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const username = (form.elements.namedItem('username') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value
    // ✅ Kiểm tra confirmPassword
    if (password !== confirmPassword) {
      setError(['Mật khẩu xác nhận không khớp'])
      setLoading(false)
      return
    }
    try {
      const params = {
            name: name,
            username: username,
            email: email,
            password: password
          };
      const res = await apiService.register(params);
      if (res.status == 200){
        router.push('/login')

        setSuccess(true)
      }
      
    } catch (err: any) {
      console.error('Lỗi:', err.response?.data)

      const apiErrors = err.response?.data?.detail;
      if (Array.isArray(apiErrors)) {
        const messages = apiErrors.map((e: any) => e.msg);
        setError(messages); // setError là mảng
      } else {
        setError([err.response?.data?.message || 'Đăng ký thất bại']);
      }
    } finally {
          setLoading(false)
        }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản</h1>
            <p className="text-gray-600">
              Tham gia cùng hàng nghìn người dùng đang sử dụng hệ thống quản lý của chúng tôi.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-8 border border-blue-100">
            {/* Registration Form */}
            <form onSubmit={handleSubmit} >
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiType className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                </div>
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="nguyenvana"
                      required
                    />
                  </div>
                </div>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="•••••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Mật khẩu phải có ít nhất 8 ký tự.
                  </p>
                </div>
                
                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="Password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="•••••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                </div>
                
                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-700">
                      I agree to the <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
                    </label>
                  </div>
                </div>
                {/* Error Mess */}
                {error.length > 0 && (
                  <div className="rounded-md bg-red-50 p-4 border border-red-200 space-y-1">
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                      </div>
                      <div className="ml-3 text-sm text-red-700 space-y-1">
                        {error.map((msg, idx) => (
                          <p key={idx}>• {msg}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                    <FiChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
            
            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc đăng ký với</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-800">
                Đăng nhập
              </Link>
            </p>
          </div>
          
          {/* Features */}
          <div className="mt-12">
            <h2 className="text-center text-lg font-medium text-gray-900 mb-6">
              Why join Elegant Dashboard?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiCheck className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  <span className="font-medium text-gray-900">Advanced Analytics</span> - Get powerful data visualization tools at your fingertips
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiCheck className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  <span className="font-medium text-gray-900">Elegant Design</span> - A beautiful black and white interface that puts your data first
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiCheck className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  <span className="font-medium text-gray-900">Data Security</span> - Enterprise-grade security to protect your valuable information
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 