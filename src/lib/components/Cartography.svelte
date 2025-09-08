<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	
	// Props
	export let mini = false;
	export let interactive = true;
	export let showUserPath = true;
	export let showCommunityPaths = true;
	
	// State
	let canvas;
	let svgElement;
	let animationFrame;
	let time = 0;
	
	// User Journey
	let userPath = [];
	let currentLocation = null;
	let visitedSnacks = [];
	
	// Community Data (später von Supabase)
	let communityPaths = [];
	let heatMap = {};
	let activeUsers = 0;
	
	// Plateaus mit erweiterten Daten
	const plateaus = [
		{ 
			id: 'apparate', 
			label: 'APPARATE', 
			x: 0.2, 
			y: 0.3, 
			color: '#00ffff',
			snacks: ['cookie-roulette', 'privacy-theater'],
			visitors: 0,
			description: 'Technische Systeme sichtbar machen'
		},
		{ 
			id: 'koerper', 
			label: 'KÖRPER', 
			x: 0.8, 
			y: 0.3, 
			color: '#ff00ff',
			snacks: ['scroll-yoga', 'data-dna'],
			visitors: 0,
			description: 'Daten verkörpern und ritualisieren'
		},
		{ 
			id: 'fehler', 
			label: 'FEHLER', 
			x: 0.5, 
			y: 0.5, 
			color: '#ffff00',
			snacks: ['error-oracle', 'glitch-gallery'],
			visitors: 0,
			description: 'Irritation als Methode'
		},
		{ 
			id: 'zeit', 
			label: 'ZEIT', 
			x: 0.2, 
			y: 0.7, 
			color: '#00ff88',
			snacks: ['doom-timer', 'infinite-recursion'],
			visitors: 0,
			description: 'Trajektorien und Gewohnheit'
		},
		{ 
			id: 'gemeinschaft', 
			label: 'GEMEINSCHAFT', 
			x: 0.8, 
			y: 0.7, 
			color: '#ff0040',
			snacks: ['echo-chamber', 'consensus-machine'],
			visitors: 0,
			description: 'Kollektive Stimmen'
		}
	];
	
	// Snacks mit Positionen und Status
	const snacks = [
		{
			id: 'primordial-soup',
			name: 'PRIMORDIAL_SOUP',
			plateau: null, // Meta-Snack
			x: 0.5,
			y: 0.1,
			status: 'active',
			color: '#ffffff',
			connections: ['apparate', 'koerper', 'fehler', 'zeit', 'gemeinschaft']
		},
		{
			id: 'cookie-roulette',
			name: 'COOKIE_ROULETTE',
			plateau: 'apparate',
			x: 0.15,
			y: 0.2,
			status: 'active',
			color: '#ff0040'
		},
		{
			id: 'scroll-yoga',
			name: 'SCROLL_YOGA',
			plateau: 'koerper',
			x: 0.85,
			y: 0.2,
			status: 'active',
			color: '#00ff88'
		},
		{
			id: 'error-oracle',
			name: 'ERROR_ORACLE',
			plateau: 'fehler',
			x: 0.5,
			y: 0.4,
			status: 'active',
			color: '#ffff00'
		}
	];
	
	// Dynamic connections based on user flow
	let connections = [];
	let particles = [];
	
	// Initialize user data from localStorage
	function loadUserData() {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('dataSnackJourney');
			if (stored) {
				const data = JSON.parse(stored);
				userPath = data.path || [];
				visitedSnacks = data.visited || [];
			}
			
			// Get current location from URL
			const path = window.location.pathname;
			if (path.includes('/kitchen/')) {
				const snackId = path.split('/kitchen/')[1];
				updateCurrentLocation(snackId);
			}
		}
	}
	
	// Save user journey
	function saveUserData() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('dataSnackJourney', JSON.stringify({
				path: userPath,
				visited: visitedSnacks,
				timestamp: Date.now()
			}));
		}
	}
	
	// Update current location
	function updateCurrentLocation(snackId) {
		const snack = snacks.find(s => s.id === snackId);
		if (snack) {
			currentLocation = snack;
			
			// Add to visited if not already
			if (!visitedSnacks.includes(snackId)) {
				visitedSnacks = [...visitedSnacks, snackId];
			}
			
			// Add to path
			userPath = [...userPath, {
				snack: snackId,
				timestamp: Date.now()
			}];
			
			// Update connections
			updateConnections();
			
			// Save
			saveUserData();
		}
	}
	
	// Update dynamic connections
	function updateConnections() {
		connections = [];
		
		// User path connections
		if (userPath.length > 1) {
			for (let i = 0; i < userPath.length - 1; i++) {
				const from = snacks.find(s => s.id === userPath[i].snack);
				const to = snacks.find(s => s.id === userPath[i + 1].snack);
				
				if (from && to) {
					connections.push({
						from: from,
						to: to,
						type: 'user',
						strength: 1 - (i / userPath.length), // Fade older connections
						color: '#00ffff'
					});
				}
			}
		}
		
		// Plateau connections
		snacks.forEach(snack => {
			if (snack.connections) {
				snack.connections.forEach(plateauId => {
					const plateau = plateaus.find(p => p.id === plateauId);
					if (plateau) {
						connections.push({
							from: snack,
							to: plateau,
							type: 'structural',
							strength: 0.3,
							color: '#ffffff'
						});
					}
				});
			}
		});
		
		// Community paths (simulated for now)
		if (showCommunityPaths) {
			generateCommunityPaths();
		}
	}
	
	// Simulate community paths
	function generateCommunityPaths() {
		// Simulate popular routes
		const popularRoutes = [
			['primordial-soup', 'cookie-roulette'],
			['primordial-soup', 'scroll-yoga'],
			['cookie-roulette', 'scroll-yoga']
		];
		
		popularRoutes.forEach(route => {
			const from = snacks.find(s => s.id === route[0]);
			const to = snacks.find(s => s.id === route[1]);
			
			if (from && to) {
				connections.push({
					from: from,
					to: to,
					type: 'community',
					strength: Math.random() * 0.5 + 0.2,
					color: '#ff00ff'
				});
			}
		});
	}
	
	// Create data particles
	function createParticle(from, to, color) {
		particles.push({
			id: Date.now() + Math.random(),
			from: from,
			to: to,
			progress: 0,
			color: color || '#00ffff',
			size: Math.random() * 2 + 1
		});
	}
	
	// Animation loop
	function animate() {
		time += 0.01;
		
		// Update particles
		particles = particles.filter(p => {
			p.progress += 0.02;
			return p.progress <= 1;
		});
		
		// Add new particles occasionally
		if (Math.random() < 0.02 && connections.length > 0) {
			const conn = connections[Math.floor(Math.random() * connections.length)];
			createParticle(conn.from, conn.to, conn.color);
		}
		
		// Update heat map
		updateHeatMap();
		
		animationFrame = requestAnimationFrame(animate);
	}
	
	// Update heat map based on activity
	function updateHeatMap() {
		plateaus.forEach(plateau => {
			const activity = visitedSnacks.filter(s => {
				const snack = snacks.find(sn => sn.id === s);
				return snack && snack.plateau === plateau.id;
			}).length;
			
			plateau.visitors = activity;
		});
	}
	
	// Handle click on snack/plateau
	function handleNodeClick(node) {
		if (!interactive) return;
		
		if (node.id && snacks.find(s => s.id === node.id)) {
			// Navigate to snack
			window.location.href = `/kitchen/${node.id}`;
		}
	}
	
	// Get node position
	function getNodePosition(node) {
		if (node.x !== undefined && node.y !== undefined) {
			return { x: node.x * 100, y: node.y * 100 };
		}
		return { x: 50, y: 50 };
	}
	
	// Calculate particle position
	function getParticlePosition(particle) {
		const from = getNodePosition(particle.from);
		const to = getNodePosition(particle.to);
		
		return {
			x: from.x + (to.x - from.x) * particle.progress,
			y: from.y + (to.y - from.y) * particle.progress
		};
	}
	
	onMount(() => {
		loadUserData();
		updateConnections();
		
		if (!mini) {
			animate();
		}
	});
	
	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

