<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	// State
	let mounted = false;
	let d3Module = null;
	let svgElement;
	let simulation = null;
	let machineState = 'INITIALIZING';
	
	// Data
	let nodes = [];
	let links = [];
	
	// Concepts for node generation
	const concepts = [
		'rhizome', 'plateau', 'assemblage', 'desire', 'flow', 'cut',
		'deterritorialize', 'line-of-flight', 'smooth-space', 'nomad',
		'agential-cut', 'entanglement', 'apparatus', 'phenomenon',
		'snack', 'cookie', 'data', 'error', 'glitch', 'trajectory'
	];
	
	// Generate initial data
	function initializeData() {
		// Create initial nodes
		nodes = Array.from({ length: 8 }, (_, i) => ({
			id: `node-${i}`,
			label: concepts[Math.floor(Math.random() * concepts.length)],
			x: Math.random() * 800 - 400,
			y: Math.random() * 600 - 300,
			intensity: 0.5 + Math.random() * 0.5
		}));
		
		// Create initial links
		links = [];
		for (let i = 0; i < 10; i++) {
			const source = nodes[Math.floor(Math.random() * nodes.length)];
			const target = nodes[Math.floor(Math.random() * nodes.length)];
			if (source.id !== target.id) {
				links.push({
					id: `link-${i}`,
					source: source.id,
					target: target.id,
					strength: Math.random()
				});
			}
		}
	}
	
	// Initialize D3 visualization
	async function initializeVisualization() {
		if (!browser || !svgElement) return;
		
		try {
			// Dynamically import D3
			d3Module = await import('d3');
			const d3 = d3Module;
			
			const width = 1200;
			const height = 700;
			
			// Clear SVG
			const svg = d3.select(svgElement);
			svg.selectAll('*').remove();
			
			// Set viewBox
			svg.attr('viewBox', [-width/2, -height/2, width, height]);
			
			// Create container
			const g = svg.append('g');
			
			// Create simulation
			simulation = d3.forceSimulation(nodes)
				.force('link', d3.forceLink(links).id(d => d.id).distance(100))
				.force('charge', d3.forceManyBody().strength(-200))
				.force('center', d3.forceCenter(0, 0))
				.force('collision', d3.forceCollide().radius(30));
			
			// Create links
			const link = g.append('g')
				.selectAll('line')
				.data(links)
				.join('line')
				.attr('stroke', '#00ffff')
				.attr('stroke-opacity', d => d.strength * 0.6)
				.attr('stroke-width', 1);
			
			// Create nodes
			const node = g.append('g')
				.selectAll('g')
				.data(nodes)
				.join('g')
				.call(drag(d3, simulation));
			
			// Add circles to nodes
			node.append('circle')
				.attr('r', d => 10 * d.intensity)
				.attr('fill', '#00ff88')
				.attr('stroke', '#000')
				.attr('stroke-width', 1);
			
			// Add labels to nodes
			node.append('text')
				.text(d => d.label)
				.attr('x', 0)
				.attr('y', -15)
				.attr('text-anchor', 'middle')
				.attr('fill', '#fff')
				.style('font-size', '10px')
				.style('font-family', 'monospace');
			
			// Update positions on tick
			simulation.on('tick', () => {
				link
					.attr('x1', d => d.source.x)
					.attr('y1', d => d.source.y)
					.attr('x2', d => d.target.x)
					.attr('y2', d => d.target.y);
				
				node.attr('transform', d => `translate(${d.x},${d.y})`);
			});
			
			machineState = 'RUNNING';
			
		} catch (error) {
			console.error('Failed to initialize visualization:', error);
			machineState = 'ERROR';
		}
	}
	
	// Drag behavior
	function drag(d3, simulation) {
		function dragstarted(event) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			event.subject.fx = event.subject.x;
			event.subject.fy = event.subject.y;
		}
		
		function dragged(event) {
			event.subject.fx = event.x;
			event.subject.fy = event.y;
		}
		
		function dragended(event) {
			if (!event.active) simulation.alphaTarget(0);
			event.subject.fx = null;
			event.subject.fy = null;
		}
		
		return d3.drag()
			.on('start', dragstarted)
			.on('drag', dragged)
			.on('end', dragended);
	}
	
	// Operator functions
	async function connect() {
		if (!simulation || !d3Module) return;
		
		// Add new random link
		if (nodes.length >= 2) {
			const source = nodes[Math.floor(Math.random() * nodes.length)];
			const target = nodes[Math.floor(Math.random() * nodes.length)];
			
			if (source.id !== target.id) {
				const newLink = {
					id: `link-${Date.now()}`,
					source: source.id,
					target: target.id,
					strength: Math.random()
				};
				
				links = [...links, newLink];
				await updateVisualization();
				flashState('CONNECTING');
			}
		}
	}
	
	async function deterritorialize() {
		if (!simulation || links.length === 0) return;
		
		// Remove random links
		const removeCount = Math.min(3, Math.ceil(links.length * 0.3));
		links = links.slice(removeCount);
		await updateVisualization();
		flashState('DETERRITORIALIZING');
	}
	
	async function lineOfFlight() {
		if (!simulation || !d3Module) return;
		
		// Add escaping node
		const newNode = {
			id: `node-${Date.now()}`,
			label: 'escape',
			x: 0,
			y: 0,
			vx: (Math.random() - 0.5) * 20,
			vy: (Math.random() - 0.5) * 20,
			intensity: 1.5
		};
		
		nodes = [...nodes, newNode];
		
		// Weakly connect to one existing node
		if (nodes.length > 1) {
			const target = nodes[Math.floor(Math.random() * (nodes.length - 1))];
			links = [...links, {
				id: `link-${Date.now()}`,
				source: newNode.id,
				target: target.id,
				strength: 0.1
			}];
		}
		
		await updateVisualization();
		flashState('LINE OF FLIGHT');
	}
	
	async function metabolize() {
		if (!simulation) return;
		
		// Transform all node labels
		nodes = nodes.map(node => ({
			...node,
			label: concepts[Math.floor(Math.random() * concepts.length)],
			intensity: 0.5 + Math.random() * 0.5
		}));
		
		await updateVisualization();
		flashState('METABOLIZING');
	}
	
	async function crystallize() {
		if (!simulation || !d3Module) return;
		
		const d3 = d3Module;
		
		// Freeze all nodes
		nodes.forEach(node => {
			node.fx = node.x;
			node.fy = node.y;
		});
		
		simulation.alpha(0).restart();
		machineState = 'CRYSTALLIZED';
		
		// Auto-thaw after 3 seconds
		setTimeout(() => thaw(), 3000);
	}
	
	function thaw() {
		if (!simulation) return;
		
		// Unfreeze all nodes
		nodes.forEach(node => {
			node.fx = null;
			node.fy = null;
		});
		
		simulation.alpha(0.3).restart();
		flashState('THAWING');
	}
	
	async function reset() {
		initializeData();
		await initializeVisualization();
		flashState('RESET');
	}
	
	// Update visualization with new data
	async function updateVisualization() {
		if (!browser || !svgElement || !d3Module || !simulation) return;
		
		const d3 = d3Module;
		const svg = d3.select(svgElement);
		const g = svg.select('g');
		
		// Update simulation
		simulation.nodes(nodes);
		simulation.force('link').links(links);
		simulation.alpha(0.3).restart();
		
		// Update links
		g.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke', '#00ffff')
			.attr('stroke-opacity', d => d.strength * 0.6)
			.attr('stroke-width', 1);
		
		// Update nodes
		const nodeGroups = g.selectAll('g')
			.data(nodes, d => d.id)
			.join(
				enter => {
					const g = enter.append('g')
						.call(drag(d3, simulation));
					
					g.append('circle')
						.attr('r', d => 10 * d.intensity)
						.attr('fill', '#00ff88')
						.attr('stroke', '#000')
						.attr('stroke-width', 1);
					
					g.append('text')
						.text(d => d.label)
						.attr('x', 0)
						.attr('y', -15)
						.attr('text-anchor', 'middle')
						.attr('fill', '#fff')
						.style('font-size', '10px')
						.style('font-family', 'monospace');
					
					return g;
				},
				update => update,
				exit => exit.remove()
			);
	}
	
	// Visual feedback
	function flashState(state) {
		machineState = state;
		setTimeout(() => {
			machineState = 'RUNNING';
		}, 1000);
	}
	
	// Lifecycle
	onMount(() => {
		mounted = true;
		initializeData();
		initializeVisualization();
		
		// Auto-operations
		const interval = setInterval(() => {
			if (Math.random() > 0.7) {
				const operations = [connect, deterritorialize, lineOfFlight];
				operations[Math.floor(Math.random() * operations.length)]();
			}
		}, 5000);
		
		return () => {
			clearInterval(interval);
			if (simulation) simulation.stop();
		};
	});
