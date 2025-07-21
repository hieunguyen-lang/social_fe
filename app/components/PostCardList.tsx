import React, { useEffect, useRef, useCallback, useState } from 'react';
import PostCard from './PostCard';
import { TablePostData } from '../types';

const getColumnCount = () => {
  if (typeof window === 'undefined') return 1;
  const width = window.innerWidth;
  if (width >= 2560) return 8;
  if (width >= 2200) return 7;
  if (width >= 1920) return 6;
  if (width >= 1600) return 5;
  if (width >= 1280) return 4;
  if (width >= 960) return 3;
  if (width >= 640) return 2;
  return 1;
};

type Props = {
  posts: TablePostData[];
  fetchNextPage: () => void;
  hasMore: boolean;
  backgroundMode?: boolean;
};

export default function PostCardList({ posts, fetchNextPage, hasMore, backgroundMode }: Props) {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [colCount, setColCount] = useState(1);
  const [pausedCol, setPausedCol] = useState<number | null>(null);

  // Set colCount sau khi đã vào client
  useEffect(() => {
    setColCount(getColumnCount());
    const handleResize = () => setColCount(getColumnCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chia posts thành các cột mỗi khi posts hoặc colCount thay đổi
  const columns = React.useMemo(() => {
    const cols: TablePostData[][] = Array.from({ length: colCount }, () => []);
    posts.forEach((post, i) => {
      cols[i % colCount].push(post);
    });
    return cols;
  }, [posts, colCount]);

  // Observer cho infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore) {
        fetchNextPage();
      }
    },
    [hasMore, fetchNextPage]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };
    if (!observerRef.current) return;
    const observer = new window.IntersectionObserver(handleObserver, option);
    observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  return (
    <>
      <div className="flex w-full gap-6 px-2 sm:px-4 md:px-8">
        {columns.map((col, colIdx) => {
          // Nếu backgroundMode, random margin-top cho mỗi cột
          const randomMargin = backgroundMode ? Math.floor(Math.random() * 40) : 0;
          return (
            <div
              key={colIdx}
              className={`masonry-col flex-1 flex flex-col`}
              style={{
                animation: 'floatCol 4s ease-in-out infinite',
                animationPlayState: pausedCol === colIdx ? 'paused' : 'running',
                willChange: 'transform',
                marginTop: randomMargin,
              }}
            >
              {col.map((post, rowIdx) => {
                // Nếu backgroundMode, tất cả card đều nghiêng về một phía
                const rotateDeg = backgroundMode ? 30: 0;
                const marginB = backgroundMode ? 8 : 0;
                return (
                  <div
                    key={post.post_url}
                    onMouseEnter={() => setPausedCol(colIdx)}
                    onMouseLeave={() => setPausedCol(null)}
                    style={{
                      transform: backgroundMode ? `rotate(${rotateDeg}deg)` : undefined,
                      marginBottom: marginB,
                    }}
                  >
                    <PostCard post={post} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* Đưa observer ra ngoài flex, luôn căn giữa */}
      <div ref={observerRef} className="h-12 mt-4 flex justify-center items-center w-full">
        {hasMore ? (
          <span className="animate-pulse text-gray-500">🔄 Đang tải thêm...</span>
        ) : (
          <span></span>
        )}
      </div>
      <style jsx global>{`
        @keyframes floatCol {
          0% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
