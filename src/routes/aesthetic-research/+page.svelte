<script>
	import { onMount, onDestroy } from 'svelte';
	
	// ================================================
	// ABSTRAKTE MASCHINE MIT ECHTZEITDATEN
	// Kunst ↔ Philosophie ↔ Wissenschaft
	// ================================================
	
	// -- DATENQUELLEN (Real-time) --
	const dataSources = {
		// Browser/User Daten
		mouse: { x: 0, y: 0, velocity: 0 },
		scroll: { position: 0, velocity: 0 },
		time: { local: new Date(), delta: 0 },
		performance: { memory: 0, fps: 0 },
		
		// Netzwerk Daten
		connection: { type: '', downlink: 0, rtt: 0 },
		
		// Device Daten
		battery: { level: 1, charging: false },
		device: { touch: false, orientation: 0 },
		
		// External APIs (später)
		weather: null,
		crypto: null,
		news: null
	};
	
	// -- PERZEPTE (Empfindungsblöcke aus Daten) --
	class DataPerzept {
		constructor(source, type) {
			this.source = source;
			this.type = type;
			this.intensity = 0;
			this.affect = 0;
			this.vector = { x: 0, y: 0 };
			this.color = 0;
			this.timestamp = Date.now();
			this.trace = [];
		}
		
		update(value) {
			// Daten in Intensität übersetzen
			const delta = value - (this.lastValue || value);
			this.intensity = Math.abs(delta);
			this.affect += delta * 0.1;
			this.lastValue = value;
			
			// Trace für History
			this.trace.push({ value, time: Date.now() });
			if (this.trace.length > 100) this.trace.shift();
			
			// Vector aus Veränderung
			this.vector.x += delta * Math.cos(this.affect);
			this.vector.y += delta * Math.sin(this.affect);
			this.vector.x *= 0.95; // Dämpfung
			this.vector.y *= 0.95;
		}
	}
	
	// -- BEGRIFFE (Philosophische Operationen) --
	const concepts = {
		// Differenz & Wiederholung
		difference: function(perzept1, perzept2) {
			return Math.abs(perzept1.intensity - perzept2.intensity);
		},
		
		repetition: function(perzept) {
			// Muster in der Trace finden
			const pattern = perzept.trace.slice(-10);
			const similarity = pattern.reduce((acc, p, i) => {
				if (i === 0) return 0;
				return acc + Math.abs(p.value - pattern[i-1].value);
			}, 0);
			return 1 / (1 + similarity);
		},
		
		// Rhizom
		rhizome: function(perzepts) {
			// Jeder mit jedem verbindbar
			const connections = [];
			perzepts.forEach((p1, k1) => {
				perzepts.forEach((p2, k2) => {
					if (k1 !== k2) {
						const affinity = 1 / (1 + concepts.difference(p1, p2));
						if (affinity > 0.3) {
							connections.push({ from: k1, to: k2, strength: affinity });
						}
					}
				});
			});
			return connections;
		},
		
		// Werden (Becoming)
		becoming: function(perzept, target) {
			perzept.intensity = perzept.intensity * 0.9 + target * 0.1;
			perzept.affect = perzept.affect * 0.9 + target * 0.1;
		},
		
		// Falte (Fold)
		fold: function(perzept) {
			// Daten auf sich selbst falten
			perzept.intensity = Math.sin(perzept.intensity * Math.PI);
			perzept.affect = Math.cos(perzept.affect * Math.PI);
		}
	};
	
	// -- FUNKTIONEN (Wissenschaftliche Messungen) --
	const functions = {
		// Entropie des Systems
		entropy: function(perzepts) {
			let sum = 0;
			perzepts.forEach(p => {
				const prob = p.intensity / Math.max(...Array.from(perzepts.values()).map(x => x.intensity));
				if (prob > 0) sum -= prob * Math.log2(prob);
			});
			return sum;
		},
		
		// Kohärenz zwischen Perzepten
		coherence: function(perzepts) {
			let totalCoherence = 0;
			let count = 0;
			perzepts.forEach((p1, k1) => {
				perzepts.forEach((p2, k2) => {
					if (k1 !== k2) {
						const correlation = Math.abs(p1.affect - p2.affect) / Math.max(p1.affect, p2.affect, 1);
						totalCoherence += 1 - correlation;
						count++;
					}
				});
			});
			return count > 0 ? totalCoherence / count : 0;
		},
		
		// Fraktalität
		fractality: function(perzept) {
			// Selbstähnlichkeit in verschiedenen Skalen
			const scales = [1, 2, 4, 8, 16];
			let similarity = 0;
			scales.forEach(scale => {
				const scaled = perzept.trace.filter((_, i) => i % scale === 0);
				if (scaled.length > 1) {
					const variance = scaled.reduce((acc, p) => acc + Math.pow(p.value - perzept.intensity, 2), 0);
					similarity += 1 / (1 + variance);
				}
			});
			return similarity / scales.length;
		}
	};
	
	// -- DIE MASCHINE --
	let canvas;
	let ctx;
	let animationFrame;
	let perzepts = new Map();
	let connections = [];
	let machineState = {
		entropy: 0,
		coherence: 0,
		complexity: 0
	};
	
	// Daten sammeln
	function collectData() {
		// Mouse
		dataSources.mouse.velocity = Math.sqrt(
			Math.pow(dataSources.mouse.x - (dataSources.mouse.lastX || 0), 2) +
			Math.pow(dataSources.mouse.y - (dataSources.mouse.lastY || 0), 2)
		);
		dataSources.mouse.lastX = dataSources.mouse.x;
		dataSources.mouse.lastY = dataSources.mouse.y;
		
		// Time
		const now = Date.now();
		dataSources.time.delta = now - (dataSources.time.last || now);
		dataSources.time.last = now;
		
		// Performance
		if (performance.memory) {
			dataSources.performance.memory = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
		}
		dataSources.performance.fps = 1000 / Math.max(dataSources.time.delta, 16.67);
		
		// Network
		if (navigator.connection) {
			dataSources.connection.type = navigator.connection.effectiveType;
			dataSources.connection.downlink = navigator.connection.downlink || 0;
			dataSources.connection.rtt = navigator.connection.rtt || 0;
		}
		
		// Battery
		if (navigator.getBattery) {
			navigator.getBattery().then(battery => {
				dataSources.battery.level = battery.level;
				dataSources.battery.charging = battery.charging;
			});
		}
		
		// Update Perzepts
		updatePerzepts();
	}
	
	function updatePerzepts() {
		// Mouse Velocity → Movement Perzept
		if (!perzepts.has('movement')) {
			perzepts.set('movement', new DataPerzept('mouse', 'velocity'));
		}
		perzepts.get('movement').update(dataSources.mouse.velocity);
		
		// Time Delta → Rhythm Perzept
		if (!perzepts.has('rhythm')) {
			perzepts.set('rhythm', new DataPerzept('time', 'delta'));
		}
		perzepts.get('rhythm').update(dataSources.time.delta);
		
		// Memory → Pressure Perzept
		if (!perzepts.has('pressure')) {
			perzepts.set('pressure', new DataPerzept('performance', 'memory'));
		}
		perzepts.get('pressure').update(dataSources.performance.memory);
		
		// FPS → Flow Perzept
		if (!perzepts.has('flow')) {
			perzepts.set('flow', new DataPerzept('performance', 'fps'));
		}
		perzepts.get('flow').update(dataSources.performance.fps);
		
		// Network → Connection Perzept
		if (dataSources.connection.rtt > 0) {
			if (!perzepts.has('connection')) {
				perzepts.set('connection', new DataPerzept('network', 'latency'));
			}
			perzepts.get('connection').update(dataSources.connection.rtt);
		}
		
		// Battery → Energy Perzept
		if (!perzepts.has('energy')) {
			perzepts.set('energy', new DataPerzept('battery', 'level'));
		}
		perzepts.get('energy').update(dataSources.battery.level);
		
		// Update connections
		connections = concepts.rhizome(perzepts);
		
		// Calculate machine state
		machineState.entropy = functions.entropy(perzepts);
		machineState.coherence = functions.coherence(perzepts);
		machineState.complexity = perzepts.size * connections.length;
	}
	
	// Rendering
	function render() {
		if (!ctx || !canvas) return;
		
		// Fade effect
		ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		// Collect fresh data
		collectData();
		
		// Render connections as fields
		connections.forEach(conn => {
			const p1 = Array.from(perzepts.values())[conn.from];
			const p2 = Array.from(perzepts.values())[conn.to];
			
			if (p1 && p2) {
				const x1 = canvas.width/2 + p1.vector.x * 100;
				const y1 = canvas.height/2 + p1.vector.y * 100;
				const x2 = canvas.width/2 + p2.vector.x * 100;
				const y2 = canvas.height/2 + p2.vector.y * 100;
				
				ctx.strokeStyle = `hsla(${180 + conn.strength * 180}, 100%, 50%, ${conn.strength * 0.3})`;
				ctx.lineWidth = conn.strength * 3;
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.stroke();
			}
		});
		
		// Render perzepts
		perzepts.forEach((perzept, key) => {
			const x = canvas.width/2 + perzept.vector.x * 100;
			const y = canvas.height/2 + perzept.vector.y * 100;
			const radius = 5 + perzept.intensity * 50;
			const hue = (perzept.affect * 180 + 180) % 360;
			
			// Glow
			const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
			gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${perzept.intensity})`);
			gradient.addColorStop(0.5, `hsla(${hue}, 100%, 50%, ${perzept.intensity * 0.5})`);
			gradient.addColorStop(1, 'transparent');
			
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
			ctx.fill();
			
			// Core
			ctx.fillStyle = `hsla(${hue}, 100%, 80%, 0.8)`;
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.fill();
			
			// Label
			ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
			ctx.font = '10px monospace';
			ctx.fillText(key.toUpperCase(), x - 20, y - radius - 5);
			
			// Value
			ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
			ctx.font = '8px monospace';
			ctx.fillText(perzept.intensity.toFixed(3), x - 15, y + radius + 12);
		});
		
		// Render data traces
		perzepts.forEach(perzept => {
			if (perzept.trace.length > 1) {
				ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
				ctx.lineWidth = 0.5;
				ctx.beginPath();
				perzept.trace.forEach((point, i) => {
					const x = (i / perzept.trace.length) * canvas.width;
					const y = canvas.height - (point.value * 100);
					if (i === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				});
				ctx.stroke();
			}
		});
		
		// Info overlay
		ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
		ctx.font = '12px monospace';
		ctx.fillText(`ENTROPY: ${machineState.entropy.toFixed(3)}`, 10, 20);
		ctx.fillText(`COHERENCE: ${machineState.coherence.toFixed(3)}`, 10, 35);
		ctx.fillText(`COMPLEXITY: ${machineState.complexity}`, 10, 50);
		ctx.fillText(`FPS: ${dataSources.performance.fps.toFixed(0)}`, 10, 65);
		
		// Philosophical operations based on state
		if (machineState.entropy > 2) {
			// High entropy → apply fold
			perzepts.forEach(p => concepts.fold(p));
		}
		
		if (machineState.coherence < 0.3) {
			// Low coherence → increase becoming
			perzepts.forEach(p => concepts.becoming(p, 0.5));
		}
		
		animationFrame = requestAnimationFrame(render);
	}
	
	// Event listeners
	function setupEventListeners() {
		// Mouse tracking
		window.addEventListener('mousemove', (e) => {
			dataSources.mouse.x = e.clientX;
			dataSources.mouse.y = e.clientY;
		});
		
		// Scroll tracking
		window.addEventListener('scroll', () => {
			dataSources.scroll.position = window.scrollY;
			dataSources.scroll.velocity = window.scrollY - (dataSources.scroll.last || 0);
			dataSources.scroll.last = window.scrollY;
		});
		
		// Touch tracking
		window.addEventListener('touchstart', () => {
			dataSources.device.touch = true;
		});
		
		// Orientation
		window.addEventListener('deviceorientation', (e) => {
			dataSources.device.orientation = e.alpha || 0;
		});
		
		// Visibility change
		document.addEventListener('visibilitychange', () => {
			if (!document.hidden) {
				// Create visibility perzept when returning
				perzepts.set('presence', new DataPerzept('user', 'visibility'));
				perzepts.get('presence').update(1);
			}
		});
	}
	
	// External data sources (optional)
	async function fetchExternalData() {
		// Weather API (example)
		try {
			const weather = await fetch('https://wttr.in/?format=j1');
			const data = await weather.json();
			dataSources.weather = data.current_condition?.[0];
			
			if (dataSources.weather) {
				if (!perzepts.has('weather')) {
					perzepts.set('weather', new DataPerzept('external', 'temperature'));
				}
				perzepts.get('weather').update(parseFloat(dataSources.weather.temp_C));
			}
		} catch (e) {
			// Weather fetch failed, continue without
		}
	}
	
	onMount(() => {
		canvas = document.getElementById('dataCanvas');
		ctx = canvas.getContext('2d');
		
		// Set canvas size
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight - 200;
		
		// Setup
		setupEventListeners();
		fetchExternalData();
		
		// Start rendering
		render();
		
		// Periodic external data fetch
		const externalInterval = setInterval(fetchExternalData, 60000); // Every minute
		
		return () => {
			clearInterval(externalInterval);
		};
	});
	
	onDestroy(() => {
		if (animationFrame) cancelAnimationFrame(animationFrame);
	});
	
	// Manual operations
	function injectChaos() {
		perzepts.forEach(p => {
			p.intensity = Math.random();
			p.affect = (Math.random() - 0.5) * 10;
		});
	}
	
	function harmonize() {
		const avg = Array.from(perzepts.values()).reduce((a, p) => a + p.intensity, 0) / perzepts.size;
		perzepts.forEach(p => concepts.becoming(p, avg));
	}
	
	function crystallize() {
		perzepts.forEach(p => {
			p.vector.x *= 0.1;
			p.vector.y *= 0.1;
		});
	}
</script>

<svelte:head>
	<title>AESTHETIC_RESEARCH // Data as Material</title>
</svelte:head>

<div class="research-container">
	<header>
		<h1>AESTHETIC_RESEARCH</h1>
		<p class="subtitle">Where Art ↔ Philosophy ↔ Science converge through data</p>
		<p class="theory">
			"Philosophy creates concepts, Art creates percepts & affects, Science creates functions. 
			Data Snack operates in their intersection."
		</p>
	</header>
	
	<div class="controls">
		<div class="operations">
			<button on:click={injectChaos}>
				INJECT CHAOS
			</button>
			<button on:click={harmonize}>
				HARMONIZE
			</button>
			<button on:click={crystallize}>
				CRYSTALLIZE
			</button>
			<button on:click={() => perzepts.forEach(p => concepts.fold(p))}>
				FOLD
			</button>
			<button on:click={() => perzepts.clear()}>
				CLEAR
			</button>
		</div>
		
		<div class="info">
			<p>The machine reads your mouse velocity, scroll patterns, device state, network latency, and time rhythms.</p>
			<p>Each data stream becomes a perzept - an autonomous block of sensation that exists and acts.</p>
		</div>
	</div>
	
	<canvas id="dataCanvas"></canvas>
	
	<div class="data-sources">
		<h3>LIVE DATA STREAMS</h3>
		<div class="source-grid">
			<div class="source">
				<span class="label">MOUSE</span>
				<span class="value">{dataSources.mouse.velocity?.toFixed(1) || 0} px/s</span>
			</div>
			<div class="source">
				<span class="label">FPS</span>
				<span class="value">{dataSources.performance.fps?.toFixed(0) || 0}</span>
			</div>
			<div class="source">
				<span class="label">MEMORY</span>
				<span class="value">{(dataSources.performance.memory * 100)?.toFixed(1) || 0}%</span>
			</div>
			<div class="source">
				<span class="label">NETWORK</span>
				<span class="value">{dataSources.connection.rtt || '?'} ms</span>
			</div>
			<div class="source">
				<span class="label">BATTERY</span>
				<span class="value">{(dataSources.battery.level * 100)?.toFixed(0) || '?'}%</span>
			</div>
			<div class="source">
				<span class="label">TIME Δ</span>
				<span class="value">{dataSources.time.delta || 0} ms</span>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: #000;
		overflow-x: hidden;
	}
	
	.research-container {
		min-height: 100vh;
		color: #fff;
		font-family: 'JetBrains Mono', monospace;
	}
	
	header {
		padding: 2rem;
		background: rgba(0, 0, 0, 0.9);
		border-bottom: 1px solid rgba(0, 255, 255, 0.2);
	}
	
	h1 {
		margin: 0;
		font-size: 2.5rem;
		font-weight: 800;
		background: linear-gradient(90deg, #00ffff, #ff00ff, #ffff00);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.subtitle {
		color: rgba(255, 255, 255, 0.6);
		font-size: 1rem;
		margin: 0.5rem 0;
	}
	
	.theory {
		color: rgba(255, 255, 255, 0.4);
		font-size: 0.875rem;
		font-style: italic;
		max-width: 700px;
		line-height: 1.4;
		margin-top: 1rem;
	}
	
	.controls {
		padding: 1.5rem 2rem;
		background: rgba(0, 0, 0, 0.8);
		border-bottom: 1px solid rgba(0, 255, 255, 0.1);
	}
	
	.operations {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}
	
	button {
		padding: 0.75rem 1.5rem;
		background: transparent;
		border: 1px solid rgba(0, 255, 255, 0.5);
		color: #00ffff;
		font-family: inherit;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: all 0.3s;
	}
	
	button:hover {
		background: rgba(0, 255, 255, 0.1);
		border-color: #00ffff;
		box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
	}
	
	.info {
		color: rgba(255, 255, 255, 0.5);
		font-size: 0.875rem;
		line-height: 1.5;
	}
	
	.info p {
		margin: 0.5rem 0;
	}
	
	#dataCanvas {
		display: block;
		width: 100%;
		background: #000;
	}
	
	.data-sources {
		padding: 2rem;
		background: rgba(0, 0, 0, 0.9);
		border-top: 1px solid rgba(0, 255, 255, 0.1);
	}
	
	.data-sources h3 {
		color: rgba(0, 255, 255, 0.7);
		font-size: 0.875rem;
		letter-spacing: 0.1em;
		margin-bottom: 1rem;
	}
	
	.source-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}
	
	.source {
		padding: 0.75rem;
		background: rgba(0, 255, 255, 0.05);
		border: 1px solid rgba(0, 255, 255, 0.2);
		border-radius: 4px;
	}
	
	.source .label {
		display: block;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 0.25rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.source .value {
		font-size: 1.25rem;
		color: #00ffff;
		font-weight: 600;
	}
	
	@media (max-width: 768px) {
		h1 { font-size: 1.75rem; }
		.operations { gap: 0.5rem; }
		button { padding: 0.5rem 1rem; font-size: 0.75rem; }
	}
</style>
