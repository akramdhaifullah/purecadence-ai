import { json } from '@sveltejs/kit';
import { getMcpClient } from '$lib/server/mcp';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const email = cookies.get('garmin_email');
	const password = cookies.get('garmin_password');
	if (!email || !password) {
		return json({ error: 'Unauthorized: Garmin credentials not found' }, { status: 401 });
	}

	const client = await getMcpClient(email, password);
	const { tools } = await client.listTools();

	const allTools = [
		...tools,
		{
			name: 'get_current_datetime',
			description:
				'Get the current date and time in ISO 8601 format. Useful for filtering activities by date, scheduling workouts, or any task requiring the current time.',
			inputSchema: {
				type: 'object',
				properties: {}
			}
		}
	];

	return json({ tools: allTools });
};
