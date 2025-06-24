export type Categories = 'sveltekit' | 'svelte'

export type PostType = 'article' | 'note' | 'find'

export type Post = {
	title: string
	slug: string
	description: string
	date: string
	categories: Categories[]
	published: boolean
}

export type SearchablePost = Omit<Post, 'published'> & {
	content: string
	type: PostType
}