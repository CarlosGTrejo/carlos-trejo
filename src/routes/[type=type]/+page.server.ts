import type { Post } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
    const posts = (await fetch(`/api/posts?type=${params.type}`).then((res) =>
        res.json()
    )) as Post[];
    return { posts };
};
