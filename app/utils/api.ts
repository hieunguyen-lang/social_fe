import axios from 'axios';

// Base URL for API calls
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8002"
    : "/api";
const TOKEN_KEY = 'access_token';
// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ Cho phép gửi cookie HttpOnly
  headers: {
    'Content-Type': 'application/json',
    credentials: 'include'
  },
});

// Optional: interceptor response nếu muốn xử lý 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'; // hoặc xử lý khác
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Authentication
  login: '/token',
  register: '/user/create_user',
  logout: '/auth/logout',
  
 
  
  analyticsData: '/analytics/data',
  performanceMetrics: '/performance/metrics',
  users: '/users',
  
  // Reports
  reports: '/reports',
  generateReport: '/reports/generate',
};

// API methods
export const apiService = {
  // Get methods
  get: (url: string, params = {}) => api.get(url, { params }),
  
  // Post methods
  post: (url: string, data = {}) => api.post(url, data),
  
  // Put methods
  put: (url: string, data = {}) => api.put(url, data),
  
  // Delete methods
  delete: (url: string) => api.delete(url),
  
  // Authentication methods
  login: (credentials: { username: string; password: string }) => 
    api.post(
      endpoints.login, 
      credentials,
      {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        
      },
      withCredentials: true
    }
    ),
  
  register: (userData: { username: string; email: string; password: string }) => 
    api.post(endpoints.register, userData),
  
  logout: () => api.post(endpoints.logout),
  


  // User methods
  getUsers: (params = {}) => api.get(endpoints.users, { params }),
  createUser: (userData: any) => api.post(endpoints.users, userData),
  updateUser: (id: string, userData: any) => api.put(`${endpoints.users}/${id}`, userData),
  deleteUser: (id: string) => api.delete(`${endpoints.users}/${id}`),
  

};

export default apiService; 