import type { Game } from '$lib/model';

export async function load({ fetch, url }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const gamesRes = await fetch(`${baseUrl}/games${url.search}`, { credentials: 'include' });
	const games: Game[] = await gamesRes.json();

	return {
		games
	};
}
