import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import { simulateLatency, useMockService } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'patch' = 'get') {
  const response = await api.request<ApiResponse<T>>({ url: path, method, data: payload });
  if (!response.data.success) throw new Error(response.data.error.message);
  return response.data.data;
}

export interface AdminSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  currency: 'INR';
  shippingFlatRate: number;
  freeShippingThreshold: number;
  taxRate: number; // 0–1
  razorpayEnabled: boolean;
  codEnabled: boolean;
  maintenanceMode: boolean;
}

let settings: AdminSettings = {
  siteName: 'Bhavita Textiles',
  contactEmail: 'hello@bhavitatextiles.com',
  contactPhone: '+91-9810000000',
  currency: 'INR',
  shippingFlatRate: 150,
  freeShippingThreshold: 5000,
  taxRate: 0.05,
  razorpayEnabled: true,
  codEnabled: true,
  maintenanceMode: false,
};

export const adminSettingsService = {
  async get(): Promise<AdminSettings> {
    if (useMockService) {
      await simulateLatency();
      return { ...settings };
    }
    return callApi<AdminSettings>('/admin/settings');
  },

  async update(payload: Partial<AdminSettings>): Promise<AdminSettings> {
    if (useMockService) {
      await simulateLatency();
      settings = { ...settings, ...payload };
      return { ...settings };
    }
    return callApi<AdminSettings>('/admin/settings', payload, 'patch');
  },
};

export default adminSettingsService;
