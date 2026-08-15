'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadFile, usePersistUpload } from '@/hooks/useUploads';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export interface UploadedAsset {
  secureUrl: string;
  publicId: string;
  alt?: string;
  sortOrder?: number;
}

interface ImageUploaderProps {
  value: UploadedAsset[];
  onChange: (assets: UploadedAsset[]) => void;
  folder?: string;
  max?: number;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = 'bhavita/products',
  max = 10,
  label = 'Upload images',
}: ImageUploaderProps) {
  const uploadFile = useUploadFile();
  const persist = usePersistUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (value.length + files.length > max) {
      toast.error(`You can upload up to ${max} images.`);
      return;
    }
    setBusy(true);
    try {
      const next: UploadedAsset[] = [];
      for (const file of Array.from(files)) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`${file.name}: only JPG, PNG, WEBP, or AVIF are allowed.`);
          continue;
        }
        if (file.size > MAX_SIZE) {
          toast.error(`${file.name}: exceeds 5 MB limit.`);
          continue;
        }
        const uploaded = await uploadFile.mutateAsync(file);
        const persisted = await persist.mutateAsync({
          secureUrl: uploaded.secureUrl,
          publicId: uploaded.publicId,
          alt: file.name,
          sortOrder: value.length + next.length,
        });
        next.push({
          secureUrl: uploaded.secureUrl,
          publicId: uploaded.publicId,
          alt: (persisted as { alt?: string }).alt ?? file.name,
          sortOrder: value.length + next.length,
        });
      }
      if (next.length) {
        onChange([...value, ...next]);
        toast.success(`${next.length} image${next.length === 1 ? '' : 's'} uploaded.`);
      }
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div data-testid="image-uploader" className="grid gap-4">
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        multiple
        hidden
        data-testid="image-uploader-input"
        onChange={(event: ChangeEvent<HTMLInputElement>) => handleFiles(event.target.files)}
        aria-label={label}
        title={label}
        data-folder={folder}
      />

      <button
        type="button"
        data-testid="image-uploader-trigger"
        onClick={() => inputRef.current?.click()}
        disabled={busy || value.length >= max}
        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-bg/60 py-10 text-sm text-ink-2 transition-colors hover:border-gold disabled:opacity-50"
      >
        <UploadCloud className="size-8 text-gold" />
        <span className="font-semibold text-ink">{busy ? 'Uploading…' : label}</span>
        <span className="text-xs">JPG · PNG · WEBP · AVIF · up to 5 MB · {value.length}/{max}</span>
      </button>

      {value.length > 0 ? (
        <ul data-testid="image-uploader-list" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {value.map((asset, idx) => (
            <li key={asset.publicId + idx} data-testid={`image-uploader-item-${idx}`} className="relative overflow-hidden rounded-lg border border-border bg-surface">
              <div className="relative aspect-square">
                <Image src={asset.secureUrl} alt={asset.alt ?? ''} fill sizes="200px" className="object-cover" unoptimized />
              </div>
              <button
                type="button"
                data-testid={`image-uploader-remove-${idx}`}
                onClick={() => onChange(value.filter((_, i) => i !== idx))}
                aria-label="Remove image"
                className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-bg/90 text-danger transition-colors hover:bg-danger hover:text-bg"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
