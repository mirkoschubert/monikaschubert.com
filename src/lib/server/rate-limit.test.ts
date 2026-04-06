import { describe, it, expect, beforeEach } from 'vitest'
import { rateLimit } from '$lib/server/rate-limit'

describe('rateLimit', () => {
  beforeEach(() => {
    // Rate limit store is in-memory, tests run fresh each time
  })

  it('allows requests within limit', () => {
    const result = rateLimit('test-key-1', 3, 60000)
    expect(result.allowed).toBe(true)
  })

  it('blocks after exceeding limit', () => {
    rateLimit('test-key-2', 2, 60000)
    rateLimit('test-key-2', 2, 60000)
    const result = rateLimit('test-key-2', 2, 60000)
    expect(result.allowed).toBe(false)
    expect(result.retryAfter).toBeGreaterThan(0)
  })

  it('resets after window expires', async () => {
    rateLimit('test-key-3', 1, 50)
    const blocked = rateLimit('test-key-3', 1, 50)
    expect(blocked.allowed).toBe(false)

    await new Promise((r) => setTimeout(r, 60))
    const allowed = rateLimit('test-key-3', 1, 50)
    expect(allowed.allowed).toBe(true)
  })

  it('tracks different keys independently', () => {
    rateLimit('key-a', 1, 60000)
    const blockedA = rateLimit('key-a', 1, 60000)
    const allowedB = rateLimit('key-b', 1, 60000)
    expect(blockedA.allowed).toBe(false)
    expect(allowedB.allowed).toBe(true)
  })
})
