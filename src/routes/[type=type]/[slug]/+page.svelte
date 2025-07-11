<script lang="ts">
	import { badgeVariants } from '$lib/components/ui/badge/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { formatDate } from '$lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
</svelte:head>

<article>
	<hgroup>
		<h1 class="text-balance">{data.meta.title}</h1>
		<p>Published at {formatDate(data.meta.date)}</p>
	</hgroup>

	<div class="flex gap-2">
		{#each data.meta.categories as category}
			<!-- Will use this when the categories route is ready -->
			<!-- <a href="/categories/{category}" class={badgeVariants({ variant: 'default' })}>{category}</a> -->
			<Badge>{category}</Badge>
		{/each}
	</div>

	<div class="prose">
		<data.content />
	</div>
</article>

<style>
	article {
		max-inline-size: 70ch;
		margin-inline: auto;
	}
</style>
