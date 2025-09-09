<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import { snackPerzepts } from '$lib/stores/perzeptEngine.js';
	
	// Game States
	let gamePhase = 'LOADING'; // LOADING -> READY -> SPINNING -> FIRED -> RESULT
	let cylinder = null;
	let currentChamber = 0;
	let firedChambers = [];
	let isSpinning = false;
	let triggerPulled = false;
	let survivedShots = 0;
	
	// Audio context for sound effects
	let audioContext;
	let clickSound;
	
	// The 6 Chambers of Data Death
	const chambers = [
		{
			id: 1,
			type: 'ESSENTIAL',
			loaded: false,
			color: '#00ff88',
			trackers: ['Session Storage', 'Basic Analytics'],
			impact: 'Minimal tracking - You still have privacy',
			description: 'Only essential cookies for site functionality',
			severity: 1
		},
		{
			id: 2,
			type: 'ANALYTICS',
			loaded: true,
			color: '#00ffff',
			trackers: ['Google Analytics', 'Hotjar', 'Mixpanel'],
			impact: 'Behavioral analysis begins',
			description: 'Your every move is being recorded and analyzed',
			severity: 3
		},
		{
			id: 3,
			type: 'MARKETING',
			loaded: false,
			color: '#ffff00',
			trackers: ['Facebook Pixel', 'LinkedIn Insight', 'Twitter Pixel'],
			impact: 'You are now a product',
			description: 'Cross-site tracking activated. Your profile is being sold.',
			severity: 5
		},
		{
			id: 4,
			type: 'ADVERTISING',
			loaded: true,
			color: '#ff00ff',
			trackers: ['Google Ads', 'Amazon Ads', 'Criteo', 'AdRoll'],
			impact: 'Complete commercial surveillance',
			description: 'Every desire catalogued. Every weakness exploited.',
			severity: 7
		},
		{
			id: 5,
			type: 'SOCIAL',
			loaded: false,
			color: '#ff0040',
			trackers: ['Facebook SDK', 'TikTok Pixel', 'Snapchat Pixel'],
			impact: 'Social graph fully mapped',
			description: 'Your relationships are data points. Your emotions are metrics.',
			severity: 8
		},
		{
			id: 6,
			type: 'TOTAL_SURVEILLANCE',
			loaded: true,
			color: '#ff0000',
			trackers: ['Device Fingerprinting', 'Canvas Tracking', 'WebRTC Leak', 'Font Detection', 'Audio Context', 'WebGL Signature'],
			impact: 'DIGITAL DEATH - No privacy remains',
			description: 'Complete identity theft. You are transparent. You are owned.',
			severity: 10
		}
	];
	
	// Shuffle chambers on mount
	function shuffleChambers() {
		// Randomize which chambers are loaded (3 loaded, 3 empty)
		const loadedIndices = [];
		while (loadedIndices.length < 3) {
			const idx = Math.floor(Math.random() * 6);
			if (!loadedIndices.includes(idx)) {
				loadedIndices.push(idx);
			}
		}
		
		chambers.forEach((chamber, i) => {
			chamber.loaded = loadedIndices.includes(i);
		});
	}
	
	// Visual tracking effects
	let activeTrackers = [];
	let dataStreams = [];
	let glitchActive = false;
	
	// Stats tracking
	let stats = {
		shotsTotal: 0,
		shotsSurvived: 0,
		dataLeaked: [],
		privacyHealth: 100
	};
	
	// Initialize audio
	function initAudio() {
		// User interaction required for audio
		if (!audioContext) {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
		}
		
		// Create click sound
		clickSound = () => {
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();
			
			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);
			
			oscillator.frequency.value = 800;
			oscillator.type = 'square';
			
			gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
			
			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.1);
		};
		
		// Spin sound
		window.spinSound = () => {
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();
			
			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);
			
			oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
			oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
			oscillator.type = 'sawtooth';
			
			gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
			
			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.5);
		};
		
		// Fire sound (empty chamber)
		window.emptySound = () => {
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();
			
			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);
			
			oscillator.frequency.value = 150;
			oscillator.type = 'triangle';
			
			gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
			
			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.05);
		};
		
		// Fire sound (loaded chamber) 
		window.loadedSound = () => {
			const noise = audioContext.createBufferSource();
			const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.2, audioContext.sampleRate);
			const data = buffer.getChannelData(0);
			
			for (let i = 0; i < buffer.length; i++) {
				data[i] = Math.random() * 2 - 1;
			}
			
			noise.buffer = buffer;
			
			const filter = audioContext.createBiquadFilter();
			filter.type = 'lowpass';
			filter.frequency.value = 1000;
			
			const gainNode = audioContext.createGain();
			gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
			
			noise.connect(filter);
			filter.connect(gainNode);
			gainNode.connect(audioContext.destination);
			
			noise.start();
		};
	}
	
	// Spin the cylinder
	function spinCylinder() {
		if (isSpinning || gamePhase !== 'READY') return;
		
		isSpinning = true;
		gamePhase = 'SPINNING';
		
		// Generate anxiety perzept
		snackPerzepts.cookieRoulette.anxiety(stats.shotsTotal + 1);
		
		// Play spin sound
		if (window.spinSound) window.spinSound();
		
		// Random spin amount
		const spins = 3 + Math.random() * 3;
		const finalChamber = Math.floor(Math.random() * 6);
		
		// Animate cylinder rotation
		if (cylinder) {
			cylinder.style.transition = 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
			cylinder.style.transform = `rotate(${spins * 360 + finalChamber * 60}deg)`;
		}
		
		setTimeout(() => {
			currentChamber = finalChamber;
			isSpinning = false;
			gamePhase = 'READY';
		}, 2000);
	}
	
	// Pull the trigger
	function pullTrigger() {
		if (gamePhase !== 'READY' || triggerPulled) return;
		
		triggerPulled = true;
		gamePhase = 'FIRED';
		stats.shotsTotal++;
		
		// Generate danger perzept based on chamber risk
		snackPerzepts.cookieRoulette.danger(currentChamber / 6);
		
		// Click sound
		if (clickSound) clickSound();
		
		const chamber = chambers[currentChamber];
		firedChambers = [...firedChambers, currentChamber];
		
		setTimeout(() => {
			if (chamber.loaded) {
				// BANG! Privacy dies
				if (window.loadedSound) window.loadedSound();
				activateTrackers(chamber);
				glitchActive = true;
				stats.privacyHealth -= chamber.severity * 10;
				
				// Generate surveillance perzept based on severity
				snackPerzepts.cookieRoulette.surveillance(chamber.severity);
				snackPerzepts.cookieRoulette.danger(chamber.severity / 10);
				
				gamePhase = 'HIT';
				
				// Glitch effect
				setTimeout(() => {
					glitchActive = false;
					gamePhase = 'RESULT';
				}, 1500);
			} else {
				// Click - survived
				if (window.emptySound) window.emptySound();
				stats.shotsSurvived++;
				survivedShots++;
				gamePhase = 'SURVIVED';
				
				setTimeout(() => {
					gamePhase = 'READY';
					triggerPulled = false;
					// Auto-advance to next chamber
					currentChamber = (currentChamber + 1) % 6;
					if (cylinder) {
						cylinder.style.transition = 'transform 0.3s ease-out';
						cylinder.style.transform = `rotate(${(currentChamber * 60)}deg)`;
					}
				}, 1000);
			}
		}, 300);
	}
	
	// Activate tracking visualization
	function activateTrackers(chamber) {
		activeTrackers = [...activeTrackers, ...chamber.trackers];
		stats.dataLeaked = [...stats.dataLeaked, chamber.type];
		
		// Create visual data streams
		for (let i = 0; i < chamber.trackers.length; i++) {
			setTimeout(() => {
				dataStreams = [...dataStreams, {
					id: Date.now() + i,
					tracker: chamber.trackers[i],
					color: chamber.color
				}];
			}, i * 100);
		}
	}
	
	// Reset game
	function resetGame() {
		gamePhase = 'LOADING';
		currentChamber = 0;
		firedChambers = [];
		isSpinning = false;
		triggerPulled = false;
		survivedShots = 0;
		activeTrackers = [];
		dataStreams = [];
		glitchActive = false;
		stats = {
			shotsTotal: 0,
			shotsSurvived: 0,
			dataLeaked: [],
			privacyHealth: 100
		};
		
		shuffleChambers();
		
		setTimeout(() => {
			gamePhase = 'READY';
		}, 1000);
	}
	
	// Accept all cookies (coward mode)
	function acceptAll() {
		gamePhase = 'TOTAL_SURVEILLANCE';
		chambers.forEach(chamber => {
			activateTrackers(chamber);
		});
		stats.privacyHealth = 0;
		glitchActive = true;
	}
	
	// Reject all (hero mode)
	function rejectAll() {
		gamePhase = 'FREEDOM';
		activeTrackers = [];
		stats.privacyHealth = 100;
	}
	
	onMount(() => {
		initAudio();
		shuffleChambers();
		
		setTimeout(() => {
			gamePhase = 'READY';
		}, 1500);
		
		// Get cylinder element
		cylinder = document.querySelector('.cylinder');
	});
	
	onDestroy(() => {
		if (audioContext) {
			audioContext.close();
		}
	});
