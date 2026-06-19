'use client';

import { useMutation } from '@tanstack/react-query';
import uploadService from '@/services/upload.service';

export function useUploadSignature() {
  return useMutation({
    mutationFn: (folder: string) => uploadService.getSignature(folder),
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => uploadService.upload(file),
  });
}

export function usePersistUpload() {
  return useMutation({
    mutationFn: (payload: { secureUrl: string; publicId: string; alt?: string; sortOrder?: number }) =>
      uploadService.persist(payload),
  });
}
