import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import remarkTocCollapsible from './src/lib/modified-remarkToc.js';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const highlighter = await createHighlighter({
	themes: ['vitesse-black', 'vitesse-light'],
	langs: ['javascript', 'typescript', 'python', 'json', 'svelte'],
})

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			await highlighter.loadLanguage('javascript', 'typescript', 'python', 'json', 'svelte', 'ansi')
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, themes: { light: 'vitesse-light', dark: 'vitesse-black' } }))
			return `{@html \`${html}\` }`
		}
	},
	remarkPlugins: [[remarkTocCollapsible, { ordered: true }]],
	rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: { adapter: adapter() },
	extensions: ['.svelte', '.svx', '.md'],
};

export default config;
