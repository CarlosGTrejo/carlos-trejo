import type { Post } from '$lib/types'

export async function load({ fetch }) {
	const response = await fetch('/api/articles')
	const articles: Post[] = await response.json()
	return { articles }
}
