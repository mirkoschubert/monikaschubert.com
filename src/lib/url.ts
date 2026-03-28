/**
 * Returns the app's base URL - automatically determined from environment:
 * - On Vercel: https://<VERCEL_PROJECT_PRODUCTION_URL> (stable primary domain)
 * - Locally:   http://localhost:<PORT> (defaults to 5173)
 *
 * No ORIGIN env var needed - works automatically in both environments.
 */
export function getBaseUrl(): string {
	if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
		return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
	}
	return `http://localhost:${process.env.PORT ?? '5173'}`
}
