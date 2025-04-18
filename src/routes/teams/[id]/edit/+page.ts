import type { Team } from '$lib/model.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = ({ fetch, params }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const team: Promise<Team> = fetch(`${baseUrl}/teams/${params.id}`, {
		credentials: 'include'
	}).then((res) => res.json());

	return { team };
};
