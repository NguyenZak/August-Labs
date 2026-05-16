import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'user';

/**
 * Check if a user has a specific role or higher
 */
export async function hasRole(requiredRole: UserRole | UserRole[]) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Roles are typically stored in a 'profiles' table or in 'app_metadata'
  // Here we check both for maximum compatibility
  const userRole = user.app_metadata?.role as UserRole || 'user';
  
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  // Hierarchy: super_admin > admin > editor > user
  const rolePriority: Record<UserRole, number> = {
    'super_admin': 4,
    'admin': 3,
    'editor': 2,
    'user': 1,
  };

  const userPriority = rolePriority[userRole] || 1;
  
  return requiredRoles.some(role => userPriority >= rolePriority[role]);
}

/**
 * Server-side requirement for authentication
 */
export async function requireAuth() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

/**
 * Server-side requirement for Admin role
 */
export async function requireAdmin() {
  const user = await requireAuth();
  const isAdmin = await hasRole(['admin', 'super_admin']);
  
  if (!isAdmin) {
    redirect('/unauthorized');
  }
  
  return user;
}

/**
 * Server-side requirement for Editor or higher
 */
export async function requireEditor() {
  const user = await requireAuth();
  const isEditor = await hasRole(['editor', 'admin', 'super_admin']);
  
  if (!isEditor) {
    redirect('/unauthorized');
  }
  
  return user;
}
