import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { env } from '$env/dynamic/private';
import { createHash } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

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
	'GARMIN_DISABLED_TOOLS',
	'GARMINTOKENS',
	'GARMINTOKENS_BASE64'
] as const;

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

function getUserTokenPaths(email: string): { tokenStore: string; base64TokenStore: string } {
	const normalizedEmail = email.trim().toLowerCase();
	const emailHash = createHash('sha256').update(normalizedEmail).digest('hex');

	let root = env.GARMIN_TOKEN_ROOT;
	if (!root) {
		// Vercel and AWS Lambda environments have a read-only filesystem except for the /tmp folder
		if (process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.NOW_BUILDER) {
			root = '/tmp/.garminconnect-tokens';
		} else {
			root = join(process.cwd(), '.garminconnect-tokens');
		}
	}
	const tokenRoot = join(root, emailHash);

	mkdirSync(tokenRoot, { recursive: true });

	return {
		tokenStore: join(tokenRoot, 'tokens'),
		base64TokenStore: join(tokenRoot, 'tokens_base64')
	};
}

function buildServerEnv(email?: string, password?: string): Record<string, string> | undefined {
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

	if (email) {
		const tokenPaths = getUserTokenPaths(email);
		serverEnv['GARMIN_EMAIL'] = email;
		serverEnv['GARMINTOKENS'] = tokenPaths.tokenStore;
		serverEnv['GARMINTOKENS_BASE64'] = tokenPaths.base64TokenStore;
	}
	if (password) {
		serverEnv['GARMIN_PASSWORD'] = password;
	}

	return Object.keys(serverEnv).length > 0 ? serverEnv : undefined;
}

function getServerParams(email?: string, password?: string): ServerParams {
	const command = env.MCP_SERVER_COMMAND ?? DEFAULT_COMMAND;
	const args = parseArgs(env.MCP_SERVER_ARGS) ?? DEFAULT_ARGS;

	return {
		command,
		args,
		env: buildServerEnv(email, password)
	};
}
type ClientInstance = {
	client: Client;
	transport: StdioClientTransport;
};

const clients = new Map<string, ClientInstance | Promise<ClientInstance>>();

export async function getMcpClient(email?: string, password?: string): Promise<Client> {
	const key = email || 'default';
	let instanceOrPromise = clients.get(key);

	if (!instanceOrPromise) {
		const connectPromise = (async () => {
			const server = getServerParams(email, password);
			const transport = new StdioClientTransport(server);
			const client = new Client({ name: 'garmin-trainer', version: '0.0.1' });
			await client.connect(transport);
			const instance = { client, transport };
			clients.set(key, instance);
			return instance;
		})();

		clients.set(key, connectPromise);
		instanceOrPromise = connectPromise;
	}

	try {
		const resolved = await instanceOrPromise;
		return resolved.client;
	} catch (error) {
		clients.delete(key);
		throw error;
	}
}

export async function closeMcpClient(email?: string): Promise<void> {
	const key = email || 'default';
	const instanceOrPromise = clients.get(key);
	if (instanceOrPromise) {
		clients.delete(key);
		try {
			const resolved = await instanceOrPromise;
			await resolved.transport.close();
		} catch {
			// ignore close errors
		}
	}
}
