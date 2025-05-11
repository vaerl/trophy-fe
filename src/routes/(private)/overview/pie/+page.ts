import { getYear } from '$lib/util';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let year = getYear();
	let params = `?year=${year}`;

	const { teams, games } = await parent();

	const pendingTeams: Promise<number> = fetch(`${baseUrl}/teams/pending${params}`, {
		credentials: 'include'
	})
		.then((res) => res.json())
		.then((teams) => teams.length);

	const pendingGames: Promise<number> = fetch(`${baseUrl}/games/pending${params}`, {
		credentials: 'include'
	})
		.then((res) => res.json())
		.then((games) => games.length);

	// load as few things as possible - especially the pending- and finished-calls are expensive
	return {
		pendingTeams,
		finishedTeams: Promise.all([teams, pendingTeams]).then(
			([teams, pendingTeams]) => teams.length - pendingTeams
		),
		pendingGames,
		finishedGames: Promise.all([games, pendingGames]).then(
			([games, pendingGames]) => games.length - pendingGames
		)
	};
};
