import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import remarkTocCollapsible from './src/lib/modified-remarkToc.js';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const highlighter = await createHighlighter({
    themes: ['vitesse-black', 'vitesse-light'],
    langs: ['javascript', 'typescript', 'python', 'json', 'svelte', 'sql', 'dockerfile', 'docker', 'terraform', 'ansi']
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
    extensions: ['.md'],
    highlight: {
        highlighter: (code, lang = 'text') => {
            const safeLang = highlighter.getLoadedLanguages().includes(lang)
                ? lang
                : 'text';
            const html = escapeSvelte(
                highlighter.codeToHtml(code, {
                    lang: safeLang,
                    themes: { light: 'vitesse-light', dark: 'vitesse-black' }
                })
            );
            return `{@html \`${html}\` }`;
        }
    },
    remarkPlugins: [[remarkTocCollapsible, { ordered: true }]],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
    kit: { adapter: adapter() },
    extensions: ['.svelte', '.svx', '.md']
};

export default config;
