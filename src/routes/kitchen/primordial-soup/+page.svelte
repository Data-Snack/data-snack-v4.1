<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { snackPerzepts } from '$lib/stores/perzeptEngine.js';
	
	// Die 5 Operatoren
	const operators = [
		{ 
			id: 'EMBODIMENT',
			symbol: '⟨ℳ⟩',
			color: '#00ff88',
			description: 'Daten werden zu Bewegung',
			frequency: 432
		},
		{ 
			id: 'NOISE',
			symbol: '⟨∇⟩',
			color: '#ff00ff',
			description: 'Irritation als Methode',
			frequency: 528
		},
		{ 
			id: 'CROSS_DOMAIN',
			symbol: '⟨⊗⟩',
			color: '#ffff00',
			description: 'Fremde Formen kollidieren',
			frequency: 639
		},
		{ 
			id: 'RITUAL',
			symbol: '⟨◈⟩',
			color: '#00ffff',
			description: 'Wiederholung schafft Bedeutung',
			frequency: 741
		},
		{ 
			id: 'SUBVERSION',
			symbol: '⟨Ψ⟩',
			color: '#ff0040',
			description: 'Überhöhung bis zum Bruch',
			frequency: 852
		}
	];
	
	let phase = 'INITIALIZATION';
	let selectedOperators = [];
	let mixture = [];
	let temperature = 273; // Kelvin
	let entropy = 0;
	let canvas;
	let resultCode = null;
	
	function selectOperator(op) {
		if (selectedOperators.length >= 3) return;
		if (selectedOperators.find(o => o.id === op.id)) return;
		
		selectedOperators = [...selectedOperators, op];
		temperature += 50;
		entropy += Math.random() * 10;
		
		// Generate perzepts for operator mixing
		snackPerzepts.primordialSoup.mixture(selectedOperators.length);
		snackPerzepts.primordialSoup.emergence(entropy / 100);
		
		// Generate visual effect
		createRipple(op.color);
		
		if (selectedOperators.length >= 2) {
			phase = 'REACTION';
		}
	}
	
	function createRipple(color) {
		// Visual feedback when selecting
		const ripple = document.createElement('div');
		ripple.style.cssText = `
			position: fixed;
			width: 50px;
			height: 50px;
			border: 2px solid ${color};
			border-radius: 50%;
			pointer-events: none;
			z-index: 1000;
			animation: ripple-expand 1s ease-out forwards;
		`;
		ripple.style.left = `${event.clientX - 25}px`;
		ripple.style.top = `${event.clientY - 25}px`;
		document.body.appendChild(ripple);
		setTimeout(() => ripple.remove(), 1000);
	}
	
	function catalyze() {
		if (selectedOperators.length < 2) return;
		
		phase = 'SYNTHESIS';
		temperature = 373; // Boiling point
		entropy = 100;
		
		// Generate transformation perzept during catalysis
		snackPerzepts.primordialSoup.transformation(1.0);
		snackPerzepts.primordialSoup.emergence(1.0);
		
		// Generate unique result code
		const hash = selectedOperators
			.map(op => op.id.substring(0, 2))
			.join('')
			.toUpperCase();
		
		resultCode = `REALITY_${hash}_${Date.now().toString(36).toUpperCase()}`;
		
		// Simulate reaction
		setTimeout(() => {
			phase = 'CRYSTALLIZATION';
			generateProfile();
		}, 3000);
	}
	
	function generateProfile() {
		const combinations = {
			'EMBODIMENT,NOISE': {
				archetype: 'CHAOS_DANCER',
				pathway: 'Du navigierst durch Unordnung mit körperlicher Intuition',
				resonance: 'KÖRPER ⟷ FEHLER'
			},
			'CROSS_DOMAIN,RITUAL': {
				archetype: 'BOUNDARY_PRIEST',
				pathway: 'Du erschaffst heilige Räume zwischen den Welten',
				resonance: 'APPARATE ⟷ GEMEINSCHAFT'
			},
			'NOISE,SUBVERSION': {
				archetype: 'GLITCH_ARTIST',
				pathway: 'Du findest Schönheit im systematischen Versagen',
				resonance: 'FEHLER ⟷ ZEIT'
			},
			default: {
				archetype: 'DATA_ALCHEMIST',
				pathway: 'Du transformierst Information in neue Realitäten',
				resonance: 'ÜBERALL ⟷ NIRGENDS'
			}
		};
		
		const key = selectedOperators.map(op => op.id).sort().join(',');
		mixture = combinations[key] || combinations.default;
	}
	
	function reset() {
		phase = 'INITIALIZATION';
		selectedOperators = [];
		mixture = [];
		temperature = 273;
		entropy = 0;
		resultCode = null;
	}
	
	onMount(() => {
		// Initialize soup visualization
		if (canvas) {
			const ctx = canvas.getContext('2d');
			animateSoup(ctx);
		}
	});
	
	function animateSoup(ctx) {
		const width = canvas.width;
		const height = canvas.height;
		let particles = [];
		
		// Create particles for selected operators
		selectedOperators.forEach(op => {
			for (let i = 0; i < 10; i++) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * 2,
					vy: (Math.random() - 0.5) * 2,
					color: op.color,
					size: Math.random() * 3 + 1
				});
			}
		});
		
		function draw() {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
			ctx.fillRect(0, 0, width, height);
			
			particles.forEach(p => {
				p.x += p.vx;
				p.y += p.vy;
				
				// Boundary collision
				if (p.x < 0 || p.x > width) p.vx *= -1;
				if (p.y < 0 || p.y > height) p.vy *= -1;
				
				// Draw particle
				ctx.fillStyle = p.color;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fill();
			});
			
			requestAnimationFrame(draw);
		}
		
		if (particles.length > 0) draw();
	}
