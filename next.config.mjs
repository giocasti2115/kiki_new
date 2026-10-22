/**
 * Exportación 100% estática: `next build` genera HTML/CSS/JS en /out,
 * listo para un CDN (Vercel, Netlify, Cloudflare Pages, S3+CloudFront).
 * No hay servidor ni PHP del lado público.
 */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
