import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { closeMcpClient } from '$lib/server/mcp';

export const load: PageServerLoad = async () => {
	// If a user hits GET /logout directly, just redirect them to login
	throw redirect(303, '/login');
};

export const actions: Actions = {
	default: async ({ cookies }) => {
		const email = cookies.get('garmin_email');
		if (email) {
			// Gracefully stop the MCP child process associated with this user
			await closeMcpClient(email);
		}

		// Delete the authentication cookies
		cookies.delete('garmin_email', { path: '/' });
		cookies.delete('garmin_password', { path: '/' });

		throw redirect(303, '/login');
	}
};
