'use client'; // Quan trọng khi dùng onClick trong component app/
import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { apiService } from '../utils/api';
import { useState,useEffect } from 'react';
import { useRouter,useSearchParams } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { TablePostData } from '../types';

import { FiUser, FiMail, FiLock, FiCheck, FiChevronRight } from 'react-icons/fi';
import LoginPostCardList from '../components/LoginPostCardList';

// Copy MOCK_POSTS trực tiếp vào file này
const MOCK_POSTS: TablePostData[] = [
  {
    post_keyword:"",
    post_url: 'https://www.instagram.com/p/DLt4l-lvHWt/?img_index=1',
    author_username: 'https://www.instagram.com/p/DLt4l-lvHWt/?img_index=1',
    message: 'Một ngày làm tiên nữ, tối về vẫn rửa bát 🙃"',
    content_created: '2 giờ trước',
    post_created_timestamp: 12,
    hours_diff: 2,
    count_like: 120,
    count_comments: 15,
    count_share: 10,
    post_image: 'https://instagram.fhan5-2.fna.fbcdn.net/v/t51.2885-15/522616979_17849573622512452_8417586206858751573_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InRocmVhZHMuQ0FST1VTRUxfSVRFTS5pbWFnZV91cmxnZW4uMTA4MHgxMDgwLnNkci5mODI3ODcuZGVmYXVsdF9pbWFnZSJ9&_nc_ht=instagram.fhan5-2.fna.fbcdn.net&_nc_cat=104&_nc_oc=Q6cZ2QGdN9pSsmWnVoVUHtr3ekQaoUSY-371oLYtFAhVlvdVwHvfr5HSGyVZP2BnLbvNVGg&_nc_ohc=QlDk23REpiIQ7kNvwE40V9L&_nc_gid=wbtBFYva23bR5IdhC0mGiQ&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MzY3OTg1NTY2MDc5MzMwMjMxMQ%3D%3D.3-ccb7-5&oh=00_AfTNOah2BTXdXJ0bLXPGN6O3sYQ-aP2VvlZH8Fu6UQlydw&oe=68826328&_nc_sid=10d13b',
    post_type: 'facebook',
  },
  
  {
    post_keyword:"",
    post_url: 'https://www.instagram.com/p/DLt4l-lvHWt/?img_index=1',
    author_username: 'https://www.instagram.com/p/DLt4l-lvHWt/?img_index=1',
    message: 'Một ngày làm tiên nữ, tối về vẫn rửa bát 🙃"',
    content_created: '2 giờ trước',
    post_created_timestamp: 12,
    hours_diff: 2,
    count_like: 120,
    count_comments: 15,
    count_share: 10,
    post_image: 'https://instagram.fhan5-2.fna.fbcdn.net/v/t51.2885-15/522616979_17849573622512452_8417586206858751573_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InRocmVhZHMuQ0FST1VTRUxfSVRFTS5pbWFnZV91cmxnZW4uMTA4MHgxMDgwLnNkci5mODI3ODcuZGVmYXVsdF9pbWFnZSJ9&_nc_ht=instagram.fhan5-2.fna.fbcdn.net&_nc_cat=104&_nc_oc=Q6cZ2QGdN9pSsmWnVoVUHtr3ekQaoUSY-371oLYtFAhVlvdVwHvfr5HSGyVZP2BnLbvNVGg&_nc_ohc=QlDk23REpiIQ7kNvwE40V9L&_nc_gid=wbtBFYva23bR5IdhC0mGiQ&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MzY3OTg1NTY2MDc5MzMwMjMxMQ%3D%3D.3-ccb7-5&oh=00_AfTNOah2BTXdXJ0bLXPGN6O3sYQ-aP2VvlZH8Fu6UQlydw&oe=68826328&_nc_sid=10d13b',
    post_type: 'facebook',
  },
  {
    post_keyword:"",
    post_url: 'https://www.instagram.com/p/DLt4l-lvHWt/?img_index=1',
    author_username: 'https://www.instagram.com/p/DLt4l-lvHWt/?img_index=1',
    message: 'Một ngày làm tiên nữ, tối về vẫn rửa bát 🙃"',
    content_created: '2 giờ trước',
    post_created_timestamp: 12,
    hours_diff: 2,
    count_like: 120,
    count_comments: 15,
    count_share: 10,
    post_image: 'https://instagram.fhan5-2.fna.fbcdn.net/v/t51.2885-15/522616979_17849573622512452_8417586206858751573_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InRocmVhZHMuQ0FST1VTRUxfSVRFTS5pbWFnZV91cmxnZW4uMTA4MHgxMDgwLnNkci5mODI3ODcuZGVmYXVsdF9pbWFnZSJ9&_nc_ht=instagram.fhan5-2.fna.fbcdn.net&_nc_cat=104&_nc_oc=Q6cZ2QGdN9pSsmWnVoVUHtr3ekQaoUSY-371oLYtFAhVlvdVwHvfr5HSGyVZP2BnLbvNVGg&_nc_ohc=QlDk23REpiIQ7kNvwE40V9L&_nc_gid=wbtBFYva23bR5IdhC0mGiQ&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MzY3OTg1NTY2MDc5MzMwMjMxMQ%3D%3D.3-ccb7-5&oh=00_AfTNOah2BTXdXJ0bLXPGN6O3sYQ-aP2VvlZH8Fu6UQlydw&oe=68826328&_nc_sid=10d13b',
    post_type: 'facebook',
  },
  {
    post_keyword:"",
    post_url: 'https://www.instagram.com/p/DLt4l-lvHWt/?img_index=1',
    author_username: 'https://www.instagram.com/p/DLt4l-lvHWt/?img_index=1',
    message: 'Một ngày làm tiên nữ, tối về vẫn rửa bát 🙃"',
    content_created: '2 giờ trước',
    post_created_timestamp: 12,
    hours_diff: 2,
    count_like: 120,
    count_comments: 15,
    count_share: 10,
    post_image: 'https://instagram.fhan5-2.fna.fbcdn.net/v/t51.2885-15/522616979_17849573622512452_8417586206858751573_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InRocmVhZHMuQ0FST1VTRUxfSVRFTS5pbWFnZV91cmxnZW4uMTA4MHgxMDgwLnNkci5mODI3ODcuZGVmYXVsdF9pbWFnZSJ9&_nc_ht=instagram.fhan5-2.fna.fbcdn.net&_nc_cat=104&_nc_oc=Q6cZ2QGdN9pSsmWnVoVUHtr3ekQaoUSY-371oLYtFAhVlvdVwHvfr5HSGyVZP2BnLbvNVGg&_nc_ohc=QlDk23REpiIQ7kNvwE40V9L&_nc_gid=wbtBFYva23bR5IdhC0mGiQ&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MzY3OTg1NTY2MDc5MzMwMjMxMQ%3D%3D.3-ccb7-5&oh=00_AfTNOah2BTXdXJ0bLXPGN6O3sYQ-aP2VvlZH8Fu6UQlydw&oe=68826328&_nc_sid=10d13b',
    post_type: 'facebook',
  },
  {
    post_keyword:"",
    post_url: 'https://www.instagram.com/p/DLt4l-lvHWt/?img_index=1',
    author_username: 'https://www.instagram.com/p/DLt4l-lvHWt/?img_index=1',
    message: 'Một ngày làm tiên nữ, tối về vẫn rửa bát 🙃"',
    content_created: '2 giờ trước',
    post_created_timestamp: 12,
    hours_diff: 2,
    count_like: 120,
    count_comments: 15,
    count_share: 10,
    post_image: 'https://instagram.fhan5-2.fna.fbcdn.net/v/t51.2885-15/522616979_17849573622512452_8417586206858751573_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InRocmVhZHMuQ0FST1VTRUxfSVRFTS5pbWFnZV91cmxnZW4uMTA4MHgxMDgwLnNkci5mODI3ODcuZGVmYXVsdF9pbWFnZSJ9&_nc_ht=instagram.fhan5-2.fna.fbcdn.net&_nc_cat=104&_nc_oc=Q6cZ2QGdN9pSsmWnVoVUHtr3ekQaoUSY-371oLYtFAhVlvdVwHvfr5HSGyVZP2BnLbvNVGg&_nc_ohc=QlDk23REpiIQ7kNvwE40V9L&_nc_gid=wbtBFYva23bR5IdhC0mGiQ&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MzY3OTg1NTY2MDc5MzMwMjMxMQ%3D%3D.3-ccb7-5&oh=00_AfTNOah2BTXdXJ0bLXPGN6O3sYQ-aP2VvlZH8Fu6UQlydw&oe=68826328&_nc_sid=10d13b',
    post_type: 'facebook',
  },
];

