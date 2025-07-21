import LoginPostCard from './LoginPostCard';
import { TablePostData } from '../types';

type Props = {
  posts: TablePostData[];
  rotate?: number;
  colCount?: number;
};

export default function LoginPostCardList({ posts, rotate = -15, colCount = 5 }: Props) {
  // Chia posts thành các cột
  const columns: TablePostData[][] = Array.from({ length: colCount }, () => []);
  posts.forEach((post, i) => {
    columns[i % colCount].push(post);
  });

  return (
    <div className="flex w-full gap-6 px-2 sm:px-4 md:px-8">
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="flex-1 flex flex-col">
          {col.map((post, idx) => (
            <LoginPostCard key={post.post_url} post={post} rotate={rotate} />
          ))}
        </div>
      ))}
    </div>
  );
} 