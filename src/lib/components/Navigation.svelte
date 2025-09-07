<script>
	let isMenuOpen = false;
</script>

<nav class="navigation glass">
	<div class="nav-container">
		<a href="/" class="logo">
			<span class="logo-icon">🍴</span>
			<span>Data Snack</span>
		</a>
		
		<div class="nav-links">
			<a href="/kitchen">Küche</a>
			<a href="/menu">Speisekarte</a>
			<a href="/map">Karte</a>
			<a href="/about">Über</a>
		</div>

		<button 
			class="menu-toggle"
			on:click={() => isMenuOpen = !isMenuOpen}
			aria-label="Menu"
		>
			<span></span>
			<span></span>
			<span></span>
		</button>
	</div>
</nav>

{#if isMenuOpen}
	<div class="mobile-menu glass">
		<a href="/kitchen" on:click={() => isMenuOpen = false}>Küche</a>
		<a href="/menu" on:click={() => isMenuOpen = false}>Speisekarte</a>
		<a href="/map" on:click={() => isMenuOpen = false}>Karte</a>
		<a href="/about" on:click={() => isMenuOpen = false}>Über</a>
	</div>
{/if}

<style>
	.navigation {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 1rem 0;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text);
		text-decoration: none;
		transition: transform 0.3s ease;
	}

	.logo:hover {
		transform: scale(1.05);
	}

	.logo-icon {
		font-size: 1.8rem;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
	}

	.nav-links a {
		color: var(--text-dim);
		text-decoration: none;
		transition: color 0.3s ease;
		font-weight: 500;
	}

	.nav-links a:hover {
		color: var(--primary);
	}

	.menu-toggle {
		display: none;
		flex-direction: column;
		gap: 4px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
	}

	.menu-toggle span {
		width: 24px;
		height: 2px;
		background: var(--text);
		transition: all 0.3s ease;
	}

	.mobile-menu {
		position: fixed;
		top: 60px;
		left: 0;
		right: 0;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		z-index: 99;
	}

	.mobile-menu a {
		color: var(--text);
		text-decoration: none;
		padding: 0.5rem 1rem;
		transition: background 0.3s ease;
		border-radius: 8px;
	}

	.mobile-menu a:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}

		.menu-toggle {
			display: flex;
		}
	}
</style>
