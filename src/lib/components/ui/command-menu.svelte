<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import { Newspaper, NotebookText, Sparkle } from '@lucide/svelte/icons';
	import SearchWorker from '$lib/search-worker?worker';
	import { onMount } from 'svelte';

	let open = $state(false);
	let status = $state<'idle' | 'init' | 'ready'>('idle');
	let query = $state('');
	let results = $state([]);
	let searchWorker: Worker;

	onMount(() => {
		searchWorker = new SearchWorker();
		searchWorker.onmessage = (event) => {
			const { type, payload } = event.data;
			console.log('Message from worker:', event.data);
			type === 'ready' && (status = 'ready');
			type === 'results' && (results = payload);
		};

		searchWorker.postMessage({ type: 'init' });
	});

	$effect(() => {
		if (status === 'ready' && query.trim()) {
			searchWorker.postMessage({ type: 'search', payload: query });
		} else if (!query.trim()) {
			results = [];
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
		// Close on Escape
		if (e.key === 'Escape' && open) {
			e.preventDefault();
			open = false;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<p class="text-muted-foreground text-sm max-lg:hidden">
	Press
	<kbd
		class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100"
	>
		<span class="text-xs">⌘</span>K
	</kbd>
	to search
</p>

<Command.Dialog bind:open>
	<Command.Input placeholder="Search" bind:value={query} />
	<Command.List>
		<Command.Loading>Searching...</Command.Loading>
		{JSON.stringify(results)}
	</Command.List>
</Command.Dialog>

<style>
	p {
		cursor: default;
	}
</style>
