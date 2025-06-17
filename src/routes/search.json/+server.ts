import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit'
import matter from 'gray-matter'
import { remark } from 'remark'
import strip from 'strip-markdown'

export const prerender = true

// Return JSON array of all the files in the markdown folder, in the format:
// {
//     "title": "<title of the post>",
//     "slug": "<post slug>",
//     "content": "<content in plain text without markdown>",
//     "description": "<description>",
//     "date": "<date>",
//     "categories": ["<category1>", "<category2>"],
//     "type": "article" | "note" | "find"
// }

async function getAllContent() {
    // Single glob call to get raw markdown files
    const rawPaths = import.meta.glob('/src/markdown/**/*.md', { 
        eager: true, 
        query: '?raw', 
        import: 'default' 
    });
    
    const content = await Promise.all(
        Object.entries(rawPaths).map(async ([path, rawContent]) => {
            // Parse front-matter and content using gray-matter
            const { data: metadata, content: markdownContent } = matter(rawContent as string);
            
            // Extract slug from file path
            const slug = path.split('/').pop()?.replace('.md', '') || '';
            
            // Early return if no slug
            if (!slug) return null;
            
            // Determine content type from path
            const type: 'article' | 'note' | 'find' = 
                path.includes('/notes/') ? 'note' :
                path.includes('/finds/') ? 'find' : 'article';
            
            // Process the content to remove markdown formatting
            const processedContent = await remark()
                .use(strip)
                .process(markdownContent);
            
            const plainTextContent = String(processedContent).trim();
            
            return {
                title: metadata?.title || slug.replace(/-/g, ' '),
                slug,
                description: metadata?.description || '',
                date: metadata?.date || '',
                categories: metadata?.categories || [],
                content: plainTextContent,
                type
            };
        })
    );
    
    // Filter out null entries and items without titles, then sort
    return content
        .filter((item): item is NonNullable<typeof item> => 
            item !== null && Boolean(item.title && item.slug)
        )
        .sort((a, b) => {
            // Sort by type (articles first), then by date (newest first)
            if (a.type !== b.type) {
                const typeOrder = { article: 0, note: 1, find: 2 };
                return typeOrder[a.type] - typeOrder[b.type];
            }
            return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
        });
}

export const GET: RequestHandler = async () => {
    const content = await getAllContent()
    return json(content)
}