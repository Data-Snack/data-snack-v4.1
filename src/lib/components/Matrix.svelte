<script>
	import { onMount, onDestroy } from 'svelte';
	
	let canvas;
	let ctx;
	let columns = [];
	let fontSize = 14;
	let animationId;
	
	onMount(() => {
		if (!canvas) return;
		
		ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		const columnCount = Math.floor(canvas.width / fontSize);
		
		for (let i = 0; i < columnCount; i++) {
			columns[i] = 1;
		}
		
		draw();
		
		window.addEventListener('resize', handleResize);
	});
	
	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
		window.removeEventListener('resize', handleResize);
	});
	
	function handleResize() {
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	
	function draw() {
		if (!ctx || !canvas) return;
		
		ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		ctx.fillStyle = '#00ff88';
		ctx.font = fontSize + 'px JetBrains Mono';
		
		for (let i = 0; i < columns.length; i++) {
			const text = Math.random() > 0.5 ? '1' : '0';
			ctx.fillText(text, i * fontSize, columns[i] * fontSize);
			
			if (columns[i] * fontSize > canvas.height && Math.random() > 0.975) {
				columns[i] = 0;
			}
			
			columns[i]++;
		}
		
		animationId = requestAnimationFrame(draw);
	}
</script>

<canvas bind:this={canvas} class="matrix-rain"></canvas>

<style>
	.matrix-rain {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		opacity: 0.05;
		pointer-events: none;
	}
</style>
