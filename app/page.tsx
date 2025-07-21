"use client";
import Link from 'next/link';
import Navbar from './components/Navbar';
import { 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp, 
  FiActivity,
  FiFileText,
  FiCreditCard,
  FiLink,
  FiBarChart2,
  FiPlus,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiSettings
} from 'react-icons/fi';
import React, { useState, useEffect } from 'react';
import PostCardList from './components/PostCardList';
import { TablePostData } from './types';
import { searchSocialPost } from './api/searchapi';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [posts, setPosts] = useState<TablePostData[]>([]);
  const [loading, setLoading] = useState(false);
  // Thêm state đếm giây loading
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;
    if (loading) {
      setLoadingSeconds(0);
      timer = setInterval(() => {
        setLoadingSeconds(s => s + 1);
      }, 1000);
    } else {
      setLoadingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [loading]);


  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchSocialPost(inputValue);
      setPosts(data);
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-20">
        <section className="py-16 text-center px-2 sm:px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hệ thống lắng nghe & theo dõi mạng xã hội realtime</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">Tự động thu thập , tổng hợp và hiển thị các bài viết nổi bật, mới nhất theo từ khóa từ Facebook, Threads, Instagram, YouTube, TikTok...</p>
          <div className="max-w-xl mx-auto flex gap-3 items-center">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, tác giả..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-lg placeholder-gray-400 transition-all duration-200"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-white font-bold text-base shadow hover:bg-gray-700 transition-all duration-200 active:scale-95 disabled:opacity-60"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
              Tìm kiếm
            </button>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-gray-400 mt-2 justify-center">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
              Đang tìm kiếm, vui lòng chờ {loadingSeconds} giây...
            </div>
          )}
        </section>
        <section className="pb-20">
          <PostCardList posts={posts} fetchNextPage={() => {}} hasMore={false} />
        </section>
      </div>
    </div>
  );
} 