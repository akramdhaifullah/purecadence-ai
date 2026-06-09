import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getMcpClient } from '$lib/server/mcp';

type ChatMessage = {
	role: 'user' | 'assistant' | 'system';
	content: string;
};

type ToolChoice = {
	tool?: string;
	args?: Record<string, unknown>;
	response?: string;
};

type ToolResponse = {
	content?: Array<{ type?: string; text?: string }>;
};

const SYSTEM_PROMPT = `You are a concise assistant.
You can call MCP tools to answer user questions.
If a user asks about events in relative time (e.g., "today", "last week", "this month"), you MUST call the 'get_current_datetime' tool first to establish the current date before making any other tool calls that require dates.
Return JSON only, with either:
{"tool":"tool_name","args":{...}} or {"response":"text"}.
Do not include extra keys.`;

function extractJson(text: string): string {
	const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
	if (fenced?.[1]) {
		return fenced[1].trim();
	}

	return text.trim();
}

function safeParse(text: string): ToolChoice | null {
	try {
		return JSON.parse(text) as ToolChoice;
	} catch {
		return null;
	}
}

function formatConversation(messages: ChatMessage[]): string {
	return messages.map((message) => `${message.role}: ${message.content}`).join('\n');
}

function extractToolData(result: unknown): unknown | null {
	if (!result || typeof result !== 'object') return null;
	const response = result as ToolResponse;
	const textContent = response.content?.find((item) => item.type === 'text')?.text;
	if (!textContent) return null;

	try {
		const parsed = JSON.parse(textContent);
		if (Array.isArray(parsed)) return parsed;
		if (parsed && typeof parsed === 'object') {
			if (Array.isArray((parsed as { activities?: unknown }).activities)) {
				return (parsed as { activities: unknown[] }).activities;
			}
			if (Array.isArray((parsed as { activityList?: unknown }).activityList)) {
				return (parsed as { activityList: unknown[] }).activityList;
			}
		}
		return parsed;
	} catch {
		return null;
	}
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const email = cookies.get('garmin_email');
	const password = cookies.get('garmin_password');
	if (!email || !password) {
		return json({ error: 'Unauthorized: Garmin credentials not found' }, { status: 401 });
	}

	const apiKey = env.GEMINI_API_KEY;
	if (!apiKey) {
		return json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
	}

	const body = (await request.json()) as { messages?: ChatMessage[]; model?: string };
	const messages = body.messages ?? [];
	const requestedModel = body.model ?? 'gemini-2.5-flash-lite';
	if (messages.length === 0) {
		return json({ error: 'No messages provided' }, { status: 400 });
	}

	const client = await getMcpClient(email, password);
	const { tools } = await client.listTools();
	const toolIndex = tools.map((tool) => ({
		name: tool.name,
		description: tool.description ?? '',
		inputSchema: tool.inputSchema ?? {}
	}));

	toolIndex.push({
		name: 'get_current_datetime',
		description:
			'Get the current date and time in ISO 8601 format. Useful for filtering activities by date, scheduling workouts, or any task requiring the current time.',
		inputSchema: {
			type: 'object',
			properties: {}
		}
	});

	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({ model: requestedModel });

	let currentPrompt = [
		SYSTEM_PROMPT,
		`Tools: ${JSON.stringify(toolIndex)}`,
		`Conversation:\n${formatConversation(messages)}`
	].join('\n\n');

	let finalToolName: string | undefined;
	let finalToolData: unknown = null;
	const MAX_ITERATIONS = 5;

	for (let i = 0; i < MAX_ITERATIONS; i++) {
		const result = await model.generateContent(currentPrompt);
		const text = result.response.text();
		const parsed = safeParse(extractJson(text));

		if (parsed?.response) {
			return json({
				reply: parsed.response,
				data: finalToolData,
				tool: finalToolName
			});
		} else if (parsed?.tool) {
			finalToolName = parsed.tool;
			let toolResult: unknown;

			if (parsed.tool === 'get_current_datetime') {
				const now = new Date();
				toolResult = {
					content: [{ type: 'text', text: JSON.stringify({ current_datetime: now.toISOString() }) }]
				};
				finalToolData = { current_datetime: now.toISOString() };
			} else {
				try {
					toolResult = await client.callTool({
						name: parsed.tool,
						arguments: parsed.args ?? {}
					});
					finalToolData = extractToolData(toolResult) ?? toolResult;
				} catch (err) {
					const errorMsg = err instanceof Error ? err.message : String(err);
					toolResult = { error: `Failed to execute tool ${parsed.tool}: ${errorMsg}` };
				}
			}

			currentPrompt += `\n\nTool call: ${parsed.tool}\nTool args: ${JSON.stringify(parsed.args ?? {})}\nTool result: ${JSON.stringify(toolResult)}`;
		} else {
			return json({
				reply: text.trim(),
				data: finalToolData,
				tool: finalToolName
			});
		}
	}

	return json({
		reply: 'I reached the maximum number of steps trying to answer your question.',
		data: finalToolData,
		tool: finalToolName
	});
};
