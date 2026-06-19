'use client';

import { useMutation } from '@tanstack/react-query';
import uploadService from '@/services/upload.service';

export function useUploadSignature() {
  return useMutation((folder: string) => uploadService.getSignature(folder));
}

export function useUploadFile() {
  return useMutation((file: File) => uploadService.upload(file));
}

export function usePersistUpload() {
  return useMutation((payload: { secureUrl: string; publicId: string; alt?: string; sortOrder?: number }) => uploadService.persist(payload));
}
