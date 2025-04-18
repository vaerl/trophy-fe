import type { Team } from '$lib/model';
import { getYear } from '$lib/util';
import type { PageLoad } from './$types.js';

export const load: PageLoad = ({ fetch }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let year = getYear();
	let params = `?year=${year}`;

	const teams: Promise<Team[]> = fetch(`${baseUrl}/teams${params}`, {
		credentials: 'include'
	}).then((res) => res.json());

	return {
		teams
	};
};
