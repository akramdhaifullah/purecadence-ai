import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { env } from '$env/dynamic/private';

type ServerParams = {
	command: string;
	args: string[];
	env?: Record<string, string>;
};

const DEFAULT_COMMAND = 'uvx';
const DEFAULT_ARGS = [
	'--python',
	'3.12',
	'--from',
	'git+https://github.com/Taxuspt/garmin_mcp',
	'garmin-mcp'
];

const GARMIN_ENV_KEYS = [
	'GARMIN_EMAIL',
	'GARMIN_PASSWORD',
	'GARMIN_EMAIL_FILE',
	'GARMIN_PASSWORD_FILE',
	'GARMIN_IS_CN',
	'GARMIN_ENABLED_TOOLS',
	'GARMIN_DISABLED_TOOLS'
] as const;

let client: Client | null = null;
let transport: StdioClientTransport | null = null;
let connectPromise: Promise<Client> | null = null;

function parseArgs(raw: string | undefined): string[] | null {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed) && parsed.every((value) => typeof value === 'string')) {
			return parsed;
		}
	} catch {
		// fall through
	}

	throw new Error('MCP_SERVER_ARGS must be a JSON array of strings');
}

function buildServerEnv(): Record<string, string> | undefined {
	const serverEnv: Record<string, string> = {};

	for (const key of GARMIN_ENV_KEYS) {
		const value = env[key];
		if (value) {
			serverEnv[key] = value;
		}
	}

	if (env.MCP_SERVER_ENV) {
		try {
			const parsed = JSON.parse(env.MCP_SERVER_ENV) as Record<string, string>;
			for (const [key, value] of Object.entries(parsed)) {
				if (typeof value === 'string') {
					serverEnv[key] = value;
				}
			}
		} catch {
			throw new Error('MCP_SERVER_ENV must be a JSON object of string values');
		}
	}

	return Object.keys(serverEnv).length > 0 ? serverEnv : undefined;
}

function getServerParams(): ServerParams {
	const command = env.MCP_SERVER_COMMAND ?? DEFAULT_COMMAND;
	const args = parseArgs(env.MCP_SERVER_ARGS) ?? DEFAULT_ARGS;

	return {
		command,
		args,
		env: buildServerEnv()
	};
}

async function connectMcp(): Promise<Client> {
	const server = getServerParams();
	transport = new StdioClientTransport(server);
	client = new Client({ name: 'garmin-trainer', version: '0.0.1' });
	await client.connect(transport);
	return client;
}

export async function getMcpClient(): Promise<Client> {
	if (client) {
		return client;
	}

	if (!connectPromise) {
		connectPromise = connectMcp();
	}

	return connectPromise;
}

export async function closeMcpClient(): Promise<void> {
	if (transport) {
		await transport.close();
	}

	client = null;
	transport = null;
	connectPromise = null;
}
