import { TablePostData } from '../types';

type LoginPostCardProps = {
  post: TablePostData & { image_url?: string | null };
  rotate?: number;
};

export default function LoginPostCard({ post, rotate = -15 }: LoginPostCardProps) {
  return (
    <div
      className="relative bg-[#18181b]/80 border border-white/10 rounded-2xl shadow-lg p-4 mb-6"
      style={{ minWidth: 220, maxWidth: 300, width: '100%', transform: `rotate(${rotate}deg)` }}
    >
      {post.image_url && (
        <img
          src={post.image_url}
          alt="Post image"
          className="w-full object-contain rounded-xl mb-2 border border-white/10 shadow"
          style={{ height: 'auto', maxWidth: '100%', display: 'block' }}
        />
      )}
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-semibold text-white truncate max-w-[60%]">{post.author_username}</span>
        <span className="text-gray-400 truncate">{post.content_created}</span>
      </div>
      <div className="text-gray-100 text-xs truncate max-w-full">
        {post.message}
      </div>
    </div>
  );
} 