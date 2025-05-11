import type { User } from '$lib/model';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ fetch, params, url }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const user: Promise<User> = fetch(`${baseUrl}/users/${params.id}`, {
		credentials: 'include'
	}).then((res) => res.json());

	return {
		user
	};
};
