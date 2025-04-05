import type { Team } from '$lib/model';
import { getYear } from '$lib/util';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let year = getYear();
	let params = `?year=${year}`;

	const teamsRes = await fetch(`${baseUrl}/teams${params}`, { credentials: 'include' });
	const teams: Team[] = await teamsRes.json();

	return {
		teams
	};
}
