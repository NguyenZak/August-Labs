import { Redis } from '@upstash/redis';
import { env } from './env';

/**
 * Simple Rate Limiter using Upstash Redis.
 * If Redis keys are missing, it defaults to allowing all requests (warns in console).
 */
export async function rateLimit(
  identifier: string,
  limit: number = 10,
  windowInSeconds: number = 60
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Rate limiting is disabled in production because Upstash keys are missing.');
    }
    return { success: true, limit, remaining: limit, reset: 0 };
  }

  try {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    const key = `ratelimit:${identifier}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowInSeconds);
    }

    const success = current <= limit;
    const remaining = Math.max(0, limit - current);
    const reset = Math.floor(Date.now() / 1000) + windowInSeconds;

    return {
      success,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Fallback: allow request in case of Redis failure to prevent total outage
    return { success: true, limit, remaining: 1, reset: 0 };
  }
}
