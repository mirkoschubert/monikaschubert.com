import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  registerSchema,
  pageSchema,
  createUserSchema,
  setPasswordSchema,
  slugSchema,
  parseFormData
} from '$lib/validation'

function makeFormData(obj: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(obj)) {
    fd.set(key, value)
  }
  return fd
}

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123'
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: ''
    })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'securepass123'
    })
    expect(result.success).toBe(true)
  })

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      name: 'Test',
      email: 'test@example.com',
      password: 'short'
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = registerSchema.safeParse({
      name: '',
      email: 'test@example.com',
      password: 'securepass123'
    })
    expect(result.success).toBe(false)
  })
})

describe('slugSchema', () => {
  it('accepts valid slugs', () => {
    expect(slugSchema.safeParse('about').success).toBe(true)
    expect(slugSchema.safeParse('my-page').success).toBe(true)
    expect(slugSchema.safeParse('page-123').success).toBe(true)
  })

  it('rejects uppercase slugs', () => {
    expect(slugSchema.safeParse('About').success).toBe(false)
  })

  it('rejects slugs with spaces', () => {
    expect(slugSchema.safeParse('my page').success).toBe(false)
  })

  it('rejects slugs with special characters', () => {
    expect(slugSchema.safeParse('my/page').success).toBe(false)
    expect(slugSchema.safeParse('my_page').success).toBe(false)
  })

  it('rejects empty slug', () => {
    expect(slugSchema.safeParse('').success).toBe(false)
  })
})

describe('pageSchema', () => {
  it('accepts valid page data', () => {
    const result = pageSchema.safeParse({
      title_en: 'My Page',
      title_de: 'Meine Seite',
      slug: 'my-page',
      content_en: 'Content',
      content_de: 'Inhalt',
      hero_image: '',
      seo_title_en: '',
      seo_title_de: '',
      seo_description_en: '',
      seo_description_de: ''
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty english title', () => {
    const result = pageSchema.safeParse({
      title_en: '',
      title_de: '',
      slug: 'my-page',
      content_en: '',
      content_de: '',
      hero_image: '',
      seo_title_en: '',
      seo_title_de: '',
      seo_description_en: '',
      seo_description_de: ''
    })
    expect(result.success).toBe(false)
  })
})

describe('createUserSchema', () => {
  it('accepts valid user data', () => {
    const result = createUserSchema.safeParse({
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
      role: 'editor'
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid role', () => {
    const result = createUserSchema.safeParse({
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
      role: 'superadmin'
    })
    expect(result.success).toBe(false)
  })
})

describe('setPasswordSchema', () => {
  it('accepts valid password change', () => {
    const result = setPasswordSchema.safeParse({
      id: 'user-123',
      password: 'newpassword123'
    })
    expect(result.success).toBe(true)
  })

  it('rejects short password', () => {
    const result = setPasswordSchema.safeParse({
      id: 'user-123',
      password: 'short'
    })
    expect(result.success).toBe(false)
  })
})

describe('parseFormData', () => {
  it('parses valid form data', () => {
    const fd = makeFormData({
      email: 'test@example.com',
      password: 'password123'
    })
    const result = parseFormData(loginSchema, fd)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('test@example.com')
    }
  })

  it('returns error for invalid data', () => {
    const fd = makeFormData({
      email: 'invalid',
      password: ''
    })
    const result = parseFormData(loginSchema, fd)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeTruthy()
    }
  })
})
