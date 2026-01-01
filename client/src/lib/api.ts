import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

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
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data: { full_name?: string; email?: string }) =>
    api.put('/auth/profile', data),
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.put('/auth/password', data),
  logout: () => api.post('/auth/logout'),
};

// Content API
export const contentApi = {
  getAll: () => api.get('/content/all'),
  getHero: () => api.get('/content/hero'),
  updateHero: (data: any) => api.put('/content/hero', data),
  getAbout: () => api.get('/content/about'),
  updateAbout: (data: any) => api.put('/content/about', data),
  getContact: () => api.get('/content/contact'),
  updateContact: (data: any) => api.put('/content/contact', data),
  getFooter: () => api.get('/content/footer'),
  updateFooter: (data: any) => api.put('/content/footer', data),
};

// Services API
export const servicesApi = {
  getSection: () => api.get('/services/section'),
  updateSection: (data: any) => api.put('/services/section', data),
  getAll: () => api.get('/services'),
  getActive: () => api.get('/services/active'),
  getOne: (id: number) => api.get(`/services/${id}`),
  create: (data: any) => api.post('/services', data),
  update: (id: number, data: any) => api.put(`/services/${id}`, data),
  delete: (id: number) => api.delete(`/services/${id}`),
  reorder: (orders: { id: number; display_order: number }[]) =>
    api.put('/services/reorder', { orders }),
};

// Settings API
export const settingsApi = {
  getAll: () => api.get('/settings'),
  getByCategory: (category: string) => api.get(`/settings/category/${category}`),
  get: (key: string) => api.get(`/settings/${key}`),
  update: (key: string, data: any) => api.put(`/settings/${key}`, data),
  bulkUpdate: (settings: any[]) => api.put('/settings', { settings }),
  delete: (key: string) => api.delete(`/settings/${key}`),
  getDashboardStats: () => api.get('/settings/dashboard/stats'),
  getActivityLogs: (params?: { limit?: number; offset?: number }) =>
    api.get('/settings/logs/activity', { params }),
  getContactSubmissions: (params?: { limit?: number; offset?: number }) =>
    api.get('/settings/submissions/contact', { params }),
  markSubmissionRead: (id: number) =>
    api.put(`/settings/submissions/contact/${id}/read`),
};

// Upload API
export const uploadApi = {
  single: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  multiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: (params?: { limit?: number; offset?: number }) =>
    api.get('/upload', { params }),
  delete: (id: number) => api.delete(`/upload/${id}`),
};