</script>

<svelte:head>
	<title>PRIMORDIAL_SOUP // Reality Kitchen</title>
</svelte:head>

<div class="soup-laboratory">
	<header class="lab-header">
		<div class="status-bar">
			<span class="status-item">TEMP: {temperature}K</span>
			<span class="status-item">ENTROPY: {entropy.toFixed(2)}</span>
			<span class="status-item">PHASE: {phase}</span>
			<span class="status-item">OPERATORS: {selectedOperators.length}/3</span>
		</div>
	</header>

	{#if phase === 'INITIALIZATION'}
		<section class="initialization-phase fade-in">
			<div class="title-block">
				<h1 class="glitch neon" data-text="PRIMORDIAL_SOUP">PRIMORDIAL_SOUP</h1>
				<p class="subtitle holo">Reality Generation Protocol v4.0</p>
			</div>
			
			<div class="instructions panel neon-box">
				<p>SELECT YOUR OPERATORS:</p>
				<p class="instruction-detail">
					Each operator modifies the reality field differently.
					Combine them to create unique emergence patterns.
				</p>
			</div>
			
			<div class="operator-grid">
				{#each operators as op}
					<button 
						class="operator-card"
						style="--op-color: {op.color}"
						on:click={() => selectOperator(op)}
						disabled={selectedOperators.find(o => o.id === op.id)}
					>
						<div class="operator-symbol">{op.symbol}</div>
						<div class="operator-id">{op.id}</div>
						<div class="operator-desc">{op.description}</div>
						<div class="operator-freq">ƒ = {op.frequency} Hz</div>
					</button>
				{/each}
			</div>
			
			{#if selectedOperators.length > 0}
				<div class="selected-display">
					<p>SELECTED:</p>
					<div class="selected-operators">
						{#each selectedOperators as op}
							<span style="color: {op.color}">{op.symbol}</span>
						{/each}
					</div>
				</div>
			{/if}
		</section>
	{/if}

	{#if phase === 'REACTION'}
		<section class="reaction-phase fade-in">
			<div class="reaction-chamber panel neon-box">
				<canvas bind:this={canvas} width="600" height="400"></canvas>
				<div class="reaction-overlay">
					<p class="reaction-status pulse">OPERATORS LOADED</p>
					<p>Ready for catalysis</p>
				</div>
			</div>
			
			<button class="catalyze-button" on:click={catalyze}>
				INITIATE CATALYSIS
			</button>
		</section>
	{/if}

	{#if phase === 'SYNTHESIS'}
		<section class="synthesis-phase fade-in">
			<div class="synthesis-animation">
				<div class="synthesis-core rotate"></div>
				<div class="synthesis-ring pulse"></div>
				<p class="synthesis-status">REALITY SYNTHESIS IN PROGRESS...</p>
				{#each selectedOperators as op, i}
					<div 
						class="orbiting-operator"
						style="
							--orbit-delay: {i * 0.5}s;
							--orbit-color: {op.color};
						"
					>
						{op.symbol}
					</div>
				{/each}
			</div>
		</section>
	{/if}

	{#if phase === 'CRYSTALLIZATION'}
		<section class="result-phase fade-in">
			<div class="result-container panel neon-box">
				<div class="result-header">
					<p class="result-label">SYNTHESIS COMPLETE</p>
					<p class="result-code">{resultCode}</p>
				</div>
				
				<div class="archetype-display">
					<h2 class="archetype-name holo">{mixture.archetype}</h2>
					<p class="pathway">{mixture.pathway}</p>
					<div class="resonance">
						<span class="resonance-label">RESONANCE:</span>
						<span class="resonance-value neon">{mixture.resonance}</span>
					</div>
				</div>
				
				<div class="operator-formula">
					{#each selectedOperators as op, i}
						<span style="color: {op.color}">{op.symbol}</span>
						{#if i < selectedOperators.length - 1}
							<span class="operator-plus">+</span>
						{/if}
					{/each}
					<span class="equals">=</span>
					<span class="result-symbol">⟨Ω⟩</span>
				</div>
				
				<div class="actions">
					<button on:click={reset}>NEW SYNTHESIS</button>
					<button on:click={() => console.log('Saved to cartography:', resultCode)}>
						SAVE TO CARTOGRAPHY
					</button>
				</div>
			</div>
		</section>
	{/if}
</div>

<style>
	@keyframes ripple-expand {
		to {
			width: 200px;
			height: 200px;
			margin-left: -75px;
			margin-top: -75px;
			opacity: 0;
		}
	}
	
	@keyframes orbit {
		from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
		to { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
	}
	
	.soup-laboratory {
		min-height: 100vh;
		padding: 2rem;
		position: relative;
	}
	
	.lab-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.9);
		border-bottom: 1px solid var(--cyan);
		z-index: 100;
		padding: 1rem 2rem;
	}
	
	.status-bar {
		display: flex;
		gap: 2rem;
		justify-content: center;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--cyan);
		font-family: 'JetBrains Mono', monospace;
	}
	
	.status-item {
		opacity: 0.8;
	}
	
	.initialization-phase,
	.reaction-phase,
	.synthesis-phase,
	.result-phase {
		max-width: 1200px;
		margin: 0 auto;
		padding-top: 4rem;
	}
	
	.title-block {
		text-align: center;
		margin-bottom: 3rem;
	}
	
	.title-block h1 {
		font-size: 3rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
	}
	
	.subtitle {
		font-size: 1.25rem;
		opacity: 0.9;
	}
	
	.instructions {
		max-width: 600px;
		margin: 0 auto 3rem;
		padding: 1.5rem;
		text-align: center;
	}
	
	.instructions p {
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 0.875rem;
	}
	
	.instruction-detail {
		color: var(--text-secondary);
		font-size: 0.75rem !important;
		text-transform: none !important;
		letter-spacing: normal !important;
		line-height: 1.6;
	}
	
	.operator-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}
	
	.operator-card {
		background: rgba(0, 0, 0, 0.8);
		border: 2px solid var(--op-color);
		padding: 1.5rem;
		cursor: pointer;
		transition: all 0.3s;
		position: relative;
		overflow: hidden;
	}
	
	.operator-card::before {
		content: "";
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, var(--op-color), transparent);
		opacity: 0.3;
		transition: left 0.5s;
	}
	
	.operator-card:hover::before {
		left: 100%;
	}
	
	.operator-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
	}
	
	.operator-card:disabled {
		opacity: 0.3;
		cursor: not-allowed;
		transform: none;
	}
	
	.operator-symbol {
		font-size: 2rem;
		color: var(--op-color);
		margin-bottom: 0.5rem;
	}
	
	.operator-id {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 0.5rem;
	}
	
	.operator-desc {
		font-size: 0.75rem;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
		line-height: 1.4;
	}
	
	.operator-freq {
		font-size: 0.7rem;
		color: var(--text-dim);
		font-family: 'JetBrains Mono', monospace;
	}
	
	.selected-display {
		text-align: center;
	}
	
	.selected-display p {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}
	
	.selected-operators {
		display: flex;
		gap: 2rem;
		justify-content: center;
		font-size: 2rem;
	}
	
	.reaction-chamber {
		position: relative;
		max-width: 600px;
		margin: 0 auto 2rem;
		padding: 0;
		overflow: hidden;
	}
	
	.reaction-chamber canvas {
		display: block;
		width: 100%;
		height: 400px;
		background: rgba(0, 0, 0, 0.9);
	}
	
	.reaction-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		pointer-events: none;
	}
	
	.reaction-status {
		font-size: 1.5rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--cyan);
		margin-bottom: 0.5rem;
	}
	
	.catalyze-button {
		display: block;
		margin: 0 auto;
		padding: 1rem 3rem;
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.2em;
	}
	
	.synthesis-animation {
		position: relative;
		height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.synthesis-core {
		width: 100px;
		height: 100px;
		background: radial-gradient(circle, var(--cyan), transparent);
		border-radius: 50%;
		position: absolute;
	}
	
	.synthesis-ring {
		width: 200px;
		height: 200px;
		border: 2px solid var(--cyan);
		border-radius: 50%;
		position: absolute;
	}
	
	.synthesis-status {
		position: absolute;
		bottom: 50px;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--text-secondary);
		font-size: 0.875rem;
	}
	
	.orbiting-operator {
		position: absolute;
		font-size: 1.5rem;
		color: var(--orbit-color);
		animation: orbit 3s linear infinite;
		animation-delay: var(--orbit-delay);
	}
	
	.result-container {
		max-width: 700px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	.result-header {
		text-align: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(0, 255, 255, 0.3);
	}
	
	.result-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
	}
	
	.result-code {
		font-family: 'JetBrains Mono', monospace;
		color: var(--green);
		font-size: 1.25rem;
	}
	
	.archetype-display {
		text-align: center;
		margin-bottom: 2rem;
	}
	
	.archetype-name {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 1rem;
	}
	
	.pathway {
		font-size: 1.125rem;
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: 1rem;
	}
	
	.resonance {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		font-size: 0.875rem;
	}
	
	.resonance-label {
		color: var(--text-dim);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.resonance-value {
		font-family: 'JetBrains Mono', monospace;
	}
	
	.operator-formula {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		font-size: 1.5rem;
		margin: 2rem 0;
		padding: 1rem;
		background: rgba(0, 255, 255, 0.05);
		border: 1px solid rgba(0, 255, 255, 0.2);
		border-radius: 4px;
	}
	
	.operator-plus,
	.equals {
		color: var(--text-secondary);
	}
	
	.result-symbol {
		color: var(--cyan);
		font-size: 2rem;
	}
	
	.actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 2rem;
	}
</style>
