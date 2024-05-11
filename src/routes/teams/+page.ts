import type { Team } from '$lib/model';

export async function load({ fetch, url }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const teamsRes = await fetch(`${baseUrl}/teams${url.search}`, { credentials: 'include' });
	const teams: Team[] = await teamsRes.json();

	return {
		teams
	};
}
