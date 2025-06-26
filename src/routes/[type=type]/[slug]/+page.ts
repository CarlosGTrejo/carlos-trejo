import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const article = await import(`../../../markdown/${params.type}/${params.slug}.md`)

		return {
			content: article.default,
			meta: article.metadata
		}
	} catch (e) {
		error(404, `Could not find ${params.slug}`)
	}
}
