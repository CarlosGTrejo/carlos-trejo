<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import SearchWorker from '$lib/search-worker?worker';
	import type { GroupedResults, PostType, SearchResult } from '$lib/types';
	import { Newspaper, NotepadText, Sparkle } from '@lucide/svelte/icons';
	import { onMount } from 'svelte';

	let open = $state(false);
	let status = $state<'idle' | 'init' | 'ready'>('idle');
	let query = $state('');
	const emptyResults: GroupedResults = {
		articles: [],
		notes: [],
		finds: []
	};
	let results = $state<GroupedResults>(emptyResults);
	let searchWorker: Worker;

	// Debounce configuration
	const DEBOUNCE_DELAY = 300; // milliseconds
	let debounceTimer: number;

	onMount(() => {
		searchWorker = new SearchWorker();
		searchWorker.onmessage = (event) => {
			const { type, payload } = event.data;
			type === 'ready' && (status = 'ready');
			type === 'results' && (results = payload);
		};

		searchWorker.postMessage({ type: 'init' });

		return () => {
			searchWorker.terminate();
		};
	});

	$effect(() => {
		// Clear any existing timer
		clearTimeout(debounceTimer);

		if (status === 'ready' && query.trim()) {
			// Set up debounced search
			debounceTimer = setTimeout(() => {
				searchWorker.postMessage({ type: 'search', payload: query });
			}, DEBOUNCE_DELAY);
		} else if (!query.trim()) {
			// Clear results immediately when query is empty
			results = emptyResults;
		}

		// Cleanup function to clear timer if effect re-runs
		return () => {
			clearTimeout(debounceTimer);
		};
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

{#snippet searchResult({ id, doc }: SearchResult)}
	<Command.LinkItem href="/{doc.type}s/{id}" onSelect={() => (open = false)}>
		{#if doc.type === 'notes'}
			<NotepadText />
		{:else if doc.type === 'finds'}
			<Sparkle />
		{:else}
			<Newspaper />
		{/if}
		{doc.title}
	</Command.LinkItem>
{/snippet}

<Command.Dialog bind:open shouldFilter={false}>
	<Command.Input placeholder="Search" bind:value={query} />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<!-- iterate over the keys of results -->
		{#each Object.keys(results) as PostType[] as type}
			{#if results[type].length > 0}
				<Command.Group heading={type} class="capitalize">
					{#each results[type] as result (result.id)}
						{@render searchResult(result)}
					{/each}
				</Command.Group>
			{/if}
		{/each}
	</Command.List>
</Command.Dialog>

<style>
	p {
		cursor: default;
	}
</style>
