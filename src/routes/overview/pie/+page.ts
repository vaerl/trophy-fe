import type { Game, Team } from '$lib/model';
import { getYear } from '$lib/util';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let year = getYear();
	let params = `?year=${year}`;

	const teamsRes = await fetch(`${baseUrl}/teams/amount${params}`, {
		credentials: 'include'
	});
	const teams: number = await teamsRes.json();
	const pendingTeamsRes = await fetch(`${baseUrl}/teams/pending${params}`, {
		credentials: 'include'
	});
	const pendingTeams: Team[] = await pendingTeamsRes.json();

	const gamesRes = await fetch(`${baseUrl}/games/amount${params}`, { credentials: 'include' });
	const games: number = await gamesRes.json();
	const pendingGamesRes = await fetch(`${baseUrl}/games/pending${params}`, {
		credentials: 'include'
	});
	const pendingGames: Game[] = await pendingGamesRes.json();

	// load as few things as possible - especially the pending- and finished-calls are expensive
	return {
		pendingTeams: pendingTeams.length,
		finishedTeams: teams - pendingTeams.length,
		pendingGames: pendingGames.length,
		finishedGames: games - pendingGames.length
	};
}
