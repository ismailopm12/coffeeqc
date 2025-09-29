import { User } from '@supabase/supabase-js';
import { ADMIN_EMAILS, ADMIN_USER_IDS, ALLOW_ALL_USERS_ADMIN } from '@/config/adminConfig';

/**
 * Check if a user has admin privileges
 * @param user The user to check
 * @returns boolean indicating if the user is an admin
 */
export const isAdminUser = (user: User | null): boolean => {
  if (!user) return false;
  
  // Check if user is admin by email
  const isAdminByEmail = ADMIN_EMAILS.includes(user.email || '');
  
  // Check if user is admin by user ID
  const isAdminById = ADMIN_USER_IDS.includes(user.id || '');
  
  // Also check if email contains "admin" as a fallback
  const isAdminByKeyword = user.email?.includes('admin') || false;
  
  // For development/testing, allow all users if configured
  if (ALLOW_ALL_USERS_ADMIN) {
    return true;
  }
  
  // User is admin if any of the above conditions are true
  return isAdminByEmail || isAdminById || isAdminByKeyword;
};

/**
 * Add an email to the admin list
 * @param email The email to add
 */
export const addAdminEmail = (email: string) => {
  if (!ADMIN_EMAILS.includes(email)) {
    ADMIN_EMAILS.push(email);
  }
};