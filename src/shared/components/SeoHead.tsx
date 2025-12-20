import { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'product';
  price?: number;
  currency?: string;
}

export const SeoHead = ({ 
  title, 
  description, 
  image, 
  url = window.location.href, 
  type = 'website',
  price,
  currency = 'ARS'
}: SeoHeadProps) => {

  const siteName = "Arcoiris";
  const defaultImage = "https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/logo_comercio_v2.png"; 
  const finalImage = image || defaultImage;
  const fullTitle = `${title} | ${siteName}`;

  // --- NUEVO: Limpiador de duplicados para Lazy Loading ---
  useEffect(() => {
    // 1. Forzar el título en el navegador inmediatamente
    document.title = fullTitle;

    // 2. Buscar si hay etiquetas <title> duplicadas en el DOM y borrarlas
    const titles = document.querySelectorAll('title');
    if (titles.length > 1) {
      titles.forEach((t) => {
        // Si el contenido del tag no es igual al título actual, bórralo
        if (t.innerText !== fullTitle) {
          t.remove();
        }
      });
    }
  }, [fullTitle]); // Se ejecuta cada vez que cambia el título
  // --------------------------------------------------------

  return (
    <>
      <title key="title">{fullTitle}</title>
      
      <meta key="description" name="description" content={description} />
      <link key="canonical" rel="canonical" href={url} />

      {/* Open Graph */}
      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:title" property="og:title" content={fullTitle} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:url" property="og:url" content={url} />
      <meta key="og:site_name" property="og:site_name" content={siteName} />
      <meta key="og:image" property="og:image" content={finalImage} />

      {/* Twitter */}
      <meta key="tw:card" name="twitter:card" content="summary_large_image" />
      <meta key="tw:title" name="twitter:title" content={fullTitle} />
      <meta key="tw:desc" name="twitter:description" content={description} />
      <meta key="tw:img" name="twitter:image" content={finalImage} />

      {/* JSON-LD */}
      {type === 'product' && price && (
        <>
          <meta key="product:price" property="product:price:amount" content={price.toString()} />
          <meta key="product:currency" property="product:price:currency" content={currency} />
          
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": title,
              "image": [finalImage],
              "description": description,
              "offers": {
                "@type": "Offer",
                "url": url,
                "priceCurrency": currency,
                "price": price,
                "availability": "https://schema.org/InStock" 
              }
            })}
          </script>
        </>
      )}
    </>
  );
};