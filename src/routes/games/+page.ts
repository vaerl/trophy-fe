import type { Game } from '$lib/model';
import { getYear } from '$lib/util';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let year = getYear();
	let params = `?year=${year}`;

	const games: Promise<Game[]> = fetch(`${baseUrl}/games${params}`, {
		credentials: 'include'
	}).then((res) => res.json());

	return {
		games
	};
};
