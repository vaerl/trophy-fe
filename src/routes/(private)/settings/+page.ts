import { getYear } from '$lib/util.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch, parent }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const years: Promise<string[]> = fetch(`${baseUrl}/years`, { credentials: 'include' })
		.then((res) => res.json())
		// explicitly add the current year as an option if it's not included
		.then((years) => [...years, getYear()])
		.then((y) => y.map((n: number) => n.toString()));

	const { games, teams } = await parent();
	return {
		years: years,
		games: games,
		teams: teams
	};
};
