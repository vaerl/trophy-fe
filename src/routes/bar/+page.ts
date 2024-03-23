import type { Game, Team } from '$lib/model';

export async function load({ fetch, params }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const teamsRes = await fetch(`${baseUrl}/teams/amount`, { credentials: 'include' });
	const teamsAmount: number = await teamsRes.json();

	const gamesRes = await fetch(`${baseUrl}/games`, { credentials: 'include' });
	const games: Game[] = await gamesRes.json();

	return {
		teamsAmount,
		games
	};
}
