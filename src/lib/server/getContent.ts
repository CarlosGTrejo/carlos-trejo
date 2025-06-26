import type { Post, PostType, SearchablePost } from '$lib/types'
import matter from 'gray-matter'
import { remark } from 'remark'
import strip from 'strip-markdown'

export const prerender = true

export async function getContent(contentType: PostType | 'search') {
	// Used for two different cases:
	// 1. Fetching all content for search (contentType = 'search')
	// 2. Fetching specific content type for listing (contentType = 'articles' | 'notes' | 'finds')
	// We only return the plaintext content if contentType is 'search' for performance reasons.
	// For listings, we don't need the full content, just the metadata+slug.

	// If contentType is search we get all markdown files, else we get only the files in the specific folder
	// Note: Using import.meta.glob with dynamic paths is not supported, so we have to use conditionals here with a lot of repitition.
	const paths =
		contentType === 'search'
			? import.meta.glob('/src/markdown/**/*.md', {
				eager: true,
				query: '?raw',
				import: 'default'
			})
			: (() => {
				if (contentType === 'notes') {
					return import.meta.glob('/src/markdown/notes/*.md', {
						eager: true,
						query: '?raw',
						import: 'default'
					});
				}
				if (contentType === 'finds') {
					return import.meta.glob('/src/markdown/finds/*.md', {
						eager: true,
						query: '?raw',
						import: 'default'
					});
				}
				return import.meta.glob('/src/markdown/articles/*.md', {
					eager: true,
					query: '?raw',
					import: 'default'
				});
			})();


	const postArray: (Post | SearchablePost | null)[] = await Promise.all(
		Object.entries(paths).map(async ([path, rawContent]) => {
			// Parse front-matter and content using gray-matter
			const { data: metadata, content: markdownContent } = matter(rawContent as string);

			// Do not add if not published
			if (!metadata.published || false) {
				return null
			}

			// Extract slug from file path
			const slug = path.split('/').at(-1)?.replace('.md', '');

			// Determine content type from path only if contentType is 'search', else use the provided contentType
			const type: PostType =
				contentType === 'search'
					? (() => {
						if (path.includes('/notes/')) {
							return 'notes';
						}
						if (path.includes('/finds/')) {
							return 'finds';
						}
						return 'articles';
					})()
					: (contentType as PostType);

			// If not searching, skip processing full content for performance
			const post = {
				title: metadata.title || 'MISSING TITLE',
				description: metadata.description || 'MISSING DESCRIPTION',
				date: metadata.date || new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date()),
				categories: metadata.categories || [],
				published: metadata.published || false,
				type,
				slug
			} as Post;

			if (contentType !== 'search') {
				return post
			}

			// Process the content to remove markdown formatting
			const processedContent = await remark()
				.use(strip)
				.process(markdownContent);

			const plainTextContent = String(processedContent).trim();

			// Return plaintext content only for search
			return {
				...post,
				content: plainTextContent
			} as SearchablePost;
		})
	);

	return postArray
		.filter((post): post is Post | SearchablePost => post !== null)
		.sort((a, b) => {
			// Sort by type (articles first), then by date (newest first)
			if (a.type !== b.type) {
				const typeOrder = { articles: 0, notes: 1, finds: 2 };
				return typeOrder[a.type] - typeOrder[b.type];
			}
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});
}