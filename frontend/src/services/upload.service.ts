import api from '@/lib/api';
import env from '@/lib/env';
import type { ApiResponse } from '@/types/api';
import type { ProductImage } from '@/types/ProductImage';
import { mockDelay, useMockService } from '@/services/_mock-runtime';

export interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  transformation?: string;
}

export interface UploadResult {
  secureUrl: string;
  publicId: string;
  originalFilename: string;
  metadata?: Record<string, unknown>;
}

async function callApi<T>(path: string, payload?: unknown) {
  const response = await api.request<ApiResponse<T>>({
    url: path,
    method: payload ? 'post' : 'get',
    data: payload,
  });
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  return response.data.data;
}

export const uploadService = {
  async getSignature(folder: string) {
    if (useMockService) {
      await mockDelay();
      return {
        signature: `mock-signature-${folder}`,
        timestamp: Math.floor(Date.now() / 1000),
        apiKey: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'mock_cloud',
        cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'mock_cloud',
        folder,
        transformation: 'f_auto,q_auto:good',
      };
    }
    return callApi<UploadSignature>(`/upload/signature?folder=${encodeURIComponent(folder)}`);
  },

  async upload(file: File) {
    if (useMockService) {
      await mockDelay();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Unable to read file'));
        reader.readAsDataURL(file);
      });
      return {
        secureUrl: dataUrl,
        publicId: `mock/${file.name}`,
        originalFilename: file.name,
      };
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Unable to read file'));
      reader.readAsDataURL(file);
    });
    return {
      secureUrl: dataUrl,
      publicId: `pending/${file.name}`,
      originalFilename: file.name,
    };
  },

  async persist(payload: { secureUrl: string; publicId: string; alt?: string; sortOrder?: number }) {
    if (useMockService) {
      await mockDelay();
      return {
        ...payload,
        id: `${payload.publicId}-${Date.now()}`,
      } as unknown as ProductImage;
    }
    return callApi<ProductImage>('/upload/persist', payload);
  },
};

export default uploadService;
