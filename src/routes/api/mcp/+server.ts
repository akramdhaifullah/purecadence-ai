import { json } from '@sveltejs/kit';
import { getMcpClient } from '$lib/server/mcp';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const client = await getMcpClient();
	const { tools } = await client.listTools();

	return json({ tools });
};
