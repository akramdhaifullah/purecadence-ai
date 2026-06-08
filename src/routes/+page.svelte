<script lang="ts">
	type ChatMessage = {
		role: 'user' | 'assistant';
		content: string;
	};

	let input = $state('');
	let messages = $state<ChatMessage[]>([]);
	let loading = $state(false);
	let error = $state('');
	let model = $state('gemini-2.5-flash-lite');

	const sendMessage = async () => {
		const content = input.trim();
		if (!content || loading) return;

		messages = [...messages, { role: 'user', content }];
		input = '';
		error = '';
		loading = true;

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ messages, model })
			});

			if (!response.ok) {
				throw new Error(await response.text());
			}

			const data = (await response.json()) as { reply?: string };
			messages = [...messages, { role: 'assistant', content: data.reply ?? '' }];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Something went wrong.';
		} finally {
			loading = false;
		}
	};
</script>

<main>
	<h1>Garmin MCP Chat</h1>

	<section class="chat-window">
		{#if messages.length === 0}
			<p class="muted">Ask about your Garmin data or request a tool call.</p>
		{/if}

		{#each messages as message}
			<div class={`message ${message.role}`}>
				<strong>{message.role === 'user' ? 'You' : 'Assistant'}</strong>
				<p>{message.content}</p>
			</div>
		{/each}
	</section>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	<form
		class="chat-form"
		onsubmit={(event) => {
			event.preventDefault();
			void sendMessage();
		}}
	>
		<label class="model-select">
			<span>Model</span>
			<select bind:value={model}>
				<option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
				<option value="gemma-4-31b">Gemma 4 31B</option>
			</select>
		</label>
		<textarea rows="3" placeholder="Type your question..." bind:value={input}></textarea>
		<button type="submit" disabled={loading || input.trim().length === 0}>
			{loading ? 'Sending...' : 'Send'}
		</button>
	</form>
</main>
