import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const pages = import.meta.glob('/src/lib/docs/nulltickets/*.md', { query: '?raw', import: 'default' });
    const path = `/src/lib/docs/nulltickets/${params.slug}.md`;

    if (!pages[path]) {
        throw error(404, 'Documentation page not found');
    }

    const content = await pages[path]();
    return { content: content as string };
}
