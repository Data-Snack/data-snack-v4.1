import { writable, derived, get } from 'svelte/store';

// ================================================
// ZENTRALE PERZEPT-ENGINE FÜR DATA SNACK
// ================================================

class DataPerzept {
	constructor(source, type, snack) {
		this.id = `${snack}-${source}-${Date.now()}`;
		this.source = source;
		this.type = type;
		this.snack = snack;
		this.intensity = 0;
		this.affect = 0;
		this.vector = { x: 0, y: 0 };
		this.color = 0;
		this.timestamp = Date.now();
		this.trace = [];
		this.decay = 0.95;
	}
	
	update(value) {
		const delta = value - (this.lastValue || value);
		this.intensity = Math.min(1, Math.abs(delta));
		this.affect += delta * 0.1;
		this.lastValue = value;
		
		this.trace.push({ value, time: Date.now() });
		if (this.trace.length > 100) this.trace.shift();
		
		this.vector.x += delta * Math.cos(this.affect);
		this.vector.y += delta * Math.sin(this.affect);
		this.vector.x *= this.decay;
		this.vector.y *= this.decay;
		
		return this;
	}
	
	merge(otherPerzept) {
		// Perzepte können sich gegenseitig beeinflussen
		this.intensity = (this.intensity + otherPerzept.intensity) / 2;
		this.affect = (this.affect + otherPerzept.affect) / 2;
		return this;
	}
}

// PERZEPT STORE
function createPerzeptEngine() {
	const { subscribe, set, update } = writable(new Map());
	
	return {
		subscribe,
		
		// Neues Perzept hinzufügen
		add: (source, type, snack, initialValue = 0) => {
			update(perzepts => {
				const key = `${snack}-${source}`;
				if (!perzepts.has(key)) {
					perzepts.set(key, new DataPerzept(source, type, snack));
				}
				perzepts.get(key).update(initialValue);
				return new Map(perzepts);
			});
		},
		
		// Perzept updaten
		update: (source, snack, value) => {
			update(perzepts => {
				const key = `${snack}-${source}`;
				if (perzepts.has(key)) {
					perzepts.get(key).update(value);
				}
				return new Map(perzepts);
			});
		},
		
		// Perzept abrufen
		get: (source, snack) => {
			const perzepts = get({ subscribe });
			return perzepts.get(`${snack}-${source}`);
		},
		
		// Alle Perzepte eines Snacks
		getBySnack: (snack) => {
			const perzepts = get({ subscribe });
			return Array.from(perzepts.values()).filter(p => p.snack === snack);
		},
		
		// Perzepte zwischen Snacks übertragen
		transfer: (fromSnack, toSnack, source) => {
			update(perzepts => {
				const fromKey = `${fromSnack}-${source}`;
				const toKey = `${toSnack}-${source}`;
				
				if (perzepts.has(fromKey)) {
					const fromPerzept = perzepts.get(fromKey);
					if (!perzepts.has(toKey)) {
						perzepts.set(toKey, new DataPerzept(source, fromPerzept.type, toSnack));
					}
					perzepts.get(toKey).merge(fromPerzept);
				}
				return new Map(perzepts);
			});
		},
		
		// Cleanup alte Perzepte
		cleanup: (maxAge = 300000) => { // 5 Minuten default
			update(perzepts => {
				const now = Date.now();
				perzepts.forEach((perzept, key) => {
					if (now - perzept.timestamp > maxAge && perzept.intensity < 0.01) {
						perzepts.delete(key);
					}
				});
				return new Map(perzepts);
			});
		},
		
		// Reset
		reset: () => set(new Map())
	};
}

// GLOBALER PERZEPT STORE
export const perzeptEngine = createPerzeptEngine();

// DERIVED STORES für Analyse
export const totalIntensity = derived(
	perzeptEngine,
	$perzepts => {
		let sum = 0;
		$perzepts.forEach(p => sum += p.intensity);
		return sum;
	}
);

export const activeSnacks = derived(
	perzeptEngine,
	$perzepts => {
		const snacks = new Set();
		$perzepts.forEach(p => snacks.add(p.snack));
		return Array.from(snacks);
	}
);

export const dominantPerzept = derived(
	perzeptEngine,
	$perzepts => {
		let max = null;
		let maxIntensity = 0;
		$perzepts.forEach(p => {
			if (p.intensity > maxIntensity) {
				maxIntensity = p.intensity;
				max = p;
			}
		});
		return max;
	}
);

// SNACK-SPEZIFISCHE PERZEPT FACTORIES

export const snackPerzepts = {
	// Cookie Roulette
	cookieRoulette: {
		danger: (level) => perzeptEngine.add('danger', 'risk', 'cookie-roulette', level),
		surveillance: (trackers) => perzeptEngine.add('surveillance', 'count', 'cookie-roulette', trackers),
		anxiety: (clicks) => perzeptEngine.add('anxiety', 'accumulation', 'cookie-roulette', clicks)
	},
	
	// Scroll Yoga
	scrollYoga: {
		rhythm: (velocity) => perzeptEngine.add('rhythm', 'flow', 'scroll-yoga', velocity),
		harmony: (coherence) => perzeptEngine.add('harmony', 'balance', 'scroll-yoga', coherence),
		breath: (interval) => perzeptEngine.add('breath', 'cycle', 'scroll-yoga', interval)
	},
	
	// Error Oracle
	errorOracle: {
		glitch: (errors) => perzeptEngine.add('glitch', 'disruption', 'error-oracle', errors),
		prophecy: (certainty) => perzeptEngine.add('prophecy', 'prediction', 'error-oracle', certainty),
		corruption: (level) => perzeptEngine.add('corruption', 'decay', 'error-oracle', level)
	},
	
	// Primordial Soup
	primordialSoup: {
		emergence: (complexity) => perzeptEngine.add('emergence', 'creation', 'primordial-soup', complexity),
		mixture: (ingredients) => perzeptEngine.add('mixture', 'combination', 'primordial-soup', ingredients),
		transformation: (delta) => perzeptEngine.add('transformation', 'change', 'primordial-soup', delta)
	}
};

// PERZEPT VISUALIZER COMPONENT HELPER
export function getPerzeptVisualization(perzept) {
	if (!perzept) return null;
	
	return {
		x: 400 + perzept.vector.x * 100,
		y: 300 + perzept.vector.y * 100,
		radius: 5 + perzept.intensity * 50,
		color: `hsl(${(perzept.affect * 180 + 180) % 360}, 100%, 50%)`,
		opacity: perzept.intensity,
		label: `${perzept.source}:${perzept.intensity.toFixed(2)}`
	};
}

// AUTO-CLEANUP
if (typeof window !== 'undefined') {
	setInterval(() => {
		perzeptEngine.cleanup();
	}, 60000); // Jede Minute
}
