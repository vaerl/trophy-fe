import type { Game, User } from '$lib/model';
import type { PageLoad } from './$types.js';

export const load: PageLoad = ({ fetch, params, url }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const user: Promise<User> = fetch(`${baseUrl}/users/${params.id}`, {
		credentials: 'include'
	}).then((res) => res.json());

	const games: Promise<Game[]> = fetch(`${baseUrl}/games${url.search}`, {
		credentials: 'include'
	}).then((res) => res.json());

	return {
		user,
		games
	};
};
