/**
 * Base API service for making HTTP requests
 * This centralized service handles all API requests to the backend
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Base URL of the API - would typically come from environment variables in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    // Handle server errors with custom message
    if (response?.status && response.status >= 500) {
      console.error('Server error:', error);
      // You could dispatch to a notification system here
    }
    
    return Promise.reject(error);
  }
);

// Generic request method
const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

// Typed convenience methods for different HTTP methods
export const apiService = {
  get: <T>(url: string, params?: any): Promise<T> => 
    request<T>({ method: 'GET', url, params }),
  
  post: <T>(url: string, data?: any): Promise<T> => 
    request<T>({ method: 'POST', url, data }),
  
  put: <T>(url: string, data?: any): Promise<T> => 
    request<T>({ method: 'PUT', url, data }),
  
  patch: <T>(url: string, data?: any): Promise<T> => 
    request<T>({ method: 'PATCH', url, data }),
  
  delete: <T>(url: string): Promise<T> => 
    request<T>({ method: 'DELETE', url }),
};

export default apiService;
