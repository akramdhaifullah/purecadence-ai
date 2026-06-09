<script lang="ts">
	import { enhance } from '$app/forms';

	let { form }: { form: { error?: string; email?: string } | null } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Garmin Connect Login</title>
</svelte:head>

<main class="login-container">
	<div class="login-card">
		<div class="header">
			<svg
				class="garmin-logo"
				viewBox="0 0 100 100"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
			>
				<circle cx="50" cy="50" r="42" stroke="currentColor" stroke-width="3" />
				<path d="M50 20 L32 68 L68 68 Z" fill="currentColor" />
				<circle cx="50" cy="48" r="6" fill="white" />
			</svg>
			<h1>Garmin Connect</h1>
			<p class="muted text-center">
				Enter your Garmin Connect credentials to sync your training and activity data.
			</p>
		</div>

		{#if form?.error}
			<p class="error text-center">{form.error}</p>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
			class="login-form"
		>
			<label class="form-field">
				<span>Email Address</span>
				<input
					type="email"
					name="email"
					value={form?.email ?? ''}
					placeholder="your.email@example.com"
					required
					disabled={loading}
				/>
			</label>

			<label class="form-field">
				<span>Password</span>
				<input type="password" name="password" placeholder="••••••••" required disabled={loading} />
			</label>

			<button type="submit" class="submit-btn" disabled={loading}>
				{#if loading}
					Connecting to Garmin...
				{:else}
					Connect Account
				{/if}
			</button>
		</form>
	</div>
</main>

<style>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 80vh;
		max-width: 440px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.login-card {
		width: 100%;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 16px;
		padding: 2rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.05),
			0 2px 4px -1px rgba(0, 0, 0, 0.02);
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2rem;
		text-align: center;
	}

	.garmin-logo {
		width: 56px;
		height: 56px;
		color: #111827;
		margin-bottom: 1rem;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.9rem;
		color: #374151;
	}

	.form-field input {
		border-radius: 10px;
		border: 1px solid #d1d5db;
		padding: 0.65rem 0.85rem;
		font: inherit;
		width: 100%;
		box-sizing: border-box;
	}

	.form-field input:focus {
		outline: none;
		border-color: #111827;
		box-shadow: 0 0 0 1px #111827;
	}

	.submit-btn {
		width: 100%;
		padding: 0.75rem;
		border-radius: 10px;
		border: none;
		background: #111827;
		color: white;
		font-weight: 500;
		cursor: pointer;
		margin-top: 0.5rem;
		transition: background 0.15s ease;
	}

	.submit-btn:hover:not(:disabled) {
		background: #1f2937;
	}

	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.text-center {
		text-align: center;
	}

	.error {
		color: #b91c1c;
		background-color: #fef2f2;
		border: 1px solid #fca5a5;
		border-radius: 10px;
		padding: 0.75rem;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
	}
</style>
