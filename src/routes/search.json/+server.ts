import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getContent } from '$lib/server/getContent';

export const prerender = true;

export const GET: RequestHandler = async () => {
    const allContent = await getContent('search');
    return json(allContent);
};