<div class="cartography {mini ? 'mini' : ''}" bind:this={canvas}>
	<svg viewBox="0 0 100 100" bind:this={svgElement}>
		<defs>
			<!-- Glow filter -->
			<filter id="glow">
				<feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
				<feMerge>
					<feMergeNode in="coloredBlur"/>
					<feMergeNode in="SourceGraphic"/>
				</feMerge>
			</filter>
			
			<!-- Gradient for connections -->
			<linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" style="stop-color:#00ffff;stop-opacity:0" />
				<stop offset="50%" style="stop-color:#00ffff;stop-opacity:1" />
				<stop offset="100%" style="stop-color:#00ffff;stop-opacity:0" />
			</linearGradient>
		</defs>
		
		<!-- Background grid -->
		{#if !mini}
			<pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
				<path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>
			</pattern>
			<rect width="100" height="100" fill="url(#grid)" />
		{/if}
		
		<!-- Connections -->
		{#each connections as conn}
			<line 
				x1={getNodePosition(conn.from).x}
				y1={getNodePosition(conn.from).y}
				x2={getNodePosition(conn.to).x}
				y2={getNodePosition(conn.to).y}
				stroke={conn.color}
				stroke-opacity={conn.strength * 0.5}
				stroke-width={conn.type === 'user' ? 0.5 : 0.2}
				stroke-dasharray={conn.type === 'structural' ? '1,1' : '0'}
				class="connection"
			/>
		{/each}
		
		<!-- Particles -->
		{#each particles as particle (particle.id)}
			<circle 
				cx={getParticlePosition(particle).x}
				cy={getParticlePosition(particle).y}
				r={particle.size}
				fill={particle.color}
				opacity="0.8"
				filter="url(#glow)"
			/>
		{/each}
		
		<!-- Plateaus -->
		{#each plateaus as plateau}
			<g 
				transform="translate({plateau.x * 100}, {plateau.y * 100})"
				class="plateau-node"
				on:click={() => handleNodeClick(plateau)}
				style="cursor: {interactive ? 'pointer' : 'default'}"
			>
				<!-- Heat map background -->
				{#if plateau.visitors > 0}
					<circle 
						r={8 + plateau.visitors * 2}
						fill={plateau.color}
						opacity={0.1 + plateau.visitors * 0.1}
						class="heat-circle"
					/>
				{/if}
				
				<!-- Main circle -->
				<circle 
					r="5" 
					fill="none"
					stroke={plateau.color}
					stroke-width="0.5"
					opacity="0.8"
					class="pulse"
					style="animation-delay: {Math.random() * 2}s"
				/>
				
				<!-- Inner circle -->
				<circle 
					r="3" 
					fill={plateau.color}
					opacity="0.5"
				/>
				
				<!-- Label -->
				{#if !mini}
					<text 
						y="10" 
						text-anchor="middle"
						fill={plateau.color}
						font-size="2"
						font-family="JetBrains Mono"
						font-weight="600"
					>
						{plateau.label}
					</text>
				{/if}
			</g>
		{/each}
		
		<!-- Snacks -->
		{#each snacks as snack}
			{#if snack.status === 'active' || !mini}
				<g 
					transform="translate({snack.x * 100}, {snack.y * 100})"
					class="snack-node"
					on:click={() => handleNodeClick(snack)}
					style="cursor: {interactive && snack.status === 'active' ? 'pointer' : 'default'}"
				>
					<!-- Visited indicator -->
					{#if visitedSnacks.includes(snack.id)}
						<circle 
							r="4"
							fill="none"
							stroke="#00ff88"
							stroke-width="0.5"
							opacity="0.5"
							class="visited-ring"
						/>
					{/if}
					
					<!-- Current location indicator -->
					{#if currentLocation && currentLocation.id === snack.id}
						<circle 
							r="6"
							fill="none"
							stroke="#ffffff"
							stroke-width="1"
							opacity="0.8"
							class="current-ring pulse"
						/>
					{/if}
					
					<!-- Snack dot -->
					<circle 
						r="2" 
						fill={snack.status === 'active' ? snack.color : '#444444'}
						opacity={snack.status === 'active' ? 1 : 0.3}
						filter={snack.status === 'active' ? 'url(#glow)' : ''}
					/>
					
					<!-- Label -->
					{#if !mini && snack.status === 'active'}
						<text 
							y="-5" 
							text-anchor="middle"
							fill="white"
							font-size="1.5"
							font-family="JetBrains Mono"
							opacity="0.7"
						>
							{snack.name}
						</text>
					{/if}
				</g>
			{/if}
		{/each}
		
		<!-- User path trace -->
		{#if showUserPath && userPath.length > 1}
			<polyline
				points={userPath.map(p => {
					const snack = snacks.find(s => s.id === p.snack);
					if (snack) {
						const pos = getNodePosition(snack);
						return `${pos.x},${pos.y}`;
					}
					return '';
				}).join(' ')}
				fill="none"
				stroke="#00ffff"
				stroke-width="0.3"
				stroke-opacity="0.5"
				stroke-dasharray="2,2"
			/>
		{/if}
		
		<!-- Stats overlay -->
		{#if !mini}
			<g transform="translate(2, 95)">
				<text fill="white" font-size="1.5" opacity="0.5" font-family="JetBrains Mono">
					SNACKS: {visitedSnacks.length}/{snacks.filter(s => s.status === 'active').length}
				</text>
				<text y="2" fill="white" font-size="1.5" opacity="0.5" font-family="JetBrains Mono">
					PATH: {userPath.length} NODES
				</text>
			</g>
		{/if}
		
		<!-- Legend -->
		{#if !mini && interactive}
			<g transform="translate(85, 90)">
				<text fill="#00ffff" font-size="1.2" opacity="0.5" font-family="JetBrains Mono">YOUR PATH</text>
				<text y="2" fill="#ff00ff" font-size="1.2" opacity="0.5" font-family="JetBrains Mono">COMMUNITY</text>
				<text y="4" fill="#00ff88" font-size="1.2" opacity="0.5" font-family="JetBrains Mono">VISITED</text>
			</g>
		{/if}
	</svg>
	
	<!-- Hover info -->
	{#if !mini}
		<div class="hover-info">
			<p class="info-text">Click nodes to navigate • Your journey is being mapped</p>
		</div>
	{/if}
</div>

<style>
	.cartography {
		width: 100%;
		height: 500px;
		border-radius: 4px;
		overflow: hidden;
		background: linear-gradient(135deg, rgba(0, 0, 51, 0.9), rgba(0, 0, 0, 0.9));
		border: 1px solid rgba(0, 255, 255, 0.2);
		position: relative;
		box-shadow: 
			inset 0 0 50px rgba(0, 255, 255, 0.05),
			0 0 20px rgba(0, 255, 255, 0.1);
	}
	
	.cartography.mini {
		height: 250px;
		background: rgba(0, 0, 0, 0.6);
	}
	
	svg {
		width: 100%;
		height: 100%;
	}
	
	.connection {
		transition: stroke-opacity 0.3s;
	}
	
	.plateau-node,
	.snack-node {
		transition: transform 0.3s;
	}
	
	.plateau-node:hover,
	.snack-node:hover {
		transform: scale(1.2);
	}
	
	.pulse {
		animation: pulse 3s ease-in-out infinite;
	}
	
	@keyframes pulse {
		0%, 100% { 
			r: 5;
			opacity: 0.8;
		}
		50% { 
			r: 6;
			opacity: 1;
		}
	}
	
	.heat-circle {
		animation: heat-pulse 4s ease-in-out infinite;
	}
	
	@keyframes heat-pulse {
		0%, 100% { 
			opacity: 0.1;
		}
		50% { 
			opacity: 0.3;
		}
	}
	
	.visited-ring {
		animation: visited-pulse 2s ease-in-out infinite;
	}
	
	@keyframes visited-pulse {
		0%, 100% { 
			r: 4;
			opacity: 0.5;
		}
		50% { 
			r: 5;
			opacity: 0.8;
		}
	}
	
	.current-ring {
		animation: current-pulse 1s ease-in-out infinite;
	}
	
	@keyframes current-pulse {
		0%, 100% { 
			r: 6;
			stroke-width: 1;
		}
		50% { 
			r: 7;
			stroke-width: 0.5;
		}
	}
	
	.hover-info {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		right: 1rem;
		text-align: center;
	}
	
	.info-text {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.3);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-family: 'JetBrains Mono', monospace;
	}
	
	/* Mobile responsive */
	@media (max-width: 768px) {
		.cartography {
			height: 400px;
		}
		
		.cartography.mini {
			height: 200px;
		}
	}
</style>
