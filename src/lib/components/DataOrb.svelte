<script>
	import { onMount } from 'svelte';
	
	let canvas;
	let animationId;
	
	onMount(() => {
		if (!canvas) return;
		
		const ctx = canvas.getContext('2d');
		const width = canvas.width = 200;
		const height = canvas.height = 200;
		const centerX = width / 2;
		const centerY = height / 2;
		
		let time = 0;
		
		function draw() {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
			ctx.fillRect(0, 0, width, height);
			
			// Outer ring
			ctx.strokeStyle = '#00ffff';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(centerX, centerY, 80 + Math.sin(time * 0.02) * 10, 0, Math.PI * 2);
			ctx.stroke();
			
			// Inner rings
			for (let i = 0; i < 3; i++) {
				ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 - i * 0.1})`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.arc(
					centerX, 
					centerY, 
					40 + i * 15 + Math.sin(time * 0.03 + i) * 5, 
					0, 
					Math.PI * 2
				);
				ctx.stroke();
			}
			
			// Data particles
			for (let i = 0; i < 5; i++) {
				const angle = (time * 0.01) + (i * Math.PI * 2 / 5);
				const radius = 60 + Math.sin(time * 0.05 + i) * 20;
				const x = centerX + Math.cos(angle) * radius;
				const y = centerY + Math.sin(angle) * radius;
				
				ctx.fillStyle = '#00ff88';
				ctx.beginPath();
				ctx.arc(x, y, 3, 0, Math.PI * 2);
				ctx.fill();
				
				// Connections
				ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(centerX, centerY);
				ctx.lineTo(x, y);
				ctx.stroke();
			}
			
			// Center core
			const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
			gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
			gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.5)');
			gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
			
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(centerX, centerY, 20 + Math.sin(time * 0.04) * 5, 0, Math.PI * 2);
			ctx.fill();
			
			time++;
			animationId = requestAnimationFrame(draw);
		}
		
		draw();
		
		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});
</script>

<div class="orb-container">
	<canvas bind:this={canvas} width="200" height="200"></canvas>
	<div class="orb-glow"></div>
</div>

<style>
	.orb-container {
		position: relative;
		width: 200px;
		height: 200px;
		margin: 0 auto;
	}
	
	canvas {
		width: 100%;
		height: 100%;
	}
	
	.orb-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 150px;
		height: 150px;
		transform: translate(-50%, -50%);
		background: radial-gradient(circle, rgba(0, 255, 255, 0.2), transparent);
		filter: blur(20px);
		animation: pulse 3s ease-in-out infinite;
		pointer-events: none;
	}
</style>
