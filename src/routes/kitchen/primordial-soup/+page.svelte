<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	
	// Die 5 Operatoren als Zutaten
	const ingredients = [
		{ 
			id: 'embodiment',
			name: 'Embodiment',
			symbol: '🫀',
			description: 'Daten werden zu Bewegung',
			active: false
		},
		{ 
			id: 'noise',
			name: 'Noise & Fehler',
			symbol: '⚡',
			description: 'Irritation als Methode',
			active: false
		},
		{ 
			id: 'cross-domain',
			name: 'Cross-Domain',
			symbol: '🔀',
			description: 'Fremde Formen kollidieren',
			active: false
		},
		{ 
			id: 'ritual',
			name: 'Ritual',
			symbol: '🔮',
			description: 'Wiederholung schafft Bedeutung',
			active: false
		},
		{ 
			id: 'subversion',
			name: 'Ästhetische Subversion',
			symbol: '🎭',
			description: 'Überhöhung bis zum Bruch',
			active: false
		}
	];
	
	let currentPhase = 'intro';
	let soupTemperature = 20;
	let stirCount = 0;
	let selectedIngredients = [];
	let personalRecipe = null;
	let isStirring = false;
	
	function selectIngredient(ingredient) {
		if (selectedIngredients.length < 3 && !selectedIngredients.includes(ingredient)) {
			selectedIngredients = [...selectedIngredients, ingredient];
			soupTemperature += 15;
			ingredient.active = true;
		}
	}
	
	function stirSoup() {
		if (isStirring) return;
		
		isStirring = true;
		stirCount++;
		soupTemperature += 5;
		
		setTimeout(() => {
			isStirring = false;
			if (stirCount >= 5 && selectedIngredients.length >= 2) {
				currentPhase = 'tasting';
				generatePersonalRecipe();
			}
		}, 500);
	}
	
	function generatePersonalRecipe() {
		// Generiere eine persönliche "Forscherkarte" basierend auf Auswahl
		const combo = selectedIngredients.map(i => i.id).sort().join('-');
		const recipes = {
			'embodiment-noise': {
				type: 'Chaos-Tänzer',
				description: 'Du findest Erkenntnis in der Bewegung des Unvorhersehbaren',
				path: 'Körper ↔ Fehler'
			},
			'cross-domain-ritual': {
				type: 'Grenzgänger-Priester',
				description: 'Du erschaffst neue Rituale aus fremden Welten',
				path: 'Apparate ↔ Gemeinschaft'
			},
			'embodiment-ritual': {
				type: 'Verkörperter Mystiker',
				description: 'Dein Körper ist dein Forschungsinstrument',
				path: 'Körper ↔ Zeit'
			},
			// ... weitere Kombinationen
			'default': {
				type: 'Daten-Alchemist',
				description: 'Du experimentierst mit unbekannten Verbindungen',
				path: 'Überall ↔ Nirgends'
			}
		};
		
		personalRecipe = recipes[combo] || recipes.default;
	}
	
	function restart() {
		currentPhase = 'intro';
		soupTemperature = 20;
		stirCount = 0;
		selectedIngredients = [];
		personalRecipe = null;
		ingredients.forEach(i => i.active = false);
	}
	
	function saveToCartography() {
		// Später: Speichere den Pfad in der Gesamtkartographie
		console.log('Pfad gespeichert:', personalRecipe);
		// TODO: Supabase integration
	}
</script>

<svelte:head>
	<title>Primordial Soup - Data Snack</title>
</svelte:head>

