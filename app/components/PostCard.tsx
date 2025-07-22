import { TablePostData } from '../types';
import { faFacebook, faThreads, faInstagram, faXTwitter, faTumblr, faTiktok, IconDefinition,faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef } from 'react';
type PostCardProps = {
  post: TablePostData & { post_image?: string | null };
};
const faIconMap: Record<string, IconDefinition> = {
  facebook: faFacebook,
  instagram: faInstagram,
  threads: faThreads,
  x: faXTwitter,
  twitter: faXTwitter,
  tumblr: faTumblr,
  tiktok: faTiktok,
  linkedin: faLinkedin
};

// TikTok nhúng
function extractTikTokVideoId(url: string): string | null {
  // Ví dụ: https://www.tiktok.com/@username/video/1234567890123456789
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
}

function TikTokEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLQuoteElement>(null);
  const videoId = extractTikTokVideoId(url);

  useEffect(() => {
    if (typeof window === 'undefined' || !videoId) return;
    if (!document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        if ((window as any).tiktokEmbedLoaded) (window as any).tiktokEmbedLoaded();
        if ((window as any).tiktokEmbedInit) (window as any).tiktokEmbedInit();
      };
    } else {
      setTimeout(() => {
        if ((window as any).tiktokEmbedLoaded) (window as any).tiktokEmbedLoaded();
        if ((window as any).tiktokEmbedInit) (window as any).tiktokEmbedInit();
      }, 100);
    }
  }, [videoId]);

  if (typeof window === 'undefined' || !videoId) return null;
  return (
    <blockquote
      className="tiktok-embed"
      cite={url}
      data-video-id={videoId}
      style={{ maxWidth: 605, minWidth: 325 }}
      ref={ref}
    ></blockquote>
  );
}

// Utility: Convert UTC timestamp to GMT+7 and format
function formatToGMT7(utcTimestamp: string | number | Date) {
  if (!utcTimestamp) return '';
  try {
    let date: Date;
    if (typeof utcTimestamp === 'number') {
      // Nếu là số và nhỏ hơn 10^12 thì là giây, cần nhân 1000
      date = utcTimestamp < 1e12 ? new Date(utcTimestamp * 1000) : new Date(utcTimestamp);
    } else {
      date = new Date(utcTimestamp);
    }
    // Add 7 hours for GMT+7
    const gmt7Date = new Date(date.getTime() + 0 * 60 * 60 * 1000);
    return gmt7Date.toLocaleString('vi-VN', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(utcTimestamp);
  }
}

// Hàm highlight keyword trong message
function highlightKeywords(message: string, key_word: string) {
  if (!key_word) return message;
  const keyword = key_word.trim();
  if (!keyword) return message;
  // Tạo regex để match keyword, không phân biệt hoa thường
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')})`, 'gi');
  const parts = message.split(regex);
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={i} className="bg-yellow-300 text-black px-1 rounded">{part}</mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

const bgMap: Record<string, string> = {
  facebook: 'bg-[#1877F3]',
  instagram: 'bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
  threads: 'bg-[#262626]',
  x: 'bg-[#000000]',
  twitter: 'bg-[#000000]',
  tumblr: 'bg-[#36465D]',
  tiktok: 'bg-[#010101]',
  linkedin: 'bg-[#0A66C2]', 
  default: 'bg-[#18181b]/80',
};

// Đặt biến domain proxy theo môi trường
const PROXY_DOMAIN = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8002'
  : 'http://45.32.104.37:8002';

export default function PostCard({ post }: PostCardProps) {
  const iconKey = post.post_type?.toLowerCase();
  const icon = iconKey ? faIconMap[iconKey] : null;

  // Gradient màu cho hover, có thể random hoặc theo type
  const gradientMap: Record<string, string> = {
    facebook: 'from-blue-500 via-blue-400 to-blue-600',
    instagram: 'from-pink-500 via-yellow-400 to-purple-500',
    threads: 'from-gray-800 via-gray-600 to-black',
    x: 'from-gray-900 via-gray-700 to-black',
    twitter: 'from-blue-400 via-blue-500 to-gray-900',
    tumblr: 'from-blue-900 via-blue-700 to-gray-900',
    tiktok: 'from-[#010101] via-[#25F4EE] to-[#010101]',
    default: 'from-blue-500 to-purple-500',
  };
  const gradient = gradientMap[iconKey || ''] || gradientMap.default;

  const bgColor = bgMap[iconKey || ''] || bgMap.default;

  // Map màu cho icon theo nền tảng
  const iconColorMap: Record<string, string> = {
    facebook: '#1877F3',
    instagram: '#E1306C',
    threads: '#262626',
    x: '#000000',
    twitter: '#1DA1F2',
    tumblr: '#36465D',
    linkedin: '#0A66C2',
    tiktok: '#25F4EE',
    default: '#888888',
  };
  const iconColor = iconColorMap[iconKey || ''] || iconColorMap.default;

  return (
    <div
      className={`relative border border-white/10 rounded-2xl shadow-lg p-4 mb-6 group transition-all duration-300 ${bgColor}`}
      style={{ minHeight: 180, minWidth: 260, maxWidth: 340, width: '100%' }}
    >
      <div className={`pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 bg-gradient-to-br ${gradient}`}></div>
      <div className="relative z-10">
      
      {/* Icon và tên tác giả */}
      <div className="flex items-center justify-between text-sm mb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              className="w-6 h-6 bg-[#18181b] border border-white/10 rounded-full shadow p-1"
              style={{ color: iconColor }}
            />
          )}
          <span className="font-semibold text-white">{post.author_username}</span>
        </div>
        <span className="text-gray-400">{post.content_created}</span>
      </div>
      {/* Thời gian tạo bài viết (GMT+7) */}
      {post.post_created_timestamp && (
        <div className="text-xs text-gray-600 mb-1">
          🕒 {formatToGMT7(post.post_created_timestamp)}
        </div>
      )}

      {/* Ảnh nổi bật nếu có */}
      {post.post_image && (
        (post.post_type === 'instagram' || post.post_type === 'threads') ? (
          <img
            src={`${PROXY_DOMAIN}/seacrhsocial/proxy?url=${encodeURIComponent(post.post_image)}`}
            alt="Post image"
            className="w-full object-contain rounded-xl mb-2 border border-white/10 shadow"
            style={{ height: 'auto', maxWidth: '100%', display: 'block' }}
          />
        ) : (
          <img
            src={post.post_image}
            alt="Post image"
            className="w-full object-contain rounded-xl mb-2 border border-white/10 shadow"
            style={{ height: 'auto', maxWidth: '100%', display: 'block' }}
          />
        )
      )}

      <div className="text-gray-100 mb-3 whitespace-pre-line text-xs break-all">
        {highlightKeywords(post.message, post.post_keyword)}
      </div>

      {/* Footer sát đáy có padding-bottom nhẹ */}
      <div className="text-sm text-gray-400 flex justify-between items-center border-t border-white/10 pt-2 pb-3">
        <span>👍 {post.count_like}</span>
        <span>💬 {post.count_comments}</span>
        <span>🔁 {post.count_share}</span>
        <a
          href={post.post_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 underline ml-auto hover:text-white"
        >
          Xem bài viết
        </a>
      </div>
      </div>
    </div>
  );
}

