/**
 * Returns a safe React Native <Image /> source for:
 * - local require() assets
 * - remote/local URI strings
 * - already-shaped { uri } objects
 * - null / undefined fallback cases
 */
export function imgSrc(image) {
  if (!image) return null;
  if (typeof image === 'number') return image;
  if (typeof image === 'string') return { uri: image };
  if (typeof image === 'object' && image.uri) return image;
  return image;
}
