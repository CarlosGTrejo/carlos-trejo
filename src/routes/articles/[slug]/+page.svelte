<script lang="ts">
    import { badgeVariants } from "$lib/components/ui/badge/index.js";
    import { formatDate } from "$lib/utils";

    let { data } = $props();
</script>

<svelte:head>
    <title>{data.meta.title}</title>
    <meta property="og:type" content="article" />
    <meta property="og:title" content={data.meta.title} />
    <meta property="og:description" content={data.meta.description} />
</svelte:head>

<article>
    <hgroup>
        <h1 class='text-balance'>{data.meta.title}</h1>
        <p>Published at {formatDate(data.meta.date)}</p>
    </hgroup>

    <div class="flex gap-4">
        {#each data.meta.categories as category}
            <a href="/categories/{category}" class={badgeVariants({ variant: "outline" })}>{category}</a>
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
