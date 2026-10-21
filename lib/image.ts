/**
 * Utility function to append Cloudinary auto-format, auto-quality, and target width parameters
 * to drastically reduce image payload sizes and boost PageSpeed LCP / Speed Index performance.
 * Also handles PDFs uploaded as certificates/images by converting them to displayable JPGs.
 */
export function getOptimizedImageUrl(url: string, width = 800): string {
  if (!url || typeof url !== 'string') return url;

  let cleanUrl = url;

  // If Cloudinary PDF, convert to image format (.jpg) so HTML <img> tags can render it
  if (cleanUrl.includes('res.cloudinary.com') && /\.pdf(\?.*)?$/i.test(cleanUrl)) {
    cleanUrl = cleanUrl.replace(/\.pdf(\?.*)?$/i, '.jpg$1');
  }

  if (cleanUrl.includes('res.cloudinary.com') && cleanUrl.includes('/upload/') && !cleanUrl.includes('f_auto')) {
    return cleanUrl.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }

  return cleanUrl;
}
