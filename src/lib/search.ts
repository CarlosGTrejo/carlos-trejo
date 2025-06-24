import { Document } from 'flexsearch';
import type { SearchablePost } from './types';

let index: Document<SearchablePost, true, false>;

export function createIndex(data: SearchablePost[]): void {
	console.log('Creating search index...');
	index = new Document<SearchablePost, true, false>({
		document: {
			id: 'slug',
			index: [
				{
					field: 'title',
					tokenize: 'forward',
					resolution: 9
				},
				{
					field: 'description',
					tokenize: 'forward',
					resolution: 5
				},
				{
					field: 'content',
					tokenize: 'forward',
					resolution: 3
				},
				// {
				//     field: 'categories',
				//     tokenize: 'strict'
				// }
			],
			tag: 'type', // Enable filtering by content type
			store: ['title', 'description', 'type'] // Store for retrieval
		}
	})

	console.log('Index created, adding documents...');
	for (const post of data) {
		index.add(post);
	}

	console.log('Documents added, performing test search...');
	let result = index.search('svelte', {
		merge: true,
		enrich: true
	});

	console.log('Test search result:', result);
}

export function searchIndex(query: string) {
	if (!index) {
		throw new Error('Index not created yet. Call createIndex first.');
	}

	return index.search(query, {
		merge: true,
		enrich: true
	});
}