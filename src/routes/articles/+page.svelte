<script lang="ts">
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { formatDate } from '$lib/utils'
	import * as config from '$lib/config'

	let { data } = $props()
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<section>
	<ul class="grid gap-8">
		{#each data.articles as article, index}
			<li>
				<a href='/articles/{article.slug}' class='flex flex-col '>
					<span class='capitalize font-bold underline underline-offset-2 text-xl md:text-3xl text-balance'>{article.title}</span>
					<span class='text-muted-foreground text-sm'>{formatDate(article.date)}</span>
				</a>
				<p class="mt-2 line-clamp-3">{article.description}</p>
			</li>
			{#if index !== data.articles.length - 1}
				<Separator />
			{/if}
		{/each}
	</ul>
</section>