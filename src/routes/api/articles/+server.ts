import { json } from '@sveltejs/kit'
import type { Article } from '$lib/types'

async function getArticles() {
	let articles: Article[] = []

	const paths = import.meta.glob('/src/markdown/articles/*.md', { eager: true })

	for (const path in paths) {
		const file = paths[path]
		const slug = path.split('/').at(-1)?.replace('.md', '')

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Article, 'slug'>
			const article = { ...metadata, slug } satisfies Article
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
