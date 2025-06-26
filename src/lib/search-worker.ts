import { createIndex, searchIndex } from "./search";
import type { GroupedResults, SearchablePost, SearchResult } from "./types";

self.onmessage = async (event) => {
	const { type, payload } = event.data;
	if (type === 'init') {
		const data = await fetch('/api/posts?type=search').then(res => res.json()) as SearchablePost[];
		createIndex(data);
		self.postMessage({ type: 'ready' });
	}
	else if (type === 'search') {
		const query = payload;
		const results = searchIndex(query);

		const grouped: GroupedResults = {
			articles: [],
			notes: [],
			finds: []
		};

		for (const result of results as SearchResult[]) {
			grouped[result.doc.type].push(result);
		}

		self.postMessage({ type: 'results', payload: grouped });
	}
}