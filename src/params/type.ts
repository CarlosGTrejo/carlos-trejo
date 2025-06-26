import type { ParamMatcher } from '@sveltejs/kit';
import type { PostType } from '$lib/types';

export const match = ((param: string): param is PostType => {
	return ['articles', 'notes', 'finds'].includes(param);
}) satisfies ParamMatcher;