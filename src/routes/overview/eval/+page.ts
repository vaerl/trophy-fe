import type { Game, StatusResponse } from '$lib/model';
import { getYear } from '$lib/util.js';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	let year = getYear();
	let params = `?year=${year}`;

	const trophyDoneRes = await fetch(`${baseUrl}/done${params}`, {
		credentials: 'include'
	});
	const trophyDone: StatusResponse = await trophyDoneRes.json();

	const evalDoneRes = await fetch(`${baseUrl}/eval/done${params}`, {
		credentials: 'include'
	});
	const evalDone: StatusResponse = await evalDoneRes.json();

	const pendingGamesRes = await fetch(`${baseUrl}/games/pending${params}`, {
		credentials: 'include'
	});
	const pendingGames: Game[] = await pendingGamesRes.json();

	// load as few things as possible - especially the pending- and finished-calls are expensive
	return {
		pendingGames: pendingGames.length,
		trophyDone,
		evalDone
	};
}
