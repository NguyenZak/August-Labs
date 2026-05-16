import { z } from 'zod';

/**
 * Reusable Zod schemas for common inputs
 */

export const emailSchema = z.string().email().toLowerCase().trim();

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const nameSchema = z.string().min(2).max(100).trim();

export const phoneSchema = z.string().min(10).max(15).regex(/^[+0-9]+$/, 'Invalid phone format').optional();

export const slugSchema = z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Invalid slug format');

export const fileUploadSchema = z.object({
  name: z.string(),
  type: z.string().refine(
    (type) => ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'].includes(type),
    { message: 'Invalid file type' }
  ),
  size: z.number().max(10 * 1024 * 1024, 'File too large (max 10MB)'),
});

// Contact Form Schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  message: z.string().min(10).max(1000).trim(),
});

// Post/CMS Schema
export const postSchema = z.object({
  title: z.string().min(5).max(200),
  slug: slugSchema,
  content: z.string().min(10),
  excerpt: z.string().max(500).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured_image: z.string().url().optional(),
});