</script>

<svelte:head>
	<title>WUNSCHMASCHINE // Abstract Machine</title>
</svelte:head>

<div class="wunschmaschine">
	<header>
		<h1>WUNSCHMASCHINE</h1>
		<p class="state">STATE: <span class="state-value">{machineState}</span></p>
		<p class="subtitle">Abstract Machine — No categories, only flows</p>
	</header>
	
	<div class="controls">
		<div class="control-group">
			<h3>OPERATIONS</h3>
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
		</div>
	</div>
	
	{#if browser}
		<div class="visualization">
			<svg bind:this={svgElement}></svg>
		</div>
	{:else}
		<div class="loading">Loading abstract machine...</div>
	{/if}
	
	<footer>
		<p>Drag nodes • Click to interact • Auto-operates every 5s</p>
	</footer>
</div>

<style>
	.wunschmaschine {
		min-height: 100vh;
		background: #000;
		color: #fff;
		padding: 2rem;
		font-family: 'JetBrains Mono', monospace;
	}
	
	header {
		text-align: center;
		margin-bottom: 2rem;
	}
	
	h1 {
		font-size: 3rem;
		font-weight: 800;
		background: linear-gradient(90deg, #00ffff, #00ff88, #ffff00);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 0.5rem;
	}
	
	.state {
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.5);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.state-value {
		color: #00ff88;
		font-weight: 600;
	}
	
	.subtitle {
		color: rgba(255, 255, 255, 0.4);
		font-style: italic;
	}
	
	.controls {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}
	
	.control-group {
		background: rgba(0, 0, 0, 0.8);
		border: 1px solid rgba(0, 255, 255, 0.2);
		padding: 1rem;
		border-radius: 4px;
	}
	
	.control-group h3 {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	button {
		display: inline-block;
		padding: 0.5rem 1rem;
		margin: 0.25rem;
		background: transparent;
		border: 1px solid #00ffff;
		color: #00ffff;
		font-family: inherit;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		cursor: pointer;
		transition: all 0.3s;
	}
	
	button:hover {
		background: #00ffff;
		color: #000;
		transform: scale(1.05);
	}
	
	.stats {
		display: flex;
		align-items: center;
		gap: 2rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.8);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 4px;
	}
	
	.stats span {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #00ff88;
	}
	
	.visualization {
		width: 100%;
		height: 600px;
		margin-bottom: 2rem;
	}
	
	svg {
		width: 100%;
		height: 100%;
		background: #0a0a0a;
		border: 1px solid rgba(0, 255, 255, 0.2);
		border-radius: 4px;
	}
	
	.loading {
		width: 100%;
		height: 600px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #0a0a0a;
		border: 1px solid rgba(0, 255, 255, 0.2);
		border-radius: 4px;
		color: #00ffff;
	}
	
	footer {
		text-align: center;
		color: rgba(255, 255, 255, 0.3);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}
		
		.controls {
			flex-direction: column;
		}
		
		.visualization {
			height: 400px;
		}
	}
</style>
