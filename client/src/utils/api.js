import axios from 'axios';

// Development-e localhost:5000 ar Production-e main domain nibe
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  res => res,
  err => {
    // Jodi Token expire hoye jay ba bhul thake
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      // Login page-e redirect korar agey check kora jeno loop na hoy
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;