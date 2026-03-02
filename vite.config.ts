import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';

export default defineConfig(async ({ mode }) => {
	const plugins: PluginOption[] = [sveltekit()];

	if (mode === 'test') {
		const { svelteTesting } = await import('@testing-library/svelte/vite');
		plugins.push(svelteTesting());
	}

	return { plugins };
});
