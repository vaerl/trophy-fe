import type { Game, GameWithPending, Team } from '$lib/model';
import { credentialFetch } from '$lib/util';

export async function load({ fetch, url }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const teamsRes = await fetch(`${baseUrl}/teams/amount${url.search}`, { credentials: 'include' });
	const teamsAmount: number = await teamsRes.json();

	const gamesRes = await fetch(`${baseUrl}/games${url.search}`, { credentials: 'include' });
	const games: Game[] = await gamesRes.json();

	const gamesWithPending: Promise<GameWithPending>[] = games.map(async (g) => {
		// TODO maybe offer and use /pending/amount
		const pendingTeamsRes = await credentialFetch(
			import.meta.env.VITE_BACKEND_URL + `/games/${g.id}/pending`,
			{
				method: 'GET'
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
