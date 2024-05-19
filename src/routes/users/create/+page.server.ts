import { type UpdateUser, UserRole, type User } from '$lib/model';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async (event) => {
		let data = await event.request.formData();
		let password = data.get('password');
		let game_id = data.get('game_id');

		let name = data.get('name');
		if (!name) {
			return fail(400, { field: 'Name', missing: true });
		}

		let role = data.get('role');
		if (!role) {
			return fail(400, { field: 'Rolle', missing: true });
		}

		let user: UpdateUser = {
			password: password ? password!.toString() : undefined,
			name: name.toString(),
			role: role as UserRole,
			game_id: game_id ? parseInt(game_id!.toString()) : undefined
		};

		console.log(user);

		let cookie = event.cookies.get('session');
		if (!cookie) {
			return fail(400, { unauthorized: true });
		}

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res = await event.fetch(`${baseUrl}/users`, {
			method: 'POST',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		});

		if (res.status != 200) {
			return fail!(422, { miscellaneous: true, detail: await res.text() });
		}

		// go back to overview after successful creation
		return { success: true, user: (await res.json()) as User };
	}
};
