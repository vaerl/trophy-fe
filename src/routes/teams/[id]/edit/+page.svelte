<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { MessageType, TeamGender, type CreateTeam, type Team } from '$lib/model.js';
	import { messageStore, yearStore } from '$lib/stores';
	import { getYear } from '$lib/util.js';
	import LeftArrow from '../../../../components/icons/LeftArrow.svelte';

	export let data;

	async function save(event: any) {
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
		let res = await fetch(`${baseUrl}/teams/${data.team.id}`, {
			method: 'PUT',
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
			message: `Änderungen an Team ${teamRes.name} wurde erfolgreich gespeichert.`
		});
		goto(`/teams/${data.team.id}`);
	}
</script>

<a href={`/teams/${data.team.id}`} class="absolute top-0 left-14 py-6"><LeftArrow /></a>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">
	<span class="underline">{data.team.name}</span> bearbeiten
</h1>

<form method="POST" class="flex flex-col w-80 m-auto gap-8" on:submit|preventDefault={save}>
	<div class="w-full">
		<label class="label" for="trophy_id">
			<span class="label-text">Trophy-ID</span>
		</label>
		<input
			class="input input-bordered w-full"
			name="trophy_id"
			type="number"
			required
			min="1"
			value={data.team.trophy_id}
		/>
	</div>

	<div>
		<label class="label" for="name">
			<span class="label-text">Name</span>
		</label>
		<input
			class="input input-bordered w-full"
			name="name"
			type="text"
			required
			minlength="1"
			value={data.team.name}
		/>
	</div>

	<div>
		<label class="label" for="gender">
			<span class="label-text">Typ</span>
		</label>
		<select
			name="gender"
			class="select select-bordered w-full max-w-xs"
			required
			value={data.team.gender}
		>
			{#each Object.values(TeamGender) as value}
				<option {value}> {value} </option>
			{/each}
		</select>
	</div>
	<button class="btn btn-primary w-full">Speichern</button>
</form>
