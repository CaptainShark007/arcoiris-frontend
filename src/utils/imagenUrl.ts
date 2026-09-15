export const CDN = 'https://cdn.tiendaarcoiris.net';

const SUPABASE_STORAGE_PREFIX = '/storage/v1/object/public/';

const encodePath = (path: string): string =>
  path
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join('/');

const getPathFromUrl = (value: string, bucket: string): string | null => {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    return null;
  }

  const pathname = parsed.pathname;
  const cdnPrefix = `/${bucket}/`;
  const supabasePrefix = `${SUPABASE_STORAGE_PREFIX}${bucket}/`;

  if (parsed.origin === CDN && pathname.startsWith(cdnPrefix)) {
    return pathname.slice(cdnPrefix.length);
  }

  if (pathname.startsWith(supabasePrefix)) {
    return pathname.slice(supabasePrefix.length);
  }

  return null;
};

export function imagenUrl(bucket: string, path: string): string {
  const relativePath = getPathFromUrl(path, bucket) ?? path;

  if (/^[a-z][a-z\d+.-]*:\/\//i.test(relativePath)) {
    return relativePath;
  }

  return `${CDN}/${encodeURIComponent(bucket)}/${encodePath(relativePath)}`;
}

export function extractStoragePath(bucket: string, value: string): string {
  const relativePath = getPathFromUrl(value, bucket) ?? value;

  if (/^[a-z][a-z\d+.-]*:\/\//i.test(relativePath)) {
    throw new Error(`URL de imagen no válida para el bucket ${bucket}: ${value}`);
  }

  const decodedPath = relativePath
    .split('/')
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment))
    .join('/');

  if (!decodedPath) {
    throw new Error(`Path de imagen vacío para el bucket ${bucket}`);
  }

  return decodedPath;
}
