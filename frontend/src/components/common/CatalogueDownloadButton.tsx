'use client';

import { Download } from 'lucide-react';
import env from '@/lib/env';
import { products } from '@/mocks/products.mock';

function pdfEscape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/[^\x20-\x7E]/g, ' ');
}

function createMockCatalogue(): Blob {
  const lines = ['BHAVITA TEXTILES', 'WHOLESALE CATALOGUE', 'Woven with tradition. Delivered at scale.', '', ...products.flatMap((p) => [p.name, `Price: Rs ${p.price.toLocaleString('en-IN')}`, p.specification ?? p.shortDescription ?? 'Premium home textile for wholesale supply.', ''])];
  const pages = Array.from({ length: Math.max(1, Math.ceil(lines.length / 42)) }, (_, page) => lines.slice(page * 42, page * 42 + 42));
  const objects: string[] = [];
  const pageIds: number[] = [];
  objects.push('<< /Type /Catalog /Pages 2 0 R >>');
  objects.push('<< /Type /Pages /Kids [PLACEHOLDER] /Count 0 >>');
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  pages.forEach((pageLines) => {
    const content = ['BT', '/F1 16 Tf', '48 790 Td', '(BHAVITA TEXTILES) Tj', '0 -24 Td', '/F1 12 Tf', '(WHOLESALE CATALOGUE) Tj', '0 -30 Td', '/F1 9 Tf', ...pageLines.map((line) => `(${pdfEscape(line.slice(0, 105))}) Tj 0 -16 Td`), 'ET'].join('\n');
    const contentId = objects.length + 1;
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    const pageId = objects.length + 1;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  });
  objects[1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets[index + 1] = pdf.length; pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}

export default function CatalogueDownloadButton({ className = '' }: { className?: string }) {
  function download() {
    if (!env.NEXT_PUBLIC_USE_MOCKS) {
      window.location.href = `${env.NEXT_PUBLIC_API_URL}/products/catalogue.pdf`;
      return;
    }
    const url = URL.createObjectURL(createMockCatalogue());
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'bhavita-textiles-catalogue.pdf';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <button type="button" onClick={download} className={className}><Download className="mr-2 inline-block size-3" />Download catalogue</button>;
}
