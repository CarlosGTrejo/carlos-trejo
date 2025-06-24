import { createIndex, searchIndex } from "./search";
import type { SearchablePost } from "./types";

self.onmessage = async (event) => {
	const { type, payload } = event.data;
	console.log('Worker received message:', type, payload);
	if (type === 'init') {
		const data = await fetch('/search.json').then(res => res.json()) as SearchablePost[];
		createIndex(data);
		self.postMessage({ type: 'ready' });
	}
	else if (type === 'search') {
		const query = payload;
		const results = searchIndex(query);
		self.postMessage({ type: 'results', payload: results });
	}
}