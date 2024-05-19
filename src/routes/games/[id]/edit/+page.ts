import type { Game } from '$lib/model.js';

export async function load({ fetch, params }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const gameRes = await fetch(`${baseUrl}/games/${params.id}`, { credentials: 'include' });
	const game: Game = await gameRes.json();

	return { game };
}
