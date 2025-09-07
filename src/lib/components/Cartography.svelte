<script>
	import { onMount } from 'svelte';
	
	export let mini = false;
	
	let canvas;
	let nodes = [];
	let connections = [];
	
	// Die 5 Plateaus als Knoten
	const plateaus = [
		{ id: 'apparate', label: 'Apparate', x: 0.2, y: 0.3, color: '#8b5cf6' },
		{ id: 'koerper', label: 'Körper', x: 0.8, y: 0.3, color: '#10b981' },
		{ id: 'fehler', label: 'Fehler', x: 0.5, y: 0.5, color: '#f59e0b' },
		{ id: 'zeit', label: 'Zeit', x: 0.2, y: 0.7, color: '#06b6d4' },
		{ id: 'gemeinschaft', label: 'Gemeinschaft', x: 0.8, y: 0.7, color: '#ec4899' }
	];
	
	onMount(() => {
		// Initialisiere die lebendige Karte
		nodes = plateaus.map(p => ({
			...p,
			pulsePhase: Math.random() * Math.PI * 2
		}));
		
		// Zufällige Verbindungen für Demo
		connections = [
			{ from: 'koerper', to: 'zeit', opacity: 0.5 },
			{ from: 'apparate', to: 'fehler', opacity: 0.3 },
			{ from: 'fehler', to: 'gemeinschaft', opacity: 0.4 }
		];
		
		if (!mini) {
			animateMap();
		}
	});
	
	function animateMap() {
		// Später: Animation der Karte
	}
</script>

<div class="cartography {mini ? 'mini' : ''}" bind:this={canvas}>
	<svg viewBox="0 0 100 100">
		<!-- Verbindungen -->
		{#each connections as conn}
			<line 
				x1="{nodes.find(n => n.id === conn.from)?.x * 100}"
				y1="{nodes.find(n => n.id === conn.from)?.y * 100}"
				x2="{nodes.find(n => n.id === conn.to)?.x * 100}"
				y2="{nodes.find(n => n.id === conn.to)?.y * 100}"
				stroke="white"
				stroke-opacity={conn.opacity}
				stroke-width="0.2"
				stroke-dasharray="1,1"
			/>
		{/each}
		
		<!-- Plateaus -->
		{#each nodes as node}
			<g transform="translate({node.x * 100}, {node.y * 100})">
				<circle 
					r="5" 
					fill={node.color}
					opacity="0.8"
					class="pulse"
				/>
				<text 
					y="8" 
					text-anchor="middle"
					fill="white"
					font-size="2"
				>
					{node.label}
				</text>
			</g>
		{/each}
		
		{#if !mini}
			<!-- Primordial Soup als erster Pfad -->
			<g transform="translate(50, 30)">
				<circle r="2" fill="#fff" opacity="0.9" class="float" />
				<text y="4" text-anchor="middle" fill="white" font-size="1.5">
					Primordial Soup
				</text>
			</g>
		{/if}
	</svg>
</div>

<style>
	.cartography {
		width: 100%;
		height: 400px;
		border-radius: 12px;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.3);
		padding: 2rem;
	}
	
	.cartography.mini {
		height: 200px;
		padding: 1rem;
	}
	
	svg {
		width: 100%;
		height: 100%;
	}
	
	circle.pulse {
		animation: pulse 3s ease-in-out infinite;
	}
	
	.float {
		animation: float 4s ease-in-out infinite;
	}
</style>
