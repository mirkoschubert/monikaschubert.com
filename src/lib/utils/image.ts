import { dev } from '$app/environment'

export function vercelImg(url: string, width: number, quality = 80): string {
  if (dev) return url
  return `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`
}
