export type PostType = 'articles' | 'notes' | 'finds'

export type Post = {
	title: string
	slug: string
	description: string
	date: string
	categories: string[]
	published: boolean
	type: PostType
}

export type SearchablePost = Post & {
	content: string
}

export type SearchResult = {
	id: string;
	doc: { title: string; description: string; type: PostType };
	field: string[];
};

export type GroupedResults = {
	[K in PostType]: SearchResult[];
};