import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from './auth';
import { hasRole, UserRole } from './rbac';
import { rateLimit } from './rate-limit';
import { handleApiError, SecurityErrors } from './errors';
import { securityLog } from './logger';

type ApiHandler = (req: NextRequest, context: any) => Promise<NextResponse>;

/**
 * Wrapper for API routes to enforce authentication, authorization, and rate limiting.
 */
export function withSecurity(
  handler: ApiHandler,
  options: {
    requireAuth?: boolean;
    requiredRole?: UserRole | UserRole[];
    rateLimitKey?: string;
    limit?: number;
    window?: number;
  } = {}
) {
  return async (req: NextRequest, context: any) => {
    try {
      const {
        requireAuth = false,
        requiredRole,
        rateLimitKey,
        limit = 60,
        window = 60
      } = options;

      // 1. Rate Limiting
      if (rateLimitKey) {
        const ip = req.headers.get('x-forwarded-for') || req.ip || 'anonymous';
        const identifier = `${rateLimitKey}:${ip}`;
        const limitResult = await rateLimit(identifier, limit, window);
        
        if (!limitResult.success) {
          await securityLog({
            action: 'API_RATE_LIMIT_EXCEEDED',
            ip,
            resourceType: 'API',
            resourceId: req.nextUrl.pathname,
            metadata: { limit, window }
          });
          throw SecurityErrors.tooManyRequests();
        }
      }

      // 2. Authentication
      const user = await getServerSession();
      if (requireAuth && !user) {
        throw SecurityErrors.unauthorized();
      }

      // 3. Authorization (RBAC)
      if (requiredRole) {
        const hasPermission = await hasRole(requiredRole);
        if (!hasPermission) {
          await securityLog({
            action: 'API_FORBIDDEN_ACCESS',
            userId: user?.id,
            resourceType: 'API',
            resourceId: req.nextUrl.pathname,
            ip: req.headers.get('x-forwarded-for') || req.ip || undefined
          });
          throw SecurityErrors.forbidden();
        }
      }

      // 4. CSRF / Origin Check for mutations
      if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
        const origin = req.headers.get('origin');
        const host = req.headers.get('host');
        
        // Simple CSRF protection: Ensure origin matches host (if origin is present)
        if (origin && !origin.includes(host || '')) {
          throw SecurityErrors.forbidden('Invalid origin');
        }
      }

      return await handler(req, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Convenience wrapper for Admin-only APIs
 */
export function withAdmin(handler: ApiHandler, rateLimitOptions = {}) {
  return withSecurity(handler, {
    requireAuth: true,
    requiredRole: ['admin', 'super_admin'],
    rateLimitKey: 'admin_api',
    ...rateLimitOptions
  });
}
