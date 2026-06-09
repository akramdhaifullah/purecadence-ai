import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getMcpClient, closeMcpClient } from '$lib/server/mcp';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email: email ?? '' });
		}

		try {
			// Close any existing client for this email first
			await closeMcpClient(email);

			// Test the login by starting the MCP client with the supplied credentials
			const client = await getMcpClient(email, password);
			// List tools to verify a successful connect & auth with Garmin Connect
			await client.listTools();
		} catch (err) {
			// On failure, close client and clear map entry to avoid leaking processes
			await closeMcpClient(email);
			const message =
				err instanceof Error ? err.message : 'Invalid credentials or connection error';
			return fail(400, { error: `Failed to connect to Garmin: ${message}`, email: email ?? '' });
		}

		// Save secure, HTTP-only cookies on successful login
		cookies.set('garmin_email', email, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});
		cookies.set('garmin_password', password, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		throw redirect(303, '/chat');
	}
};
