<script>
	import { onMount, onDestroy } from 'svelte';
	import { perzeptEngine, totalIntensity, activeSnacks, dominantPerzept } from '$lib/stores/perzeptEngine.js';
	
	let canvas;
	let ctx;
	let animationFrame;
	let perzepts = [];
	let connections = [];
	
	// Visual parameters
	const config = {
		particleSize: 3,
		connectionDistance: 150,
		forceMultiplier: 0.02,
		dampening: 0.98,
		glowIntensity: 0.8
	};
	
	class PerzeptParticle {
		constructor(perzept, canvas) {
			this.perzept = perzept;
			this.x = Math.random() * canvas.width;
			this.y = Math.random() * canvas.height;
			this.vx = (Math.random() - 0.5) * 2;
			this.vy = (Math.random() - 0.5) * 2;
			this.radius = config.particleSize + perzept.intensity * 20;
			this.hue = (perzept.affect * 180 + 180) % 360;
			this.trail = [];
			this.maxTrailLength = 20;
		}
		
		update(canvas) {
			// Apply perzept vector as force
			this.vx += this.perzept.vector.x * config.forceMultiplier;
			this.vy += this.perzept.vector.y * config.forceMultiplier;
			
			// Apply dampening
			this.vx *= config.dampening;
			this.vy *= config.dampening;
			
			// Update position
			this.x += this.vx;
			this.y += this.vy;
			
			// Boundary collision with bounce
			if (this.x < this.radius || this.x > canvas.width - this.radius) {
				this.vx *= -0.8;
				this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
			}
			if (this.y < this.radius || this.y > canvas.height - this.radius) {
				this.vy *= -0.8;
				this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
			}
			
			// Update trail
			this.trail.push({ x: this.x, y: this.y });
			if (this.trail.length > this.maxTrailLength) {
				this.trail.shift();
			}
			
			// Update visual properties from perzept
			this.radius = config.particleSize + this.perzept.intensity * 20;
			this.hue = (this.perzept.affect * 180 + 180) % 360;
		}
		
		draw(ctx) {
			// Draw trail
			if (this.trail.length > 1) {
				ctx.strokeStyle = `hsla(${this.hue}, 100%, 50%, 0.1)`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(this.trail[0].x, this.trail[0].y);
				for (let i = 1; i < this.trail.length; i++) {
					const alpha = (i / this.trail.length) * 0.3;
					ctx.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${alpha})`;
					ctx.lineTo(this.trail[i].x, this.trail[i].y);
				}
				ctx.stroke();
			}
			
			// Draw glow
			const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
			gradient.addColorStop(0, `hsla(${this.hue}, 100%, 60%, ${this.perzept.intensity * config.glowIntensity})`);
			gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 50%, ${this.perzept.intensity * 0.3})`);
			gradient.addColorStop(1, 'transparent');
			
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
			ctx.fill();
			
			// Draw core
			ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			ctx.fill();
			
			// Draw label
			if (this.perzept.intensity > 0.3) {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
				ctx.font = '10px JetBrains Mono';
				ctx.textAlign = 'center';
				ctx.fillText(`${this.perzept.source}`, this.x, this.y - this.radius - 5);
				ctx.fillText(`${this.perzept.intensity.toFixed(2)}`, this.x, this.y);
			}
		}
	}
	
	function initCanvas() {
		if (!canvas) return;
		
		ctx = canvas.getContext('2d');
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		
		// Handle resize
		window.addEventListener('resize', () => {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		});
	}
	
	function updatePerzepts() {
		const currentPerzepts = $perzeptEngine;
		
		// Update or create particles for each perzept
		perzepts = Array.from(currentPerzepts.values()).map(p => {
			let particle = perzepts.find(part => part.perzept.id === p.id);
			if (!particle) {
				particle = new PerzeptParticle(p, canvas);
			} else {
				particle.perzept = p;
			}
			return particle;
		});
		
		// Find connections between perzepts from same snack
		connections = [];
		for (let i = 0; i < perzepts.length; i++) {
			for (let j = i + 1; j < perzepts.length; j++) {
				const p1 = perzepts[i];
				const p2 = perzepts[j];
				const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
				
				if (distance < config.connectionDistance) {
					// Stronger connection if from same snack
					const strength = p1.perzept.snack === p2.perzept.snack ? 1 : 0.3;
					connections.push({ p1, p2, distance, strength });
				}
			}
		}
	}
	
	function animate() {
		if (!ctx || !canvas) return;
		
		// Clear with fade effect
		ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		updatePerzepts();
		
		// Draw connections
		connections.forEach(conn => {
			const alpha = (1 - conn.distance / config.connectionDistance) * conn.strength * 0.3;
			ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
			ctx.lineWidth = conn.strength;
			ctx.beginPath();
			ctx.moveTo(conn.p1.x, conn.p1.y);
			ctx.lineTo(conn.p2.x, conn.p2.y);
			ctx.stroke();
		});
		
		// Update and draw particles
		perzepts.forEach(particle => {
			particle.update(canvas);
			particle.draw(ctx);
		});
		
		// Draw stats
		drawStats();
		
		animationFrame = requestAnimationFrame(animate);
	}
	
	function drawStats() {
		const stats = [
			`TOTAL INTENSITY: ${$totalIntensity.toFixed(2)}`,
			`ACTIVE SNACKS: ${$activeSnacks.join(', ') || 'NONE'}`,
			`DOMINANT: ${$dominantPerzept?.source || 'NONE'}`
		];
		
		ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
		ctx.fillRect(10, 10, 250, 80);
		
		ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
		ctx.strokeRect(10, 10, 250, 80);
		
		ctx.fillStyle = '#00ffff';
		ctx.font = '12px JetBrains Mono';
		ctx.textAlign = 'left';
		
		stats.forEach((stat, i) => {
			ctx.fillText(stat, 20, 30 + i * 20);
		});
	}
	
	onMount(() => {
		initCanvas();
		animate();
	});
	
	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

<div class="perzept-visualizer">
	<canvas bind:this={canvas}></canvas>
	<div class="visualizer-overlay">
		<h3 class="visualizer-title">PERZEPT ENGINE</h3>
		<p class="visualizer-subtitle">Cross-Snack Data Flow Visualization</p>
	</div>
</div>

<style>
	.perzept-visualizer {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 400px;
		background: rgba(0, 0, 0, 0.9);
		border: 1px solid var(--cyan);
		overflow: hidden;
	}
	
	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}
	
	.visualizer-overlay {
		position: absolute;
		bottom: 20px;
		right: 20px;
		text-align: right;
		pointer-events: none;
	}
	
	.visualizer-title {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--cyan);
		margin: 0;
		opacity: 0.8;
	}
	
	.visualizer-subtitle {
		font-size: 0.7rem;
		color: var(--text-secondary);
		margin: 0;
		opacity: 0.6;
	}
</style>
