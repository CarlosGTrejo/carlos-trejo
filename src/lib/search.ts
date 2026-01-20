import { Document } from 'flexsearch';
import type { SearchablePost } from './types';

let index: Document<SearchablePost>;

export function createIndex(data: SearchablePost[]): void {
    index = new Document<SearchablePost>({
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
                }
                // {
                //     field: 'categories',
                //     tokenize: 'strict'
                // }
            ],
            tag: 'type', // Enable filtering by content type
            store: ['title', 'description', 'type'] // Store for retrieval
        }
    });

    for (const post of data) {
        index.add(post);
    }
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
