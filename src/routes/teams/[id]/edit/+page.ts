import type { Team } from '$lib/model.js';

export async function load({ fetch, params }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const teamRes = await fetch(`${baseUrl}/teams/${params.id}`, { credentials: 'include' });
	const team: Team = await teamRes.json();

	return { team };
}
