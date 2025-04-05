import type { Outcome, Game } from '$lib/model.js';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch, params }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const gameRes = await fetch(`${baseUrl}/games/${params.id}`, { credentials: 'include' });
	const game: Game | { error: string } = await gameRes.json();

	if ('error' in game) {
		// redirect back to /games if we couldn't GET the game,
		// f.e. when using history after deletion
		redirect(302, '/games');
	}

	const outcomeRes = await fetch(`${baseUrl}/outcomes/games/${params.id}`, {
		credentials: 'include'
	});
	const outcomes: Outcome[] = await outcomeRes.json();

	return { item: game, outcomes };
}
