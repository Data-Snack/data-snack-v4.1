<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	
	// Yoga States
	let currentAsana = 'MOUNTAIN'; // Current position
	let breathPhase = 'INHALE'; // INHALE or EXHALE
	let sessionActive = false;
	let sessionComplete = false;
	
	// Metrics
	let scrollSpeed = 0;
	let scrollPosition = 0;
	let totalScrollDistance = 0;
	let breathRhythm = 4; // seconds per breath cycle
	let harmonyScore = 100;
	let zenLevel = 0;
	let scrollDirection = 'down';
	let lastScrollY = 0;
	let scrollVelocity = [];
	
	// Mandala State
	let mandalaRotation = 0;
	let mandalaScale = 1;
	let mandalaLayers = [];
	let petalCount = 0;
	
	// Breath Guide
	let breathProgress = 0;
	let breathTimer;
	let breathCycle = 0;
	
	// Session Data
	let sessionStats = {
		duration: 0,
		totalDistance: 0,
		averageSpeed: 0,
		harmonyMoments: 0,
		chaosSpikes: 0,
		deepBreaths: 0,
		asanasCompleted: []
	};
	
	// The 5 Scroll Asanas
	const asanas = [
		{
			name: 'MOUNTAIN',
			sanskrit: 'Tadasana',
			instruction: 'Scroll slowly and steadily, like a mountain standing tall',
			targetSpeed: 50,
			breathPattern: 'slow',
			color: '#00ff88',
			symbol: '▲',
			mantra: 'I am grounded'
		},
		{
			name: 'FLOW',
			sanskrit: 'Vinyasa',
			instruction: 'Let your scroll flow like water, continuous and smooth',
			targetSpeed: 100,
			breathPattern: 'medium',
			color: '#00ffff',
			symbol: '≈',
			mantra: 'I flow with ease'
		},
		{
			name: 'WAVE',
			sanskrit: 'Tarangasana',
			instruction: 'Scroll in waves - accelerate, decelerate, repeat',
			targetSpeed: 'variable',
			breathPattern: 'wave',
			color: '#0080ff',
			symbol: '∿',
			mantra: 'I ride the waves'
		},
		{
			name: 'STILLNESS',
			sanskrit: 'Sthira',
			instruction: 'Pause between scrolls. Find stillness in movement',
			targetSpeed: 0,
			breathPattern: 'deep',
			color: '#ff00ff',
			symbol: '◯',
			mantra: 'In stillness, I find peace'
		},
		{
			name: 'INFINITY',
			sanskrit: 'Ananta',
			instruction: 'Scroll up and down in endless cycles',
			targetSpeed: 'cyclic',
			breathPattern: 'circular',
			color: '#ffff00',
			symbol: '∞',
			mantra: 'I am infinite'
		}
	];
	
	let currentAsanaIndex = 0;
	let currentAsanaData = asanas[0];
	
	// Audio Context for meditation sounds
	let audioContext;
	let oscillators = [];
	let isPlayingSound = false;
	
	// Initialize audio
	function initAudio() {
		if (!audioContext) {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
		}
		
		// Create ambient drone
		createAmbientDrone();
	}
	
	function createAmbientDrone() {
		if (isPlayingSound) return;
		
		// Base frequencies for meditation (Hz)
		const frequencies = [
			136.1, // OM frequency
			174,   // Pain relief
			285,   // Healing
			396,   // Liberation from fear
			417    // Facilitating change
		];
		
		frequencies.forEach((freq, i) => {
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();
			const filter = audioContext.createBiquadFilter();
			
			oscillator.frequency.value = freq;
			oscillator.type = 'sine';
			
			filter.type = 'lowpass';
			filter.frequency.value = 800;
			filter.Q.value = 1;
			
			gainNode.gain.value = 0;
			gainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 2);
			
			oscillator.connect(filter);
			filter.connect(gainNode);
			gainNode.connect(audioContext.destination);
			
			oscillator.start();
			oscillators.push({ osc: oscillator, gain: gainNode });
		});
		
		isPlayingSound = true;
	}
	
	function stopAmbientDrone() {
		oscillators.forEach(({ osc, gain }) => {
			gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
			setTimeout(() => osc.stop(), 1000);
		});
		oscillators = [];
		isPlayingSound = false;
	}
	
	// Breathing Guide
	function startBreathing() {
		breathTimer = setInterval(() => {
			breathProgress += 100 / (breathRhythm * 1000 / 100); // Update every 100ms
			
			if (breathProgress >= 100) {
				breathProgress = 0;
				breathPhase = breathPhase === 'INHALE' ? 'EXHALE' : 'INHALE';
				breathCycle++;
				
				if (breathCycle % 4 === 0) {
					sessionStats.deepBreaths++;
				}
			}
			
			// Modulate sound with breath
			if (oscillators.length > 0) {
				const breathIntensity = breathPhase === 'INHALE' 
					? breathProgress / 100 
					: 1 - (breathProgress / 100);
				
				oscillators.forEach(({ gain }, i) => {
					const targetGain = 0.01 + (breathIntensity * 0.02);
					gain.gain.linearRampToValueAtTime(targetGain, audioContext.currentTime + 0.1);
				});
			}
		}, 100);
	}
	
	function stopBreathing() {
		if (breathTimer) {
			clearInterval(breathTimer);
			breathTimer = null;
		}
	}
	
	// Scroll Tracking
	function handleScroll(event) {
		if (!sessionActive) return;
		
		const currentY = window.scrollY;
		const deltaY = currentY - lastScrollY;
		
		// Calculate speed
		scrollVelocity.push(Math.abs(deltaY));
		if (scrollVelocity.length > 10) scrollVelocity.shift();
		
		scrollSpeed = scrollVelocity.reduce((a, b) => a + b, 0) / scrollVelocity.length;
		scrollDirection = deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : 'still';
		
		// Update metrics
		scrollPosition = currentY;
		totalScrollDistance += Math.abs(deltaY);
		sessionStats.totalDistance = totalScrollDistance;
		
		// Update Mandala
		updateMandala(deltaY);
		
		// Check harmony with current asana
		checkHarmony();
		
		// Update Zen level
		updateZenLevel();
		
		lastScrollY = currentY;
	}
	
	function updateMandala(deltaY) {
		// Rotate based on scroll
		mandalaRotation += deltaY * 0.1;
		
		// Scale based on speed
		const targetScale = 1 + (scrollSpeed / 200);
		mandalaScale += (targetScale - mandalaScale) * 0.1;
		
		// Add petals based on harmony
		if (harmonyScore > 80 && petalCount < 108) { // 108 is sacred number
			petalCount++;
			
			mandalaLayers.push({
				rotation: mandalaRotation,
				scale: mandalaScale,
				opacity: harmonyScore / 100,
				color: currentAsanaData.color
			});
			
			// Keep only last 12 layers
			if (mandalaLayers.length > 12) {
				mandalaLayers.shift();
			}
		}
	}
	
	function checkHarmony() {
		const targetSpeed = currentAsanaData.targetSpeed;
		let harmonyDelta = 0;
		
		if (typeof targetSpeed === 'number') {
			// Fixed speed target
			const speedDiff = Math.abs(scrollSpeed - targetSpeed);
			harmonyDelta = speedDiff < 20 ? 1 : -1;
		} else if (targetSpeed === 'variable') {
			// Wave pattern
			const isWaving = scrollVelocity.some(v => v > 100) && scrollVelocity.some(v => v < 30);
			harmonyDelta = isWaving ? 2 : -0.5;
		} else if (targetSpeed === 'cyclic') {
			// Up and down pattern
			// Check if direction changes
			harmonyDelta = scrollDirection === 'still' ? -1 : 0.5;
		} else if (targetSpeed === 0) {
			// Stillness
			harmonyDelta = scrollSpeed < 10 ? 3 : -2;
		}
		
		// Update harmony score
		harmonyScore = Math.max(0, Math.min(100, harmonyScore + harmonyDelta));
		
		// Track harmony moments
		if (harmonyScore > 90) {
			sessionStats.harmonyMoments++;
		} else if (harmonyScore < 20) {
			sessionStats.chaosSpikes++;
		}
	}
	
	function updateZenLevel() {
		// Zen increases with practice and harmony
		const zenIncrease = (harmonyScore / 100) * 0.1;
		zenLevel = Math.min(100, zenLevel + zenIncrease);
	}
	
	// Session Management
	function startSession() {
		sessionActive = true;
		sessionComplete = false;
		initAudio();
		startBreathing();
		
		// Reset metrics
		harmonyScore = 50;
		zenLevel = 0;
		scrollVelocity = [];
		mandalaLayers = [];
		petalCount = 0;
		sessionStats = {
			duration: 0,
			totalDistance: 0,
			averageSpeed: 0,
			harmonyMoments: 0,
			chaosSpikes: 0,
			deepBreaths: 0,
			asanasCompleted: []
		};
		
		// Start duration timer
		const startTime = Date.now();
		const durationTimer = setInterval(() => {
			if (sessionActive) {
				sessionStats.duration = Math.floor((Date.now() - startTime) / 1000);
			} else {
				clearInterval(durationTimer);
			}
		}, 1000);
	}
	
	function endSession() {
		sessionActive = false;
		sessionComplete = true;
		stopBreathing();
		stopAmbientDrone();
		
		// Calculate final stats
		sessionStats.averageSpeed = scrollVelocity.reduce((a, b) => a + b, 0) / scrollVelocity.length || 0;
		
		// Generate insight
		generateInsight();
	}
	
	function switchAsana(index) {
		if (!sessionActive) return;
		
		currentAsanaIndex = index;
		currentAsanaData = asanas[index];
		currentAsana = currentAsanaData.name;
		
		// Track completion
		if (!sessionStats.asanasCompleted.includes(currentAsana)) {
			sessionStats.asanasCompleted.push(currentAsana);
		}
		
		// Reset harmony for new position
		harmonyScore = 50;
		
		// Adjust breath rhythm
		switch (currentAsanaData.breathPattern) {
			case 'slow':
				breathRhythm = 6;
				break;
			case 'medium':
				breathRhythm = 4;
				break;
			case 'wave':
				breathRhythm = 3;
				break;
			case 'deep':
				breathRhythm = 8;
				break;
			case 'circular':
				breathRhythm = 5;
				break;
		}
	}
	
	function generateInsight() {
		// Generate personalized insight based on session
		const insights = [];
		
		if (sessionStats.harmonyMoments > 10) {
			insights.push("You found your flow. The digital stream bends to your will.");
		}
		
		if (sessionStats.chaosSpikes > 5) {
			insights.push("Chaos visited you today. Remember: storms pass, mountains remain.");
		}
		
		if (sessionStats.deepBreaths > 10) {
			insights.push("Your breath is your anchor. You breathed life into the machine.");
		}
		
		if (sessionStats.asanasCompleted.length >= 3) {
			insights.push("Versatility is mastery. You adapted like water to many forms.");
		}
		
		if (zenLevel > 80) {
			insights.push("Digital enlightenment approaches. The screen is your mirror.");
		}
		
		return insights;
	}
	
	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		
		// Create infinite scroll content
		const content = document.querySelector('.scroll-content');
		if (content) {
			// Generate enough content to scroll
			for (let i = 0; i < 50; i++) {
				const element = document.createElement('div');
				element.className = 'content-block';
				element.innerHTML = `<span class="block-number">${i}</span>`;
				content.appendChild(element);
			}
		}
	});
	
	onDestroy(() => {
		window.removeEventListener('scroll', handleScroll);
		stopBreathing();
		if (audioContext) {
			stopAmbientDrone();
			audioContext.close();
		}
	});
