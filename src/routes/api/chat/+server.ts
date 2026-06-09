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

	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({ model: requestedModel });

	const firstPrompt = [
		SYSTEM_PROMPT,
		`Tools: ${JSON.stringify(toolIndex)}`,
		`Conversation:\n${formatConversation(messages)}`
	].join('\n\n');

	const firstResult = await model.generateContent(firstPrompt);
	const firstText = firstResult.response.text();
	const firstParsed = safeParse(extractJson(firstText));

	if (firstParsed?.tool) {
		const toolResult = await client.callTool({
			name: firstParsed.tool,
			arguments: firstParsed.args ?? {}
		});

		const toolData = extractToolData(toolResult);

		const secondPrompt = [
			SYSTEM_PROMPT,
			`Tool call: ${firstParsed.tool}`,
			`Tool args: ${JSON.stringify(firstParsed.args ?? {})}`,
			`Tool result: ${JSON.stringify(toolResult)}`,
			`Conversation:\n${formatConversation(messages)}`
		].join('\n\n');

		const secondResult = await model.generateContent(secondPrompt);
		const secondText = secondResult.response.text();
		const secondParsed = safeParse(extractJson(secondText));
		return json({
			reply: secondParsed?.response ?? secondText.trim(),
			data: toolData ?? toolResult,
			tool: firstParsed.tool
		});
	}

	return json({ reply: firstParsed?.response ?? firstText.trim() });
};
