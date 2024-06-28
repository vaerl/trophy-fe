import type { Game, StatusResponse } from '$lib/model';
import { getYear } from '$lib/util.js';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	let year = getYear();
	let params = `?year=${year}`;

	const trophyDone: Promise<boolean> = fetch(`${baseUrl}/done${params}`, {
		credentials: 'include'
	})
		.then((res) => res.json())
		.then((res: StatusResponse) => res.status);

	const evalDone: Promise<boolean> = fetch(`${baseUrl}/eval/done${params}`, {
		credentials: 'include'
	})
		.then((res) => res.json())
		.then((res: StatusResponse) => res.status);

	const pendingGames: Promise<number> = fetch(`${baseUrl}/games/pending${params}`, {
		credentials: 'include'
	})
		.then((res) => res.json())
		.then((games: Game[]) => games.length);

	// load as few things as possible - especially the pending- and finished-calls are expensive
	return {
		pendingGames,
		trophyDone,
		evalDone
	};
}
