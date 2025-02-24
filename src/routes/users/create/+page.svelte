<script lang="ts">
	import { goto } from '$app/navigation';
	import { MessageType, UserRole, type UpdateUser, type User } from '$lib/model.js';
	import { messageStore } from '$lib/stores';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';

	let { data } = $props();

	async function create(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		let password = form.get('password');
		let game_id = form.get('game_id');
		let name = form.get('name');
		let role = form.get('role');

		let user: UpdateUser = {
			password: password ? password!.toString() : undefined,
			name: name!.toString(),
			role: role as UserRole,
			game_id: game_id ? parseInt(game_id!.toString()) : undefined
		};

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res = await fetch(`${baseUrl}/users`, {
			method: 'POST',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user),
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
		let userRes: User = await res.json();
		messageStore.set({
			type: MessageType.Success,
			message: `Änderungen an Nutzer ${userRes.name} wurde erfolgreich gespeichert.`
		});
		goto('/users');
	}
</script>

<a href="/users" class="absolute top-0 left-14 py-6"><LeftArrow /></a>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Neuen Nutzer anlegen</h1>

<form class="flex flex-col w-80 m-auto gap-8" onsubmit={create}>
	<div class="w-full">
		<label class="label" for="name">
			<span class="label-text">Name</span>
		</label>
		<!-- svelte-ignore a11y_autofocus -->
		<input class="input input-bordered w-full" name="name" type="text" required autofocus />
	</div>

	<div class="w-full">
		<label class="label" for="role">
			<span class="label-text">Rolle</span>
		</label>
		<select name="role" class="select select-bordered w-full max-w-xs" required>
			{#each Object.values(UserRole) as value}
				<option {value}> {value} </option>
			{/each}
		</select>
	</div>

	<div class="w-full">
		<label class="label" for="game_id">
			<span class="label-text">Spiel</span>
		</label>
		<select name="game_id" class="select select-bordered w-full max-w-xs" value={null}>
			{#each data.games as game (game.id)}
				<option value={game.id}> {game.name} </option>
			{/each}

			<option value={null}> Kein Spiel </option>
		</select>
	</div>

	<div class="w-full">
		<label class="label" for="password">
			<span class="label-text">Passwort</span>
		</label>
		<input class="input input-bordered w-full" name="password" type="text" minlength="4" />
	</div>

	<button class="btn btn-primary w-full">Speichern</button>
</form>
