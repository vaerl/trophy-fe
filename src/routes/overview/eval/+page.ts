import type { Team, Game, StatusResponse } from '$lib/model';

export async function load({ fetch, url }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const trophyDoneRes = await fetch(`${baseUrl}/done${url.search}`, {
		credentials: 'include'
	});
	const trophyDone: StatusResponse = await trophyDoneRes.json();

	const evalDoneRes = await fetch(`${baseUrl}/eval/done${url.search}`, {
		credentials: 'include'
	});
	const evalDone: StatusResponse = await evalDoneRes.json();

	const pendingGamesRes = await fetch(`${baseUrl}/games/pending${url.search}`, {
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
