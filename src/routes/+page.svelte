<script>
	import { onMount } from 'svelte';
	import Cartography from '$lib/components/Cartography.svelte';
	
	let isLoading = true;
	
	onMount(() => {
		setTimeout(() => {
			isLoading = false;
		}, 500);
	});
</script>

<svelte:head>
	<title>Data Snack V4 - Kartographien der Datenwirklichkeit</title>
</svelte:head>

<div class="container">
	{#if isLoading}
		<div class="loading">
			<h1 class="pulse">Bereite die Küche vor...</h1>
		</div>
	{:else}
		<section class="hero">
			<h1>Data Snack</h1>
			<p class="tagline">Kartographien der Datenwirklichkeit</p>
			<p class="description">
				Künstlerische Forschung im Mainstream. Für alle von allen.
			</p>
		</section>

		<section class="kitchen-entrance glass">
			<h2>🍲 Heute im Menü</h2>
			<div class="featured-snack">
				<h3>Primordial Soup</h3>
				<p>Der Ur-Snack: Aus dem Chaos der Daten brodelt die erste Erkenntnis</p>
				<a href="/kitchen/primordial-soup" class="button">
					Löffel eintauchen
				</a>
			</div>
		</section>

		<section class="cartography-preview">
			<h2>Die lebendige Karte</h2>
			<p>Jeder Pfad erweitert das Rhizom. Keine Fotos - nur Karten.</p>
			<Cartography mini={true} />
		</section>

		<section class="manifesto glass">
			<blockquote>
				"Information ist kein Spiegel, sondern ein Schnitt. 
				Jeder Snack ist ein Apparat, der durch seine Inszenierung 
				eine Realität performt."
			</blockquote>
		</section>
	{/if}
</div>

<style>
	.container {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.loading {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero {
		text-align: center;
		margin: 4rem 0;
	}

	h1 {
		font-size: 4rem;
		background: linear-gradient(135deg, var(--primary), var(--secondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: 1rem;
		font-weight: 900;
	}

	.tagline {
		font-size: 1.5rem;
		color: var(--text-dim);
		margin-bottom: 0.5rem;
	}

	.description {
		font-size: 1.1rem;
		opacity: 0.9;
	}

	.kitchen-entrance {
		padding: 3rem;
		margin: 4rem 0;
		text-align: center;
	}

	.featured-snack {
		margin-top: 2rem;
	}

	.featured-snack h3 {
		font-size: 2rem;
		color: var(--accent);
		margin-bottom: 1rem;
	}

	.featured-snack p {
		margin-bottom: 2rem;
		opacity: 0.9;
	}

	.cartography-preview {
		margin: 4rem 0;
		text-align: center;
	}

	.cartography-preview h2 {
		margin-bottom: 1rem;
		font-size: 2rem;
	}

	.cartography-preview p {
		color: var(--text-dim);
		margin-bottom: 2rem;
	}

	.manifesto {
		padding: 3rem;
		margin: 4rem 0;
		text-align: center;
	}

	blockquote {
		font-style: italic;
		font-size: 1.2rem;
		line-height: 1.8;
		opacity: 0.9;
	}

	section h2 {
		color: var(--text);
	}
</style>
