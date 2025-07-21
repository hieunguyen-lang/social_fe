'use client';

import React, { useState } from 'react';
import { FiSearch, FiBell, FiPlus, FiX } from 'react-icons/fi';

const MOCK_RESULTS = [
  { platform: 'Facebook', content: 'Bài viết về AI trên Facebook', time: '2 phút trước' },
  { platform: 'Threads', content: 'Threads chia sẻ về ReactJS', time: '5 phút trước' },
  { platform: 'Instagram', content: 'Ảnh đẹp về UI/UX', time: '10 phút trước' },
  { platform: 'YouTube', content: 'Video hướng dẫn crawl dữ liệu', time: '20 phút trước' },
  { platform: 'TikTok', content: 'Tips code nhanh trên TikTok', time: '30 phút trước' },
];

const PLATFORM_COLORS: { [key: string]: string } = {
  Facebook: "text-blue-500",
  Threads: "text-gray-400",
  Instagram: "text-pink-500",
  YouTube: "text-red-500",
  TikTok: "text-black",
};

export default function FeaturesPage() {
  const [search, setSearch] = useState('');
  const [keywords, setKeywords] = useState(['AI', 'ReactJS', 'Tài chính']);
  const [newKeyword, setNewKeyword] = useState('');

  const filteredResults = !search
    ? MOCK_RESULTS
    : MOCK_RESULTS.filter(r =>
        r.content.toLowerCase().includes(search.toLowerCase()) ||
        r.platform.toLowerCase().includes(search.toLowerCase())
      );

  const handleAddKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword('');
    }
  };
  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">Tính năng nổi bật</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 text-center">
          Hệ thống hỗ trợ tìm kiếm realtime đa nền tảng, cảnh báo từ khoá, theo dõi group Facebook và nhiều tính năng mạnh mẽ khác.
        </p>

        {/* Search realtime demo */}
        <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-lg p-6 mb-10 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><FiSearch className="mr-2" /> Search realtime đa nền tảng</h2>
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm bài viết, video, hashtag..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-black dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
          <ul>
            {filteredResults.length === 0 && (
              <li className="text-gray-400 italic">Không có kết quả phù hợp.</li>
            )}
            {filteredResults.map((r, idx) => (
              <li key={idx} className="py-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <span className={`font-semibold ${PLATFORM_COLORS[r.platform ]}`}>{r.platform}</span>
                <span className="flex-1 text-gray-700 dark:text-gray-100">{r.content}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{r.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Alert keyword demo */}
        <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-lg p-6 mb-10 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><FiBell className="mr-2" /> Alert cảnh báo từ khoá, group Facebook</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {keywords.map(kw => (
              <span key={kw} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                {kw}
                <button onClick={() => handleRemoveKeyword(kw)} className="ml-1 hover:text-red-400"><FiX /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={e => setNewKeyword(e.target.value)}
              placeholder="Thêm từ khoá mới..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-black dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              onKeyDown={e => { if (e.key === 'Enter') handleAddKeyword(); }}
            />
            <button
              onClick={handleAddKeyword}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 font-semibold"
            >
              <FiPlus /> Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 