</script>

<svelte:head>
	<title>SCROLL_YOGA // Digital Meditation</title>
</svelte:head>

<div class="yoga-studio">
	{#if !sessionActive && !sessionComplete}
		<!-- Welcome Screen -->
		<div class="welcome-screen" in:fade>
			<div class="welcome-content">
				<h1 class="welcome-title">
					<span class="sanskrit">॰</span>
					SCROLL_YOGA
					<span class="sanskrit">॰</span>
				</h1>
				<p class="welcome-subtitle">Transform your scrolling into meditation</p>
				
				<div class="intro-text">
					<p>Your scrollbar is a prayer wheel.</p>
					<p>Your mouse wheel, a mandala.</p>
					<p>Your screen, a window to digital enlightenment.</p>
				</div>
				
				<div class="asana-preview">
					<h3>Today's Practice</h3>
					<div class="asana-grid">
						{#each asanas as asana}
							<div class="asana-card" style="--asana-color: {asana.color}">
								<span class="asana-symbol">{asana.symbol}</span>
								<span class="asana-name">{asana.name}</span>
								<span class="asana-sanskrit">{asana.sanskrit}</span>
							</div>
						{/each}
					</div>
				</div>
				
				<button class="start-button" on:click={startSession}>
					BEGIN PRACTICE
				</button>
				
				<p class="instruction">
					Use your scroll wheel or trackpad to practice digital mindfulness
				</p>
			</div>
		</div>
	{:else if sessionActive}
		<!-- Active Session -->
		<div class="yoga-session">
			<!-- Fixed UI Elements -->
			<div class="session-ui">
				<!-- Breath Guide -->
				<div class="breath-guide">
					<div class="breath-circle" class:inhale={breathPhase === 'INHALE'}>
						<div class="breath-inner" style="transform: scale({1 + breathProgress / 100})"></div>
						<span class="breath-text">{breathPhase}</span>
					</div>
					<div class="breath-instruction">
						{breathPhase === 'INHALE' ? 'Scroll Down' : 'Scroll Up'}
					</div>
				</div>
				
				<!-- Current Asana Display -->
				<div class="asana-display">
					<h2 class="current-asana" style="color: {currentAsanaData.color}">
						{currentAsanaData.symbol} {currentAsana}
					</h2>
					<p class="asana-instruction">{currentAsanaData.instruction}</p>
					<p class="asana-mantra">"{currentAsanaData.mantra}"</p>
				</div>
				
				<!-- Metrics Dashboard -->
				<div class="metrics-panel">
					<div class="metric">
						<span class="metric-label">HARMONY</span>
						<div class="metric-bar">
							<div class="metric-fill" style="width: {harmonyScore}%; background: {currentAsanaData.color}"></div>
						</div>
						<span class="metric-value">{harmonyScore.toFixed(0)}%</span>
					</div>
					
					<div class="metric">
						<span class="metric-label">ZEN LEVEL</span>
						<div class="metric-bar">
							<div class="metric-fill" style="width: {zenLevel}%; background: linear-gradient(90deg, #00ff88, #00ffff)"></div>
						</div>
						<span class="metric-value">{zenLevel.toFixed(0)}%</span>
					</div>
					
					<div class="metric">
						<span class="metric-label">SPEED</span>
						<span class="metric-value">{scrollSpeed.toFixed(0)} px/s</span>
					</div>
					
					<div class="metric">
						<span class="metric-label">BREATHS</span>
						<span class="metric-value">{sessionStats.deepBreaths}</span>
					</div>
				</div>
				
				<!-- Asana Selector -->
				<div class="asana-selector">
					{#each asanas as asana, i}
						<button 
							class="asana-button"
							class:active={currentAsanaIndex === i}
							style="--asana-color: {asana.color}"
							on:click={() => switchAsana(i)}
						>
							{asana.symbol}
						</button>
					{/each}
				</div>
				
				<!-- End Session Button -->
				<button class="end-button" on:click={endSession}>
					END PRACTICE
				</button>
			</div>
			
			<!-- Mandala Visualization -->
			<div class="mandala-container">
				<svg class="mandala" viewBox="-200 -200 400 400" style="transform: rotate({mandalaRotation}deg) scale({mandalaScale})">
					<defs>
						<radialGradient id="mandalaGradient">
							<stop offset="0%" style="stop-color:{currentAsanaData.color};stop-opacity:0.8" />
							<stop offset="100%" style="stop-color:{currentAsanaData.color};stop-opacity:0" />
						</radialGradient>
					</defs>
					
					<!-- Base circle -->
					<circle r="50" fill="none" stroke={currentAsanaData.color} stroke-width="0.5" opacity="0.3"/>
					
					<!-- Dynamic layers -->
					{#each mandalaLayers as layer, i}
						<g transform="rotate({layer.rotation}) scale({layer.scale})" opacity={layer.opacity}>
							{#each Array(8) as _, j}
								<ellipse 
									rx="30" 
									ry="60" 
									fill="url(#mandalaGradient)"
									transform="rotate({j * 45})"
									opacity={0.3}
								/>
							{/each}
						</g>
					{/each}
					
					<!-- Petal counter -->
					<text y="0" text-anchor="middle" fill={currentAsanaData.color} font-size="20" opacity="0.5">
						{petalCount}
					</text>
				</svg>
			</div>
			
			<!-- Scrollable Content -->
			<div class="scroll-content">
				<!-- Content is generated dynamically -->
			</div>
		</div>
	{:else if sessionComplete}
		<!-- Results Screen -->
		<div class="results-screen" in:fade>
			<div class="results-content">
				<h1 class="results-title">PRACTICE COMPLETE</h1>
				
				<div class="final-mandala">
					<svg viewBox="-100 -100 200 200" width="200" height="200">
						{#each mandalaLayers as layer, i}
							<g transform="rotate({layer.rotation}) scale({layer.scale})" opacity={layer.opacity}>
								{#each Array(8) as _, j}
									<ellipse 
										rx="20" 
										ry="40" 
										fill={layer.color}
										transform="rotate({j * 45})"
										opacity={0.2}
									/>
								{/each}
							</g>
						{/each}
					</svg>
				</div>
				
				<div class="session-summary">
					<h2>Your Digital Meditation</h2>
					
					<div class="stat-grid">
						<div class="stat-item">
							<span class="stat-label">Duration</span>
							<span class="stat-value">{Math.floor(sessionStats.duration / 60)}:{(sessionStats.duration % 60).toString().padStart(2, '0')}</span>
						</div>
						
						<div class="stat-item">
							<span class="stat-label">Distance Scrolled</span>
							<span class="stat-value">{(sessionStats.totalDistance / 1000).toFixed(1)}m</span>
						</div>
						
						<div class="stat-item">
							<span class="stat-label">Deep Breaths</span>
							<span class="stat-value">{sessionStats.deepBreaths}</span>
						</div>
						
						<div class="stat-item">
							<span class="stat-label">Harmony Moments</span>
							<span class="stat-value">{sessionStats.harmonyMoments}</span>
						</div>
						
						<div class="stat-item">
							<span class="stat-label">Asanas Practiced</span>
							<span class="stat-value">{sessionStats.asanasCompleted.length}/{asanas.length}</span>
						</div>
						
						<div class="stat-item">
							<span class="stat-label">Final Zen</span>
							<span class="stat-value">{zenLevel.toFixed(0)}%</span>
						</div>
					</div>
					
					<div class="insights">
						<h3>Insights</h3>
						{#each generateInsight() as insight}
							<p class="insight">{insight}</p>
						{/each}
					</div>
					
					<div class="digital-mantra">
						<p>Your unique mantra:</p>
						<p class="mantra-code">
							SCROLL_{currentAsana}_{zenLevel.toFixed(0)}_{Date.now().toString(36).toUpperCase()}
						</p>
					</div>
				</div>
				
				<div class="action-buttons">
					<button on:click={() => location.reload()}>
						PRACTICE AGAIN
					</button>
					<button on:click={() => window.location.href = '/'}>
						RETURN TO REALITY
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.yoga-studio {
		min-height: 100vh;
		background: linear-gradient(180deg, #000033, #000066, #000033);
		color: white;
		position: relative;
		overflow-x: hidden;
	}
	
	/* Welcome Screen */
	.welcome-screen {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}
	
	.welcome-content {
		max-width: 800px;
		text-align: center;
	}
	
	.welcome-title {
		font-size: 3rem;
		font-weight: 800;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, #00ff88, #00ffff, #ff00ff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.sanskrit {
		font-size: 2rem;
		opacity: 0.5;
	}
	
	.welcome-subtitle {
		font-size: 1.25rem;
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: 3rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
	}
	
	.intro-text {
		margin-bottom: 3rem;
		line-height: 2;
		color: rgba(255, 255, 255, 0.8);
	}
	
	.intro-text p {
		margin-bottom: 1rem;
		font-size: 1.125rem;
	}
	
	.asana-preview {
		margin-bottom: 3rem;
	}
	
	.asana-preview h3 {
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 1.5rem;
	}
	
	.asana-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}
	
	.asana-card {
		padding: 1rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--asana-color);
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.3s;
	}
	
	.asana-card:hover {
		background: rgba(255, 255, 255, 0.1);
		transform: translateY(-5px);
		box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
	}
	
	.asana-symbol {
		font-size: 2rem;
		color: var(--asana-color);
	}
	
	.asana-name {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.asana-sanskrit {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
		font-style: italic;
	}
	
	.start-button {
		padding: 1rem 3rem;
		background: linear-gradient(135deg, #00ff88, #00ffff);
		border: none;
		color: #000033;
		font-size: 1.125rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		cursor: pointer;
		transition: all 0.3s;
		border-radius: 50px;
	}
	
	.start-button:hover {
		transform: scale(1.05);
		box-shadow: 0 20px 40px rgba(0, 255, 255, 0.4);
	}
	
	.instruction {
		margin-top: 2rem;
		color: rgba(255, 255, 255, 0.5);
		font-size: 0.875rem;
	}
	
	/* Active Session */
	.yoga-session {
		position: relative;
		min-height: 100vh;
	}
	
	.session-ui {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 2rem;
		background: linear-gradient(180deg, rgba(0, 0, 51, 0.95), transparent);
		pointer-events: none;
	}
	
	.session-ui > * {
		pointer-events: auto;
	}
	
	.breath-guide {
		position: fixed;
		top: 2rem;
		left: 2rem;
		text-align: center;
	}
	
	.breath-circle {
		width: 100px;
		height: 100px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		transition: all 4s ease-in-out;
	}
	
	.breath-circle.inhale {
		border-color: #00ff88;
		box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
	}
	
	.breath-inner {
		width: 80px;
		height: 80px;
		background: radial-gradient(circle, rgba(0, 255, 136, 0.3), transparent);
		border-radius: 50%;
		transition: transform 4s ease-in-out;
	}
	
	.breath-text {
		position: absolute;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.7);
	}
	
	.breath-instruction {
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.asana-display {
		position: fixed;
		top: 2rem;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		max-width: 600px;
	}
	
	.current-asana {
		font-size: 2rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
	}
	
	.asana-instruction {
		color: rgba(255, 255, 255, 0.7);
		font-size: 1rem;
		margin-bottom: 0.5rem;
		line-height: 1.4;
	}
	
	.asana-mantra {
		font-style: italic;
		color: rgba(255, 255, 255, 0.5);
		font-size: 0.875rem;
	}
	
	.metrics-panel {
		position: fixed;
		top: 2rem;
		right: 2rem;
		background: rgba(0, 0, 0, 0.7);
		padding: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		min-width: 200px;
	}
	
	.metric {
		margin-bottom: 1rem;
	}
	
	.metric-label {
		display: block;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 0.25rem;
	}
	
	.metric-bar {
		height: 4px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
		margin-bottom: 0.25rem;
		overflow: hidden;
	}
	
	.metric-fill {
		height: 100%;
		transition: width 0.3s ease;
		border-radius: 2px;
	}
	
	.metric-value {
		font-size: 1.25rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
	}
	
	.asana-selector {
		position: fixed;
		bottom: 6rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 1rem;
		background: rgba(0, 0, 0, 0.7);
		padding: 1rem;
		border-radius: 50px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.asana-button {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid var(--asana-color);
		color: var(--asana-color);
		font-size: 1.5rem;
		cursor: pointer;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.asana-button:hover {
		background: rgba(255, 255, 255, 0.1);
		transform: scale(1.1);
	}
	
	.asana-button.active {
		background: var(--asana-color);
		color: #000033;
		box-shadow: 0 0 20px var(--asana-color);
	}
	
	.end-button {
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.75rem 2rem;
		background: rgba(255, 0, 64, 0.8);
		border: 1px solid #ff0040;
		color: white;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		cursor: pointer;
		transition: all 0.3s;
		border-radius: 25px;
	}
	
	.end-button:hover {
		background: #ff0040;
		box-shadow: 0 10px 30px rgba(255, 0, 64, 0.4);
	}
	
	.mandala-container {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 400px;
		height: 400px;
		pointer-events: none;
		opacity: 0.3;
		z-index: 1;
	}
	
	.mandala {
		width: 100%;
		height: 100%;
		transition: transform 0.3s ease;
	}
	
	.scroll-content {
		padding-top: 100vh;
		position: relative;
		z-index: 0;
	}
	
	.content-block {
		height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.03);
		position: relative;
	}
	
	.block-number {
		font-size: 8rem;
		font-weight: 800;
		color: rgba(255, 255, 255, 0.02);
		user-select: none;
	}
	
	/* Results Screen */
	.results-screen {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}
	
	.results-content {
		max-width: 800px;
		text-align: center;
	}
	
	.results-title {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 2rem;
		background: linear-gradient(135deg, #00ff88, #00ffff, #ff00ff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.final-mandala {
		margin: 0 auto 3rem;
		display: flex;
		justify-content: center;
	}
	
	.session-summary {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		padding: 2rem;
		margin-bottom: 2rem;
	}
	
	.session-summary h2 {
		font-size: 1.5rem;
		margin-bottom: 2rem;
		color: rgba(255, 255, 255, 0.9);
	}
	
	.stat-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	
	.stat-item {
		text-align: center;
	}
	
	.stat-label {
		display: block;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 0.5rem;
	}
	
	.stat-value {
		font-size: 1.5rem;
		font-weight: 600;
		color: #00ffff;
	}
	
	.insights {
		margin: 2rem 0;
		padding: 1.5rem;
		background: rgba(0, 255, 136, 0.05);
		border-left: 3px solid #00ff88;
		text-align: left;
	}
	
	.insights h3 {
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #00ff88;
		margin-bottom: 1rem;
	}
	
	.insight {
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.6;
		margin-bottom: 0.5rem;
	}
	
	.digital-mantra {
		margin: 2rem 0;
	}
	
	.digital-mantra p {
		color: rgba(255, 255, 255, 0.5);
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}
	
	.mantra-code {
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.125rem;
		color: #ffff00;
		background: rgba(255, 255, 0, 0.1);
		padding: 0.5rem 1rem;
		border-radius: 4px;
		display: inline-block;
	}
	
	.action-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}
	
	.action-buttons button {
		padding: 0.75rem 2rem;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: white;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		cursor: pointer;
		transition: all 0.3s;
		border-radius: 25px;
	}
	
	.action-buttons button:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: #00ffff;
		box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
	}
	
	/* Mobile Responsive */
	@media (max-width: 768px) {
		.welcome-title {
			font-size: 2rem;
		}
		
		.asana-grid {
			grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		}
		
		.asana-display {
			top: 8rem;
		}
		
		.metrics-panel {
			top: auto;
			bottom: 10rem;
			right: 1rem;
			min-width: 150px;
			padding: 1rem;
		}
		
		.breath-guide {
			transform: scale(0.8);
			left: 1rem;
		}
		
		.asana-selector {
			bottom: 4rem;
			padding: 0.5rem;
		}
		
		.asana-button {
			width: 40px;
			height: 40px;
			font-size: 1.25rem;
		}
		
		.mandala-container {
			width: 300px;
			height: 300px;
		}
	}
	
	@media (max-width: 480px) {
		.stat-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		
		.action-buttons {
			flex-direction: column;
		}
		
		.action-buttons button {
			width: 100%;
		}
	}
</style>
