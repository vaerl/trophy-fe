import type { Game, Team } from '$lib/model';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const teamsRes = await fetch(`${baseUrl}/teams/amount`, { credentials: 'include' });
	const teams: number = await teamsRes.json();
	const pendingTeamsRes = await fetch(`${baseUrl}/teams/pending`, { credentials: 'include' });
	const pendingTeams: Team[] = await pendingTeamsRes.json();

	const gamesRes = await fetch(`${baseUrl}/games/amount`, { credentials: 'include' });
	const games: number = await gamesRes.json();
	const pendingGamesRes = await fetch(`${baseUrl}/games/pending`, { credentials: 'include' });
	const pendingGames: Game[] = await pendingGamesRes.json();

	// load as few things as possible - especially the pending- and finished-calls are expensive
	return {
		teams,
		games,
		pendingTeams: pendingTeams.length,
		finishedTeams: teams - pendingTeams.length,
		pendingGames: pendingGames.length,
		finishedGames: games - pendingGames.length
	};
}
