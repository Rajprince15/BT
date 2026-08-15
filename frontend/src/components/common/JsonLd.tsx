interface JsonLdProps {
  id?: string;
  data: object;
}

export default function JsonLd({ id, data }: JsonLdProps) {
  return (
    <script
      key={id}
      type="application/ld+json"
      // Injected schema.org JSON-LD, safely serialised.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
