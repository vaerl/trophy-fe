import type { Game, GameWithPending, Team } from '$lib/model';
import { getYear } from '$lib/util';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let year = getYear();
	let params = `?year=${year}`;

	const teamsRes = await fetch(`${baseUrl}/teams/amount${params}`, { credentials: 'include' });
	const teamsAmount: number = await teamsRes.json();

	const gamesRes = await fetch(`${baseUrl}/games${params}`, { credentials: 'include' });
	const games: Game[] = await gamesRes.json();

	const gamesWithPending: Promise<GameWithPending>[] = games.map(async (g) => {
		const pendingTeamsRes = await fetch(
			import.meta.env.VITE_BACKEND_URL + `/games/${g.id}/pending`,
			{
				method: 'GET',
				credentials: 'include'
			}
		);
		const pendingTeams: Team[] = await pendingTeamsRes.json();

		return {
			...g,
			pendingTeams: pendingTeams.length
		};
	});

	return {
		teamsAmount,
		gamesWithPending: await Promise.all(gamesWithPending)
	};
}
