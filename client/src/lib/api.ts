import axios from 'axios';

// For production, use /admin/api as base URL (PHP backend)
const API_URL = import.meta.env.VITE_API_URL || '/admin/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Content API - Direct PHP endpoint calls
export const contentApi = {
  getHero: () => api.get('/hero.php'),
  updateHero: (data: any) => api.post('/hero.php', data),
  getAbout: () => api.get('/about.php'),
  updateAbout: (data: any) => api.post('/about.php', data),
  getContact: () => api.get('/contact.php'),
  updateContact: (data: any) => api.post('/contact.php', data),
};

// Services API - Direct PHP endpoint calls
export const servicesApi = {
  getAll: () => api.get('/services.php'),
  updateAll: (categories: any[]) => api.post('/services.php', { action: 'update_all', categories }),
};

// Settings API (placeholder - not connected yet)
export const settingsApi = {
  getDashboardStats: () => Promise.resolve({ data: { success: true, data: {} } }),
  getActivityLogs: () => Promise.resolve({ data: { success: true, data: [] } }),
  getContactSubmissions: () => Promise.resolve({ data: { success: true, data: [] } }),
};

// Upload API
export const uploadApi = {
  single: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload.php', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  multiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return api.post('/upload.php', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: (params?: { limit?: number; offset?: number }) =>
    api.get('/upload.php', { params }),
  delete: (id: number) => api.delete(`/upload.php?id=${id}`),
};
