<script lang="ts">
	import { formatDate } from '$lib/utils'
	import * as config from '$lib/config'

	let { data } = $props()
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<section>
	<ul class="posts">
		{#each data.posts as post}
			<li class="post">
				<a href={post.slug} class="title">{post.title}</a>
				<p class="date">{formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	.posts {
		display: grid;
		gap: 3rem;

		.post {
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