<script>
	import { onMount } from 'svelte';
	import Matrix from '$lib/components/Matrix.svelte';
	import DataOrb from '$lib/components/DataOrb.svelte';
	import Cartography from '$lib/components/Cartography.svelte';
	
	let phase = 'boot';
	let bootSequence = [
		'REALITY_KITCHEN.init()',
		'Loading plateaus...',
		'Mapping rhizomes...',
		'Calibrating operators...',
		'Taste receptors online',
		'System ready'
	];
	let currentLine = 0;
	
	onMount(() => {
		const timer = setInterval(() => {
			if (currentLine < bootSequence.length - 1) {
				currentLine++;
			} else {
				clearInterval(timer);
				setTimeout(() => phase = 'interface', 500);
			}
		}, 300);
		
		return () => clearInterval(timer);
	});
</script>

<svelte:head>
	<title>DATA://SNACK/V4 — Reality Kitchen OS</title>
</svelte:head>

{#if phase === 'boot'}
	<div class="boot-screen">
		<div class="terminal-window">
			{#each bootSequence.slice(0, currentLine + 1) as line, i}
				<div class="boot-line" style="animation-delay: {i * 0.1}s">
					<span class="prompt">{'>'}</span> {line}
					{#if i === currentLine}
						<span class="cursor"></span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="interface fade-in">
		<Matrix />
		
		<header class="system-header">
			<div class="header-grid">
				<div class="system-id">
					<span class="label">SYSTEM://</span>
					<h1 class="glitch holo" data-text="DATA_SNACK_V4">DATA_SNACK_V4</h1>
				</div>
				<div class="system-status">
					<span class="status-indicator pulse"></span>
					<span class="status-text">REALITY_ENGINE: ACTIVE</span>
				</div>
			</div>
		</header>

		<section class="primary-interface">
			<div class="interface-grid">
				<div class="left-panel panel neon-box">
					<h2 class="panel-header">
						<span class="bracket">[</span>
						LATEST_SNACKS
						<span class="bracket">]</span>
					</h2>
					<div class="panel-content">
						<!-- Scroll Yoga Card -->
						<div class="snack-card" style="border-color: #00ff88; margin-bottom: 1rem;">
							<span class="new-badge" style="background: #00ff88">NEW</span>
							<h3 class="snack-title" style="color: #00ff88">ॐ SCROLL_YOGA</h3>
							<p class="snack-desc">
								Transform your scrolling into meditation. 
								5 digital asanas await your practice.
							</p>
							<div class="snack-tags">
								<span class="tag">KÖRPER</span>
								<span class="tag">WELLNESS</span>
								<span class="tag">ZEN</span>
							</div>
							<a href="/kitchen/scroll-yoga" class="snack-button" style="border-color: #00ff88; color: #00ff88">
								BEGIN_PRACTICE ॐ
							</a>
						</div>
						
						<!-- Primordial Soup Card -->
						<div class="snack-card" style="border-color: #00ffff;">
							<h3 class="snack-title holo">PRIMORDIAL_SOUP</h3>
							<p class="snack-desc">
								Der Ur-Snack. Mix operators to generate
								your unique reality signature.
							</p>
							<div class="snack-tags">
								<span class="tag">META</span>
								<span class="tag">CREATION</span>
							</div>
							<a href="/kitchen/primordial-soup" class="snack-button" style="border-color: #00ffff; color: #00ffff">
								ENTER_KITCHEN →
							</a>
						</div>
					</div>
				</div>

				<div class="center-display">
					<div class="plateau-map">
						<Cartography mini={true} interactive={true} />
					</div>
					<div class="map-label">
						PLATEAU_MAP: <span class="highlight">DYNAMIC_CARTOGRAPHY</span>
						<a href="/map" class="view-map-link">
							[FULL_MAP] →
						</a>
					</div>
				</div>

				<div class="right-panel panel neon-box">
					<h2 class="panel-header">
						<span class="bracket">[</span>
						NEW_SNACK_ALERT
						<span class="bracket">]</span>
					</h2>
					<div class="panel-content">
						<!-- Error Oracle Card -->
						<div class="new-snack-card" style="border-color: #ffff00; margin-bottom: 1rem;">
							<span class="new-badge" style="background: #ffff00; color: black;">NEW</span>
							<h3 class="snack-title" style="color: #ffff00">∅ ERROR_ORACLE</h3>
							<p class="snack-description">
								Every error is a prophecy. Browser crashes become tarot cards.
								Channel the glitches.
							</p>
							<div class="snack-tags">
								<span class="tag">FEHLER</span>
								<span class="tag">DIVINATION</span>
								<span class="tag">GLITCH</span>
							</div>
							<a href="/kitchen/error-oracle" class="action-button pulse" style="border-color: #ffff00; color: #ffff00;">
								<span class="button-text">CHANNEL_ORACLE</span>
								<span class="button-indicator">∅</span>
							</a>
						</div>
						
						<!-- Cookie Roulette Card -->
						<div class="snack-card" style="border-color: #ff0040;">
							<h3 class="snack-title" style="color: #ff0040">🎰 COOKIE_ROULETTE</h3>
							<p class="snack-desc">
								Russian Roulette with privacy.
								6 chambers. 3 loaded.
							</p>
							<div class="snack-tags">
								<span class="tag">APPARATE</span>
								<span class="tag">DANGER</span>
							</div>
							<a href="/kitchen/cookie-roulette" class="snack-button" style="border-color: #ff0040; color: #ff0040;">
								PLAY_ROULETTE ⚠
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>

		<footer class="system-footer">
			<div class="footer-grid">
				<div class="manifesto-ticker">
					<span class="ticker-text">
						INFORMATION_IST_KEIN_SPIEGEL_SONDERN_EIN_SCHNITT // 
						MACHT_KARTEN_KEINE_FOTOS // 
						KÜNSTLERISCHE_FORSCHUNG_IM_MAINSTREAM // 
						FÜR_ALLE_VON_ALLEN //
					</span>
				</div>
				<div class="system-metrics">
					<span class="metric">OPERATORS: 5</span>
					<span class="metric">PLATEAUS: 5</span>
					<span class="metric">PATHS: ∞</span>
				</div>
			</div>
		</footer>
	</div>
{/if}

<style>
	.boot-screen {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-void);
	}

	.terminal-window {
		font-family: 'JetBrains Mono', monospace;
		color: var(--green);
		padding: 2rem;
		max-width: 600px;
	}

	.boot-line {
		margin-bottom: 0.5rem;
		opacity: 0;
		animation: fadeIn 0.5s forwards;
	}

	.prompt {
		color: var(--cyan);
		margin-right: 0.5rem;
	}

	.interface {
		min-height: 100vh;
		position: relative;
	}

	.system-header {
		padding: 2rem;
		border-bottom: 1px solid rgba(0, 255, 255, 0.2);
		background: linear-gradient(180deg, rgba(0, 255, 255, 0.05), transparent);
	}

	.header-grid {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.system-id .label {
		color: var(--text-secondary);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
	}

	.system-id h1 {
		font-size: 2.5rem;
		font-weight: 800;
		margin: 0;
		letter-spacing: 0.05em;
	}

	.system-status {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.status-indicator {
		width: 10px;
		height: 10px;
		background: var(--green);
		border-radius: 50%;
		box-shadow: 0 0 20px var(--green);
	}

	.status-text {
		color: var(--green);
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.primary-interface {
		padding: 3rem 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.interface-grid {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		gap: 2rem;
		align-items: start;
	}

	.panel {
		padding: 1.5rem;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(10px);
	}

	.panel-header {
		color: var(--cyan);
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		margin-bottom: 1.5rem;
		font-weight: 600;
	}

	.bracket {
		color: var(--text-secondary);
	}

	.panel-content {
		color: var(--text-secondary);
	}

	.description {
		line-height: 1.6;
		margin: 1.5rem 0;
		font-size: 0.875rem;
	}

	.action-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border: 1px solid var(--cyan);
		color: var(--cyan);
		text-decoration: none;
		text-transform: uppercase;
		font-size: 0.75rem;
		letter-spacing: 0.2em;
		transition: all 0.3s;
		position: relative;
		overflow: hidden;
	}

	.action-button::before {
		content: "";
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: var(--cyan);
		transition: left 0.3s;
		z-index: -1;
	}

	.action-button:hover {
		color: var(--bg-void);
	}

	.action-button:hover::before {
		left: 0;
	}

	.button-indicator {
		transition: transform 0.3s;
	}

	.action-button:hover .button-indicator {
		transform: translateX(5px);
	}

	.center-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.plateau-map {
		width: 100%;
		max-width: 600px;
		height: 400px;
		position: relative;
	}

	.plateau-svg {
		width: 100%;
		height: auto;
	}

	.plateau circle {
		animation: pulse 3s ease-in-out infinite;
	}

	.plateau:hover circle {
		r: 25;
		stroke-width: 3;
	}

	.map-label {
		color: var(--text-secondary);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.highlight {
		color: var(--cyan);
	}

	.view-map-link {
		display: inline-block;
		margin-left: 1rem;
		padding: 0.25rem 0.5rem;
		background: transparent;
		border: 1px solid var(--cyan);
		color: var(--cyan);
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: all 0.3s;
	}

	.view-map-link:hover {
		background: var(--cyan);
		color: var(--bg-void);
		box-shadow: 0 0 20px var(--cyan);
	}

	.log-content {
		font-size: 0.75rem;
		font-family: 'JetBrains Mono', monospace;
	}

	.log-header {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
	}

	.log-entry {
		margin-bottom: 0.5rem;
		display: flex;
		gap: 1rem;
	}

	.timestamp {
		color: var(--text-dim);
	}

	.log-text {
		color: var(--text-secondary);
	}

	.new-snack-card {
		padding: 1rem;
		background: rgba(255, 0, 64, 0.05);
		border: 1px solid rgba(255, 0, 64, 0.3);
		border-radius: 4px;
		position: relative;
		overflow: hidden;
	}

	.new-snack-card::before {
		content: "NEW";
		position: absolute;
		top: 0;
		right: 0;
		padding: 0.25rem 0.5rem;
		background: var(--red);
		color: var(--bg-void);
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.snack-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.snack-description {
		font-size: 0.75rem;
		color: var(--text-secondary);
		line-height: 1.4;
		margin-bottom: 1rem;
	}

	.danger-level {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.danger-label {
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--red);
	}

	.danger-bar {
		flex: 1;
		height: 4px;
		background: rgba(255, 0, 64, 0.2);
		position: relative;
		overflow: hidden;
	}

	.danger-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: linear-gradient(90deg, var(--red), var(--yellow));
		box-shadow: 0 0 10px var(--red);
	}

	.snack-card {
		padding: 1rem;
		background: rgba(0, 0, 0, 0.6);
		border: 1px solid;
		border-radius: 4px;
		position: relative;
		transition: all 0.3s;
	}

	.snack-card:hover {
		background: rgba(0, 0, 0, 0.8);
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
	}

	.new-badge {
		position: absolute;
		top: -10px;
		right: -10px;
		padding: 0.25rem 0.5rem;
		color: var(--bg-void);
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		border-radius: 2px;
		animation: pulse 2s infinite;
	}

	.snack-title {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.snack-desc {
		font-size: 0.75rem;
		color: var(--text-secondary);
		line-height: 1.4;
		margin-bottom: 0.75rem;
	}

	.snack-tags {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.tag {
		padding: 0.2rem 0.5rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.2);
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
	}

	.snack-button {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid;
		text-decoration: none;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		transition: all 0.3s;
		width: 100%;
		text-align: center;
	}

	.snack-button:hover {
		background: rgba(255, 255, 255, 0.05);
		transform: translateX(5px);
	}

	.system-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.9);
		border-top: 1px solid rgba(0, 255, 255, 0.2);
		padding: 1rem 2rem;
		z-index: 100;
	}

	.footer-grid {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.manifesto-ticker {
		flex: 1;
		overflow: hidden;
		mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
	}

	.ticker-text {
		display: inline-block;
		white-space: nowrap;
		animation: ticker 20s linear infinite;
		color: var(--text-secondary);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	@keyframes ticker {
		0% { transform: translateX(100%); }
		100% { transform: translateX(-100%); }
	}

	.system-metrics {
		display: flex;
		gap: 2rem;
	}

	.metric {
		color: var(--cyan);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	@media (max-width: 1024px) {
		.interface-grid {
			grid-template-columns: 1fr;
		}

		.right-panel {
			display: none;
		}
	}

	@media (max-width: 640px) {
		.system-id h1 {
			font-size: 1.5rem;
		}

		.footer-grid {
			flex-direction: column;
			gap: 1rem;
		}

		.manifesto-ticker {
			width: 100%;
		}
	}
</style>
