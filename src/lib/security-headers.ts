/**
 * Production-ready Security Headers and Content Security Policy (CSP)
 */

export const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];

export const getCspHeader = (supabaseUrl: string) => {
  const isProd = process.env.NODE_ENV === 'production';
  
  // Base CSP rules
  const csp = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://va.vercel-scripts.com"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "blob:", "https:", supabaseUrl],
    'font-src': ["'self'", "data:"],
    'connect-src': ["'self'", supabaseUrl, "https://*.supabase.co", "https://vitals.vercel-analytics.com"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': isProd ? [] : null,
  };

  return Object.entries(csp)
    .filter(([_, values]) => values !== null)
    .map(([key, values]) => {
      if (Array.isArray(values)) {
        return `${key} ${values.join(' ')}`;
      }
      return key;
    })
    .join('; ');
};
