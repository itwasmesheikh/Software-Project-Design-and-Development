import axios from 'axios';
import { User, Contractor, Service, Booking } from '../types';

const API_BASE_URL = process.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  },

  signup: async (userData: Partial<User>, password: string) => {
    const response = await api.post<{ user: User; token: string }>('/auth/signup', { ...userData, password });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// User services
export const userService = {
  updateProfile: async (userId: string, userData: Partial<User>) => {
    const response = await api.put<User>(`/users/${userId}`, userData);
    return response.data;
  },
};

// Booking services
export const bookingService = {
  getMyBookings: async () => {
    const response = await api.get<Booking[]>('/bookings/my-bookings');
    return response.data;
  },

  createBooking: async (bookingData: {
    contractorId: string;
    serviceId: string;
    scheduledDate: string;
    scheduledTime: string;
    location: string;
    additionalNotes?: string;
  }) => {
    const response = await api.post<Booking>('/bookings', bookingData);
    return response.data;
  },

  updateBookingStatus: async (bookingId: string, status: Booking['status']) => {
    const response = await api.patch<Booking>(`/bookings/${bookingId}/status`, { status });
    return response.data;
  },

  cancelBooking: async (bookingId: string) => {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  },
};

// Service services
export const serviceService = {
  getServices: async () => {
    const response = await api.get<Service[]>('/services');
    return response.data;
  },

  getServicesByCategory: async (category: string) => {
    const response = await api.get<Service[]>(`/services?category=${category}`);
    return response.data;
  },
};

// Contractor services
export const contractorService = {
  getContractors: async () => {
    const response = await api.get<Contractor[]>('/contractors');
    return response.data;
  },

  getContractorById: async (id: string) => {
    const response = await api.get<Contractor>(`/contractors/${id}`);
    return response.data;
  },

  updateContractorProfile: async (id: string, data: Partial<Contractor>) => {
    const response = await api.put<Contractor>(`/contractors/${id}`, data);
    return response.data;
  },
};