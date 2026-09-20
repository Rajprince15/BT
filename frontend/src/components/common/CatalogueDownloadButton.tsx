'use client';

import { Download } from 'lucide-react';
import { toast } from 'sonner';

import { downloadCatalogue } from '@/services/catalogue.service';

export default function CatalogueDownloadButton({
  className = '',
}: {
  className?: string;
}) {
  async function download() {
    try {
      const url = URL.createObjectURL(await downloadCatalogue());

      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'bhavita-textiles-catalogue.pdf';

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      toast.error(
        'The catalogue is temporarily unavailable. Please try again shortly.',
      );
    }
  }

  return (
    <button
      type="button"
      data-testid="download-catalogue-button"
      onClick={() => void download()}
      className={className}
    >
      <Download className="mr-2 inline-block size-3" />
      Download catalogue
    </button>
  );
}