<script lang="ts">
	import { goto } from '$app/navigation';
	import { messageStore, yearStore } from '$lib/stores';
	import { getYear } from '$lib/util';
	import { MessageType, TeamGender, type CreateTeam, type Team } from '../../../lib/model';

	async function create(event: any) {
		const form = new FormData(event.target);

		let trophy_id = form.get('trophy_id');
		let name = form.get('name');
		let gender = form.get('gender');
		let year = getYear();

		let team: CreateTeam = {
			trophy_id: parseInt(trophy_id!.toString()),
			name: name!.toString(),
			gender: gender as TeamGender,
			year: parseInt(year.toString())
		};

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res = await fetch(`${baseUrl}/teams`, {
			method: 'POST',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(team),
			credentials: 'include'
		});

		if (res.status != 200) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${await res.text()}`
			});
			return;
		}

		// go back to overview after successful creation
		let teamRes: Team = await res.json();
		messageStore.set({
			type: MessageType.Success,
			message: `Team ${teamRes.name} wurde erfolgreich angelegt.`
		});
		goto(`/teams`);
	}
</script>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Neues Team anlegen</h1>

<form class="flex flex-col w-80 m-auto gap-8" on:submit|preventDefault={create}>
	<div class="w-full">
		<label class="label" for="trophy_id">
			<span class="label-text">Trophy-ID</span>
		</label>
		<input class="input input-bordered w-full" name="trophy_id" type="number" required min="1" />
	</div>

	<div>
		<label class="label" for="name">
			<span class="label-text">Name</span>
		</label>
		<input class="input input-bordered w-full" name="name" type="text" required minlength="1" />
	</div>

	<div>
		<label class="label" for="gender">
			<span class="label-text">Typ</span>
		</label>
		<select name="gender" class="select select-bordered w-full max-w-xs" required>
			{#each Object.values(TeamGender) as value}
				<option {value}> {value} </option>
			{/each}
		</select>
	</div>
	<button class="btn btn-neutral w-full">Speichern</button>
</form>
