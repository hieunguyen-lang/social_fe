import { SearchPostResult } from '../types';

const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8002'
    : 'http://45.32.104.37:8002';

const API_URL = `${API_BASE_URL}/seacrhsocial`;
export const searchSocialPost = async (queryParams?: string) => {
    const url = queryParams 
    ? `${API_URL}/?keyword=${queryParams}`
    : API_URL;
          
    const response = await fetch(url, {
        credentials: 'include', // ✅ Thêm dòng này để gửi cookie
    });
    if (!response.ok) throw new Error('Lấy danh bài viết thất bại');
    return response.json();
};   