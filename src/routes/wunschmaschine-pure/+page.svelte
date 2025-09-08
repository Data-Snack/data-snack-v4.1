<script>
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	
	// Spring physics for smooth animations
	const physics = {
		stiffness: 0.05,
		damping: 0.9
	};
	
	// State
	let nodes = [];
	let links = [];
	let machineState = 'AWAKENING';
	let selectedNode = null;
	let draggedNode = null;
	
	// Concepts
	const concepts = [
		'rhizome', 'plateau', 'assemblage', 'desire', 'flow', 'cut',
		'deterritorialize', 'line-of-flight', 'smooth-space', 'nomad',
		'snack', 'cookie', 'data', 'error', 'glitch', 'void'
	];
	
	// Node class
	class Node {
		constructor(id, x, y) {
			this.id = id;
			this.x = x;
			this.y = y;
			this.vx = 0;
			this.vy = 0;
			this.label = concepts[Math.floor(Math.random() * concepts.length)];
			this.intensity = 0.5 + Math.random() * 0.5;
			this.frozen = false;
			this.color = `hsl(${Math.random() * 60 + 160}, 100%, 50%)`;
		}
	}
	
	// Initialize
	function initializeNodes() {
		nodes = [];
		for (let i = 0; i < 8; i++) {
			const angle = (i / 8) * Math.PI * 2;
			const radius = 150 + Math.random() * 100;
			nodes.push(new Node(
				`node-${i}`,
				Math.cos(angle) * radius,
				Math.sin(angle) * radius
			));
		}
		
		// Create links
		links = [];
		for (let i = 0; i < 10; i++) {
			const a = nodes[Math.floor(Math.random() * nodes.length)];
			const b = nodes[Math.floor(Math.random() * nodes.length)];
			if (a !== b) {
				links.push({
					id: `link-${i}`,
					source: a,
					target: b,
					strength: Math.random()
				});
			}
		}
	}
	
	// Physics simulation
	function updatePhysics() {
		if (machineState === 'CRYSTALLIZED') return;
		
		// Apply forces
		nodes.forEach(node => {
			if (node.frozen || node === draggedNode) return;
			
			// Center gravity
			node.vx -= node.x * 0.001;
			node.vy -= node.y * 0.001;
			
			// Repulsion between nodes
			nodes.forEach(other => {
				if (other === node) return;
				const dx = node.x - other.x;
				const dy = node.y - other.y;
				const dist = Math.sqrt(dx * dx + dy * dy) || 1;
				const force = 100 / (dist * dist);
				node.vx += (dx / dist) * force;
				node.vy += (dy / dist) * force;
			});
			
			// Apply velocity
			node.vx *= 0.9; // Damping
			node.vy *= 0.9;
			node.x += node.vx;
			node.y += node.vy;
		});
		
		// Update view
		nodes = [...nodes];
	}
	
	// Operations
	function connect() {
		if (nodes.length < 2) return;
		const a = nodes[Math.floor(Math.random() * nodes.length)];
		const b = nodes[Math.floor(Math.random() * nodes.length)];
		if (a !== b) {
			links.push({
				id: `link-${Date.now()}`,
				source: a,
				target: b,
				strength: Math.random()
			});
			links = [...links];
			flash('DESIRE_PRODUCTION');
		}
	}
	
	function deterritorialize() {
		const removeCount = Math.min(3, Math.floor(links.length * 0.3));
		links = links.slice(removeCount);
		flash('DETERRITORIALIZATION');
	}
	
	function lineOfFlight() {
		const node = new Node(
			`node-${Date.now()}`,
			Math.random() * 400 - 200,
			Math.random() * 400 - 200
		);
		node.vx = (Math.random() - 0.5) * 20;
		node.vy = (Math.random() - 0.5) * 20;
		node.label = 'escape';
		node.color = '#ffff00';
		nodes = [...nodes, node];
		flash('LINE_OF_FLIGHT');
	}
	
	function metabolize() {
		nodes.forEach(node => {
			node.label = concepts[Math.floor(Math.random() * concepts.length)];
			node.intensity = 0.5 + Math.random() * 0.5;
			node.color = `hsl(${Math.random() * 60 + 160}, 100%, 50%)`;
		});
		nodes = [...nodes];
		flash('METABOLIZATION');
	}
	
	function crystallize() {
		nodes.forEach(node => node.frozen = true);
		machineState = 'CRYSTALLIZED';
		setTimeout(thaw, 3000);
	}
	
	function thaw() {
		nodes.forEach(node => node.frozen = false);
		machineState = 'FLOWING';
	}
	
	function reset() {
		initializeNodes();
		machineState = 'AWAKENING';
		setTimeout(() => machineState = 'FLOWING', 1000);
	}
	
	function flash(state) {
		machineState = state;
		setTimeout(() => machineState = 'FLOWING', 1000);
	}
	
	// Drag handling
	function handleMouseDown(node) {
		draggedNode = node;
		selectedNode = node;
	}
	
	function handleMouseMove(e) {
		if (!draggedNode) return;
		const rect = e.currentTarget.getBoundingClientRect();
		draggedNode.x = e.clientX - rect.left - rect.width / 2;
		draggedNode.y = e.clientY - rect.top - rect.height / 2;
		nodes = [...nodes];
	}
	
	function handleMouseUp() {
		draggedNode = null;
	}
	
	// Lifecycle
	onMount(() => {
		initializeNodes();
		
		const interval = setInterval(updatePhysics, 50);
		
		const autoOp = setInterval(() => {
			if (Math.random() > 0.7) {
				const ops = [connect, deterritorialize, lineOfFlight];
				ops[Math.floor(Math.random() * ops.length)]();
			}
		}, 5000);
		
		return () => {
			clearInterval(interval);
			clearInterval(autoOp);
		};
	});
