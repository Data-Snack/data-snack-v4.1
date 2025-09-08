<script>
	import { onMount, onDestroy } from 'svelte';
	import * as d3 from 'd3';
	import { fade } from 'svelte/transition';
	
	export let currentPlateau = null;
	export let visitedSnacks = [];
	export let communityPaths = [];
	export let isExpanded = false;
	
	let container;
	let svg;
	let simulation;
	let width = 800;
	let height = 600;
	
	// Data structure for plateaus and snacks
	const plateaus = [
		{
			id: 'APPARATE',
			name: 'APPARATE',
			color: '#00ffff',
			x: width * 0.2,
			y: height * 0.3,
			snacks: [
				{ id: 'cookie-roulette', name: 'Cookie Roulette', status: 'active', visitors: 0 },
				{ id: 'privacy-theater', name: 'Privacy Theater', status: 'planned' }
			]
		},
		{
			id: 'KÖRPER',
			name: 'KÖRPER',
			color: '#ff00ff',
			x: width * 0.8,
			y: height * 0.3,
			snacks: [
				{ id: 'scroll-yoga', name: 'Scroll Yoga', status: 'active', visitors: 0 },
				{ id: 'data-dna', name: 'Data DNA', status: 'planned' }
			]
		},
		{
			id: 'FEHLER',
			name: 'FEHLER',
			color: '#ffff00',
			x: width * 0.7,
			y: height * 0.7,
			snacks: [
				{ id: 'error-oracle', name: 'Error Oracle', status: 'planned' },
				{ id: 'glitch-gallery', name: 'Glitch Gallery', status: 'planned' }
			]
		},
		{
			id: 'ZEIT',
			name: 'ZEIT',
			color: '#00ff88',
			x: width * 0.5,
			y: height * 0.9,
			snacks: [
				{ id: 'doom-timer', name: 'Doomscrolling Timer', status: 'planned' },
				{ id: 'infinite-recursion', name: 'Infinite Recursion', status: 'planned' }
			]
		},
		{
			id: 'GEMEINSCHAFT',
			name: 'GEMEINSCHAFT',
			color: '#ff0040',
			x: width * 0.3,
			y: height * 0.7,
			snacks: [
				{ id: 'echo-chamber', name: 'Echo Chamber', status: 'planned' },
				{ id: 'consensus-machine', name: 'Consensus Machine', status: 'planned' }
			]
		},
		{
			id: 'META',
			name: 'PRIMORDIAL',
			color: '#ffffff',
			x: width * 0.5,
			y: height * 0.5,
			snacks: [
				{ id: 'primordial-soup', name: 'Primordial Soup', status: 'active', visitors: 0 }
			]
		}
	];
	
	// Connections between plateaus (rhizome structure)
	const connections = [
		{ source: 'META', target: 'APPARATE', strength: 1 },
		{ source: 'META', target: 'KÖRPER', strength: 1 },
		{ source: 'META', target: 'FEHLER', strength: 1 },
		{ source: 'META', target: 'ZEIT', strength: 1 },
		{ source: 'META', target: 'GEMEINSCHAFT', strength: 1 },
		{ source: 'APPARATE', target: 'KÖRPER', strength: 0.5 },
		{ source: 'KÖRPER', target: 'FEHLER', strength: 0.5 },
		{ source: 'FEHLER', target: 'ZEIT', strength: 0.5 },
		{ source: 'ZEIT', target: 'GEMEINSCHAFT', strength: 0.5 },
		{ source: 'GEMEINSCHAFT', target: 'APPARATE', strength: 0.5 }
	];
	
	// User journey tracking
	let userPath = [];
	let particles = [];
	let heatMap = new Map();
	
	// Animation variables
	let animationFrame;
	let pulsePhase = 0;
	let flowPhase = 0;
	
	// Initialize the cartography
	function initCartography() {
		if (!container) return;
		
		// Clear existing
		d3.select(container).selectAll('*').remove();
		
		// Create SVG
		svg = d3.select(container)
			.append('svg')
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.style('width', '100%')
			.style('height', '100%');
		
		// Add filters and gradients
		const defs = svg.append('defs');
		
		// Glow filter
		const filter = defs.append('filter')
			.attr('id', 'glow');
		filter.append('feGaussianBlur')
			.attr('stdDeviation', '4')
			.attr('result', 'coloredBlur');
		const feMerge = filter.append('feMerge');
		feMerge.append('feMergeNode')
			.attr('in', 'coloredBlur');
		feMerge.append('feMergeNode')
			.attr('in', 'SourceGraphic');
		
		// Create gradients for each connection
		connections.forEach((conn, i) => {
			const gradient = defs.append('linearGradient')
				.attr('id', `gradient-${i}`)
				.attr('gradientUnits', 'userSpaceOnUse');
			
			const source = plateaus.find(p => p.id === conn.source);
			const target = plateaus.find(p => p.id === conn.target);
			
			if (source && target) {
				gradient.attr('x1', source.x)
					.attr('y1', source.y)
					.attr('x2', target.x)
					.attr('y2', target.y);
				
				gradient.append('stop')
					.attr('offset', '0%')
					.attr('stop-color', source.color)
					.attr('stop-opacity', 0.5);
				gradient.append('stop')
					.attr('offset', '50%')
					.attr('stop-color', '#ffffff')
					.attr('stop-opacity', 0.2);
				gradient.append('stop')
					.attr('offset', '100%')
					.attr('stop-color', target.color)
					.attr('stop-opacity', 0.5);
			}
		});
		
		// Background grid
		const gridGroup = svg.append('g')
			.attr('class', 'grid-layer')
			.style('opacity', 0.1);
		
		// Vertical lines
		for (let x = 0; x <= width; x += 50) {
			gridGroup.append('line')
				.attr('x1', x)
				.attr('y1', 0)
				.attr('x2', x)
				.attr('y2', height)
				.attr('stroke', '#00ffff')
				.attr('stroke-width', 0.5);
		}
		
		// Horizontal lines
		for (let y = 0; y <= height; y += 50) {
			gridGroup.append('line')
				.attr('x1', 0)
				.attr('y1', y)
				.attr('x2', width)
				.attr('y2', y)
				.attr('stroke', '#00ffff')
				.attr('stroke-width', 0.5);
		}
		
		// Connection layer
		const connectionGroup = svg.append('g')
			.attr('class', 'connections');
		
		connections.forEach((conn, i) => {
			const source = plateaus.find(p => p.id === conn.source);
			const target = plateaus.find(p => p.id === conn.target);
			
			if (source && target) {
				// Main connection line
				connectionGroup.append('line')
					.attr('class', 'connection')
					.attr('x1', source.x)
					.attr('y1', source.y)
					.attr('x2', target.x)
					.attr('y2', target.y)
					.attr('stroke', `url(#gradient-${i})`)
					.attr('stroke-width', 2 * conn.strength)
					.attr('opacity', 0.3 + conn.strength * 0.3)
					.style('stroke-dasharray', '5,5')
					.style('animation', `flow ${10 / conn.strength}s linear infinite`);
				
				// Data flow particles
				if (conn.strength > 0.7) {
					connectionGroup.append('circle')
						.attr('class', 'flow-particle')
						.attr('r', 2)
						.attr('fill', '#ffffff')
						.attr('opacity', 0.8)
						.append('animateMotion')
						.attr('dur', `${5 / conn.strength}s`)
						.attr('repeatCount', 'indefinite')
						.append('mpath')
						.attr('href', `#path-${i}`);
				}
			}
		});
		
		// Heat map layer
		const heatMapGroup = svg.append('g')
			.attr('class', 'heat-map')
			.style('opacity', 0.3);
		
		// Community paths layer
		const pathGroup = svg.append('g')
			.attr('class', 'community-paths');
		
		// Draw community paths
		if (communityPaths && communityPaths.length > 0) {
			communityPaths.forEach(path => {
				const pathData = path.nodes.map((nodeId, i) => {
					const node = plateaus.find(p => p.id === nodeId);
					return node ? [node.x, node.y] : null;
				}).filter(p => p !== null);
				
				if (pathData.length > 1) {
					const line = d3.line()
						.x(d => d[0])
						.y(d => d[1])
						.curve(d3.curveBasis);
					
					pathGroup.append('path')
						.attr('d', line(pathData))
						.attr('fill', 'none')
						.attr('stroke', '#00ff88')
						.attr('stroke-width', path.frequency || 1)
						.attr('opacity', 0.2)
						.style('stroke-dasharray', '2,2');
				}
			});
		}
		
		// Plateau nodes
		const nodeGroup = svg.append('g')
			.attr('class', 'nodes');
		
		const nodes = nodeGroup.selectAll('.plateau-node')
			.data(plateaus)
			.enter()
			.append('g')
			.attr('class', 'plateau-node')
			.attr('transform', d => `translate(${d.x}, ${d.y})`)
			.style('cursor', 'pointer')
			.on('click', handlePlateauClick)
			.on('mouseenter', handlePlateauHover)
			.on('mouseleave', handlePlateauLeave);
		
		// Outer ring (pulsing)
		nodes.append('circle')
			.attr('class', 'outer-ring')
			.attr('r', 30)
			.attr('fill', 'none')
			.attr('stroke', d => d.color)
			.attr('stroke-width', 1)
			.attr('opacity', 0.3)
			.attr('filter', 'url(#glow)');
		
		// Middle ring
		nodes.append('circle')
			.attr('class', 'middle-ring')
			.attr('r', 20)
			.attr('fill', 'none')
			.attr('stroke', d => d.color)
			.attr('stroke-width', 2)
			.attr('opacity', 0.6);
		
		// Inner core
		nodes.append('circle')
			.attr('class', 'inner-core')
			.attr('r', 10)
			.attr('fill', d => d.color)
			.attr('opacity', 0.8);
		
		// Labels
		nodes.append('text')
			.attr('class', 'plateau-label')
			.attr('y', 45)
			.attr('text-anchor', 'middle')
			.attr('fill', d => d.color)
			.attr('font-size', '10px')
			.attr('font-family', 'JetBrains Mono')
			.attr('letter-spacing', '0.1em')
			.text(d => d.name);
		
		// Snack indicators
		nodes.each(function(plateau) {
			const node = d3.select(this);
			const activeSnacks = plateau.snacks.filter(s => s.status === 'active');
			
			activeSnacks.forEach((snack, i) => {
				const angle = (i * 2 * Math.PI) / activeSnacks.length;
				const radius = 35;
				
				node.append('circle')
					.attr('class', 'snack-indicator')
					.attr('cx', Math.cos(angle) * radius)
					.attr('cy', Math.sin(angle) * radius)
					.attr('r', 4)
					.attr('fill', plateau.color)
					.attr('opacity', 0.9)
					.append('animate')
					.attr('attributeName', 'r')
					.attr('values', '4;6;4')
					.attr('dur', '2s')
					.attr('repeatCount', 'indefinite');
			});
		});
		
		// User path visualization
		if (userPath.length > 0) {
			const userPathGroup = svg.append('g')
				.attr('class', 'user-path');
			
			const pathData = userPath.map(nodeId => {
				const node = plateaus.find(p => p.id === nodeId);
				return node ? [node.x, node.y] : null;
			}).filter(p => p !== null);
			
			if (pathData.length > 1) {
				const line = d3.line()
					.x(d => d[0])
					.y(d => d[1])
					.curve(d3.curveBasis);
				
				userPathGroup.append('path')
					.attr('d', line(pathData))
					.attr('fill', 'none')
					.attr('stroke', '#00ff88')
					.attr('stroke-width', 3)
					.attr('opacity', 0.8)
					.style('stroke-dasharray', '5,5')
					.style('animation', 'dash 20s linear infinite');
			}
			
			// Current position indicator
			const currentNode = plateaus.find(p => p.id === userPath[userPath.length - 1]);
			if (currentNode) {
				userPathGroup.append('circle')
					.attr('cx', currentNode.x)
					.attr('cy', currentNode.y)
					.attr('r', 8)
					.attr('fill', '#00ff88')
					.attr('opacity', 0.8)
					.append('animate')
					.attr('attributeName', 'r')
					.attr('values', '8;15;8')
					.attr('dur', '1.5s')
					.attr('repeatCount', 'indefinite');
			}
		}
		
		// Start animation loop
		animate();
	}
	
	// Animation loop
	function animate() {
		animationFrame = requestAnimationFrame(animate);
		
		pulsePhase += 0.02;
		flowPhase += 0.01;
		
		// Animate outer rings
		svg.selectAll('.outer-ring')
			.attr('r', 30 + Math.sin(pulsePhase) * 5)
			.attr('opacity', 0.3 + Math.sin(pulsePhase) * 0.1);
		
		// Animate connection opacity
		svg.selectAll('.connection')
			.attr('opacity', function() {
				const baseOpacity = parseFloat(d3.select(this).attr('opacity'));
				return baseOpacity + Math.sin(flowPhase) * 0.1;
			});
		
		// Update particles
		updateParticles();
	}
	
	// Update particle system
	function updateParticles() {
		// Add new particles occasionally
		if (Math.random() < 0.02) {
			const connection = connections[Math.floor(Math.random() * connections.length)];
			const source = plateaus.find(p => p.id === connection.source);
			const target = plateaus.find(p => p.id === connection.target);
			
			if (source && target) {
				particles.push({
					x: source.x,
					y: source.y,
					targetX: target.x,
					targetY: target.y,
					progress: 0,
					speed: 0.01 + Math.random() * 0.02,
					color: source.color,
					size: 2 + Math.random() * 2
				});
			}
		}
		
		// Update existing particles
		particles = particles.filter(particle => {
			particle.progress += particle.speed;
			
			if (particle.progress >= 1) {
				return false; // Remove completed particles
			}
			
			// Interpolate position
			particle.currentX = particle.x + (particle.targetX - particle.x) * particle.progress;
			particle.currentY = particle.y + (particle.targetY - particle.y) * particle.progress;
			
			return true;
		});
		
		// Render particles
		const particleGroup = svg.select('.particles');
		if (particleGroup.empty()) {
			svg.append('g').attr('class', 'particles');
		}
		
		const particleSelection = svg.select('.particles')
			.selectAll('.particle')
			.data(particles);
		
		particleSelection.enter()
			.append('circle')
			.attr('class', 'particle')
			.attr('r', d => d.size)
			.attr('fill', d => d.color)
			.attr('opacity', 0.6);
		
		particleSelection
			.attr('cx', d => d.currentX)
			.attr('cy', d => d.currentY)
			.attr('opacity', d => 0.6 * (1 - d.progress));
		
		particleSelection.exit().remove();
	}
	
	// Handle plateau click
	function handlePlateauClick(event, plateau) {
		// Add to user path
		if (!userPath.includes(plateau.id)) {
			userPath = [...userPath, plateau.id];
		}
		
		// Update heat map
		const count = heatMap.get(plateau.id) || 0;
		heatMap.set(plateau.id, count + 1);
		
		// Navigate to first active snack
		const activeSnack = plateau.snacks.find(s => s.status === 'active');
		if (activeSnack) {
			window.location.href = `/kitchen/${activeSnack.id}`;
		}
		
		// Re-render
		initCartography();
	}
	
	// Handle plateau hover
	function handlePlateauHover(event, plateau) {
		// Highlight connections
		svg.selectAll('.connection')
			.attr('opacity', function() {
				const line = d3.select(this);
				const x1 = parseFloat(line.attr('x1'));
				const y1 = parseFloat(line.attr('y1'));
				const x2 = parseFloat(line.attr('x2'));
				const y2 = parseFloat(line.attr('y2'));
				
				if ((Math.abs(x1 - plateau.x) < 1 && Math.abs(y1 - plateau.y) < 1) ||
					(Math.abs(x2 - plateau.x) < 1 && Math.abs(y2 - plateau.y) < 1)) {
					return 0.8;
				}
				return 0.2;
			});
		
		// Show snack details
		const tooltip = d3.select('body')
			.append('div')
			.attr('class', 'cartography-tooltip')
			.style('position', 'absolute')
			.style('background', 'rgba(0, 0, 0, 0.9)')
			.style('border', `1px solid ${plateau.color}`)
			.style('padding', '10px')
			.style('color', '#ffffff')
			.style('font-size', '12px')
			.style('pointer-events', 'none')
			.style('opacity', 0);
		
		tooltip.html(`
			<strong style="color: ${plateau.color}">${plateau.name}</strong><br>
			${plateau.snacks.map(s => `
				<span style="color: ${s.status === 'active' ? '#00ff88' : '#666666'}">
					${s.status === 'active' ? '● ' : '○ '}${s.name}
				</span>
			`).join('<br>')}
		`)
		.style('left', (event.pageX + 10) + 'px')
		.style('top', (event.pageY - 10) + 'px')
		.transition()
		.duration(200)
		.style('opacity', 1);
	}
	
	// Handle plateau leave
	function handlePlateauLeave() {
		// Reset connection opacity
		svg.selectAll('.connection')
			.attr('opacity', 0.4);
		
		// Remove tooltip
		d3.selectAll('.cartography-tooltip').remove();
	}
	
	// Add new visitor to path
	export function addVisitor(plateauId, snackId) {
		const plateau = plateaus.find(p => p.id === plateauId);
		if (plateau) {
			const snack = plateau.snacks.find(s => s.id === snackId);
			if (snack) {
				snack.visitors = (snack.visitors || 0) + 1;
				initCartography();
			}
		}
	}
	
	// Update user journey
	export function updateJourney(path) {
		userPath = path;
		initCartography();
	}
	
	// Toggle expanded view
	export function toggleExpanded() {
		isExpanded = !isExpanded;
		if (isExpanded) {
			width = window.innerWidth * 0.9;
			height = window.innerHeight * 0.9;
		} else {
			width = 800;
			height = 600;
		}
		initCartography();
	}
	
	onMount(() => {
		// Get viewport dimensions
		if (container) {
			const rect = container.getBoundingClientRect();
			width = rect.width || 800;
			height = rect.height || 600;
		}
		
		// Initialize
		initCartography();
		
		// Load saved journey from localStorage
		const savedJourney = localStorage.getItem('userJourney');
		if (savedJourney) {
			userPath = JSON.parse(savedJourney);
			initCartography();
		}
		
		// Listen for resize
		window.addEventListener('resize', handleResize);
	});
	
	function handleResize() {
		if (container) {
			const rect = container.getBoundingClientRect();
			width = rect.width || 800;
			height = rect.height || 600;
			initCartography();
		}
	}
	
	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		window.removeEventListener('resize', handleResize);
		
		// Save journey
		if (userPath.length > 0) {
			localStorage.setItem('userJourney', JSON.stringify(userPath));
		}
	});