<div class="soup-container">
	{#if currentPhase === 'intro'}
		<div class="intro" in:fade>
			<h1>🍲 Primordial Soup</h1>
			<p class="subtitle">Aus dem Chaos der Daten brodelt die erste Erkenntnis</p>
			
			<div class="intro-text glass">
				<p>
					Dies ist der Ur-Snack. Hier lernst du die 5 Operatoren kennen,
					mit denen Data Snacks Realität erzeugen statt sie abzubilden.
				</p>
				<p>
					Wähle deine Zutaten. Rühre die Suppe. 
					Entdecke deinen Forscherpfad.
				</p>
			</div>
			
			<button class="button" on:click={() => currentPhase = 'cooking'}>
				Kochprozess starten
			</button>
		</div>
	{/if}
	
	{#if currentPhase === 'cooking'}
		<div class="cooking" in:fly={{ y: 20 }}>
			<h2>Wähle deine Zutaten</h2>
			<p class="instruction">
				Temperatur: {soupTemperature}°C | 
				Gerührt: {stirCount}x | 
				Zutaten: {selectedIngredients.length}/3
			</p>
			
			<div class="ingredients-grid">
				{#each ingredients as ingredient}
					<button 
						class="ingredient glass {ingredient.active ? 'active' : ''}"
						on:click={() => selectIngredient(ingredient)}
						disabled={ingredient.active || selectedIngredients.length >= 3}
					>
						<span class="symbol">{ingredient.symbol}</span>
						<span class="name">{ingredient.name}</span>
						<span class="desc">{ingredient.description}</span>
					</button>
				{/each}
			</div>
			
			<div class="pot-container">
				<div class="pot glass {isStirring ? 'stirring' : ''}">
					<div class="soup-surface" style="opacity: {soupTemperature / 100}">
						{#each selectedIngredients as ing}
							<span class="floating-ingredient">{ing.symbol}</span>
						{/each}
					</div>
				</div>
				
				<button 
					class="stir-button button"
					on:click={stirSoup}
					disabled={selectedIngredients.length < 2}
				>
					🥄 Umrühren
				</button>
			</div>
			
			{#if stirCount >= 3 && selectedIngredients.length >= 2}
				<p class="hint pulse">Die Suppe ist fast fertig... noch {5 - stirCount}x rühren!</p>
			{/if}
		</div>
	{/if}
	
	{#if currentPhase === 'tasting'}
		<div class="tasting" in:fly={{ y: 20 }}>
			<h2>Dein Geschmackserlebnis</h2>
			
			<div class="recipe-card glass">
				<h3>{personalRecipe.type}</h3>
				<p class="recipe-description">{personalRecipe.description}</p>
				
				<div class="path-info">
					<span>Dein Pfad im Rhizom:</span>
					<strong>{personalRecipe.path}</strong>
				</div>
				
				<div class="ingredients-summary">
					<span>Deine Zutaten:</span>
					<div class="selected-ingredients">
						{#each selectedIngredients as ing}
							<span>{ing.symbol} {ing.name}</span>
						{/each}
					</div>
				</div>
			</div>
			
			<div class="actions">
				<button class="button" on:click={saveToCartography}>
					📍 Zur Karte hinzufügen
				</button>
				<button class="button secondary" on:click={restart}>
					🔄 Neue Suppe kochen
				</button>
				<a href="/kitchen" class="button tertiary">
					🍴 Weitere Snacks erkunden
				</a>
			</div>
			
			<div class="meta-note glass">
				<p>
					<strong>Was gerade passiert ist:</strong><br>
					Du hast nicht nur Daten konsumiert, sondern durch deine Auswahl
					eine neue Realität erzeugt. Dein Pfad ist jetzt Teil der 
					kollektiven Kartographie. Das ist ästhetische Forschung.
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.soup-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
		min-height: 100vh;
	}
	
	.intro {
		text-align: center;
		padding: 4rem 0;
	}
	
	h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}
	
	.subtitle {
		font-size: 1.3rem;
		color: var(--text-dim);
		margin-bottom: 2rem;
	}
	
	.intro-text {
		padding: 2rem;
		margin: 2rem auto;
		max-width: 600px;
	}
	
	.intro-text p {
		line-height: 1.6;
		margin-bottom: 1rem;
	}
	
	.cooking {
		padding: 2rem 0;
	}
	
	h2 {
		text-align: center;
		margin-bottom: 1rem;
		font-size: 2rem;
	}
	
	.instruction {
		text-align: center;
		color: var(--accent);
		margin-bottom: 2rem;
	}
	
	.ingredients-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		margin-bottom: 3rem;
	}
	
	.ingredient {
		padding: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		border: 2px solid transparent;
	}
	
	.ingredient:hover:not(:disabled) {
		transform: translateY(-2px);
		border-color: var(--primary);
	}
	
	.ingredient.active {
		background: rgba(139, 92, 246, 0.2);
		border-color: var(--primary);
	}
	
	.ingredient:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.symbol {
		font-size: 2rem;
	}
	
	.name {
		font-weight: 600;
		font-size: 0.9rem;
	}
	
	.desc {
		font-size: 0.8rem;
		color: var(--text-dim);
		text-align: center;
	}
	
	.pot-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin: 3rem 0;
	}
	
	.pot {
		width: 300px;
		height: 300px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		background: radial-gradient(circle, rgba(139, 92, 246, 0.1), rgba(16, 185, 129, 0.1));
	}
	
	.pot.stirring {
		animation: stir 0.5s ease-in-out;
	}
	
	@keyframes stir {
		0% { transform: rotate(0deg); }
		25% { transform: rotate(5deg); }
		75% { transform: rotate(-5deg); }
		100% { transform: rotate(0deg); }
	}
	
	.soup-surface {
		position: absolute;
		inset: 20px;
		border-radius: 50%;
		background: radial-gradient(circle, var(--accent), var(--primary));
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		animation: bubble 3s ease-in-out infinite;
	}
	
	@keyframes bubble {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}
	
	.floating-ingredient {
		font-size: 2rem;
		animation: float 3s ease-in-out infinite;
	}
	
	.stir-button {
		font-size: 1.2rem;
	}
	
	.hint {
		text-align: center;
		color: var(--secondary);
		font-weight: 600;
		margin-top: 2rem;
	}
	
	.tasting {
		padding: 2rem 0;
		text-align: center;
	}
	
	.recipe-card {
		padding: 3rem;
		margin: 2rem auto;
		max-width: 600px;
	}
	
	.recipe-card h3 {
		font-size: 2rem;
		color: var(--accent);
		margin-bottom: 1rem;
	}
	
	.recipe-description {
		font-size: 1.2rem;
		line-height: 1.6;
		margin-bottom: 2rem;
	}
	
	.path-info, .ingredients-summary {
		margin: 1rem 0;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 8px;
	}
	
	.path-info strong {
		color: var(--primary);
		display: block;
		margin-top: 0.5rem;
		font-size: 1.2rem;
	}
	
	.selected-ingredients {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 0.5rem;
	}
	
	.actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin: 2rem 0;
	}
	
	.button.secondary {
		background: var(--secondary);
	}
	
	.button.tertiary {
		background: var(--bg-light);
		text-decoration: none;
		display: inline-block;
	}
	
	.meta-note {
		padding: 2rem;
		margin: 3rem auto;
		max-width: 600px;
		font-style: italic;
		line-height: 1.6;
	}
</style>
