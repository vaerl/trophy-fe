import type { User } from '$lib/model';
import type { PageLoad } from './$types.js';

export const load: PageLoad = ({ fetch }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const users: Promise<User[]> = fetch(`${baseUrl}/users`, { credentials: 'include' }).then((res) =>
		res.json()
	);

	return {
		users
	};
};
