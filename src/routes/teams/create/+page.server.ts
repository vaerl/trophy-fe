import { TeamGender, type CreateTeam, type Team } from '$lib/model';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async (event) => {
		let data = await event.request.formData();

		let trophy_id = data.get('trophy_id');
		if (!trophy_id) {
			return fail(400, { field: 'Trophy-ID', missing: true });
		}

		let name = data.get('name');
		if (!name) {
			return fail(400, { field: 'Name', missing: true });
		}

		let gender = data.get('gender');
		if (!gender) {
			return fail(400, { field: 'Typ', missing: true });
		}

		let team: CreateTeam = {
			trophy_id: parseInt(trophy_id.toString()),
			name: name.toString(),
			gender: gender as TeamGender
		};

		let cookie = event.cookies.get('session');
		if (!cookie) {
			return fail(400, { unauthorized: true });
		}

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res = await event.fetch(`${baseUrl}/teams`, {
			method: 'POST',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(team)
		});

		if (res.status != 200) {
			return fail!(422, { miscellaneous: true, detail: await res.text() });
		}

		// go back to overview after successful creation
		return { success: true, team: (await res.json()) as Team };
	}
};
