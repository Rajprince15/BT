import api from '@/lib/api';
import env from '@/lib/env';
import { categories } from '@/mocks/categories.mock';
import { products } from '@/mocks/products.mock';
import { useMockService } from '@/services/_mock-runtime';

function escapePdf(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, ' ');
}

function wrap(value: string, width: number): string[] {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let line = '';

  words.forEach((word) => {
    if (`${line} ${word}`.trim().length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  });

  if (line) {
    lines.push(line);
  }

  return lines.slice(0, 2);
}

function createMockCatalogue(): Blob {
  const categoryName = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  const grouped = new Map<string, typeof products>();

  products.forEach((product) => {
    const name = categoryName.get(product.categoryId) ?? 'Textiles';

    grouped.set(name, [
      ...(grouped.get(name) ?? []),
      product,
    ]);
  });

  const pages: string[][] = [[]];

  const push = (line: string) => {
    if (pages[pages.length - 1].length >= 20) {
      pages.push([]);
    }

    pages[pages.length - 1].push(line);
  };

  grouped.forEach((items, name) => {
    push(`CATEGORY|${name}`);

    items.forEach((product) => {
      push(
        `PRODUCT|${product.name}|${product.price}|${
          product.specification ??
          product.shortDescription ??
          'Premium home textile for wholesale supply.'
        }|${product.sku || 'Available on enquiry'}`,
      );
    });
  });

  const objects: string[] = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [PLACEHOLDER] /Count 0 >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>',
  ];

  const pageIds: number[] = [];

  pages.forEach((lines, pageIndex) => {
    const stream: string[] = [
      'q',
      '0.047 0.22 0.196 rg',
      '0 0 595 842 re f',
      'Q',
      'BT',
      '/F2 34 Tf',
      '0.94 0.90 0.80 rg',
      '48 790 Td',
      '(BT) Tj',
      '/F2 22 Tf',
      '0.68 0.51 0.28 rg',
      '58 0 Td',
      '(BHAVITA TEXTILES) Tj',
      '/F1 10 Tf',
      '0 -18 Td',
      '0.94 0.90 0.80 rg',
      '(WHOLESALE CATALOGUE  |  WOVEN WITH TRADITION) Tj',
      '0 -32 Td',
    ];

    if (pageIndex === 0) {
      stream.push(
        '/F2 30 Tf',
        '0.94 0.90 0.80 rg',
        '(A living catalogue) Tj',
        '/F1 11 Tf',
        '0 -22 Td',
        '(Current selection for wholesale partners across India and beyond.) Tj',
        '0 -35 Td',
      );
    }

    lines.forEach((line) => {
      const [kind, name, price, description, sku] = line.split('|');

      if (kind === 'CATEGORY') {
        stream.push(
          '/F2 18 Tf',
          '0.68 0.51 0.28 rg',
          `(${escapePdf(name)}) Tj`,
          '/F1 8 Tf',
          '0 -20 Td',
        );
      } else {
        const copy = wrap(description, 84);

        stream.push(
          '/F2 12 Tf',
          '0.16 0.15 0.13 rg',
          `(${escapePdf(name)}) Tj`,
          '/F1 8 Tf',
          '0 -15 Td',
          `(${escapePdf(copy[0] ?? '')}) Tj`,
          '0 -11 Td',
          `(${escapePdf(copy[1] ?? '')}) Tj`,
          '/F2 11 Tf',
          '0.68 0.51 0.28 rg',
          '0 -15 Td',
          `(${escapePdf(
            `Rs ${Number(price).toLocaleString('en-IN')}`,
          )}) Tj`,
          '/F1 7 Tf',
          '0 -12 Td',
          '0.44 0.41 0.35 rg',
          `(${escapePdf(`SKU ${sku}`)}) Tj`,
          '0 -20 Td',
        );
      }
    });

    stream.push(
      '/F1 8 Tf',
      '0.94 0.90 0.80 rg',
      `48 28 Td (Bhavita Textiles  |  ${pageIndex + 1} / ${pages.length}) Tj`,
      'ET',
    );

    const content = stream.join('\n');
    const contentId = objects.length + 1;

    objects.push(
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    );

    const pageId = objects.length + 1;

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`,
    );

    pageIds.push(pageId);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageIds
    .map((id) => `${id} 0 R`)
    .join(' ')}] /Count ${pageIds.length} >>`;

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets[index + 1] = pdf.length;
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xref = pdf.length;

  pdf += `xref
0 ${objects.length + 1}
0000000000 65535 f 
${offsets
  .slice(1)
  .map(
    (offset) => `${String(offset).padStart(10, '0')} 00000 n `,
  )
  .join('\n')}
trailer
<< /Size ${objects.length + 1} /Root 1 0 R >>
startxref
${xref}
%%EOF`;

  return new Blob([pdf], {
    type: 'application/pdf',
  });
}

export async function downloadCatalogue(): Promise<Blob> {
  if (useMockService) {
    return createMockCatalogue();
  }

  const response = await api.get<Blob>('/products/catalogue.pdf', {
    responseType: 'blob',
    headers: {
      Accept: 'application/pdf',
    },
  });

  return response.data;
}

export function catalogueApiUrl(): string {
  return `${env.NEXT_PUBLIC_API_URL.replace(
    /\/+$/,
    '',
  )}/products/catalogue.pdf`;
}
