import { redirect } from '@sveltejs/kit';

export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    throw redirect(307, '/docs/getting-started');
}
