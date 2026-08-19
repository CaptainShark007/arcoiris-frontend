// Netlify Edge Function: inyecta metadatos Open Graph / Twitter en las
// páginas de producto (/tienda/:slug) para que, al compartir el link en
// WhatsApp, Facebook, etc., se muestre la imagen y el título del producto.
//
// Los SPA (React/Vite) inyectan los meta tags en runtime, pero los scrapers
// sociales no ejecutan JavaScript, por lo que leen el index.html estático.
// Esta función consulta el producto en Supabase y devuelve el HTML con los
// meta tags correctos antes de que el crawler lo reciba.
//
// Requiere configurar en Netlify (Site settings -> Environment variables):
//   SUPABASE_URL        -> URL del proyecto Supabase (ej. https://xxxx.supabase.co)
//   SUPABASE_ANON_KEY   -> anon/public key (ya es pública, se usa en el frontend)

interface VariantRow {
  price: number;
  original_price: number | null;
}

interface ProductRow {
  name: string;
  description: unknown;
  images: string[] | null;
  brand: string | null;
  variants: VariantRow[] | null;
}

const SITE_NAME = 'Arcoiris';

const DEFAULT_IMAGE =
  'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png';

// Extrae texto plano desde contenido Tiptap (JSON) o string/HTML.
const extractPlainText = (content: unknown): string => {
  if (!content) return '';
  if (typeof content === 'string') {
    return content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  if (typeof content === 'object') {
    const node = content as {
      type?: string;
      text?: string;
      content?: unknown[];
    };
    let text = '';
    if (node.type === 'text' && node.text) text += node.text + ' ';
    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        text += extractPlainText(child) + ' ';
      }
    }
    return text.replace(/\s+/g, ' ').trim();
  }
  return '';
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildMetaTags = (data: {
  title: string;
  description: string;
  image: string;
  url: string;
  price?: number;
  currency?: string;
}): string => {
  const { title, description, image, url, price, currency } = data;
  const ogTitle = escapeHtml(`${title} | ${SITE_NAME}`);
  const desc = escapeHtml(description.slice(0, 300));
  const img = escapeHtml(image);
  const u = escapeHtml(url);

  const tags = [
    `<title>${ogTitle}</title>`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${ogTitle}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:url" content="${u}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${ogTitle}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<meta name="description" content="${desc}" />`,
  ];

  if (price != null) {
    tags.push(
      `<meta property="product:price:amount" content="${price}" />`,
      `<meta property="product:price:currency" content="${currency ?? 'ARS'}" />`,
      `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: title,
        image: [image],
        description: description.slice(0, 300),
        offers: {
          '@type': 'Offer',
          url,
          priceCurrency: currency ?? 'ARS',
          price,
          availability: 'https://schema.org/InStock',
        },
      })}</script>`
    );
  }

  return tags.join('\n');
};

export default async function handler(
  request: Request,
  context: { next: () => Promise<Response> }
) {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/tienda\/([^/]+)\/?$/);
  if (!match) {
    return context.next();
  }
  const slug = decodeURIComponent(match[1]);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

  // Sin configuración de Supabase, dejamos que el SPA renderice la página.
  if (!supabaseUrl || !supabaseKey) {
    return context.next();
  }

  try {
    const api =
      `${supabaseUrl}/rest/v1/products` +
      `?select=name,description,images,brand,variants(price,original_price)` +
      `&slug=eq.${encodeURIComponent(slug)}` +
      `&is_active=eq.true` +
      `&is_deleted=eq.false` +
      `&variants.is_active=eq.true`;

    const res = await fetch(api, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) return context.next();

    const rows = (await res.json()) as ProductRow[];
    const product = rows[0];
    if (!product) return context.next();

    const plainDesc = extractPlainText(product.description).trim();
    const description =
      plainDesc ||
      `Comprá ${product.name}${product.brand ? ` de ${product.brand}` : ''} en ${SITE_NAME}. Tienda online.`;

    const image =
      product.images && product.images.length > 0
        ? product.images[0]
        : DEFAULT_IMAGE;

    const prices = (product.variants || [])
      .map((v) => v.price)
      .filter((p) => p > 0);
    const price = prices.length > 0 ? Math.min(...prices) : undefined;

    const meta = buildMetaTags({
      title: product.name,
      description,
      image,
      url: url.href,
      price,
      currency: 'ARS',
    });

    const response = await context.next();
    const original = await response.text();

    // Eliminar title y meta OG/Twitter previos para evitar duplicados.
    let html = original.replace(/<title>[\s\S]*?<\/title>/i, '');
    html = html.replace(
      /<meta[^>]+(property|name)="(og:|twitter:|description|product:)[^>]*>/gi,
      ''
    );

    const injected = html.replace('</head>', `${meta}\n</head>`);

    return new Response(injected, {
      status: response.status,
      headers: response.headers,
    });
  } catch {
    return context.next();
  }
}
