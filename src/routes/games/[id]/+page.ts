import type { Outcome, Game } from '$lib/model.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch, params, depends }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const item: Promise<Game> = fetch(`${baseUrl}/games/${params.id}`, {
		credentials: 'include'
	}).then((res) => res.json());

	const outcomes: Promise<Outcome[]> = fetch(`${baseUrl}/outcomes/games/${params.id}`, {
		credentials: 'include'
	}).then((res) => res.json());

	return { item, outcomes };
};
