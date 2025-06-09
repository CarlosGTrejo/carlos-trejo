import { error } from '@sveltejs/kit'

export async function load({ params }) {
	try {
		const article = await import(`../../../articles/${params.slug}.md`)

		return {
			content: article.default,
			meta: article.metadata
		}
	} catch (e) {
		error(404, `Could not find ${params.slug}`)
	}
}