</script>

<div class="cartography-container" class:expanded={isExpanded} bind:this={container} transition:fade>
	<!-- SVG will be added here by D3 -->
</div>

<style>
	.cartography-container {
		width: 100%;
		height: 100%;
		min-height: 400px;
		background: rgba(0, 0, 0, 0.8);
		border: 1px solid rgba(0, 255, 255, 0.3);
		border-radius: 4px;
		position: relative;
		overflow: hidden;
	}
	
	.cartography-container.expanded {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 90vw;
		height: 90vh;
		z-index: 1000;
		background: rgba(0, 0, 0, 0.95);
		box-shadow: 0 0 100px rgba(0, 255, 255, 0.5);
	}
	
	:global(.cartography-container svg) {
		width: 100%;
		height: 100%;
	}
	
	:global(.plateau-node) {
		transition: transform 0.3s;
	}
	
	:global(.plateau-node:hover) {
		transform: scale(1.2);
	}
	
	:global(.connection) {
		pointer-events: none;
	}
	
	@keyframes flow {
		0% {
			stroke-dashoffset: 0;
		}
		100% {
			stroke-dashoffset: -10;
		}
	}
	
	@keyframes dash {
		0% {
			stroke-dashoffset: 0;
		}
		100% {
			stroke-dashoffset: -100;
		}
	}
	
	:global(.cartography-tooltip) {
		font-family: 'JetBrains Mono', monospace;
		border-radius: 4px;
		box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
		z-index: 10000;
	}
</style>
