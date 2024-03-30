import type { Game, User } from '$lib/model';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const gamesRes = await fetch(`${baseUrl}/games`, { credentials: 'include' });
	const games: Game[] = await gamesRes.json();

	return {
		games
	};
}
