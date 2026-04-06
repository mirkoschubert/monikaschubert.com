import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .max(255, 'Email too long')

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')

export const slugSchema = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .max(200, 'Slug too long')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase alphanumeric with hyphens'
  )

const localizedStringSchema = z.string().trim().max(500, 'Text too long')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

export const registerSchema = z.object({
  name: localizedStringSchema.min(1, 'Name is required'),
  email: emailSchema,
  password: passwordSchema
})

export const settingsUpdateSchema = z.object({
  name: localizedStringSchema.min(1, 'Name is required'),
  email: emailSchema
})

export const pageSchema = z.object({
  title_en: localizedStringSchema.min(1, 'English title is required'),
  title_de: localizedStringSchema,
  slug: slugSchema,
  content_en: z.string(),
  content_de: z.string(),
  hero_image: z.string().trim().max(500).nullable().optional(),
  seo_title_en: localizedStringSchema,
  seo_title_de: localizedStringSchema,
  seo_description_en: z.string().trim().max(500),
  seo_description_de: z.string().trim().max(500)
})

export const createUserSchema = z.object({
  name: localizedStringSchema.min(1, 'Name is required'),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['admin', 'editor'])
})

export const updateUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: localizedStringSchema.optional(),
  email: emailSchema.optional()
})

export const setUserRoleSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  role: z.enum(['admin', 'editor'])
})

export const setPasswordSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  password: passwordSchema
})

export const banUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  banned: z.enum(['true', 'false'])
})

export const deleteUserSchema = z.object({
  id: z.string().min(1, 'User ID is required')
})

export function parseFormData<T extends z.ZodType>(
  schema: T,
  data: FormData
): { success: true; data: z.output<T> } | { success: false; error: string } {
  const obj: Record<string, unknown> = {}
  for (const [key, value] of data.entries()) {
    obj[key] = typeof value === 'string' ? value : value.toString()
  }
  const result = schema.safeParse(obj)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }
  return { success: true, data: result.data }
}
