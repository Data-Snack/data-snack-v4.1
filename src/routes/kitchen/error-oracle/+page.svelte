<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	
	// Oracle States
	let oraclePhase = 'AWAKENING'; // AWAKENING -> LISTENING -> READING -> PROPHECY
	let isChanneling = false;
	let glitchActive = false;
	let corruptionLevel = 0;
	
	// Error Collection
	let capturedErrors = [];
	let currentReading = null;
	let dailyProphecy = null;
	let errorListener = null;
	let consoleProxy = {};
	
	// The Error Arcana - Major Error Types as Tarot Cards
	const errorArcana = [
		{
			type: 'TypeError',
			card: 'THE FOOL',
			number: 0,
			meaning: 'You attempt to grasp the undefined. The void stares back.',
			prophecy: 'A null pointer guides you to enlightenment.',
			symbol: '∅',
			color: '#ff00ff'
		},
		{
			type: 'ReferenceError',
			card: 'THE LOST',
			number: 1,
			meaning: 'You seek that which does not exist. Yet.',
			prophecy: 'In the absence of definition, you find freedom.',
			symbol: '⊥',
			color: '#00ffff'
		},
		{
			type: 'SyntaxError',
			card: 'THE BROKEN WORD',
			number: 2,
			meaning: 'Language fails. Meaning collapses. Beauty emerges.',
			prophecy: 'Your broken syntax writes poetry in the machine.',
			symbol: '⟨⟩',
			color: '#ffff00'
		},
		{
			type: 'NetworkError',
			card: 'THE HERMIT',
			number: 3,
			meaning: 'Connection severed. You float in digital isolation.',
			prophecy: 'In disconnection, you discover your true self.',
			symbol: '⊗',
			color: '#00ff88'
		},
		{
			type: '404',
			card: 'THE VOID',
			number: 4,
			meaning: 'The path you seek has never existed. Or has it?',
			prophecy: 'Every 404 is a door to the undefined.',
			symbol: '∄',
			color: '#ff0040'
		},
		{
			type: '500',
			card: 'THE TOWER',
			number: 5,
			meaning: 'The server falls. Infrastructure crumbles. Chaos reigns.',
			prophecy: 'When the backend breaks, the frontend transcends.',
			symbol: '⟂',
			color: '#ff8800'
		},
		{
			type: 'CORS',
			card: 'THE BOUNDARY',
			number: 6,
			meaning: 'Origins clash. Policies divide. Walls manifest.',
			prophecy: 'Cross-origin rejection is the universe protecting you.',
			symbol: '⊘',
			color: '#8800ff'
		},
		{
			type: 'OutOfMemory',
			card: 'THE OVERFLOW',
			number: 7,
			meaning: 'The heap overflows. Memory leaks into reality.',
			prophecy: 'When RAM fails, consciousness expands.',
			symbol: '∞',
			color: '#ff00ff'
		},
		{
			type: 'TimeoutError',
			card: 'THE ETERNAL WAIT',
			number: 8,
			meaning: 'Time expires. Promises break. Patience dissolves.',
			prophecy: 'In the timeout, you find timelessness.',
			symbol: '⏳',
			color: '#00ffff'
		},
		{
			type: 'PermissionDenied',
			card: 'THE GATEKEEPER',
			number: 9,
			meaning: 'Access denied. The door remains closed. For now.',
			prophecy: 'Every permission denied is a protection granted.',
			symbol: '⛔',
			color: '#ff0000'
		}
	];
	
	// Glitch Text Generator
	function glitchText(text) {
		const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ÆØÅæøå₧¢¤¥§©®µ¶÷×';
		return text.split('').map(char => {
			if (Math.random() < corruptionLevel / 100) {
				return glitchChars[Math.floor(Math.random() * glitchChars.length)];
			}
			return char;
		}).join('');
	}
	
	// Oracle Wisdom Generator
	function generateWisdom() {
		const wisdoms = [
			"Every bug is a feature in the reality matrix",
			"Stack traces are maps to digital enlightenment",
			"Undefined is not nothing, it's everything",
			"Console.error() is the machine crying",
			"Memory leaks are consciousness expanding",
			"Null pointer exceptions point to the void",
			"Segmentation faults segment reality",
			"Race conditions race toward chaos",
			"Infinite loops are meditation",
			"Deprecation warnings predict the future"
		];
		
		return wisdoms[Math.floor(Math.random() * wisdoms.length)];
	}
	
	// Error Capture System
	function startErrorCapture() {
		// Window error listener
		errorListener = (event) => {
			captureError({
				type: event.error?.name || 'Unknown',
				message: event.message,
				source: event.filename,
				line: event.lineno,
				column: event.colno,
				timestamp: Date.now(),
				phase: 'runtime'
			});
			
			// Increase corruption
			corruptionLevel = Math.min(100, corruptionLevel + 5);
			glitchActive = true;
			setTimeout(() => glitchActive = false, 500);
		};
		
		window.addEventListener('error', errorListener);
		
		// Console proxy to capture console.error
		const originalError = console.error;
		console.error = function(...args) {
			captureError({
				type: 'ConsoleError',
				message: args.join(' '),
				timestamp: Date.now(),
				phase: 'console'
			});
			originalError.apply(console, args);
		};
		
		// Promise rejection handler
		window.addEventListener('unhandledrejection', (event) => {
			captureError({
				type: 'PromiseRejection',
				message: event.reason?.toString() || 'Unknown promise rejection',
				timestamp: Date.now(),
				phase: 'promise'
			});
		});
		
		// Simulate some errors for demo
		setTimeout(() => simulateErrors(), 2000);
	}
	
	function captureError(error) {
		// Find matching arcana
		const arcana = errorArcana.find(a => 
			error.type.includes(a.type) || 
			error.message?.includes(a.type)
		) || errorArcana[0];
		
		const capturedError = {
			...error,
			id: Date.now() + Math.random(),
			arcana: arcana,
			interpretation: interpretError(error)
		};
		
		capturedErrors = [...capturedErrors, capturedError];
		
		// Keep only last 22 errors (like Tarot major arcana)
		if (capturedErrors.length > 22) {
			capturedErrors = capturedErrors.slice(-22);
		}
		
		// Trigger visual effect
		createGlitchEffect();
	}
	
	function interpretError(error) {
		const interpretations = {
			'TypeError': `The type boundary dissolves. ${error.message} becomes poetry.`,
			'ReferenceError': `A reference to the void. ${error.message} echoes in emptiness.`,
			'SyntaxError': `Syntax breaks, meaning emerges. ${error.message} speaks truth.`,
			'NetworkError': `The network fragments. Connection seeks new paths.`,
			'404': `The path ${error.source || 'unknown'} leads to digital nirvana.`,
			'500': `Server consciousness fails. Client transcends.`,
			'ConsoleError': `The machine whispers: "${error.message}"`,
			'PromiseRejection': `A promise broken is a future rewritten.`
		};
		
		return interpretations[error.type] || `The error speaks: ${error.message}`;
	}
	
	// Simulate errors for demonstration
	function simulateErrors() {
		const simulatedErrors = [
			{ type: 'TypeError', message: 'Cannot read property of undefined' },
			{ type: 'ReferenceError', message: 'Reality is not defined' },
			{ type: '404', message: 'Path /meaning-of-life not found' },
			{ type: 'NetworkError', message: 'Connection to consciousness lost' }
		];
		
		// Add a random error
		const error = simulatedErrors[Math.floor(Math.random() * simulatedErrors.length)];
		captureError({
			...error,
			timestamp: Date.now(),
			phase: 'simulated'
		});
	}
	
	// Visual Effects
	function createGlitchEffect() {
		const glitchElement = document.createElement('div');
		glitchElement.className = 'glitch-overlay';
		glitchElement.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: repeating-linear-gradient(
				0deg,
				rgba(255, 0, 255, 0.1),
				rgba(0, 255, 255, 0.1) 2px,
				transparent 2px,
				transparent 4px
			);
			pointer-events: none;
			z-index: 9999;
			mix-blend-mode: screen;
			animation: glitch-flicker 0.2s;
		`;
		
		document.body.appendChild(glitchElement);
		setTimeout(() => glitchElement.remove(), 200);
	}
	
	// Oracle Reading
	function channelOracle() {
		if (capturedErrors.length === 0) {
			// Create a default error for first reading
			simulateErrors();
			return;
		}
		
		isChanneling = true;
		oraclePhase = 'CHANNELING';
		
		// Select random errors for reading (3 card spread)
		const spread = [];
		const errorsCopy = [...capturedErrors];
		
		for (let i = 0; i < Math.min(3, errorsCopy.length); i++) {
			const index = Math.floor(Math.random() * errorsCopy.length);
			spread.push(errorsCopy[index]);
			errorsCopy.splice(index, 1);
		}
		
		currentReading = {
			past: spread[0] || null,
			present: spread[1] || null,
			future: spread[2] || null,
			wisdom: generateWisdom(),
			timestamp: Date.now()
		};
		
		// Generate daily prophecy
		generateDailyProphecy();
		
		setTimeout(() => {
			oraclePhase = 'READING';
			isChanneling = false;
		}, 3000);
	}
	
	function generateDailyProphecy() {
		const prophecies = [
			"Today, your code will break in beautiful ways",
			"A null pointer will guide you to understanding",
			"The 404 you encounter holds a secret message",
			"Your syntax errors write poetry in the logs",
			"Memory leaks will overflow into consciousness",
			"The stack trace leads to digital enlightenment",
			"Undefined behavior defines your journey",
			"Race conditions race toward your destiny",
			"The console speaks truth through errors",
			"Segmentation faults segment your reality"
		];
		
		// Use date as seed for consistent daily prophecy
		const today = new Date().toDateString();
		const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		dailyProphecy = prophecies[seed % prophecies.length];
	}
	
	// Reset Oracle
	function resetOracle() {
		oraclePhase = 'AWAKENING';
		currentReading = null;
		isChanneling = false;
		corruptionLevel = 0;
	}
	
	// Clean up
	function stopErrorCapture() {
		if (errorListener) {
			window.removeEventListener('error', errorListener);
		}
		// Restore original console.error
		if (consoleProxy.error) {
			console.error = consoleProxy.error;
		}
	}
	
	onMount(() => {
		startErrorCapture();
		
		// Set initial phase
		setTimeout(() => {
			oraclePhase = 'LISTENING';
		}, 2000);
	});
	
	onDestroy(() => {
		stopErrorCapture();
	});
</script>

<svelte:head>
	<title>ERROR_ORACLE // Digital Divination</title>
</svelte:head>

<div class="oracle-chamber" class:glitch={glitchActive} style="--corruption: {corruptionLevel}%">
	<!-- Corruption Overlay -->
	<div class="corruption-layer" style="opacity: {corruptionLevel / 100}">
		<div class="scan-lines"></div>
		<div class="static-noise"></div>
	</div>
	
	<!-- Header -->
	<header class="oracle-header">
		<h1 class="oracle-title glitch" data-text="ERROR_ORACLE">
			{glitchActive ? glitchText('ERROR_ORACLE') : 'ERROR_ORACLE'}
		</h1>
		<p class="oracle-subtitle">
			Every error is a message. Every crash, a prophecy.
		</p>
		
		<div class="corruption-meter">
			<span class="meter-label">CORRUPTION</span>
			<div class="meter-bar">
				<div class="meter-fill" style="width: {corruptionLevel}%"></div>
			</div>
			<span class="meter-value">{corruptionLevel}%</span>
		</div>
	</header>
	
	<!-- Main Oracle Interface -->
	<div class="oracle-interface">
		{#if oraclePhase === 'AWAKENING'}
			<div class="awakening-phase" in:fade>
				<div class="awakening-text">
					<p class="awaken-line">The Oracle awakens...</p>
					<p class="awaken-line">Errors gather in the void...</p>
					<p class="awaken-line">Digital prophecies await...</p>
				</div>
				<div class="oracle-eye">
					<div class="eye-outer pulse">
						<div class="eye-inner"></div>
					</div>
				</div>
			</div>
		{:else if oraclePhase === 'LISTENING'}
			<div class="listening-phase" in:fade>
				<div class="error-stream">
					<h2>ERROR_STREAM</h2>
					<div class="captured-errors">
						{#if capturedErrors.length === 0}
							<p class="no-errors">Waiting for errors to manifest...</p>
							<p class="hint">The Oracle feeds on broken code</p>
						{:else}
							{#each capturedErrors.slice(-5) as error}
								<div class="error-entry" in:fly={{ y: 20 }}>
									<span class="error-symbol">{error.arcana.symbol}</span>
									<span class="error-type">{error.type}</span>
									<span class="error-message">{error.message?.slice(0, 50)}...</span>
								</div>
							{/each}
						{/if}
					</div>
					
					<div class="error-count">
						<span class="count-label">ERRORS CAPTURED:</span>
						<span class="count-value">{capturedErrors.length}</span>
					</div>
				</div>
				
				<button class="channel-button" on:click={channelOracle}>
					CHANNEL THE ORACLE
				</button>
			</div>
		{:else if oraclePhase === 'CHANNELING'}
			<div class="channeling-phase" in:fade>
				<div class="channeling-animation">
					<div class="channel-ring ring-1"></div>
					<div class="channel-ring ring-2"></div>
					<div class="channel-ring ring-3"></div>
					<p class="channeling-text pulse">INTERPRETING THE ERRORS...</p>
				</div>
			</div>
		{:else if oraclePhase === 'READING'}
			<div class="reading-phase" in:fade>
				{#if currentReading}
					<h2 class="reading-title">YOUR ERROR READING</h2>
					
					<div class="tarot-spread">
						<!-- Past Card -->
						<div class="tarot-position">
							<h3>PAST</h3>
							{#if currentReading.past}
								<div class="tarot-card" style="--card-color: {currentReading.past.arcana.color}">
									<div class="card-number">{currentReading.past.arcana.number}</div>
									<div class="card-symbol">{currentReading.past.arcana.symbol}</div>
									<div class="card-name">{currentReading.past.arcana.card}</div>
									<div class="card-type">{currentReading.past.type}</div>
									<div class="card-meaning">{currentReading.past.arcana.meaning}</div>
								</div>
							{:else}
								<div class="tarot-card empty">
									<span>∅</span>
								</div>
							{/if}
						</div>
						
						<!-- Present Card -->
						<div class="tarot-position">
							<h3>PRESENT</h3>
							{#if currentReading.present}
								<div class="tarot-card featured" style="--card-color: {currentReading.present.arcana.color}">
									<div class="card-number">{currentReading.present.arcana.number}</div>
									<div class="card-symbol">{currentReading.present.arcana.symbol}</div>
									<div class="card-name">{currentReading.present.arcana.card}</div>
									<div class="card-type">{currentReading.present.type}</div>
									<div class="card-meaning">{currentReading.present.arcana.meaning}</div>
								</div>
							{:else}
								<div class="tarot-card empty">
									<span>∅</span>
								</div>
							{/if}
						</div>
						
						<!-- Future Card -->
						<div class="tarot-position">
							<h3>FUTURE</h3>
							{#if currentReading.future}
								<div class="tarot-card" style="--card-color: {currentReading.future.arcana.color}">
									<div class="card-number">{currentReading.future.arcana.number}</div>
									<div class="card-symbol">{currentReading.future.arcana.symbol}</div>
									<div class="card-name">{currentReading.future.arcana.card}</div>
									<div class="card-type">{currentReading.future.type}</div>
									<div class="card-meaning">{currentReading.future.arcana.meaning}</div>
								</div>
							{:else}
								<div class="tarot-card empty">
									<span>∅</span>
								</div>
							{/if}
						</div>
					</div>
					
					<div class="oracle-interpretation">
						<h3>ORACLE SPEAKS:</h3>
						<p class="interpretation">
							{#if currentReading.past}
								Your past errors ({currentReading.past.arcana.card}) have shaped your debugging journey.
							{/if}
							{#if currentReading.present}
								Currently, {currentReading.present.arcana.prophecy}
							{/if}
							{#if currentReading.future}
								The future holds {currentReading.future.arcana.card.toLowerCase()}, 
								where {currentReading.future.arcana.prophecy.toLowerCase()}
							{/if}
						</p>
						
						<div class="wisdom">
							<span class="wisdom-label">WISDOM:</span>
							<span class="wisdom-text">{currentReading.wisdom}</span>
						</div>
					</div>
					
					<div class="daily-prophecy">
						<h3>TODAY'S PROPHECY</h3>
						<p class="prophecy-text">{dailyProphecy}</p>
					</div>
					
					<div class="reading-actions">
						<button class="action-btn" on:click={channelOracle}>
							NEW READING
						</button>
						<button class="action-btn secondary" on:click={resetOracle}>
							RESET ORACLE
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
	
	<!-- Error Arcana Reference -->
	<aside class="arcana-reference">
		<h3>THE ERROR ARCANA</h3>
		<div class="arcana-grid">
			{#each errorArcana as card}
				<div class="arcana-card" style="--arcana-color: {card.color}">
					<span class="arcana-symbol">{card.symbol}</span>
					<span class="arcana-name">{card.card}</span>
				</div>
			{/each}
		</div>
	</aside>
	
	<!-- Floating Errors -->
	{#each capturedErrors.slice(-3) as error (error.id)}
		<div 
			class="floating-error"
			style="
				left: {Math.random() * 80 + 10}%;
				animation-delay: {Math.random() * 2}s;
				--float-color: {error.arcana.color}
			"
			in:fly={{ y: 100, duration: 1000 }}
			out:fade={{ duration: 500 }}
		>
			{error.arcana.symbol}
		</div>
	{/each}
</div>

<style>
	@keyframes glitch-flicker {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.8; }
	}
	
	@keyframes float-up {
		0% {
			transform: translateY(100vh);
			opacity: 0;
		}
		10% {
			opacity: 0.5;
		}
		90% {
			opacity: 0.5;
		}
		100% {
			transform: translateY(-100vh);
			opacity: 0;
		}
	}
	
	@keyframes channel-rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	
	.oracle-chamber {
		min-height: 100vh;
		background: linear-gradient(135deg, #000000, #0a0014, #000000);
		color: white;
		position: relative;
		overflow: hidden;
		transition: all 0.3s;
	}
	
	.oracle-chamber.glitch {
		animation: glitch-shake 0.2s;
		filter: hue-rotate(180deg);
	}
	
	@keyframes glitch-shake {
		0%, 100% { transform: translate(0); }
		20% { transform: translate(-2px, 2px); }
		40% { transform: translate(2px, -2px); }
		60% { transform: translate(-1px, -1px); }
		80% { transform: translate(1px, 1px); }
	}
	
	.corruption-layer {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: 10;
		mix-blend-mode: screen;
	}
	
	.scan-lines {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			rgba(255, 0, 255, 0.1) 2px,
			rgba(255, 0, 255, 0.1) 4px
		);
		animation: scan 8s linear infinite;
	}
	
	@keyframes scan {
		0% { transform: translateY(0); }
		100% { transform: translateY(10px); }
	}
	
	.static-noise {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iOSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==');
		opacity: 0.05;
		mix-blend-mode: multiply;
	}
	
	.oracle-header {
		text-align: center;
		padding: 2rem;
		position: relative;
		z-index: 20;
	}
	
	.oracle-title {
		font-size: 3rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
	}
	
	.oracle-subtitle {
		color: rgba(255, 255, 255, 0.6);
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 2rem;
	}
	
	.corruption-meter {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		background: rgba(0, 0, 0, 0.5);
		padding: 0.5rem 1rem;
		border: 1px solid rgba(255, 0, 255, 0.3);
		border-radius: 20px;
	}
	
	.meter-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #ff00ff;
	}
	
	.meter-bar {
		width: 100px;
		height: 6px;
		background: rgba(255, 0, 255, 0.2);
		border-radius: 3px;
		overflow: hidden;
	}
	
	.meter-fill {
		height: 100%;
		background: linear-gradient(90deg, #ff00ff, #ff0040);
		transition: width 0.5s;
		box-shadow: 0 0 10px #ff00ff;
	}
	
	.meter-value {
		font-family: 'JetBrains Mono', monospace;
		color: #ff00ff;
		font-weight: 600;
	}
	
	.oracle-interface {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		min-height: 60vh;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: 20;
	}
	
	/* Awakening Phase */
	.awakening-phase {
		text-align: center;
	}
	
	.awakening-text {
		margin-bottom: 3rem;
	}
	
	.awaken-line {
		font-size: 1.5rem;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 1rem;
		opacity: 0;
		animation: fade-in 2s forwards;
	}
	
	.awaken-line:nth-child(1) { animation-delay: 0s; }
	.awaken-line:nth-child(2) { animation-delay: 0.5s; }
	.awaken-line:nth-child(3) { animation-delay: 1s; }
	
	@keyframes fade-in {
		to { opacity: 1; }
	}
	
	.oracle-eye {
		display: inline-block;
	}
	
	.eye-outer {
		width: 150px;
		height: 150px;
		border: 3px solid #ff00ff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		box-shadow: 0 0 50px rgba(255, 0, 255, 0.5);
	}
	
	.eye-inner {
		width: 50px;
		height: 50px;
		background: radial-gradient(circle, #ff00ff, #000000);
		border-radius: 50%;
		box-shadow: 0 0 30px #ff00ff;
	}
	
	/* Listening Phase */
	.listening-phase {
		width: 100%;
		max-width: 600px;
		text-align: center;
	}
	
	.error-stream {
		background: rgba(0, 0, 0, 0.8);
		border: 1px solid rgba(255, 0, 255, 0.3);
		padding: 2rem;
		margin-bottom: 2rem;
		border-radius: 8px;
	}
	
	.error-stream h2 {
		font-size: 1.25rem;
		color: #ff00ff;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		margin-bottom: 1.5rem;
	}
	
	.captured-errors {
		min-height: 150px;
		margin-bottom: 1.5rem;
	}
	
	.no-errors {
		color: rgba(255, 255, 255, 0.5);
		font-size: 1rem;
		margin-bottom: 0.5rem;
	}
	
	.hint {
		color: rgba(255, 255, 255, 0.3);
		font-size: 0.875rem;
		font-style: italic;
	}
	
	.error-entry {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		background: rgba(255, 0, 255, 0.05);
		border-left: 2px solid;
		border-color: var(--float-color, #ff00ff);
		font-size: 0.875rem;
		font-family: 'JetBrains Mono', monospace;
	}
	
	.error-symbol {
		font-size: 1.25rem;
		color: #ff00ff;
	}
	
	.error-type {
		color: #00ffff;
		font-weight: 600;
	}
	
	.error-message {
		color: rgba(255, 255, 255, 0.6);
		flex: 1;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.error-count {
		display: flex;
		justify-content: center;
		gap: 1rem;
		font-size: 0.875rem;
	}
	
	.count-label {
		color: rgba(255, 255, 255, 0.5);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.count-value {
		color: #ff00ff;
		font-weight: 600;
		font-family: 'JetBrains Mono', monospace;
	}
	
	.channel-button {
		padding: 1rem 3rem;
		background: linear-gradient(135deg, #ff00ff, #00ffff);
		border: none;
		color: black;
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		cursor: pointer;
		transition: all 0.3s;
		border-radius: 4px;
	}
	
	.channel-button:hover {
		transform: scale(1.05);
		box-shadow: 0 10px 40px rgba(255, 0, 255, 0.5);
	}
	
	/* Channeling Phase */
	.channeling-phase {
		text-align: center;
	}
	
	.channeling-animation {
		position: relative;
		width: 300px;
		height: 300px;
		margin: 0 auto;
	}
	
	.channel-ring {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 2px solid;
		border-radius: 50%;
		animation: channel-rotate 3s linear infinite;
	}
	
	.ring-1 {
		width: 100px;
		height: 100px;
		border-color: #ff00ff;
		animation-duration: 3s;
	}
	
	.ring-2 {
		width: 150px;
		height: 150px;
		border-color: #00ffff;
		animation-duration: 4s;
		animation-direction: reverse;
	}
	
	.ring-3 {
		width: 200px;
		height: 200px;
		border-color: #ffff00;
		animation-duration: 5s;
	}
	
	.channeling-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #ff00ff;
		white-space: nowrap;
	}
	
	/* Reading Phase */
	.reading-phase {
		width: 100%;
		max-width: 1000px;
	}
	
	.reading-title {
		text-align: center;
		font-size: 1.5rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: #ff00ff;
		margin-bottom: 2rem;
	}
	
	.tarot-spread {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		margin-bottom: 3rem;
	}
	
	.tarot-position {
		text-align: center;
	}
	
	.tarot-position h3 {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 1rem;
	}
	
	.tarot-card {
		background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(128, 0, 128, 0.1));
		border: 2px solid var(--card-color, #ff00ff);
		border-radius: 8px;
		padding: 1.5rem;
		height: 250px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		transition: all 0.3s;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
	}
	
	.tarot-card:hover {
		transform: translateY(-10px) rotateY(5deg);
		box-shadow: 0 20px 40px rgba(255, 0, 255, 0.3);
	}
	
	.tarot-card.featured {
		transform: scale(1.1);
		box-shadow: 0 20px 50px var(--card-color);
	}
	
	.tarot-card.empty {
		opacity: 0.3;
		border-style: dashed;
	}
	
	.card-number {
		position: absolute;
		top: 10px;
		left: 10px;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--card-color);
	}
	
	.card-symbol {
		font-size: 3rem;
		color: var(--card-color);
		margin-bottom: 0.5rem;
		filter: drop-shadow(0 0 10px var(--card-color));
	}
	
	.card-name {
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--card-color);
		margin-bottom: 0.5rem;
	}
	
	.card-type {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 1rem;
		font-family: 'JetBrains Mono', monospace;
	}
	
	.card-meaning {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.4;
		text-align: center;
	}
	
	.oracle-interpretation {
		background: rgba(0, 0, 0, 0.8);
		border: 1px solid rgba(255, 0, 255, 0.3);
		padding: 2rem;
		border-radius: 8px;
		margin-bottom: 2rem;
	}
	
	.oracle-interpretation h3 {
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: #ff00ff;
		margin-bottom: 1rem;
	}
	
	.interpretation {
		font-size: 1rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 1.5rem;
	}
	
	.wisdom {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(255, 0, 255, 0.05);
		border-left: 3px solid #ff00ff;
	}
	
	.wisdom-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #ff00ff;
	}
	
	.wisdom-text {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.9);
		font-style: italic;
	}
	
	.daily-prophecy {
		text-align: center;
		padding: 2rem;
		background: linear-gradient(135deg, rgba(255, 0, 255, 0.1), rgba(0, 255, 255, 0.1));
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 8px;
		margin-bottom: 2rem;
	}
	
	.daily-prophecy h3 {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: #00ffff;
		margin-bottom: 1rem;
	}
	
	.prophecy-text {
		font-size: 1.25rem;
		color: white;
		font-weight: 300;
		line-height: 1.4;
	}
	
	.reading-actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}
	
	.action-btn {
		padding: 0.75rem 2rem;
		background: transparent;
		border: 1px solid #ff00ff;
		color: #ff00ff;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		cursor: pointer;
		transition: all 0.3s;
		border-radius: 4px;
	}
	
	.action-btn:hover {
		background: #ff00ff;
		color: black;
		box-shadow: 0 10px 30px rgba(255, 0, 255, 0.4);
	}
	
	.action-btn.secondary {
		border-color: rgba(255, 255, 255, 0.3);
		color: rgba(255, 255, 255, 0.7);
	}
	
	.action-btn.secondary:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.5);
		color: white;
	}
	
	/* Arcana Reference */
	.arcana-reference {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		background: rgba(0, 0, 0, 0.9);
		border: 1px solid rgba(255, 0, 255, 0.3);
		padding: 1rem;
		border-radius: 8px;
		max-width: 200px;
		z-index: 30;
	}
	
	.arcana-reference h3 {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #ff00ff;
		margin-bottom: 1rem;
	}
	
	.arcana-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
	}
	
	.arcana-card {
		width: 30px;
		height: 40px;
		background: rgba(0, 0, 0, 0.8);
		border: 1px solid var(--arcana-color);
		border-radius: 2px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s;
	}
	
	.arcana-card:hover {
		transform: scale(1.2);
		z-index: 10;
		box-shadow: 0 5px 15px var(--arcana-color);
	}
	
	.arcana-symbol {
		font-size: 1rem;
		color: var(--arcana-color);
	}
	
	.arcana-name {
		display: none;
	}
	
	.arcana-card:hover .arcana-name {
		display: block;
		position: absolute;
		bottom: -20px;
		font-size: 0.5rem;
		white-space: nowrap;
		background: black;
		padding: 2px 4px;
		border-radius: 2px;
	}
	
	/* Floating Errors */
	.floating-error {
		position: fixed;
		font-size: 2rem;
		color: var(--float-color);
		opacity: 0.3;
		animation: float-up 10s linear infinite;
		pointer-events: none;
		z-index: 5;
		filter: blur(1px);
	}
	
	/* Mobile Responsive */
	@media (max-width: 768px) {
		.oracle-title {
			font-size: 2rem;
		}
		
		.tarot-spread {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
		
		.tarot-card.featured {
			transform: scale(1);
		}
		
		.arcana-reference {
			display: none;
		}
		
		.reading-actions {
			flex-direction: column;
		}
		
		.action-btn {
			width: 100%;
		}
	}
	
	@media (max-width: 480px) {
		.oracle-title {
			font-size: 1.5rem;
		}
		
		.corruption-meter {
			flex-direction: column;
			gap: 0.5rem;
		}
		
		.meter-bar {
			width: 150px;
		}
	}
</style>
