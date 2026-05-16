import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

type LogLevel = 'info' | 'warn' | 'error' | 'security';

interface SecurityLogParams {
  action: string;
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: any;
  ip?: string;
  userAgent?: string;
}

/**
 * Security-focused logger.
 * Logs to console in dev, and can be extended to log to Supabase 'admin_logs' table.
 */
export async function securityLog({
  action,
  userId,
  resourceType,
  resourceId,
  metadata,
  ip,
  userAgent
}: SecurityLogParams) {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    level: 'security' as LogLevel,
    action,
    userId,
    resourceType,
    resourceId,
    metadata,
    ip,
    userAgent,
  };

  // 1. Console Log (Vercel logs)
  console.info(`[SECURITY] ${action} | User: ${userId || 'Anonymous'} | Resource: ${resourceType}:${resourceId || ''}`);

  // 2. Database Log (Optional, persistence)
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    
    // We use service_role for logging to ensure logs are always written even if user has no permissions
    // Note: This requires env.SUPABASE_SERVICE_ROLE_KEY
    const { error } = await supabase
      .from('admin_logs')
      .insert({
        admin_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ip_address: ip,
        user_agent: userAgent,
      });

    if (error) console.error('Failed to write security log to DB:', error);
  } catch (err) {
    console.error('Error in securityLog:', err);
  }
}

/**
 * General purpose logger for API routes
 */
export const logger = {
  info: (msg: string, meta?: any) => console.log(`[INFO] ${msg}`, meta || ''),
  warn: (msg: string, meta?: any) => console.warn(`[WARN] ${msg}`, meta || ''),
  error: (msg: string, meta?: any) => console.error(`[ERROR] ${msg}`, meta || ''),
};
