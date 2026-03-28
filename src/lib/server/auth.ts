import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { passkey } from '@better-auth/passkey';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { getBaseUrl } from '$lib/url';

export const auth = betterAuth({
	baseURL: getBaseUrl(),
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true },
	plugins: [
		passkey(),
		sveltekitCookies(getRequestEvent) // must be last plugin
	]
});
