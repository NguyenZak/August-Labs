import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { User } from "@supabase/supabase-js";

/**
 * Validates the current session on the server side.
 * Returns the user object if authenticated, otherwise returns null.
 */
export async function getServerSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

/**
 * Checks if the user is authenticated and has a valid session.
 * Throws an error or redirects if not authenticated (handled by caller or RBAC).
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session;
}

/**
 * Gets the current user's role from app_metadata or user_metadata.
 */
export async function getUserRole(): Promise<string | null> {
  const user = await getServerSession();
  if (!user) return null;
  
  return (user.app_metadata?.role as string) || (user.user_metadata?.role as string) || 'user';
}
