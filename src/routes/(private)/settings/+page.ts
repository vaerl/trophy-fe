import type { PageLoad } from './$types.js';

// TODO make this async once https://github.com/sveltejs/svelte/pull/15844 lands
export const load: PageLoad = async ({ fetch, parent }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const years: Promise<string[]> = fetch(`${baseUrl}/years`, { credentials: 'include' })
		.then((res) => res.json())
		.then((y) => y.map((n: number) => n.toString()));

	const { games, teams } = await parent();
	return {
		years: await years,
		games: await games,
		teams: await teams
	};
};
