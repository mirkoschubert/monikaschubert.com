type RateLimitEntry = {
  count: number
  resetAt: number
}

const store: Record<string, RateLimitEntry> = {}

setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (now > store[key].resetAt) delete store[key]
  }
}, 60_000)

export function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = store[key]

  if (!entry || now > entry.resetAt) {
    store[key] = { count: 1, resetAt: now + windowMs }
    return { allowed: true }
  }

  entry.count++
  if (entry.count > maxAttempts) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000)
    }
  }

  return { allowed: true }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}
