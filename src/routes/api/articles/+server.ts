import { json } from '@sveltejs/kit'
import type { Post } from '$lib/types'

async function getArticles() {
	let articles: Post[] = []

	const paths = import.meta.glob('/src/markdown/articles/*.md', { eager: true })

	for (const path in paths) {
		const file = paths[path]
		const slug = path.split('/').at(-1)?.replace('.md', '')

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>
			const article = { ...metadata, slug } satisfies Post
			article.published && articles.push(article)
		}
	}

	articles = articles.sort((first, second) =>
    new Date(second.date).getTime() - new Date(first.date).getTime()
	)

	return articles
}

export async function GET() {
	const articles = await getArticles()
	return json(articles)
}
