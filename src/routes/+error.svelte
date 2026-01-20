<script>
    import { page } from '$app/state';
</script>

<div class="error">
    <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">
        {page.status}: {page.error?.message}
    </h1>
</div>

<style>
    .error {
        /* height: 100%; */
        display: grid;
        place-content: center;
    }
</style>
