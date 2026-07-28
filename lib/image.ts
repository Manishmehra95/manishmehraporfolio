/**
 * Utility function to append Cloudinary auto-format, auto-quality, and target width parameters
 * to drastically reduce image payload sizes and boost PageSpeed LCP / Speed Index performance.
 */
export function getOptimizedImageUrl(url: string, width = 800): string {
  if (!url || typeof url !== 'string') return url;

  if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('f_auto')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }

  return url;
}
