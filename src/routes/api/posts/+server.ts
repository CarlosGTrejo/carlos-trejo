import { json } from '@sveltejs/kit';
import type { Post, SearchablePost, PostType } from '$lib/types';
import { getContent } from '$lib/server/getContent';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const type = url.searchParams.get('type') || 'articles';
    const articles: Post[] | SearchablePost[] = await getContent(type as PostType | 'search');
    return json(articles);
};
