import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Define your main domain (including localhost for development)
  const mainDomains = ['localhost:3000', 'augustagency.com', 'www.augustagency.com'];
  const isMainDomain = mainDomains.some(domain => hostname === domain);

  if (!isMainDomain) {
    // Extract subdomain (remove port if exists)
    const hostWithoutPort = hostname.split(':')[0];
    const subdomain = hostWithoutPort.split('.')[0];
    
    // If there's a subdomain, rewrite the request to a special showcase route
    // Note: We avoid rewriting static files or API routes
    if (
      !url.pathname.startsWith('/_next') && 
      !url.pathname.startsWith('/api') &&
      !url.pathname.startsWith('/adminz')
    ) {
      console.log(`Subdomain detected: ${subdomain}, rewriting to /showcase/${subdomain}${url.pathname}`);
      return NextResponse.rewrite(new URL(`/showcase/${subdomain}${url.pathname}`, request.url));
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