export default function Login() {
  const router = useRouter()
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [error_login, setErrorLogin] = useState('')
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()
  const message = searchParams.get('message') ?? ''
  const [warningMessage, setWarningMessage] = useState('')
  const { isLoggedIn, loading: authLoading, refreshAuth } = useAuth()

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.push('/dashboard')
    }
  }, [authLoading, isLoggedIn])

  useEffect(() => {
    if (message.startsWith('unauthorized')) {
      setWarningMessage('Vui lòng đăng nhập trước khi truy cập trang này.');
      const timer = setTimeout(() => setWarningMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    setSuccess(false);

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const params = { username: email, password: password };
      const res = await apiService.login(params);

      if (res.status === 200) {
        setWarningMessage('');
        setError('');
        setSuccess(true);
        await refreshAuth();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setFormLoading(false);
    }
  };

  // Lấy danh sách ảnh từ mock data
  const images = MOCK_POSTS.map(p => p.post_image).filter((img): img is string => Boolean(img));

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Background PostCardList */}
      <div className="absolute inset-0 z-0 w-full h-full flex items-center justify-center opacity-40 pointer-events-none overflow-hidden">
        <LoginPostCardList posts={MOCK_POSTS.slice(0, 24)} rotate={-15} colCount={5} />
      </div>
      {/* Overlay màu tối nhẹ để nổi text/form */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      {/* Overlay text lớn bên trái */}
      <div className="absolute left-0 top-0 h-full flex items-center z-20 w-1/2 pl-10 hidden lg:flex">
        <h1 className="text-white text-5xl font-extrabold drop-shadow-lg leading-tight">
          Login to theo dõi mạng xã hội,<br/>
          khám phá ý tưởng mới và<br/>
          cập nhật xu hướng hot nhất!
        </h1>
      </div>
      {/* Form login bo góc lớn luôn căn giữa viewport */}
      <div className="relative z-20 flex items-center justify-center min-h-screen w-full">
        <div className="w-full max-w-md mx-auto bg-white text-gray-900 rounded-3xl shadow-2xl p-10 flex flex-col justify-center items-center my-16 lg:my-0 lg:ml-auto lg:mr-24">
          {!isLoggedIn && warningMessage && (
            <div className="mb-6 text-center">
              <div className="inline-block bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm font-medium">
                {warningMessage}
              </div>
            </div>
          )}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
            <p className="text-gray-600">
              Chào mừng bạn trở lại với hệ thống quản lý của chúng tôi.
            </p>
          </div>
          
          <div className="w-full">
            {!isLoggedIn && error && (
              <div className="mb-4 text-center">
                <div className="inline-block bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm font-medium">
                  {error}
                </div>
              </div>
            )}
            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900 placeholder-gray-400"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900 placeholder-gray-400"
                      placeholder="•••••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters long.
                  </p>
                </div>
                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    Login
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
                  <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
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
              Chưa có tài khoản?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Đăng ký
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 