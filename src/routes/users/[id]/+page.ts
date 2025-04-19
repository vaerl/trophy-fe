import type { User } from '$lib/model';
import type { PageLoad } from './$types.js';

export const load: PageLoad = ({ fetch, params }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const user: Promise<User> = fetch(`${baseUrl}/users/${params.id}`, {
		credentials: 'include'
	}).then((res) => res.json());

	return {
		user
	};
};
