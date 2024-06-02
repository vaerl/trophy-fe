import type { Game } from '$lib/model';
import { getYear } from '$lib/util';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let year = getYear();
	let params = `?year=${year}`;

	const gamesRes = await fetch(`${baseUrl}/games${params}`, { credentials: 'include' });
	const games: Game[] = await gamesRes.json();

	return {
		games
	};
}
