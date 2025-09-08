<script>
	import '../app.css';
	import Terminal from '$lib/components/Terminal.svelte';
	
	let showTerminal = false;
</script>

<div class="noise"></div>

<!-- Data Streams -->
{#each Array(5) as _, i}
	<div class="data-stream" style="left: {20 + i * 15}%; animation-delay: {i * 0.4}s"></div>
{/each}

<Terminal bind:visible={showTerminal} />

<main>
	<slot />
</main>

<style>
	main {
		position: relative;
		z-index: 10;
		min-height: 100vh;
	}
</style>
