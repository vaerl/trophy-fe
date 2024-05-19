import { type Outcome } from '$lib/model';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	delete: async (event) => {
		let id = event.params.id;

		let cookie = event.cookies.get('session');
		if (!cookie) {
			return fail(400, { unauthorized: true });
		}

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res = await event.fetch(`${baseUrl}/users/${id}`, {
			method: 'DELETE',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			}
		});

		if (res.status != 200) {
			return fail!(422, { miscellaneous: true, detail: await res.text() });
		}

		// go back to /users after deletion
		redirect(302, '/users');
	}
};
