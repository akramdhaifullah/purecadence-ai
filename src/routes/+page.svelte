<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>purecadence.ai — Intelligent Garmin Training Assistant</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200">
	<!-- Navigation -->
	<header class="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<div class="flex items-center gap-2">
				<svg class="h-8 w-8 text-indigo-600" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3">
					<circle cx="50" cy="50" r="42" stroke="currentColor" stroke-width="4" />
					<path d="M50 20 L32 68 L68 68 Z" fill="currentColor" />
					<circle cx="50" cy="48" r="6" fill="white" />
				</svg>
				<span class="text-xl font-bold tracking-tight text-slate-950">purecadence.ai</span>
			</div>

			<nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
				<a href="#features" class="hover:text-indigo-600 transition">Features</a>
				<a href="#how-it-works" class="hover:text-indigo-600 transition">How it Works</a>
				<a href="#pricing" class="hover:text-indigo-600 transition">Pricing</a>
			</nav>

			<div class="flex items-center gap-4">
				{#if data?.isLoggedIn}
					<span class="hidden lg:inline text-xs text-slate-500">Connected as {data.email}</span>
					<a href="/chat" class="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition shadow-sm">
						Go to Chat
					</a>
				{:else}
					<a href="/login" class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
						Sign In
					</a>
					<a href="/login" class="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 transition">
						Get Started
					</a>
				{/if}
			</div>
		</div>
	</header>

	<!-- Hero Section -->
	<section class="relative px-6 py-20 lg:py-32">
		<div class="mx-auto max-w-5xl text-center">
			<span class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-6">
				Powered by Gemini 3.5 & Garmin MCP
			</span>
			<h1 class="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
				Your Garmin training data, <br/>
				<span class="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">unlocked with intelligence.</span>
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
				purecadence.ai connects to your Garmin account using state-of-the-art AI. Ask questions, analyze performance trends, build workouts, and schedule them directly to your wrist.
			</p>
			<div class="mt-10 flex items-center justify-center gap-x-6">
				{#if data?.isLoggedIn}
					<a href="/chat" class="rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition">
						Go to Coach Chat
					</a>
				{:else}
					<a href="/login" class="rounded-full bg-slate-950 px-8 py-3.5 text-base font-semibold text-white hover:bg-slate-800 shadow-md transition">
						Connect Your Garmin
					</a>
					<a href="#features" class="text-sm font-semibold leading-6 text-slate-900 hover:text-indigo-600 transition">
						Learn more <span aria-hidden="true">→</span>
					</a>
				{/if}
			</div>
		</div>

		<!-- Dashboard Preview Placeholder -->
		<div class="mx-auto max-w-7xl px-6 mt-16 lg:mt-24">
			<div class="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
				<div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
					<div class="flex items-center gap-2">
						<span class="h-3 w-3 rounded-full bg-red-400"></span>
						<span class="h-3 w-3 rounded-full bg-yellow-400"></span>
						<span class="h-3 w-3 rounded-full bg-green-400"></span>
					</div>
					<span class="text-xs text-slate-400 font-mono">dashboard_preview_placeholder.png</span>
					<div class="w-12"></div>
				</div>
				<div class="rounded-lg bg-slate-50 border border-dashed border-slate-300 py-20 px-8 text-center">
					<svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 3.75-3.75V15m-18 0A4.5 4.5 0 0 1 7.5 10.5h11.25A3.75 3.75 0 0 1 22.5 15m-18 0v-4.5A4.5 4.5 0 0 1 7.5 6h11.25A3.75 3.75 0 0 1 22.5 9.75V15M12 9v11.25M12 9l3 3m-3-3-3 3" />
					</svg>
					<h3 class="mt-4 text-sm font-semibold text-slate-900">Dashboard Preview Placeholder</h3>
					<p class="mx-auto mt-2 max-w-lg text-xs text-slate-500">
						<strong>Visual description:</strong> This placeholder should display a high-fidelity screenshot of the purecadence.ai chat workspace. On the left, it should show an interactive agent conversation containing queries like "What was my HRV trend?" and on the right, dynamically rendered rich charts of body battery, training loads (ATL/CTL/TSB), or running cadence.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="border-t border-slate-200 bg-white py-24 sm:py-32">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-2xl lg:text-center">
				<h2 class="text-base font-semibold leading-7 text-indigo-600">Sync & Analyze</h2>
				<p class="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Everything you need to master your rhythm.</p>
				<p class="mt-6 text-lg leading-8 text-slate-600">
					Unlike static dashboard spreadsheets, purecadence.ai gives you a conversational, intelligent workspace capable of reading and modifying training data on your Garmin account.
				</p>
			</div>

			<div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
				<dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">

					<!-- Feature 1 -->
					<div class="flex flex-col bg-slate-50 border border-slate-200 rounded-2xl p-6">
						<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.12 2.95 2.68 3.22 1.24.22 2.5.32 3.77.31L12 21l3.3-3.22c1.27.01 2.53-.09 3.77-.31 1.56-.27 2.68-1.62 2.68-3.22V6.75c0-1.62-1.12-2.97-2.68-3.24A48.751 48.751 0 0 0 12 3.25c-2.9 0-5.71.18-8.47.51C1.88 4.03.76 5.38.76 7v6.26Z" />
							</svg>
						</div>
						<dt class="text-lg font-bold text-slate-950">AI Conversational Coach</dt>
						<dd class="mt-2 text-sm leading-6 text-slate-600">
							Ask questions about your health, steps, sleep, and workouts like you would to a personal coach. Get instant, accurate responses based on Garmin's underlying API.
						</dd>
						<div class="mt-4 rounded bg-white border border-dashed border-slate-200 p-3 text-center">
							<span class="text-[10px] font-mono text-slate-400">conversational_coach_graphic_placeholder</span>
							<p class="text-[11px] text-slate-500 mt-1 leading-normal">
								<strong>Section placeholder:</strong> Illustrates a conversational interface chat bubble featuring a workout breakdown of CTL/ATL and a suggested recovery recommendation.
							</p>
						</div>
					</div>

					<!-- Feature 2 -->
					<div class="flex flex-col bg-slate-50 border border-slate-200 rounded-2xl p-6">
						<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
							</svg>
						</div>
						<dt class="text-lg font-bold text-slate-950">Smart Workout Builder</dt>
						<dd class="mt-2 text-sm leading-6 text-slate-600">
							Create highly structured interval workouts (running, cycling, walking, strength) using simple prompt requests. The agent handles JSON compilation and schedules them directly on your watch.
						</dd>
						<div class="mt-4 rounded bg-white border border-dashed border-slate-200 p-3 text-center">
							<span class="text-[10px] font-mono text-slate-400">workout_builder_graphic_placeholder</span>
							<p class="text-[11px] text-slate-500 mt-1 leading-normal">
								<strong>Section placeholder:</strong> Displays a high-contrast layout of a custom structured workout step blocks (Warm-up, repeats, rest periods) with a watch sync loading indicator.
							</p>
						</div>
					</div>

					<!-- Feature 3 -->
					<div class="flex flex-col bg-slate-50 border border-slate-200 rounded-2xl p-6">
						<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
								<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
							</svg>
						</div>
						<dt class="text-lg font-bold text-slate-950">Advanced Performance Analysis</dt>
						<dd class="mt-2 text-sm leading-6 text-slate-600">
							Analyze aerobic decoupling, cardiac drift, climb detections, DI2 shift counts, and seasonal best power duration curves on a single dashboard, with fully custom metrics.
						</dd>
						<div class="mt-4 rounded bg-white border border-dashed border-slate-200 p-3 text-center">
							<span class="text-[10px] font-mono text-slate-400">performance_analytics_graphic_placeholder</span>
							<p class="text-[11px] text-slate-500 mt-1 leading-normal">
								<strong>Section placeholder:</strong> Illustrates complex graphs highlighting cardiovascular drift over distance, Di2 gear shifts mapped to climbs, and CTL/ATL training loads.
							</p>
						</div>
					</div>

				</dl>
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
	<section id="how-it-works" class="bg-slate-100 py-24 sm:py-32">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-base font-semibold leading-7 text-indigo-600">Three Simple Steps</h2>
				<p class="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">How purecadence.ai powers your running</p>
			</div>

			<div class="mx-auto mt-16 max-w-5xl">
				<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">

					<!-- Step 1 -->
					<div class="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
						<div class="absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white text-lg font-bold">1</div>
						<h3 class="mt-2 text-lg font-bold text-slate-950">Secure Garmin Sign-In</h3>
						<p class="mt-3 text-sm text-slate-600 leading-relaxed">
							Provide your Garmin Connect credentials through our highly secure, encrypted form. We do not store plain-text passwords—we use standard sessions and tokens saved uniquely for you.
						</p>
						<div class="mt-6 rounded bg-slate-50 border border-dashed border-slate-300 p-3 text-center">
							<span class="text-[10px] font-mono text-slate-400">secure_signin_mockup_placeholder</span>
							<p class="text-[11px] text-slate-500 mt-1">
								<strong>Section placeholder:</strong> Shows an elegant padlock symbol and simplified user credentials cards illustrating client-to-server data encryption.
							</p>
						</div>
					</div>

					<!-- Step 2 -->
					<div class="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
						<div class="absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white text-lg font-bold">2</div>
						<h3 class="mt-2 text-lg font-bold text-slate-950">Chat with purecadence.ai</h3>
						<p class="mt-3 text-sm text-slate-600 leading-relaxed">
							Our artificial intelligence reads your actual history. Simply ask questions like "Did I perform well during my threshold intervals last Thursday?" and get data-backed answers.
						</p>
						<div class="mt-6 rounded bg-slate-50 border border-dashed border-slate-300 p-3 text-center">
							<span class="text-[10px] font-mono text-slate-400">conversational_interaction_mockup_placeholder</span>
							<p class="text-[11px] text-slate-500 mt-1">
								<strong>Section placeholder:</strong> Minimal prompt-to-response interface detailing raw training data successfully parsed and summarized by Gemini.
							</p>
						</div>
					</div>

					<!-- Step 3 -->
					<div class="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
						<div class="absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-white text-lg font-bold">3</div>
						<h3 class="mt-2 text-lg font-bold text-slate-950">Sync Directly to Wrist</h3>
						<p class="mt-3 text-sm text-slate-600 leading-relaxed">
							Tell the AI to schedule a walk, run, or custom interval set. It builds the workout steps programmatically and uploads it to your Garmin calendar for synchronization with your watch.
						</p>
						<div class="mt-6 rounded bg-slate-50 border border-dashed border-slate-300 p-3 text-center">
							<span class="text-[10px] font-mono text-slate-400">garmin_watch_sync_mockup_placeholder</span>
							<p class="text-[11px] text-slate-500 mt-1">
								<strong>Section placeholder:</strong> Illustrates a vector graphic of a modern sports watch receiving a structured workout packet over the air.
							</p>
						</div>
					</div>

				</div>
			</div>
		</div>
	</section>

	<!-- Pricing Section -->
	<section id="pricing" class="bg-white py-24 sm:py-32">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-base font-semibold leading-7 text-indigo-600">Pricing Plans</h2>
				<p class="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Simple, honest plans for every athlete</p>
			</div>

			<div class="mx-auto mt-16 max-w-3xl rounded-3xl border border-slate-200 p-8 sm:p-10 bg-slate-50 flex flex-col md:flex-row gap-8 items-center justify-between shadow-sm">
				<div class="flex-1">
					<h3 class="text-xl font-bold text-slate-950">Premium Trainer Access</h3>
					<p class="mt-4 text-sm text-slate-600 leading-relaxed">
						Get absolute full access to the AI coaching assistant, unlimited workout scheduling, fitness trends analytics, sleep monitoring, and multi-user profile separation.
					</p>
					<ul class="mt-6 space-y-2 text-xs text-slate-600">
						<li class="flex items-center gap-2">
							<svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
							Full Garmin Connect MCP tool coverage
						</li>
						<li class="flex items-center gap-2">
							<svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
							Gemini 3.5 Flash direct conversational reasoning
						</li>
						<li class="flex items-center gap-2">
							<svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
							Encrypted, isolated cookie session credentials
						</li>
					</ul>
				</div>
				<div class="text-center bg-white border border-slate-200 rounded-2xl p-8 min-w-[240px] shadow-sm">
					<span class="text-sm font-semibold text-slate-500">Flat Rate</span>
					<p class="mt-2 text-4xl font-extrabold text-slate-950">$9<span class="text-base font-normal text-slate-500">/mo</span></p>
					<p class="text-xs text-slate-400 mt-1">Cancel anytime</p>
					{#if data?.isLoggedIn}
						<a href="/chat" class="mt-6 block w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition">
							Start Chatting
						</a>
					{:else}
						<a href="/login" class="mt-6 block w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition">
							Get Access Now
						</a>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-slate-200 bg-slate-50 py-12 text-center text-xs text-slate-500">
		<p>© 2026 purecadence.ai. All rights reserved. purecadence.ai is an independent tool and is not affiliated with, sponsored by, or endorsed by Garmin Ltd. or its subsidiaries.</p>
	</footer>
</div>
