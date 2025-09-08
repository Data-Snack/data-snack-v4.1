<script>
	import { onMount } from 'svelte';
	import Cartography from '$lib/components/Cartography.svelte';
	import { fade } from 'svelte/transition';
	
	let showCommunity = true;
	let showLegend = true;
	let stats = {
		totalUsers: 0,
		totalPaths: 0,
		mostVisited: null,
		yourProgress: 0
	};
	
	onMount(() => {
		// Load user stats
		const stored = localStorage.getItem('dataSnackJourney');
		if (stored) {
			const data = JSON.parse(stored);
			stats.yourProgress = (data.visited?.length || 0) / 3 * 100; // 3 active snacks
		}
		
		// Simulate community stats
		stats.totalUsers = Math.floor(Math.random() * 1000) + 500;
		stats.totalPaths = Math.floor(Math.random() * 5000) + 2000;
		stats.mostVisited = 'COOKIE_ROULETTE';
	});
</script>

<svelte:head>
	<title>REALITY_CARTOGRAPHY // Data Snack Map</title>
</svelte:head>

<div class="map-view">
	<header class="map-header">
		<div class="header-content">
			<h1 class="map-title glitch" data-text="REALITY_CARTOGRAPHY">
				REALITY_CARTOGRAPHY
			</h1>
			<p class="map-subtitle">
				Every click leaves a trace. Every journey creates reality.
			</p>
		</div>
		
		<div class="map-controls">
			<button 
				class="control-toggle"
				class:active={showCommunity}
				on:click={() => showCommunity = !showCommunity}
			>
				<span class="toggle-icon">{showCommunity ? '👁' : '👁‍🗨'}</span>
				COMMUNITY PATHS
			</button>
			
			<button 
				class="control-toggle"
				class:active={showLegend}
				on:click={() => showLegend = !showLegend}
			>
				<span class="toggle-icon">📍</span>
				LEGEND
			</button>
			
			<a href="/" class="back-button">
				<span>←</span> BACK TO REALITY
			</a>
		</div>
	</header>
	
	<div class="map-container">
		<div class="map-wrapper">
			<Cartography 
				mini={false} 
				interactive={true}
				showUserPath={true}
				showCommunityPaths={showCommunity}
			/>
		</div>
		
		<!-- Stats Panel -->
		<aside class="stats-panel">
			<h2 class="panel-title">NETWORK_STATS</h2>
			
			<div class="stat-item">
				<span class="stat-label">Active Explorers</span>
				<span class="stat-value">{stats.totalUsers}</span>
			</div>
			
			<div class="stat-item">
				<span class="stat-label">Paths Created</span>
				<span class="stat-value">{stats.totalPaths}</span>
			</div>
			
			<div class="stat-item">
				<span class="stat-label">Most Visited</span>
				<span class="stat-value highlight">{stats.mostVisited}</span>
			</div>
			
			<div class="stat-item">
				<span class="stat-label">Your Progress</span>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {stats.yourProgress}%"></div>
				</div>
				<span class="stat-value">{stats.yourProgress.toFixed(0)}%</span>
			</div>
			
			<div class="divider"></div>
			
			<h3 class="section-title">PLATEAUS</h3>
			<div class="plateau-list">
				<div class="plateau-item">
					<span class="plateau-dot" style="background: #00ffff"></span>
					<span class="plateau-name">APPARATE</span>
					<span class="plateau-status">ACTIVE</span>
				</div>
				<div class="plateau-item">
					<span class="plateau-dot" style="background: #ff00ff"></span>
					<span class="plateau-name">KÖRPER</span>
					<span class="plateau-status">ACTIVE</span>
				</div>
				<div class="plateau-item">
					<span class="plateau-dot" style="background: #ffff00"></span>
					<span class="plateau-name">FEHLER</span>
					<span class="plateau-status">LOCKED</span>
				</div>
				<div class="plateau-item">
					<span class="plateau-dot" style="background: #00ff88"></span>
					<span class="plateau-name">ZEIT</span>
					<span class="plateau-status">LOCKED</span>
				</div>
				<div class="plateau-item">
					<span class="plateau-dot" style="background: #ff0040"></span>
					<span class="plateau-name">GEMEINSCHAFT</span>
					<span class="plateau-status">LOCKED</span>
				</div>
			</div>
		</aside>
	</div>
	
	<!-- Legend Overlay -->
	{#if showLegend}
		<div class="legend-overlay" transition:fade>
			<div class="legend-content">
				<h3>MAP LEGEND</h3>
				
				<div class="legend-item">
					<svg width="30" height="10">
						<line x1="0" y1="5" x2="30" y2="5" stroke="#00ffff" stroke-width="2"/>
					</svg>
					<span>Your Path</span>
				</div>
				
				<div class="legend-item">
					<svg width="30" height="10">
						<line x1="0" y1="5" x2="30" y2="5" stroke="#ff00ff" stroke-width="1" stroke-dasharray="2,2"/>
					</svg>
					<span>Community Paths</span>
				</div>
				
				<div class="legend-item">
					<svg width="20" height="20">
						<circle cx="10" cy="10" r="5" fill="#00ff88"/>
					</svg>
					<span>Visited Snack</span>
				</div>
				
				<div class="legend-item">
					<svg width="20" height="20">
						<circle cx="10" cy="10" r="5" fill="#444444"/>
					</svg>
					<span>Locked Snack</span>
				</div>
				
				<div class="legend-item">
					<svg width="20" height="20">
						<circle cx="10" cy="10" r="8" fill="none" stroke="#ffffff" stroke-width="2"/>
					</svg>
					<span>Current Location</span>
				</div>
				
				<button class="close-legend" on:click={() => showLegend = false}>×</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.map-view {
		min-height: 100vh;
		background: var(--bg-void);
		color: var(--text-primary);
		padding: 2rem;
	}
	
	.map-header {
		margin-bottom: 2rem;
	}
	
	.header-content {
		text-align: center;
		margin-bottom: 2rem;
	}
	
	.map-title {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
	}
	
	.map-subtitle {
		color: var(--text-secondary);
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
	}
	
	.map-controls {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	
	.control-toggle {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid var(--text-dim);
		color: var(--text-secondary);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		cursor: pointer;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.control-toggle.active {
		border-color: var(--cyan);
		color: var(--cyan);
		background: rgba(0, 255, 255, 0.1);
	}
	
	.control-toggle:hover {
		border-color: var(--cyan);
		color: var(--cyan);
	}
	
	.toggle-icon {
		font-size: 1rem;
	}
	
	.back-button {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid var(--red);
		color: var(--red);
		text-decoration: none;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.back-button:hover {
		background: rgba(255, 0, 64, 0.1);
		box-shadow: 0 0 20px rgba(255, 0, 64, 0.3);
	}
	
	.map-container {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}
	
	.map-wrapper {
		width: 100%;
	}
	
	.stats-panel {
		background: rgba(0, 0, 0, 0.8);
		border: 1px solid rgba(0, 255, 255, 0.2);
		padding: 1.5rem;
		height: fit-content;
	}
	
	.panel-title {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--cyan);
		margin-bottom: 1.5rem;
		font-weight: 600;
	}
	
	.stat-item {
		margin-bottom: 1.5rem;
	}
	
	.stat-label {
		display: block;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
	}
	
	.stat-value {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
		font-family: 'JetBrains Mono', monospace;
	}
	
	.stat-value.highlight {
		color: var(--cyan);
		font-size: 1rem;
	}
	
	.progress-bar {
		height: 4px;
		background: rgba(255, 255, 255, 0.1);
		margin: 0.5rem 0;
		border-radius: 2px;
		overflow: hidden;
	}
	
	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--cyan), var(--green));
		transition: width 0.5s ease;
		border-radius: 2px;
	}
	
	.divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.1);
		margin: 2rem 0;
	}
	
	.section-title {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}
	
	.plateau-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.plateau-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}
	
	.plateau-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	
	.plateau-name {
		flex: 1;
		color: var(--text-secondary);
	}
	
	.plateau-status {
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.2rem 0.4rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 2px;
		color: var(--text-dim);
	}
	
	.plateau-item:has(.plateau-status:contains("ACTIVE")) .plateau-status {
		color: var(--green);
		background: rgba(0, 255, 136, 0.1);
	}
	
	.legend-overlay {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		background: rgba(0, 0, 0, 0.95);
		border: 1px solid var(--cyan);
		padding: 1.5rem;
		border-radius: 4px;
		z-index: 100;
	}
	
	.legend-content h3 {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--cyan);
		margin-bottom: 1rem;
	}
	
	.legend-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.75rem;
		font-size: 0.75rem;
		color: var(--text-secondary);
	}
	
	.close-legend {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: transparent;
		border: none;
		color: var(--text-secondary);
		font-size: 1.5rem;
		cursor: pointer;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s;
	}
	
	.close-legend:hover {
		color: var(--red);
		transform: rotate(90deg);
	}
	
	/* Mobile responsive */
	@media (max-width: 1024px) {
		.map-container {
			grid-template-columns: 1fr;
		}
		
		.stats-panel {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 1rem;
		}
		
		.divider {
			display: none;
		}
		
		.plateau-list {
			grid-column: 1 / -1;
		}
	}
	
	@media (max-width: 640px) {
		.map-view {
			padding: 1rem;
		}
		
		.map-title {
			font-size: 1.5rem;
		}
		
		.map-controls {
			flex-direction: column;
		}
		
		.control-toggle,
		.back-button {
			width: 100%;
			justify-content: center;
		}
		
		.legend-overlay {
			bottom: 1rem;
			right: 1rem;
			left: 1rem;
		}
	}
</style>
