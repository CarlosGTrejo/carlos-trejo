<script lang='ts'>
    import SunIcon from "@lucide/svelte/icons/sun";
    import MoonIcon from "@lucide/svelte/icons/moon";

    import * as config from "$lib/config";
    
    import { toggleMode } from "mode-watcher";
    import { Button } from "$lib/components/ui/button/index.js";
    import CommandMenu from "$lib/components/ui/command-menu.svelte";
</script>

<div class="flex items-center justify-between py-6">
    <a href="/" class="text-lg font-bold md:text-xl">
        <span class="md:hidden">CT</span>
        <span class="hidden md:inline">{config.title}</span>
    </a>
    
    <nav class="flex items-center gap-3 text-sm uppercase tracking-wide md:gap-5">
        <a href="/articles">Articles</a>
        <a href="/notes">Notes</a>
        <a href="/finds">Finds</a>
        <a href="/uses">Uses</a>
    </nav>
    <CommandMenu />
    <Button onclick={toggleMode} variant="outline" size="icon" class='theme'>
        <SunIcon
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <MoonIcon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
    </Button>
</div>