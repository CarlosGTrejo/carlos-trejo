# Carlos Trejo — Portfolio

Personal site built with SvelteKit to showcase articles, notes, and curated finds. Content is markdown-driven, rendered with mdsvex + Shiki, and deployed to Cloudflare Workers. A client-side web worker powers fast, type-filtered search over all content.

## Features
- Markdown-first publishing for articles, notes, and finds with frontmatter-driven metadata and publish flags.
- Server-rendered markdown (mdsvex) with Shiki theming, heading anchors, and collapsible table of contents.
- Web-worker search using FlexSearch with per-type filtering, fed by a JSON API.
- Responsive UI built with Tailwind CSS v4, Shadcn-Svelte, carousel highlights, and light/dark theme sync (mode-watcher).
- Cloudflare Worker deployment with static asset serving and API routes.
- Automated deployment on push with Cloudflare Workers.

## Tech Stack
- Framework: SvelteKit (+ Svelte 5), Vite
- Styling: Tailwind CSS v4, Shadcn-Svelte
- Content: mdsvex, Shiki, remark/rehype plugins, gray-matter
- Search: FlexSearch + Web Worker
- Platform: Cloudflare Workers, TypeScript

## Local Development
Prereqs: Node 18+ and pnpm.

```bash
pnpm install
pnpm run dev
```

Other scripts:
- `pnpm build`: production bundle
- `pnpm preview`: preview the built worker locally
- `pnpm check`: type and Svelte checks
- `pnpm lint` / `pnpm format`: Prettier
- `pnpm deploy`: build then deploy with wrangler