import type { Game, User } from '$lib/model';
import { getYear } from '$lib/util.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = ({ fetch, params, url }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const user: Promise<User> = fetch(`${baseUrl}/users/${params.id}`, {
		credentials: 'include'
	}).then((res) => res.json());

	let year = getYear();
	let yearParam = `?year=${year}`;
	const games: Promise<Game[]> = fetch(`${baseUrl}/games${yearParam}`, {
		credentials: 'include'
	}).then((res) => res.json());

	return {
		user,
		games
	};
};
