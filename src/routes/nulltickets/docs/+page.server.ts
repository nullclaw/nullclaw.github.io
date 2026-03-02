import { redirect } from '@sveltejs/kit';

export const prerender = true;

export async function load() {
    throw redirect(307, '/nulltickets/docs/quick-start');
}
