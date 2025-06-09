<script lang="ts">
	import { formatDate } from '$lib/utils'
	import * as config from '$lib/config'

	let { data } = $props()
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<section>
	<ul class="articles">
		{#each data.articles as article}
			<li class="article">
				<a href='/articles/{article.slug}' class="title">{article.title}</a>
				<p class="date">{formatDate(article.date)}</p>
				<p class="description">{article.description}</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	.articles {
		display: grid;
		gap: 3rem;

		.article {
			max-inline-size: 60ch;

			&:not(:last-child) {
				border-bottom: 1px solid var(--border);
				padding-bottom: 3rem;
			}

			.title {
				font-size: clamp(2rem, 9vw, 3.5rem);
				text-transform: capitalize;
			}

			.date {
				color: var(--muted-foreground);
			}

			.description {
				margin-top: 1rem;
			}
		}
	}
</style>