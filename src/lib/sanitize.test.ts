import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '$lib/sanitize'

describe('sanitizeHtml', () => {
  it('allows safe HTML tags', () => {
    const html = '<p>Hello <strong>world</strong></p>'
    expect(sanitizeHtml(html)).toBe('<p>Hello <strong>world</strong></p>')
  })

  it('removes script tags', () => {
    const html = '<p>Hello</p><script>alert("xss")</script>'
    const result = sanitizeHtml(html)
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('alert')
  })

  it('removes event handlers', () => {
    const html = '<p onclick="alert(1)">Click me</p>'
    const result = sanitizeHtml(html)
    expect(result).not.toContain('onclick')
  })

  it('removes iframe tags', () => {
    const html = '<iframe src="evil.com"></iframe>'
    const result = sanitizeHtml(html)
    expect(result).not.toContain('<iframe>')
  })

  it('allows links but removes javascript: hrefs', () => {
    const html = '<a href="javascript:alert(1)">Link</a>'
    const result = sanitizeHtml(html)
    expect(result).not.toContain('javascript:')
  })

  it('allows safe links', () => {
    const html = '<a href="https://example.com">Link</a>'
    const result = sanitizeHtml(html)
    expect(result).toContain('href="https://example.com"')
  })

  it('preserves code blocks', () => {
    const html = '<pre><code>const x = 1</code></pre>'
    expect(sanitizeHtml(html)).toBe('<pre><code>const x = 1</code></pre>')
  })
})
