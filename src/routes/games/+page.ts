import type { Game } from '$lib/model';

export async function load({ fetch, params }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const gamesRes = await fetch(`${baseUrl}/games`, { credentials: 'include' });
	const games: Game[] = await gamesRes.json();

	return {
		games
	};
}
