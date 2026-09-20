import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

/* ───────────────────────── types ───────────────────────── */

export type CatalogueProduct = {
  id: string | number;
  name: string;
  price: number | string;
  description: string;
  sku?: string;
  /** JPEG/PNG data URL (already fetched + converted by the service) */
  image: string | null;
};

export type CatalogueCategory = {
  id: string | number;
  name: string;
  products: CatalogueProduct[];
};

export type CatalogueProps = {
  categories: CatalogueCategory[];
  logo: string | null;
  siteUrl: string;
  year: number;
};

/* ───────────────────────── theme ───────────────────────── */

const C = {
  green: '#0C382E',
  greenDeep: '#082B23',
  gold: '#AD8247',
  goldLight: '#D6B98A',
  cream: '#F9F4EC',
  creamAlt: '#F1E8DA',
  ink: '#2A2620',
  muted: '#706958',
  white: '#FFFFFF',
};

const SERIF = 'Times-Roman';
const SERIF_BOLD = 'Times-Bold';
const SERIF_ITALIC = 'Times-Italic';
const SANS = 'Helvetica';
const SANS_BOLD = 'Helvetica-Bold';

const s = StyleSheet.create({
  page: { backgroundColor: C.cream, fontFamily: SANS, color: C.ink },
  darkPage: { backgroundColor: C.green, fontFamily: SANS, color: C.cream },

  /* cover */
  frame: {
    position: 'absolute',
    top: 22,
    left: 22,
    right: 22,
    bottom: 22,
    borderWidth: 0.8,
    borderColor: C.gold,
  },
  frameInner: {
    position: 'absolute',
    top: 28,
    left: 28,
    right: 28,
    bottom: 28,
    borderWidth: 0.4,
    borderColor: C.gold,
    opacity: 0.6,
  },
  coverBody: { flex: 1, alignItems: 'center', paddingTop: 70 },
  coverLogo: { width: 190, height: 110, objectFit: 'contain' },
  eyebrow: {
    fontFamily: SANS_BOLD,
    fontSize: 9,
    letterSpacing: 4,
    color: C.gold,
    textTransform: 'uppercase',
  },
  coverTitle: {
    fontFamily: SERIF,
    fontSize: 46,
    letterSpacing: 5,
    color: C.cream,
    marginTop: 10,
  },
  coverTag: {
    fontFamily: SERIF_ITALIC,
    fontSize: 15,
    color: C.goldLight,
    marginTop: 12,
  },
  goldRule: { width: 46, height: 1.2, backgroundColor: C.gold, marginVertical: 14 },
  collage: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 44 },
  collageItem: {
    width: 150,
    height: 210,
    borderWidth: 3,
    borderColor: C.gold,
    marginHorizontal: 7,
  },
  collageMid: { height: 250 },
  coverFoot: {
    position: 'absolute',
    bottom: 52,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  coverFootText: {
    fontSize: 8,
    letterSpacing: 3,
    color: C.goldLight,
    textTransform: 'uppercase',
  },

  /* welcome page */
  welcomeWrap: { paddingHorizontal: 48, paddingTop: 56 },
  h1: { fontFamily: SERIF, fontSize: 34, color: C.ink, marginTop: 8 },
  lead: { fontSize: 10.5, lineHeight: 1.7, color: C.muted, marginTop: 12, maxWidth: 420 },
  featGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 26 },
  feat: {
    width: '50%',
    paddingRight: 18,
    paddingBottom: 18,
  },
  featNum: { fontFamily: SERIF, fontSize: 24, color: C.gold },
  featTitle: {
    fontFamily: SANS_BOLD,
    fontSize: 9.5,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  featCopy: { fontSize: 9, lineHeight: 1.55, color: C.muted, marginTop: 4 },
  statBand: {
    backgroundColor: C.green,
    flexDirection: 'row',
    marginHorizontal: 48,
    marginTop: 8,
    paddingVertical: 16,
  },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontFamily: SERIF_BOLD, fontSize: 15, color: C.goldLight },
  statLabel: {
    fontSize: 6.5,
    letterSpacing: 1.5,
    color: C.cream,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  tocWrap: { paddingHorizontal: 48, marginTop: 30 },
  tocRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: C.goldLight,
  },
  tocIdx: { fontFamily: SERIF, fontSize: 13, color: C.gold, width: 30 },
  tocName: { fontFamily: SERIF, fontSize: 13, flex: 1 },
  tocCount: { fontSize: 8, color: C.muted, letterSpacing: 1, textTransform: 'uppercase' },

  /* divider page */
  divLeft: { width: '46%', justifyContent: 'center', paddingLeft: 52, paddingRight: 24 },
  divRight: { width: '54%' },
  divIdx: { fontFamily: SERIF, fontSize: 64, color: C.gold, opacity: 0.9 },
  divName: { fontFamily: SERIF, fontSize: 34, lineHeight: 1.1, color: C.cream, marginTop: 6 },
  divCount: {
    fontSize: 8.5,
    letterSpacing: 3,
    color: C.goldLight,
    textTransform: 'uppercase',
  },

  /* content page shell */
  topBar: {
    height: 54,
    backgroundColor: C.green,
    paddingHorizontal: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLogo: { height: 30, width: 120, objectFit: 'contain', objectPosition: 'left center' },
  topBrand: { fontFamily: SERIF, fontSize: 13, letterSpacing: 2, color: C.goldLight },
  topTitle: { fontFamily: SANS_BOLD, fontSize: 8, letterSpacing: 3, color: C.gold },
  content: { paddingHorizontal: 36, paddingTop: 26 },
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: C.goldLight,
    paddingTop: 7,
  },
  footerText: { fontSize: 7, letterSpacing: 1.5, color: C.muted },

  /* price */
  pill: { backgroundColor: C.gold, paddingVertical: 4, paddingHorizontal: 9 },
  pillText: { fontFamily: SANS_BOLD, fontSize: 10, color: C.white },
  enquire: { fontSize: 7, letterSpacing: 1.5, color: C.gold, textTransform: 'uppercase' },

  /* layout A: 2 x 2 cards */
  gridA: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardA: {
    width: 254,
    backgroundColor: C.white,
    borderWidth: 0.5,
    borderColor: C.goldLight,
    marginBottom: 16,
  },
  cardAImg: { width: "100%", height: 205 },
  cardABody: { padding: 12 },
  nameA: { fontFamily: SERIF_BOLD, fontSize: 13, lineHeight: 1.15 },
  descA: { fontSize: 8, lineHeight: 1.5, color: C.muted, marginTop: 5, height: 36 },
  rowEnd: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },

  /* layout B: alternating showcase rows */
  rowB: { height: 216, marginBottom: 14, alignItems: 'center' },
  rowBImg: { width: 240, height: 216, borderWidth: 3, borderColor: C.white },
  rowBText: { flex: 1, paddingHorizontal: 22 },
  numB: { fontFamily: SERIF, fontSize: 30, color: C.gold },
  nameB: { fontFamily: SERIF_BOLD, fontSize: 16, lineHeight: 1.15, marginTop: 2 },
  ruleB: { width: 30, height: 1.2, backgroundColor: C.gold, marginVertical: 8 },
  descB: { fontSize: 8.5, lineHeight: 1.6, color: C.muted },
  priceB: { fontFamily: SERIF_BOLD, fontSize: 20, color: C.green, marginTop: 10 },
  priceNote: { fontSize: 7, letterSpacing: 1.5, color: C.gold, textTransform: 'uppercase', marginTop: 3 },

  /* layout C: 3 column portrait cards */
  gridC: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardC: { width: 165, marginBottom: 18 },
  cardCImg: { width: "100%", height: 235 },
  nameC: { fontFamily: SERIF_BOLD, fontSize: 11, lineHeight: 1.2, marginTop: 8, height: 26 },
  descC: { fontSize: 7.5, lineHeight: 1.45, color: C.muted, marginTop: 3, height: 32 },
  priceC: { fontFamily: SANS_BOLD, fontSize: 10.5, color: C.gold, marginTop: 5 },

  /* closing */
  closeWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 70 },
  closeH: { fontFamily: SERIF, fontSize: 34, textAlign: 'center', lineHeight: 1.15, color: C.cream },
  closeP: { fontSize: 10.5, lineHeight: 1.7, textAlign: 'center', color: C.goldLight, marginTop: 14 },
  cta: { backgroundColor: C.gold, paddingVertical: 12, paddingHorizontal: 26, marginTop: 26 },
  ctaText: { fontFamily: SANS_BOLD, fontSize: 9.5, letterSpacing: 2.5, color: C.white, textTransform: 'uppercase' },
  url: { fontSize: 9, color: C.goldLight, marginTop: 14, letterSpacing: 1 },
});

