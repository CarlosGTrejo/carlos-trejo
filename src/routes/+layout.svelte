 <script lang="ts">
	import '../app.css';
	import { ModeWatcher } from "mode-watcher";
	import Header from '$lib/components/ui/header.svelte';
	import Footer from '$lib/components/ui/footer.svelte';
	let { children } = $props();
</script>

<ModeWatcher />
<div class="mx-auto flex min-h-screen flex-col max-w-3xl px-6">
	<Header/>
	<main class="md:py-10">
		{@render children?.()}
	</main>
	<Footer/>
</div>