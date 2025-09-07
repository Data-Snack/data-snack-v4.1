<script>
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
</script>

<Navigation />

<main>
	<slot />
</main>

<style>
	main {
		min-height: 100vh;
		padding-top: 4rem;
	}
</style>
