import type { Outcome, Team } from '$lib/model.js';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch, params, depends }) => {
	depends('outcome:update');
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const item: Promise<Team> = fetch(`${baseUrl}/teams/${params.id}`, {
		credentials: 'include'
	}).then((res) => {
		if (res.status == 404) {
			error(404, 'Not Found');
		}

		return res.json();
	});
	const outcomes: Promise<Outcome[]> = fetch(`${baseUrl}/outcomes/teams/${params.id}`, {
		credentials: 'include'
	}).then((res) => res.json());

	return { item, outcomes };
};
