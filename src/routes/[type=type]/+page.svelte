<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as config from '$lib/config';
	import { formatDate } from '$lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<section>
	<ul class="grid gap-8">
		{#each data.posts as post, index}
			<li>
				<a href="/{post.type}/{post.slug}" class="flex flex-col">
					<span
						class="capitalize font-bold underline underline-offset-2 text-xl md:text-3xl text-balance"
						>{post.title}</span
					>
					<span class="text-muted-foreground text-sm">{formatDate(post.date)}</span>
				</a>
				<p class="mt-2 line-clamp-3">{post.description}</p>
			</li>
			{#if index !== data.posts.length - 1}
				<Separator />
			{/if}
		{/each}
	</ul>
</section>
