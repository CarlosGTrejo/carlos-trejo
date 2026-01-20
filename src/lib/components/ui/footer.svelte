<script lang="ts">
    import * as config from '$lib/config';
</script>

<footer class="mt-auto text-muted-foreground">
    <p>{config.title} &copy {new Date().getFullYear()}</p>
</footer>

<style>
    footer {
        padding-block: 2rem;
    }
</style>
