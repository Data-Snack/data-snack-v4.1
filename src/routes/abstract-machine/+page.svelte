<script>
	import { onMount, onDestroy } from 'svelte';
	
	// ============================================
	// DIE ABSTRAKTE MASCHINE IST KEIN OBJEKT
	// SONDERN EIN FELD VON OPERATIONEN
	// ============================================
	
	// -- INTENSITÄTEN statt Positionen --
	class Intensity {
		constructor() {
			this.value = Math.random();
			this.vector = { x: 0, y: 0 };
			this.speed = 0;
			this.color = 0;
		}
	}
	
	// -- DAS FELD (nicht der Raum) --
	let field = {
		width: 0,
		height: 0,
		intensities: new Map(),
		flows: [],
		time: 0
	};
	
	// -- OPERATIONEN (die Maschine selbst) --
	const abstractMachine = {
		// Verbinden ist ein PROZESS, kein Zustand
		connect: function(i1, i2, strength = Math.random()) {
			const flow = {
				from: i1,
				to: i2,
				strength,
				decay: 0.99,
				active: true
			};
			field.flows.push(flow);
			return flow;
		},
		
		// Deterritorialisierung als KRAFT
		deterritorialize: function(intensity = Math.random()) {
			field.flows.forEach(flow => {
				flow.strength *= (1 - intensity);
				if (flow.strength < 0.01) flow.active = false;
			});
			// Neue Intensitäten entstehen
			for (let i = 0; i < intensity * 5; i++) {
				const int = new Intensity();
				int.vector.x = (Math.random() - 0.5) * intensity * 10;
				int.vector.y = (Math.random() - 0.5) * intensity * 10;
				field.intensities.set(Symbol(), int);
			}
		},
		
		// Fluchtlinie als GESCHWINDIGKEIT
		lineOfFlight: function() {
			const escaper = new Intensity();
			escaper.speed = 10;
			escaper.vector.x = Math.random() - 0.5;
			escaper.vector.y = Math.random() - 0.5;
			escaper.value = 2; // Doppelte Intensität
			field.intensities.set(Symbol(), escaper);
			
			// Zieht andere mit
			field.intensities.forEach(int => {
				int.vector.x += escaper.vector.x * 0.1;
				int.vector.y += escaper.vector.y * 0.1;
			});
		},
		
		// Konsistenzebene modulieren
		modulate: function(frequency = 1, amplitude = 0.5) {
			field.intensities.forEach(int => {
				int.value = 0.5 + Math.sin(field.time * frequency) * amplitude;
				int.color = (int.color + frequency) % 360;
			});
		},
		
		// Stratifizierung (temporäre Ordnung)
		stratify: function(layers = 3) {
			let i = 0;
			field.intensities.forEach(int => {
				const layer = Math.floor(i++ / (field.intensities.size / layers));
				int.value = (layer + 1) / layers;
				int.speed *= 0.1; // Verlangsamung
			});
		},
		
		// Glättung (Body without Organs)
		smooth: function(factor = 0.5) {
			// Alle Differenzen reduzieren
			let avgValue = 0;
			field.intensities.forEach(int => avgValue += int.value);
			avgValue /= field.intensities.size;
			
			field.intensities.forEach(int => {
				int.value = int.value * (1 - factor) + avgValue * factor;
				int.speed *= (1 - factor);
			});
		}
	};
	
	// -- CANVAS RENDERING --
	let canvas;
	let ctx;
	let animationFrame;
	
	function initCanvas() {
		if (!canvas) return;
		ctx = canvas.getContext('2d');
		field.width = canvas.width = window.innerWidth;
		field.height = canvas.height = window.innerHeight - 200;
		
		// Initial Intensitäten
		for (let i = 0; i < 50; i++) {
			field.intensities.set(Symbol(), new Intensity());
		}
	}
	
	function render() {
		if (!ctx) return;
		
		// Fade statt clear (Spuren hinterlassen)
		ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
		ctx.fillRect(0, 0, field.width, field.height);
		
		field.time += 0.01;
		
		// Flows rendern (als Kraftfelder, nicht Linien)
		field.flows = field.flows.filter(flow => flow.active);
		field.flows.forEach(flow => {
			const gradient = ctx.createRadialGradient(
				flow.from.x || field.width/2, 
				flow.from.y || field.height/2, 
				0,
				flow.to.x || field.width/2, 
				flow.to.y || field.height/2, 
				100 * flow.strength
			);
			gradient.addColorStop(0, `hsla(${180 + flow.strength * 180}, 100%, 50%, ${flow.strength * 0.1})`);
			gradient.addColorStop(1, 'transparent');
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, field.width, field.height);
			
			flow.strength *= flow.decay;
		});
		
		// Intensitäten rendern und bewegen
		field.intensities.forEach((int, key) => {
			// Bewegung durch Vektoren
			int.vector.x += (Math.random() - 0.5) * 0.5;
			int.vector.y += (Math.random() - 0.5) * 0.5;
			int.vector.x *= 0.99; // Dämpfung
			int.vector.y *= 0.99;
			
			// Position ist FOLGE der Bewegung, nicht Zustand
			const x = (field.width/2 + int.vector.x * field.time * 10) % field.width;
			const y = (field.height/2 + int.vector.y * field.time * 10) % field.height;
			
			// Intensität als Größe und Farbe
			const radius = int.value * 20 * (1 + Math.sin(field.time * 2 + int.color) * 0.2);
			const hue = int.color || (int.value * 360);
			
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			
			// Glow effect
			const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
			glow.addColorStop(0, `hsla(${hue}, 100%, 70%, ${int.value})`);
			glow.addColorStop(0.5, `hsla(${hue}, 100%, 50%, ${int.value * 0.5})`);
			glow.addColorStop(1, 'transparent');
			ctx.fillStyle = glow;
			ctx.fill();
			
			// Speed trails
			if (int.speed > 0) {
				ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${int.speed / 10})`;
				ctx.lineWidth = int.speed;
				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.lineTo(x - int.vector.x * int.speed * 5, y - int.vector.y * int.speed * 5);
				ctx.stroke();
			}
			
			// Decay speed
			int.speed *= 0.95;
			
			// Remove if too weak
			if (int.value < 0.01) {
				field.intensities.delete(key);
			}
		});
		
		// Info overlay
		ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
		ctx.font = '10px monospace';
		ctx.fillText(`INTENSITIES: ${field.intensities.size}`, 10, 20);
		ctx.fillText(`FLOWS: ${field.flows.filter(f => f.active).length}`, 10, 35);
		ctx.fillText(`TIME: ${field.time.toFixed(2)}`, 10, 50);
		
		animationFrame = requestAnimationFrame(render);
	}
	
	// -- AUTO-OPERATIONS --
	let autoInterval;
	function startAutoOperations() {
		autoInterval = setInterval(() => {
			const operations = [
				() => abstractMachine.connect({x: Math.random() * field.width}, {x: Math.random() * field.width}),
				() => abstractMachine.deterritorialize(Math.random() * 0.5),
				() => abstractMachine.modulate(Math.random() * 3, Math.random()),
				() => abstractMachine.lineOfFlight()
			];
			
			if (Math.random() > 0.3) {
				operations[Math.floor(Math.random() * operations.length)]();
			}
		}, 2000);
	}
	
	// -- LIFECYCLE --
	onMount(() => {
		initCanvas();
		render();
		startAutoOperations();
		
		// Keyboard shortcuts
		const handleKey = (e) => {
			switch(e.key) {
				case 'c': abstractMachine.connect({}, {}); break;
				case 'd': abstractMachine.deterritorialize(); break;
				case 'l': abstractMachine.lineOfFlight(); break;
				case 'm': abstractMachine.modulate(); break;
				case 's': abstractMachine.stratify(); break;
				case 'g': abstractMachine.smooth(); break;
				case ' ': e.preventDefault(); abstractMachine.lineOfFlight(); break;
			}
		};
		window.addEventListener('keydown', handleKey);
		
		return () => {
			window.removeEventListener('keydown', handleKey);
		};
	});
	
	onDestroy(() => {
		if (animationFrame) cancelAnimationFrame(animationFrame);
		if (autoInterval) clearInterval(autoInterval);
	});
</script>

<svelte:head>
	<title>ABSTRACT_MACHINE // Operative Diagram</title>
</svelte:head>

<div class="machine-container">
	<header>
		<h1>ABSTRACT_MACHINE</h1>
		<p class="subtitle">Not a visualization but an operative diagram</p>
		<p class="theory">
			"The abstract machine is neither an infrastructure that would be determining in the last instance 
			nor a transcendent Idea that would be determining in the supreme instance. 
			Rather, it plays a piloting role." — ATP
		</p>
	</header>
	
	<div class="controls">
		<div class="operations">
			<button on:click={() => abstractMachine.connect({}, {})}>
				CONNECT <span class="key">[C]</span>
			</button>
			<button on:click={() => abstractMachine.deterritorialize()}>
				DETERRITORIALIZE <span class="key">[D]</span>
			</button>
			<button on:click={() => abstractMachine.lineOfFlight()}>
				LINE OF FLIGHT <span class="key">[L/SPACE]</span>
			</button>
			<button on:click={() => abstractMachine.modulate()}>
				MODULATE <span class="key">[M]</span>
			</button>
			<button on:click={() => abstractMachine.stratify()}>
				STRATIFY <span class="key">[S]</span>
			</button>
			<button on:click={() => abstractMachine.smooth()}>
				SMOOTH (BwO) <span class="key">[G]</span>
			</button>
		</div>
		
		<div class="info">
			The machine operates through intensities and speeds, not positions and structures.
			It auto-operates every 2 seconds. You are part of the assemblage.
		</div>
	</div>
	
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
		background: #000;
	}
	
	.machine-container {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		color: #fff;
		font-family: 'JetBrains Mono', monospace;
		background: #000;
	}
	
	header {
		padding: 1rem 2rem;
		background: rgba(0, 0, 0, 0.8);
		border-bottom: 1px solid rgba(0, 255, 255, 0.2);
		z-index: 10;
	}
	
	h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 800;
		background: linear-gradient(90deg, #00ffff, #ff00ff, #ffff00);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: 0.1em;
	}
	
	.subtitle {
		margin: 0.25rem 0;
		color: rgba(255, 255, 255, 0.5);
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.theory {
		margin: 0.5rem 0 0;
		color: rgba(255, 255, 255, 0.3);
		font-size: 0.75rem;
		font-style: italic;
		max-width: 600px;
	}
	
	.controls {
		padding: 1rem 2rem;
		background: rgba(0, 0, 0, 0.9);
		border-bottom: 1px solid rgba(0, 255, 255, 0.1);
		z-index: 10;
	}
	
	.operations {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}
	
	button {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid rgba(0, 255, 255, 0.5);
		color: #00ffff;
		font-family: inherit;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;
		overflow: hidden;
	}
	
	button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent);
		transition: left 0.5s;
	}
	
	button:hover::before {
		left: 100%;
	}
	
	button:hover {
		border-color: #00ffff;
		text-shadow: 0 0 10px #00ffff;
		box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
	}
	
	button:active {
		transform: scale(0.98);
	}
	
	.key {
		opacity: 0.5;
		font-size: 0.625rem;
		margin-left: 0.25rem;
	}
	
	.info {
		color: rgba(255, 255, 255, 0.3);
		font-size: 0.75rem;
		line-height: 1.4;
	}
	
	canvas {
		flex: 1;
		width: 100%;
		display: block;
	}
	
	@media (max-width: 768px) {
		h1 {
			font-size: 1.5rem;
		}
		
		.operations {
			gap: 0.25rem;
		}
		
		button {
			padding: 0.4rem 0.8rem;
			font-size: 0.625rem;
		}
		
		.theory {
			display: none;
		}
	}
</style>
