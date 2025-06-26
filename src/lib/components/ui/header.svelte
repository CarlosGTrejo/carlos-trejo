<script lang="ts">
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';

	import * as config from '$lib/config';

	import { Button } from '$lib/components/ui/button/index.js';
	import CommandMenu from '$lib/components/ui/command-menu.svelte';
	import type { PostType } from '$lib/types';
	import { toggleMode } from 'mode-watcher';

	import { page } from '$app/state';

	const currentPage = page.params.type || '';
	const routes: PostType[] = ['articles', 'notes', 'finds'];
	const itemClasses = (route: PostType): string =>
		currentPage === route ? 'text-foreground' : 'text-muted-foreground hover:text-foreground';
</script>

{#snippet NavItem(route: PostType)}
	<a href="/{route}" class={itemClasses(route)}>{route}</a>
{/snippet}

<div class="flex items-center justify-between py-6">
	<a href="/" class="text-lg font-bold md:text-xl">
		<span class="md:hidden">CT</span>
		<span class="hidden md:inline">{config.title}</span>
	</a>
	<nav class="flex items-center gap-3 text-sm uppercase tracking-wide md:gap-5">
		{#each routes as route}
			{@render NavItem(route)}
		{/each}
		<!-- <a href="/uses">Uses</a> -->
	</nav>
	<CommandMenu />
	<Button onclick={toggleMode} variant="outline" size="icon" class="theme">
		<SunIcon
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<MoonIcon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</div>
