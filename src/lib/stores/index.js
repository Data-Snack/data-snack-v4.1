import { writable, derived } from 'svelte/store';

// User Journey Store
function createJourneyStore() {
	const { subscribe, set, update } = writable({
		currentPlateau: 'META',
		visitedSnacks: [],
		path: ['META'],
		sessionStart: Date.now(),
		totalDistance: 0
	});
	
	return {
		subscribe,
		visitPlateau: (plateauId) => update(state => {
			if (!state.path.includes(plateauId)) {
				state.path.push(plateauId);
			}
			state.currentPlateau = plateauId;
			// Save to localStorage
			localStorage.setItem('userJourney', JSON.stringify(state.path));
			return state;
		}),
		visitSnack: (snackId, plateauId) => update(state => {
			if (!state.visitedSnacks.includes(snackId)) {
				state.visitedSnacks.push(snackId);
			}
			if (plateauId && !state.path.includes(plateauId)) {
				state.path.push(plateauId);
			}
			state.totalDistance += 1;
			// Save to localStorage
			localStorage.setItem('visitedSnacks', JSON.stringify(state.visitedSnacks));
			return state;
		}),
		reset: () => set({
			currentPlateau: 'META',
			visitedSnacks: [],
			path: ['META'],
			sessionStart: Date.now(),
			totalDistance: 0
		}),
		load: () => {
			// Load from localStorage
			const savedPath = localStorage.getItem('userJourney');
			const savedSnacks = localStorage.getItem('visitedSnacks');
			
			update(state => {
				if (savedPath) {
					state.path = JSON.parse(savedPath);
					state.currentPlateau = state.path[state.path.length - 1];
				}
				if (savedSnacks) {
					state.visitedSnacks = JSON.parse(savedSnacks);
				}
				return state;
			});
		}
	};
}

// Community Paths Store
function createCommunityStore() {
	const { subscribe, set, update } = writable({
		paths: [],
		heatMap: new Map(),
		activeUsers: 0
	});
	
	// Simulate community data (in production, this would come from Supabase)
	const simulatedPaths = [
		{
			id: 1,
			nodes: ['META', 'APPARATE', 'KÖRPER'],
			frequency: 3,
			timestamp: Date.now() - 3600000
		},
		{
			id: 2,
			nodes: ['META', 'KÖRPER', 'FEHLER', 'ZEIT'],
			frequency: 2,
			timestamp: Date.now() - 7200000
		},
		{
			id: 3,
			nodes: ['META', 'GEMEINSCHAFT', 'APPARATE'],
			frequency: 1,
			timestamp: Date.now() - 10800000
		}
	];
	
	return {
		subscribe,
		loadCommunityData: () => {
			// In production, fetch from Supabase
			set({
				paths: simulatedPaths,
				heatMap: new Map([
					['META', 100],
					['APPARATE', 45],
					['KÖRPER', 38],
					['FEHLER', 12],
					['ZEIT', 8],
					['GEMEINSCHAFT', 15]
				]),
				activeUsers: Math.floor(Math.random() * 20) + 5
			});
		},
		addPath: (path) => update(state => {
			// Check if similar path exists
			const existingPath = state.paths.find(p => 
				JSON.stringify(p.nodes) === JSON.stringify(path)
			);
			
			if (existingPath) {
				existingPath.frequency += 1;
			} else {
				state.paths.push({
					id: Date.now(),
					nodes: path,
					frequency: 1,
					timestamp: Date.now()
				});
			}
			
			// Update heat map
			path.forEach(node => {
				const count = state.heatMap.get(node) || 0;
				state.heatMap.set(node, count + 1);
			});
			
			return state;
		})
	};
}

// Reality Signature Store
function createRealityStore() {
	const { subscribe, set, update } = writable({
		signature: null,
		operators: [],
		temperature: 273,
		entropy: 0,
		phase: 'STABLE'
	});
	
	return {
		subscribe,
		generateSignature: (operators) => {
			const hash = operators
				.map(op => op.substring(0, 2))
				.join('')
				.toUpperCase();
			
			const signature = `REALITY_${hash}_${Date.now().toString(36).toUpperCase()}`;
			
			update(state => {
				state.signature = signature;
				state.operators = operators;
				state.temperature = 373;
				state.entropy = 100;
				state.phase = 'CRYSTALLIZED';
				
				// Save to localStorage
				localStorage.setItem('realitySignature', signature);
				localStorage.setItem('realityOperators', JSON.stringify(operators));
				
				return state;
			});
			
			return signature;
		},
		load: () => {
			const savedSignature = localStorage.getItem('realitySignature');
			const savedOperators = localStorage.getItem('realityOperators');
			
			if (savedSignature && savedOperators) {
				update(state => {
					state.signature = savedSignature;
					state.operators = JSON.parse(savedOperators);
					return state;
				});
			}
		}
	};
}

