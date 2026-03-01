import { error } from '@sveltejs/kit';

export async function load({ params }) {
    try {
        const pages = import.meta.glob('/src/lib/docs/*.md', { query: '?raw', import: 'default' });
        const path = `/src/lib/docs/${params.slug}.md`;

        if (!pages[path]) {
            throw error(404, 'Documentation file not found');
        }

        const content = await pages[path]();

        return {
            content: content as string,
        };
    } catch (e) {
        throw error(404, 'Documentation file not found');
    }
}
