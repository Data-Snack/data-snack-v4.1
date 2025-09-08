<script>
	export let visible = false;
	
	let command = '';
	let history = [
		'> REALITY_KITCHEN OS v4.0.1',
		'> Copyright (c) 2024 Data Snack Labs',
		'> Type "help" for commands',
		''
	];
	
	function handleCommand(e) {
		if (e.key === 'Enter' && command.trim()) {
			history = [...history, `> ${command}`];
			
			// Process commands
			switch(command.toLowerCase()) {
				case 'help':
					history = [...history, 
						'Available commands:',
						'  snacks    - List all available snacks',
						'  theory    - Toggle theory mode',
						'  clear     - Clear terminal',
						'  exit      - Close terminal'
					];
					break;
				case 'snacks':
					history = [...history,
						'Loading snack registry...',
						'  [1] PRIMORDIAL_SOUP - Status: ACTIVE',
						'  [2] COOKIE_CONSENT_ROULETTE - Status: DEVELOPMENT',
						'  [3] SCROLL_YOGA - Status: PLANNED',
						'  [4] ERROR_ORACLE - Status: CONCEPTUAL'
					];
					break;
				case 'clear':
					history = ['> Terminal cleared'];
					break;
				case 'exit':
					visible = false;
					break;
				default:
					history = [...history, `Command not found: ${command}`];
			}
			
			command = '';
			history = [...history, ''];
		}
	}
	
	function toggleTerminal(e) {
		if (e.key === '`' && e.ctrlKey) {
			visible = !visible;
		}
	}
</script>

<svelte:window on:keydown={toggleTerminal} />

{#if visible}
	<div class="terminal-overlay">
		<div class="terminal panel neon-box">
			<div class="terminal-header">
				<span>TERMINAL</span>
				<button on:click={() => visible = false}>×</button>
			</div>
			<div class="terminal-body">
				{#each history as line}
					<div class="terminal-line">{line}</div>
				{/each}
				<div class="terminal-input">
					<span class="prompt">{'>'}</span>
					<input 
						bind:value={command}
						on:keydown={handleCommand}
						placeholder="Enter command..."
						autofocus
					/>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.terminal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(5px);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.2s;
	}
	
	.terminal {
		width: 90%;
		max-width: 800px;
		height: 500px;
		display: flex;
		flex-direction: column;
	}
	
	.terminal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1rem;
		border-bottom: 1px solid var(--cyan);
		color: var(--cyan);
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	
	.terminal-header button {
		background: none;
		border: none;
		color: var(--cyan);
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.terminal-header button:hover {
		color: var(--red);
	}
	
	.terminal-body {
		flex: 1;
		padding: 1rem;
		overflow-y: auto;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		color: var(--green);
	}
	
	.terminal-line {
		margin-bottom: 0.25rem;
		white-space: pre-wrap;
		word-break: break-all;
	}
	
	.terminal-input {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	
	.prompt {
		color: var(--cyan);
	}
	
	.terminal-input input {
		flex: 1;
		background: transparent;
		border: none;
		color: var(--green);
		font-family: inherit;
		font-size: inherit;
		outline: none;
		padding: 0;
	}
</style>