</script>

<svelte:head>
	<title>WUNSCHMASCHINE // Pure Svelte</title>
</svelte:head>

<div class="wunschmaschine">
	<header>
		<h1>WUNSCHMASCHINE</h1>
		<p class="state">STATE: <span>{machineState}</span></p>
		<p>Abstract Machine — Pure Svelte Implementation</p>
	</header>
	
	<div class="controls">
		<button on:click={connect}>CONNECT</button>
		<button on:click={deterritorialize}>DETERRITORIALIZE</button>
		<button on:click={lineOfFlight}>LINE OF FLIGHT</button>
		<button on:click={metabolize}>METABOLIZE</button>
		<button on:click={crystallize}>CRYSTALLIZE</button>
		<button on:click={thaw}>THAW</button>
		<button on:click={reset}>RESET</button>
	</div>
	
	<div class="stats">
		<span>NODES: {nodes.length}</span>
		<span>LINKS: {links.length}</span>
		<span>SELECTED: {selectedNode?.label || 'none'}</span>
	</div>
	
	<div 
		class="canvas"
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
		on:mouseleave={handleMouseUp}
		role="application"
		aria-label="Abstract machine visualization"
	>
		<!-- Links -->
		{#each links as link}
			<svg class="link-svg">
				<line
					x1={link.source.x + 400}
					y1={link.source.y + 300}
					x2={link.target.x + 400}
					y2={link.target.y + 300}
					stroke="rgba(0, 255, 255, {link.strength * 0.5})"
					stroke-width="1"
				/>
			</svg>
		{/each}
		
		<!-- Nodes -->
		{#each nodes as node}
			<div
				class="node"
				class:frozen={node.frozen}
				class:selected={node === selectedNode}
				style="
					left: {node.x + 400}px;
					top: {node.y + 300}px;
					transform: translate(-50%, -50%) scale({node.intensity});
					background: {node.color};
				"
				on:mousedown={() => handleMouseDown(node)}
				role="button"
				tabindex="0"
			>
				<span class="label">{node.label}</span>
			</div>
		{/each}
	</div>
	
	<footer>
		<p>Drag nodes • Click to select • Auto-operates every 5s</p>
	</footer>
</div>

<style>
	.wunschmaschine {
		min-height: 100vh;
		background: #000;
		color: #fff;
		padding: 2rem;
		font-family: monospace;
		overflow: hidden;
	}
	
	header {
		text-align: center;
		margin-bottom: 2rem;
	}
	
	h1 {
		font-size: 3rem;
		background: linear-gradient(90deg, #00ffff, #00ff88);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.state {
		color: rgba(255, 255, 255, 0.5);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.state span {
		color: #00ff88;
		font-weight: bold;
	}
	
	.controls {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}
	
	button {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid #00ffff;
		color: #00ffff;
		cursor: pointer;
		transition: all 0.3s;
		font-family: inherit;
		text-transform: uppercase;
		font-size: 0.75rem;
	}
	
	button:hover {
		background: #00ffff;
		color: #000;
		transform: scale(1.05);
	}
	
	.stats {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 0.875rem;
		color: #00ff88;
	}
	
	.stats span {
		margin: 0 1rem;
	}
	
	.canvas {
		position: relative;
		width: 800px;
		height: 600px;
		margin: 0 auto;
		background: #0a0a0a;
		border: 1px solid #00ffff33;
		border-radius: 4px;
		cursor: grab;
		overflow: hidden;
	}
	
	.canvas:active {
		cursor: grabbing;
	}
	
	.link-svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	
	.node {
		position: absolute;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid #000;
		cursor: pointer;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
	}
	
	.node:hover {
		transform: translate(-50%, -50%) scale(1.2);
		box-shadow: 0 0 20px currentColor;
		z-index: 10;
	}
	
	.node.frozen {
		border-color: #fff;
		opacity: 0.5;
	}
	
	.node.selected {
		box-shadow: 0 0 30px currentColor;
		z-index: 100;
	}
	
	.label {
		position: absolute;
		top: -20px;
		font-size: 10px;
		white-space: nowrap;
		color: #fff;
		text-shadow: 0 0 3px #000;
	}
	
	footer {
		text-align: center;
		margin-top: 2rem;
		color: rgba(255, 255, 255, 0.3);
		font-size: 0.75rem;
		text-transform: uppercase;
	}
	
	@media (max-width: 900px) {
		.canvas {
			width: 100%;
			max-width: 600px;
			height: 450px;
		}
		
		h1 {
			font-size: 2rem;
		}
		
		.controls {
			padding: 0 1rem;
		}
		
		button {
			font-size: 0.625rem;
			padding: 0.4rem 0.8rem;
		}
	}
</style>
