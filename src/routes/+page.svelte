<script lang="ts">
	type ChatMessage = {
		role: 'user' | 'assistant';
		content: string;
		data?: unknown;
		tool?: string;
	};

	let { data }: { data: { email?: string } } = $props();

	let input = $state('');
	let messages = $state<ChatMessage[]>([]);
	let loading = $state(false);
	let error = $state('');
	let model = $state('gemini-2.5-flash-lite');

	const isRecord = (value: unknown): value is Record<string, unknown> =>
		!!value && typeof value === 'object' && !Array.isArray(value);

	const pickNumber = (record: Record<string, unknown>, keys: string[]): number | undefined => {
		for (const key of keys) {
			const value = record[key];
			if (typeof value === 'number') return value;
			if (typeof value === 'string') {
				const parsed = Number(value);
				if (!Number.isNaN(parsed)) return parsed;
			}
		}
		return undefined;
	};

	const formatActivity = (value: unknown): string => {
		if (!isRecord(value)) return String(value);
		const name =
			(value.activityName as string | undefined) ??
			(value.name as string | undefined) ??
			((value.activityType as Record<string, unknown> | undefined)?.typeKey as
				| string
				| undefined) ??
			(value.type as string | undefined) ??
			'Activity';
		const start =
			(value.startTimeLocal as string | undefined) ??
			(value.startTimeGMT as string | undefined) ??
			(value.startTime as string | undefined) ??
			(value.start_time as string | undefined) ??
			(value.date as string | undefined);
		const distance = pickNumber(value, [
			'distance',
			'distanceMeters',
			'distanceInMeters',
			'totalDistance',
			'totalDistanceMeters',
			'distance_meters'
		]);
		const distanceText =
			typeof distance === 'number' ? `${(distance / 1000).toFixed(1)} km` : undefined;
		const durationSeconds = pickNumber(value, [
			'duration',
			'elapsedDuration',
			'movingDuration',
			'durationSeconds',
			'durationInSeconds',
			'elapsedDurationSeconds',
			'movingDurationSeconds',
			'duration_seconds'
		]);
		const avgSpeed = pickNumber(value, [
			'averageSpeed',
			'avgSpeed',
			'averageSpeedMetersPerSecond',
			'averageSpeedInMetersPerSecond',
			'avgSpeedInMetersPerSecond',
			'averageMovingSpeed'
		]);
		const avgHeartRate = pickNumber(value, [
			'averageHR',
			'averageHeartRate',
			'avgHeartRate',
			'avgHr',
			'averageHr',
			'avg_hr_bpm'
		]);
		let paceText: string | undefined;
		if (typeof avgSpeed === 'number' && avgSpeed > 0) {
			const paceSeconds = 1000 / avgSpeed;
			const minutes = Math.floor(paceSeconds / 60);
			const seconds = Math.round(paceSeconds % 60);
			paceText = `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
		} else if (
			typeof durationSeconds === 'number' &&
			typeof distance === 'number' &&
			distance > 0
		) {
			const paceSeconds = durationSeconds / (distance / 1000);
			const minutes = Math.floor(paceSeconds / 60);
			const seconds = Math.round(paceSeconds % 60);
			paceText = `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
		}
		const hrText = typeof avgHeartRate === 'number' ? `${Math.round(avgHeartRate)} bpm` : undefined;
		return [name, start, distanceText, paceText, hrText].filter(Boolean).join(' · ');
	};

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

			const data = (await response.json()) as {
				reply?: string;
				data?: unknown;
				tool?: string;
			};
			messages = [
				...messages,
				{ role: 'assistant', content: data.reply ?? '', data: data.data, tool: data.tool }
			];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Something went wrong.';
		} finally {
			loading = false;
		}
	};
</script>

<main>
	<header class="header-container">
		<div class="header-title">
			<h1>Garmin MCP Chat</h1>
			{#if data?.email}
				<p>Syncing data for <strong>{data.email}</strong></p>
			{/if}
		</div>
		<form action="/logout" method="POST">
			<button type="submit" class="logout-btn">Logout</button>
		</form>
	</header>

	<section class="chat-window">
		{#if messages.length === 0}
			<p class="muted">Ask about your Garmin data or request a tool call.</p>
		{/if}

		{#each messages as message, index (index)}
			<div class={`message ${message.role}`}>
				<strong>{message.role === 'user' ? 'You' : 'Assistant'}</strong>
				<p>{message.content}</p>
				{#if Array.isArray(message.data)}
					<ul class="activity-list">
						{#each message.data as item, itemIndex (itemIndex)}
							<li>{formatActivity(item)}</li>
						{/each}
					</ul>
				{/if}
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
				<option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</option>
			</select>
		</label>
		<textarea rows="3" placeholder="Type your question..." bind:value={input}></textarea>
		<button type="submit" disabled={loading || input.trim().length === 0}>
			{loading ? 'Sending...' : 'Send'}
		</button>
	</form>
</main>

<style>
	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
		padding-bottom: 1rem;
	}

	.header-title h1 {
		margin: 0;
		font-size: 1.5rem;
	}

	.header-title p {
		margin: 0.25rem 0 0;
		font-size: 0.85rem;
		color: #6b7280;
	}

	.logout-btn {
		font-size: 0.85rem;
		color: #4b5563;
		background: none;
		border: 1px solid #d1d5db;
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.logout-btn:hover {
		color: #dc2626;
		border-color: #fca5a5;
		background: #fef2f2;
	}
</style>