</script>

<svelte:head>
	<title>COOKIE_CONSENT_ROULETTE // Reality Kitchen</title>
</svelte:head>

<div class="roulette-chamber" class:glitch={glitchActive}>
	<!-- Background Effects -->
	<div class="scan-line"></div>
	{#each dataStreams as stream (stream.id)}
		<div 
			class="data-leak"
			style="--leak-color: {stream.color}"
			in:fly={{ y: 100, duration: 500 }}
			out:fade={{ duration: 1000 }}
		>
			{stream.tracker}
		</div>
	{/each}
	
	<!-- Header -->
	<header class="roulette-header">
		<div class="header-content">
			<h1 class="glitch neon" data-text="COOKIE_CONSENT_ROULETTE">
				COOKIE_CONSENT_ROULETTE
			</h1>
			<p class="subtitle">Your privacy. Your gamble. Your data funeral.</p>
		</div>
		
		<div class="stats-display">
			<div class="stat">
				<span class="stat-label">SHOTS</span>
				<span class="stat-value">{stats.shotsTotal}</span>
			</div>
			<div class="stat">
				<span class="stat-label">SURVIVED</span>
				<span class="stat-value">{stats.shotsSurvived}</span>
			</div>
			<div class="stat">
				<span class="stat-label">PRIVACY</span>
				<span class="stat-value" style="color: {stats.privacyHealth > 50 ? '#00ff88' : stats.privacyHealth > 20 ? '#ffff00' : '#ff0040'}">
					{stats.privacyHealth}%
				</span>
			</div>
		</div>
	</header>
	
	<!-- Main Game Area -->
	<div class="game-container">
		{#if gamePhase === 'LOADING'}
			<div class="loading-screen" in:fade>
				<div class="loading-text pulse">
					LOADING_SURVEILLANCE_APPARATUS...
				</div>
				<div class="loading-bar">
					<div class="loading-progress"></div>
				</div>
			</div>
		{:else if gamePhase === 'TOTAL_SURVEILLANCE'}
			<div class="surveillance-mode" in:scale={{ duration: 500, easing: elasticOut }}>
				<h2 class="surveillance-title glitch" data-text="TOTAL SURVEILLANCE ACTIVATED">
					TOTAL SURVEILLANCE ACTIVATED
				</h2>
				<div class="surveillance-grid">
					{#each chambers as chamber}
						<div class="surveillance-item" style="--item-color: {chamber.color}">
							<h3>{chamber.type}</h3>
							<p>{chamber.impact}</p>
							<div class="tracker-list">
								{#each chamber.trackers as tracker}
									<span class="tracker-badge">{tracker}</span>
								{/each}
							</div>
						</div>
					{/each}
				</div>
				<button class="reset-button" on:click={resetGame}>
					TRY AGAIN (IF YOU DARE)
				</button>
			</div>
		{:else if gamePhase === 'FREEDOM'}
			<div class="freedom-mode" in:scale={{ duration: 500, easing: elasticOut }}>
				<h2 class="freedom-title holo">DIGITAL FREEDOM ACHIEVED</h2>
				<p class="freedom-text">
					You rejected the surveillance state. Your data remains yours.
					But for how long can you resist?
				</p>
				<button class="reset-button" on:click={resetGame}>
					PLAY AGAIN
				</button>
			</div>
		{:else}
			<!-- Revolver Display -->
			<div class="revolver-container">
				<div class="revolver">
					<!-- Cylinder -->
					<div class="cylinder-wrapper">
						<div class="cylinder" bind:this={cylinder}>
							{#each chambers as chamber, i}
								<div 
									class="chamber"
									class:fired={firedChambers.includes(i)}
									class:current={i === currentChamber && !isSpinning}
									style="--rotation: {i * 60}deg; --chamber-color: {chamber.color}"
								>
									<div class="chamber-inner">
										{#if chamber.loaded && !firedChambers.includes(i)}
											<div class="bullet"></div>
										{/if}
									</div>
									<span class="chamber-label">{i + 1}</span>
								</div>
							{/each}
						</div>
						
						<!-- Cylinder center -->
						<div class="cylinder-center"></div>
					</div>
					
					<!-- Hammer -->
					<div class="hammer" class:cocked={gamePhase === 'READY'}>
						<div class="hammer-head"></div>
					</div>
					
					<!-- Trigger -->
					<button 
						class="trigger"
						class:pulled={triggerPulled}
						on:click={pullTrigger}
						disabled={gamePhase !== 'READY'}
					>
						<span>PULL</span>
					</button>
				</div>
				
				<!-- Current Chamber Info -->
				{#if gamePhase === 'READY' || gamePhase === 'SPINNING'}
					<div class="chamber-info" transition:fade>
						<p class="chamber-number">CHAMBER {currentChamber + 1}</p>
						<p class="chamber-unknown">CONTENTS: UNKNOWN</p>
					</div>
				{/if}
				
				<!-- Result Display -->
				{#if gamePhase === 'HIT'}
					<div class="hit-display" in:scale={{ duration: 300, easing: quintOut }}>
						<h2 class="hit-title" style="color: {chambers[currentChamber].color}">
							{chambers[currentChamber].type} ACTIVATED
						</h2>
						<p class="hit-impact">{chambers[currentChamber].impact}</p>
						<p class="hit-description">{chambers[currentChamber].description}</p>
						<div class="tracker-activation">
							<p>TRACKING SYSTEMS ONLINE:</p>
							<div class="tracker-list">
								{#each chambers[currentChamber].trackers as tracker}
									<span class="tracker-item pulse" style="animation-delay: {Math.random() * 0.5}s">
										{tracker}
									</span>
								{/each}
							</div>
						</div>
					</div>
				{:else if gamePhase === 'SURVIVED'}
					<div class="survived-display" in:scale={{ duration: 300, easing: quintOut }}>
						<h2 class="survived-title">*CLICK*</h2>
						<p class="survived-text">Empty chamber. Your privacy survives... for now.</p>
					</div>
				{:else if gamePhase === 'RESULT'}
					<div class="result-display" in:fade>
						<h2>PRIVACY STATUS REPORT</h2>
						<div class="leaked-data">
							<p>DATA LEAKED TO:</p>
							{#each stats.dataLeaked as leak}
								<span class="leak-badge">{leak}</span>
							{/each}
						</div>
						<button class="continue-button" on:click={resetGame}>
							PLAY AGAIN
						</button>
					</div>
				{/if}
			</div>
			
			<!-- Controls -->
			<div class="controls">
				<button 
					class="control-button spin-button"
					on:click={spinCylinder}
					disabled={isSpinning || gamePhase !== 'READY'}
				>
					<span class="button-icon">⟲</span>
					SPIN CYLINDER
				</button>
				
				<div class="coward-options">
					<button class="coward-button accept" on:click={acceptAll}>
						ACCEPT ALL (COWARD)
					</button>
					<button class="coward-button reject" on:click={rejectAll}>
						REJECT ALL (HERO)
					</button>
				</div>
			</div>
		{/if}
	</div>
	
	<!-- Active Trackers Display -->
	{#if activeTrackers.length > 0}
		<div class="tracker-monitor">
			<h3>ACTIVE SURVEILLANCE</h3>
			<div class="tracker-grid">
				{#each activeTrackers as tracker}
					<div class="active-tracker pulse">
						<span class="tracker-dot"></span>
						{tracker}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.roulette-chamber {
		min-height: 100vh;
		padding: 2rem;
		position: relative;
		background: var(--bg-void);
		overflow: hidden;
	}
	
	.roulette-chamber.glitch {
		animation: glitch-shake 0.3s infinite;
	}
	
	@keyframes glitch-shake {
		0%, 100% { transform: translate(0); }
		10% { transform: translate(-2px, 2px); }
		20% { transform: translate(2px, -2px); }
		30% { transform: translate(-2px, -2px); }
		40% { transform: translate(2px, 2px); }
		50% { transform: translate(-1px, 1px); }
		60% { transform: translate(1px, -1px); }
		70% { transform: translate(0, 2px); }
		80% { transform: translate(-2px, 0); }
		90% { transform: translate(2px, 0); }
	}
	
	.scan-line {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--cyan), transparent);
		animation: scan 4s linear infinite;
		pointer-events: none;
		z-index: 100;
	}
	
	@keyframes scan {
		0% { transform: translateY(0); }
		100% { transform: translateY(100vh); }
	}
	
	.data-leak {
		position: absolute;
		left: random(100%);
		color: var(--leak-color);
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		opacity: 0.7;
		animation: float-up 3s ease-out forwards;
		pointer-events: none;
	}
	
	@keyframes float-up {
		0% {
			transform: translateY(100vh);
			opacity: 0;
		}
		20% {
			opacity: 0.7;
		}
		100% {
			transform: translateY(-100vh);
			opacity: 0;
		}
	}
	
	.roulette-header {
		text-align: center;
		margin-bottom: 3rem;
	}
	
	.header-content h1 {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
	}
	
	.subtitle {
		color: var(--text-secondary);
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
	}
	
	.stats-display {
		display: flex;
		justify-content: center;
		gap: 3rem;
		margin-top: 2rem;
	}
	
	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.stat-label {
		font-size: 0.75rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.stat-value {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--cyan);
		font-family: 'JetBrains Mono', monospace;
	}
	
	.game-container {
		max-width: 1000px;
		margin: 0 auto;
		position: relative;
		min-height: 500px;
	}
	
	.loading-screen {
		text-align: center;
		padding: 5rem;
	}
	
	.loading-text {
		font-size: 1.25rem;
		color: var(--cyan);
		text-transform: uppercase;
		letter-spacing: 0.2em;
		margin-bottom: 2rem;
	}
	
	.loading-bar {
		width: 300px;
		height: 4px;
		background: rgba(0, 255, 255, 0.1);
		margin: 0 auto;
		position: relative;
		overflow: hidden;
	}
	
	.loading-progress {
		height: 100%;
		background: var(--cyan);
		animation: loading-fill 1.5s ease-out forwards;
	}
	
	@keyframes loading-fill {
		0% { width: 0; }
		100% { width: 100%; }
	}
	
	.revolver-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
	}
	
	.revolver {
		position: relative;
		width: 400px;
		height: 400px;
	}
	
	.cylinder-wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 300px;
		height: 300px;
	}
	
	.cylinder {
		width: 100%;
		height: 100%;
		position: relative;
		transform-style: preserve-3d;
		transition: transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}
	
	.chamber {
		position: absolute;
		width: 80px;
		height: 80px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-100px);
		transition: all 0.3s;
	}
	
	.chamber.current {
		filter: brightness(1.5);
		transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-100px) scale(1.1);
	}
	
	.chamber.fired .chamber-inner {
		background: rgba(0, 0, 0, 0.8);
		border-color: var(--text-dim);
	}
	
	.chamber-inner {
		width: 100%;
		height: 100%;
		border: 3px solid var(--chamber-color);
		border-radius: 50%;
		background: radial-gradient(circle, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7));
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 
			inset 0 0 20px rgba(0, 0, 0, 0.5),
			0 0 20px var(--chamber-color);
		position: relative;
	}
	
	.bullet {
		width: 30px;
		height: 30px;
		background: linear-gradient(135deg, #ffd700, #ffed4e);
		border-radius: 50% 50% 60% 60%;
		box-shadow: 
			0 0 10px rgba(255, 215, 0, 0.8),
			inset -2px -2px 5px rgba(0, 0, 0, 0.3);
		position: relative;
	}
	
	.bullet::after {
		content: '';
		position: absolute;
		top: 5px;
		left: 50%;
		transform: translateX(-50%);
		width: 20px;
		height: 15px;
		background: linear-gradient(180deg, #b8860b, #8b6914);
		border-radius: 40%;
	}
	
	.chamber-label {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 0.75rem;
		color: var(--text-secondary);
		font-weight: 600;
		pointer-events: none;
	}
	
	.cylinder-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 60px;
		height: 60px;
		background: radial-gradient(circle, #333, #000);
		border: 2px solid var(--text-dim);
		border-radius: 50%;
		box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
	}
	
	.hammer {
		position: absolute;
		top: 20%;
		left: 50%;
		transform: translateX(-50%);
		width: 40px;
		height: 60px;
		transition: transform 0.3s;
	}
	
	.hammer.cocked {
		transform: translateX(-50%) rotate(-15deg);
	}
	
	.hammer-head {
		width: 100%;
		height: 100%;
		background: linear-gradient(180deg, #666, #333);
		border-radius: 50% 50% 10% 10%;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
	}
	
	.trigger {
		position: absolute;
		bottom: 10%;
		left: 50%;
		transform: translateX(-50%);
		width: 120px;
		height: 50px;
		background: linear-gradient(135deg, var(--red), #cc0000);
		border: 2px solid #ff0040;
		border-radius: 50% 50% 20% 20%;
		color: white;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		cursor: pointer;
		transition: all 0.3s;
		box-shadow: 0 5px 20px rgba(255, 0, 64, 0.3);
	}
	
	.trigger:hover:not(:disabled) {
		transform: translateX(-50%) scale(1.05);
		box-shadow: 0 5px 30px rgba(255, 0, 64, 0.5);
	}
	
	.trigger:active:not(:disabled) {
		transform: translateX(-50%) scale(0.95);
	}
	
	.trigger.pulled {
		animation: trigger-pull 0.3s ease-out;
	}
	
	.trigger:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	@keyframes trigger-pull {
		0% { transform: translateX(-50%) translateY(0); }
		50% { transform: translateX(-50%) translateY(5px); }
		100% { transform: translateX(-50%) translateY(0); }
	}
	
	.chamber-info {
		text-align: center;
	}
	
	.chamber-number {
		font-size: 1.25rem;
		color: var(--cyan);
		text-transform: uppercase;
		letter-spacing: 0.2em;
		margin-bottom: 0.5rem;
	}
	
	.chamber-unknown {
		color: var(--text-secondary);
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.hit-display,
	.survived-display,
	.result-display {
		text-align: center;
		padding: 2rem;
		background: rgba(0, 0, 0, 0.8);
		border: 1px solid var(--cyan);
		border-radius: 4px;
		max-width: 600px;
		margin: 0 auto;
	}
	
	.hit-title {
		font-size: 2rem;
		font-weight: 800;
		margin-bottom: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.hit-impact {
		font-size: 1.25rem;
		color: var(--yellow);
		margin-bottom: 1rem;
		text-transform: uppercase;
	}
	
	.hit-description {
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: 2rem;
	}
	
	.tracker-activation p {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}
	
	.tracker-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}
	
	.tracker-item {
		padding: 0.25rem 0.75rem;
		background: rgba(255, 0, 0, 0.1);
		border: 1px solid var(--red);
		color: var(--red);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.survived-title {
		font-size: 3rem;
		color: var(--green);
		margin-bottom: 1rem;
		font-weight: 800;
	}
	
	.survived-text {
		color: var(--text-secondary);
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin-top: 3rem;
	}
	
	.control-button {
		padding: 1rem 2rem;
		background: transparent;
		border: 2px solid var(--cyan);
		color: var(--cyan);
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		cursor: pointer;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.control-button:hover:not(:disabled) {
		background: var(--cyan);
		color: var(--bg-void);
		box-shadow: 0 0 30px var(--cyan);
	}
	
	.control-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
	
	.button-icon {
		font-size: 1.5rem;
	}
	
	.coward-options {
		display: flex;
		gap: 2rem;
	}
	
	.coward-button {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid var(--text-dim);
		color: var(--text-secondary);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		cursor: pointer;
		transition: all 0.3s;
	}
	
	.coward-button.accept:hover {
		border-color: var(--red);
		color: var(--red);
		background: rgba(255, 0, 64, 0.1);
	}
	
	.coward-button.reject:hover {
		border-color: var(--green);
		color: var(--green);
		background: rgba(0, 255, 136, 0.1);
	}
	
	.tracker-monitor {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		background: rgba(0, 0, 0, 0.9);
		border: 1px solid var(--red);
		padding: 1rem;
		max-width: 300px;
		z-index: 100;
	}
	
	.tracker-monitor h3 {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--red);
		margin-bottom: 1rem;
	}
	
	.tracker-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.active-tracker {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.7rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.tracker-dot {
		width: 6px;
		height: 6px;
		background: var(--red);
		border-radius: 50%;
		box-shadow: 0 0 10px var(--red);
	}
	
	.surveillance-mode,
	.freedom-mode {
		text-align: center;
		padding: 3rem;
	}
	
	.surveillance-title,
	.freedom-title {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 2rem;
	}
	
	.surveillance-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}
	
	.surveillance-item {
		padding: 1.5rem;
		background: rgba(0, 0, 0, 0.8);
		border: 1px solid var(--item-color);
		border-radius: 4px;
	}
	
	.surveillance-item h3 {
		color: var(--item-color);
		font-size: 1rem;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.surveillance-item p {
		color: var(--text-secondary);
		font-size: 0.875rem;
		margin-bottom: 1rem;
		line-height: 1.4;
	}
	
	.tracker-badge {
		display: inline-block;
		padding: 0.2rem 0.5rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--text-dim);
		font-size: 0.7rem;
		margin: 0.2rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.freedom-text {
		font-size: 1.125rem;
		color: var(--text-secondary);
		line-height: 1.6;
		max-width: 600px;
		margin: 0 auto 2rem;
	}
	
	.reset-button,
	.continue-button {
		padding: 1rem 2rem;
		background: transparent;
		border: 2px solid var(--cyan);
		color: var(--cyan);
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		cursor: pointer;
		transition: all 0.3s;
	}
	
	.reset-button:hover,
	.continue-button:hover {
		background: var(--cyan);
		color: var(--bg-void);
		box-shadow: 0 0 30px var(--cyan);
	}
	
	.leaked-data {
		margin-bottom: 2rem;
	}
	
	.leaked-data p {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}
	
	.leak-badge {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: rgba(255, 0, 64, 0.1);
		border: 1px solid var(--red);
		color: var(--red);
		font-size: 0.875rem;
		margin: 0.25rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	/* Mobile Responsive */
	@media (max-width: 768px) {
		.revolver {
			width: 300px;
			height: 300px;
		}
		
		.cylinder-wrapper {
			width: 250px;
			height: 250px;
		}
		
		.chamber {
			width: 60px;
			height: 60px;
			transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-80px);
		}
		
		.chamber.current {
			transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-80px) scale(1.1);
		}
		
		.coward-options {
			flex-direction: column;
			gap: 1rem;
			width: 100%;
		}
		
		.coward-button {
			width: 100%;
		}
		
		.tracker-monitor {
			bottom: 1rem;
			right: 1rem;
			left: 1rem;
			max-width: none;
		}
	}
	
	@media (max-width: 480px) {
		.header-content h1 {
			font-size: 1.5rem;
		}
		
		.stats-display {
			gap: 1.5rem;
		}
		
		.surveillance-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
