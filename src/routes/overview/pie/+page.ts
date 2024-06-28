import type { Game, Team } from '$lib/model';
import { getYear } from '$lib/util';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let year = getYear();
	let params = `?year=${year}`;

	const teams: Promise<number> = fetch(`${baseUrl}/teams/amount${params}`, {
		credentials: 'include'
	}).then((res) => res.json());
	const pendingTeams: Promise<number> = fetch(`${baseUrl}/teams/pending${params}`, {
		credentials: 'include'
	})
		.then((res) => res.json())
		.then((teams) => teams.length);

	const games: Promise<number> = fetch(`${baseUrl}/games/amount${params}`, {
		credentials: 'include'
	}).then((res) => res.json());
	const pendingGames: Promise<number> = fetch(`${baseUrl}/games/pending${params}`, {
		credentials: 'include'
	})
		.then((res) => res.json())
		.then((games) => games.length);

	// load as few things as possible - especially the pending- and finished-calls are expensive
	return {
		pendingTeams: pendingTeams,
		finishedTeams: Promise.all([teams, pendingTeams]).then(
			([teams, pendingTeams]) => teams - pendingTeams
		),
		pendingGames: pendingGames,
		finishedGames: Promise.all([games, pendingGames]).then(
			([games, pendingGames]) => games - pendingGames
		)
	};
}
