'use client';

import React, { useEffect, useState } from 'react';

export default function Footer() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Lấy theme từ localStorage khi load
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      document.body.classList.toggle('bg-black', saved === 'dark');
      document.body.classList.toggle('text-white', saved === 'dark');
      document.body.classList.toggle('bg-white', saved === 'light');
      document.body.classList.toggle('text-black', saved === 'light');
    } else {
      document.body.classList.add('bg-black', 'text-white');
      document.body.classList.remove('bg-white', 'text-black');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('bg-black', 'text-white');
      document.body.classList.remove('bg-white', 'text-black');
    } else {
      document.body.classList.add('bg-white', 'text-black');
      document.body.classList.remove('bg-black', 'text-white');
    }
    if (typeof window !== 'undefined') localStorage.setItem('theme', newTheme);
  };

  return (
    <footer className="bg-black text-gray-400 pt-12  border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
        {/* Email & Social */}
        <div className="flex flex-col gap-4 md:col-span-1">
          <div className="font-medium text-white mb-2">hi@socialcrawl.com</div>
          <div className="flex gap-4 text-2xl">
            <a href="#" className="hover:text-blue-400"><i className="fab fa-x-twitter"></i></a>
            <a href="#" className="hover:text-blue-400"><i className="fab fa-github"></i></a>
            <a href="#" className="hover:text-blue-400"><i className="fab fa-facebook"></i></a>
            <a href="#" className="hover:text-blue-400"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
        {/* Product */}
        <div>
          <div className="font-medium text-white mb-2">Product</div>
          <ul className="space-y-1">
            <li><a href="/" className="hover:text-blue-400">Home</a></li>
            <li><a href="/pricing" className="hover:text-blue-400">Pricing</a></li>
            <li><a href="/features" className="hover:text-blue-400">Features</a></li>
            <li><a href="/enterprise" className="hover:text-blue-400">Enterprise</a></li>
            <li><a href="#" className="hover:text-blue-400">Downloads</a></li>
            <li><a href="#" className="hover:text-blue-400">Students</a></li>
          </ul>
        </div>
        {/* Resources */}
        <div>
          <div className="font-medium text-white mb-2">Resources</div>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-blue-400">Docs</a></li>
            <li><a href="/blog" className="hover:text-blue-400">Blog</a></li>
            <li><a href="/forum" className="hover:text-blue-400">Forum</a></li>
            <li><a href="#" className="hover:text-blue-400">Changelog</a></li>
          </ul>
        </div>
        {/* Company */}
        <div>
          <div className="font-medium text-white mb-2">Company</div>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-blue-400">SocialCrawl</a></li>
            <li><a href="/careers" className="hover:text-blue-400">Careers</a></li>
            <li><a href="#" className="hover:text-blue-400">Community</a></li>
            <li><a href="#" className="hover:text-blue-400">Customers</a></li>
          </ul>
        </div>
        {/* Legal & Settings */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="font-medium text-white mb-2">Legal</div>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-blue-400">Terms</a></li>
              <li><a href="#" className="hover:text-blue-400">Security</a></li>
              <li><a href="#" className="hover:text-blue-400">Privacy</a></li>
            </ul>
          </div>
          <div className="flex gap-2 items-center mt-4">
            <select className="bg-black border border-gray-700 rounded-lg px-3 py-1 text-gray-300">
              <option>English</option>
              <option>Tiếng Việt</option>
            </select>
            <button
              className={`border border-gray-700 rounded-lg px-2 py-1 flex items-center gap-1 focus:outline-none ${theme === 'dark' ? 'text-gray-300' : 'text-yellow-500'}`}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <span role="img" aria-label="dark">🌙</span>
              ) : (
                <span role="img" aria-label="light">☀️</span>
              )}
            </button>
          </div>
          <div className="mt-2">
            <span className="inline-block border border-gray-700 rounded px-2 py-1 text-xs text-gray-400">SOC 2 Certified</span>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-8">© 2024 Made by SocialCrawl</div>
    </footer>
  );
} 