// Stats Store for tracking overall metrics
function createStatsStore() {
	const { subscribe, set, update } = writable({
		totalSnacksCompleted: 0,
		totalTimeSpent: 0,
		privacyScore: 100,
		zenLevel: 0,
		chaosLevel: 0,
		achievements: []
	});
	
	return {
		subscribe,
		completeSnack: (snackId, metrics = {}) => update(state => {
			state.totalSnacksCompleted += 1;
			
			// Update specific metrics based on snack
			if (metrics.privacyLost) {
				state.privacyScore = Math.max(0, state.privacyScore - metrics.privacyLost);
			}
			if (metrics.zenGained) {
				state.zenLevel = Math.min(100, state.zenLevel + metrics.zenGained);
			}
			if (metrics.chaosAdded) {
				state.chaosLevel = Math.min(100, state.chaosLevel + metrics.chaosAdded);
			}
			
			// Check for achievements
			checkAchievements(state, snackId);
			
			// Save to localStorage
			localStorage.setItem('dataSnackStats', JSON.stringify(state));
			
			return state;
		}),
		updateTimeSpent: (seconds) => update(state => {
			state.totalTimeSpent += seconds;
			return state;
		}),
		load: () => {
			const savedStats = localStorage.getItem('dataSnackStats');
			if (savedStats) {
				set(JSON.parse(savedStats));
			}
		}
	};
}

// Achievement checker
function checkAchievements(state, snackId) {
	const achievements = [];
	
	// First snack achievement
	if (state.totalSnacksCompleted === 1 && !state.achievements.includes('FIRST_TASTE')) {
		achievements.push({
			id: 'FIRST_TASTE',
			name: 'First Taste',
			description: 'Completed your first Data Snack',
			icon: '🍴'
		});
	}
	
	// Privacy warrior
	if (state.privacyScore <= 0 && !state.achievements.includes('PRIVACY_ZERO')) {
		achievements.push({
			id: 'PRIVACY_ZERO',
			name: 'Digital Transparency',
			description: 'Lost all privacy in Cookie Roulette',
			icon: '👁️'
		});
	}
	
	// Zen master
	if (state.zenLevel >= 80 && !state.achievements.includes('ZEN_MASTER')) {
		achievements.push({
			id: 'ZEN_MASTER',
			name: 'Digital Zen',
			description: 'Achieved high zen level in Scroll Yoga',
			icon: '🧘'
		});
	}
	
	// Chaos agent
	if (state.chaosLevel >= 50 && !state.achievements.includes('CHAOS_AGENT')) {
		achievements.push({
			id: 'CHAOS_AGENT',
			name: 'Chaos Agent',
			description: 'Embraced the glitch',
			icon: '🌀'
		});
	}
	
	// Add new achievements
	achievements.forEach(achievement => {
		if (!state.achievements.find(a => a.id === achievement.id)) {
			state.achievements.push(achievement);
			
			// Show notification (could trigger a toast/modal)
			console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
		}
	});
}

// Export store instances
export const journey = createJourneyStore();
export const community = createCommunityStore();
export const reality = createRealityStore();
export const stats = createStatsStore();

// Derived store for complete user profile
export const userProfile = derived(
	[journey, reality, stats],
	([$journey, $reality, $stats]) => ({
		journey: $journey,
		reality: $reality,
		stats: $stats,
		level: Math.floor($stats.totalSnacksCompleted / 3) + 1,
		title: getTitle($stats.totalSnacksCompleted)
	})
);

// Helper function for user titles
function getTitle(snacksCompleted) {
	if (snacksCompleted === 0) return 'Reality Tourist';
	if (snacksCompleted < 3) return 'Data Taster';
	if (snacksCompleted < 6) return 'Reality Hacker';
	if (snacksCompleted < 10) return 'Glitch Artist';
	if (snacksCompleted < 15) return 'Chaos Architect';
	return 'Reality Engineer';
}

// Initialize stores on load
if (typeof window !== 'undefined') {
	journey.load();
	reality.load();
	stats.load();
	community.loadCommunityData();
}