/* ───────────────────────── helpers ───────────────────────── */

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function priceLabel(p: CatalogueProduct): string {
  const n = Number(p.price);
  const base = Number.isFinite(n) ? `Rs ${n.toLocaleString('en-IN')}` : String(p.price);
  const d = p.description;
  const unit = /\/\s*kg/i.test(d) ? ' / kg' : /\/\s*pc/i.test(d) ? ' / pc' : '';
  return base + unit;
}

const pad = (n: number) => String(n).padStart(2, '0');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Photo({ src, style }: { src: string | null; style: any }) {
  if (src) return <Image src={src} style={{ ...style, objectFit: 'cover' }} />;
  return (
    <View
      style={{
        ...style,
        backgroundColor: C.creamAlt,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontFamily: SERIF, fontSize: 30, color: C.gold }}>BT</Text>
    </View>
  );
}

function TopBar({ logo, title }: { logo: string | null; title: string }) {
  return (
    <View style={s.topBar}>
      {logo ? (
        <Image src={logo} style={s.topLogo} />
      ) : (
        <Text style={s.topBrand}>BHAVITA TEXTILES</Text>
      )}
      <Text style={s.topTitle}>{title.toUpperCase()}</Text>
    </View>
  );
}

function Footer() {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>BHAVITA TEXTILES  ·  WHOLESALE CATALOGUE</Text>
      <Text
        style={s.footerText}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

function Price({ p }: { p: CatalogueProduct }) {
  return (
    <View style={s.pill}>
      <Text style={s.pillText}>{priceLabel(p)}</Text>
    </View>
  );
}

/* ───────────────────────── product layouts ───────────────────────── */

function LayoutA({ items }: { items: CatalogueProduct[] }) {
  return (
    <View style={s.gridA}>
      {items.map((p) => (
        <View key={p.id} style={s.cardA} wrap={false}>
          <Photo src={p.image} style={s.cardAImg} />
          <View style={s.cardABody}>
            <Text style={s.nameA}>{p.name}</Text>
            <Text style={s.descA}>{p.description}</Text>
            <View style={s.rowEnd}>
              <Price p={p} />
              <Text style={s.enquire}>Bulk rates on request</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function LayoutB({ items, start }: { items: CatalogueProduct[]; start: number }) {
  return (
    <View>
      {items.map((p, i) => {
        const flip = (start + i) % 2 === 1;
        return (
          <View
            key={p.id}
            wrap={false}
            style={[
              s.rowB,
              { flexDirection: flip ? 'row-reverse' : 'row' },
              (start + i) % 2 === 1 ? { backgroundColor: C.creamAlt } : {},
            ]}
          >
            <Photo src={p.image} style={s.rowBImg} />
            <View style={s.rowBText}>
              <Text style={s.numB}>{pad(start + i + 1)}</Text>
              <Text style={s.nameB}>{p.name}</Text>
              <View style={s.ruleB} />
              <Text style={s.descB}>{p.description}</Text>
              <Text style={s.priceB}>{priceLabel(p)}</Text>
              <Text style={s.priceNote}>Wholesale · enquire for bulk rates</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function LayoutC({ items }: { items: CatalogueProduct[] }) {
  return (
    <View style={s.gridC}>
      {items.map((p) => (
        <View key={p.id} style={s.cardC} wrap={false}>
          <Photo src={p.image} style={s.cardCImg} />
          <Text style={s.nameC}>{p.name}</Text>
          <Text style={s.descC}>{p.description}</Text>
          <Text style={s.priceC}>{priceLabel(p)}</Text>
        </View>
      ))}
    </View>
  );
}

const LAYOUTS = [
  { size: 4, kind: 'A' as const },
  { size: 3, kind: 'B' as const },
  { size: 6, kind: 'C' as const },
];

/* ───────────────────────── document ───────────────────────── */

export default function CatalogueDocument({
  categories,
  logo,
  siteUrl,
  year,
}: CatalogueProps) {
  const cats = categories.filter((c) => c.products.length > 0);
  const collage = cats
    .map((c) => c.products.find((p) => p.image)?.image ?? null)
    .filter((x): x is string => Boolean(x))
    .slice(0, 3);
  const total = cats.reduce((n, c) => n + c.products.length, 0);

  return (
    <Document
      title="Bhavita Textiles Wholesale Catalogue"
      author="Bhavita Textiles"
      subject="Wholesale home textiles"
    >
      {/* COVER */}
      <Page size="A4" style={s.darkPage}>
        <View style={s.frame} />
        <View style={s.frameInner} />
        <View style={s.coverBody}>
          {logo ? <Image src={logo} style={s.coverLogo} /> : (
            <Text style={{ fontFamily: SERIF, fontSize: 60, color: C.gold }}>BT</Text>
          )}
          <View style={s.goldRule} />
          <Text style={s.eyebrow}>Wholesale</Text>
          <Text style={s.coverTitle}>CATALOGUE</Text>
          <Text style={s.coverTag}>Woven with tradition. Made for elegance.</Text>

          {collage.length > 0 && (
            <View style={s.collage}>
              {collage.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  style={{
                    ...s.collageItem,
                    ...(collage.length === 3 && i === 1 ? s.collageMid : {}),
                    objectFit: 'cover',
                  }}
                />
              ))}
            </View>
          )}
        </View>
        <View style={s.coverFoot}>
          <Text style={s.coverFootText}>Bhavita Textiles  ·  Collection {year}</Text>
        </View>
      </Page>

      {/* WELCOME + CONTENTS */}
      <Page size="A4" style={s.page}>
        <TopBar logo={logo} title="Welcome" />
        <View style={s.welcomeWrap}>
          <Text style={s.eyebrow}>Why Bhavita Textiles</Text>
          <Text style={s.h1}>Premium home textiles,{'\n'}delivered at scale.</Text>
          <Text style={s.lead}>
            Indian roots, global reach. We bring together the richness of Indian
            heritage and modern manufacturing to supply hotels, resorts,
            hospitals, retailers and interior designers with textiles they can
            rely on, order after order.
          </Text>

          <View style={s.featGrid}>
            {[
              ['01', 'Premium quality', 'Strict quality control at every stage of production.'],
              ['02', 'Bulk manufacturing', 'Large-scale production with timely delivery.'],
              ['03', 'Customisation', 'Sizes, designs, labels and packaging made to your brand.'],
              ['04', 'Pan India & global', 'A dependable supply network across India and abroad.'],
            ].map(([n, t, c]) => (
              <View key={n} style={s.feat}>
                <Text style={s.featNum}>{n}</Text>
                <Text style={s.featTitle}>{t}</Text>
                <Text style={s.featCopy}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.statBand}>
          {[
            ['500+', 'Business clients'],
            [`${total}`, 'Designs inside'],
            ['PAN INDIA', 'Supply network'],
            ['EXPORT', 'Ready'],
          ].map(([v, l]) => (
            <View key={l} style={s.stat}>
              <Text style={s.statVal}>{v}</Text>
              <Text style={s.statLabel}>{l}</Text>
            </View>
          ))}
        </View>

        <View style={s.tocWrap}>
          <Text style={s.eyebrow}>Inside this catalogue</Text>
          <View style={{ marginTop: 8 }}>
            {cats.map((c, i) => (
              <View key={c.id} style={s.tocRow}>
                <Text style={s.tocIdx}>{pad(i + 1)}</Text>
                <Text style={s.tocName}>{c.name}</Text>
                <Text style={s.tocCount}>{c.products.length} designs</Text>
              </View>
            ))}
          </View>
        </View>
        <Footer />
      </Page>

      {/* CATEGORIES */}
      {cats.flatMap((cat, ci) => {
        const layout = LAYOUTS[ci % LAYOUTS.length];
        const hero = cat.products.find((p) => p.image)?.image ?? null;
        const pages = chunk(cat.products, layout.size);

        const divider = (
          <Page key={`d-${cat.id}`} size="A4" style={{ ...s.darkPage, flexDirection: 'row' }}>
            <View style={s.divLeft}>
              <Text style={s.divIdx}>{pad(ci + 1)}</Text>
              <View style={s.goldRule} />
              <Text style={s.divName}>{cat.name}</Text>
              <Text style={{ ...s.divCount, marginTop: 14 }}>
                {cat.products.length} designs
              </Text>
            </View>
            <View style={s.divRight}>
              <Photo src={hero} style={{ width: '100%', height: '100%' }} />
            </View>
          </Page>
        );

        const productPages = pages.map((items, pi) => (
          <Page key={`p-${cat.id}-${pi}`} size="A4" style={s.page}>
            <TopBar logo={logo} title={cat.name} />
            <View style={s.content}>
              {layout.kind === 'A' && <LayoutA items={items} />}
              {layout.kind === 'B' && <LayoutB items={items} start={pi * layout.size} />}
              {layout.kind === 'C' && <LayoutC items={items} />}
            </View>
            <Footer />
          </Page>
        ));

        return [divider, ...productPages];
      })}

      {/* CLOSING */}
      <Page size="A4" style={s.darkPage}>
        <View style={s.frame} />
        <View style={s.closeWrap}>
          {logo && <Image src={logo} style={{ width: 150, height: 90, objectFit: 'contain' }} />}
          <View style={s.goldRule} />
          <Text style={s.eyebrow}>Quality · Partnership · Growth</Text>
          <Text style={{ ...s.closeH, marginTop: 12 }}>
            Let&apos;s build something{'\n'}beautiful together
          </Text>
          <Text style={s.closeP}>
            Bulk orders, custom sizes, designs, labels and packaging. Tell us what
            you need and we will send pricing and samples.
          </Text>
          <Link src={`${siteUrl}/wholesale`} style={s.cta}>
            <Text style={s.ctaText}>Get a wholesale quote</Text>
          </Link>
          <Text style={s.url}>{siteUrl.replace(/^https?:\/\//, '')}</Text>
        </View>
      </Page>
    </Document>
  );
}