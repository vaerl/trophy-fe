<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { MessageType, UserRole, type CreateUser, type Game, type User } from '$lib/model.js';
	import { messageStore } from '$lib/stores';
	import Loader from './blocks/Loader.svelte';
	import Navbar from './blocks/Navbar.svelte';
	import LeftArrow from './icons/LeftArrow.svelte';

	type Props = { games: Promise<Game[]>; user?: Promise<User> };
	let { games, user }: Props = $props();
	let isLoading = $state(false);

	/**
	 * Updates or creates, depending on whether {@code team} is present.
	 * Also handles loading.
	 * @param event the SubmitEvent that triggered this call
	 * @param user the current team, may be undefined
	 */
	async function save(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
		user?: User
	) {
		isLoading = true;
		event.preventDefault();
		const form = new FormData(event.currentTarget);

		let password = form.get('password');
		let game_id = form.get('game_id');
		let name = form.get('name');
		let role = form.get('role');
		console.log('game_id', game_id);

		let createUser: CreateUser = {
			password: password?.toString(),
			name: name!.toString(),
			role: role as UserRole,
			game_id: game_id?.toString()
		};
		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res;

		if (user) {
			res = await fetch(`${baseUrl}/users/${user.id}`, {
				method: 'PUT',
				headers: {
					// requests won't work without this
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(createUser),
				credentials: 'include'
			});
		} else {
			res = await fetch(`${baseUrl}/users`, {
				method: 'POST',
				headers: {
					// requests won't work without this
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(createUser),
				credentials: 'include'
			});
		}

		if (res.status != 200) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${await res.text()}`
			});
			return;
		}

		let userRes: User = await res.json();
		if (user) {
			messageStore.set({
				type: MessageType.Success,
				message: `Änderungen an Nutzer ${userRes.name} wurde erfolgreich gespeichert.`
			});
		} else {
			messageStore.set({
				type: MessageType.Success,
				message: `Nutzer ${userRes.name} wurde erfolgreich angelegt.`
			});
		}

		await goto(`/users/${userRes.id}`);
		invalidate(`${baseUrl}/users`);
		invalidate(`${baseUrl}/users/${userRes.id}`);
		isLoading = false;
	}
</script>

<div class="flex flex-col h-full">
	{#await Promise.all([games, user])}
		<div class="w-full h-full flex justify-center">
			<Loader></Loader>
		</div>
	{:then [games, user]}
		<Navbar title={user ? `${user.name} bearbeiten` : 'Neuen Nutzer anlegen'}>
			{#snippet left()}
				{#if user}
					<a href={`/users/${user.id}`}><LeftArrow /></a>
				{/if}
			{/snippet}
		</Navbar>

		<div class="w-full h-full flex justify-center items-center">
			{#if isLoading}
				<Loader></Loader>
			{:else}
				<form class="flex flex-col w-80 gap-8" onsubmit={(event) => save(event, user)}>
					<div>
						<label class="label" for="name">
							<span class="label-text">Name</span>
						</label>
						<!-- svelte-ignore a11y_autofocus -->
						<input
							class="input input-bordered w-full"
							name="name"
							type="text"
							required
							minlength="1"
							value={user?.name}
							autofocus
						/>
					</div>

					<div>
						<label class="label" for="role">
							<span class="label-text">Rolle</span>
						</label>
						<select
							name="role"
							class="select select-bordered w-full max-w-xs"
							required
							value={user?.role}
						>
							{#each Object.values(UserRole) as value}
								<option {value}> {value} </option>
							{/each}
						</select>
					</div>

					<div class="w-full">
						<label class="label" for="game_id">
							<span class="label-text">Spiel</span>
						</label>
						<select
							name="game_id"
							class="select select-bordered w-full max-w-xs"
							value={user?.game_id}
						>
							{#each games as game (game.id)}
								<option value={game.id}> {game.name} </option>
							{/each}

							<option value={null}> Kein Spiel </option>
						</select>
					</div>

					{#if user}
						<details class="collapse border collapse-arrow">
							<summary class="collapse-title font-medium">Passwort ändern</summary>
							<div class="collapse-content">
								<input
									class="input input-bordered w-full"
									name="password"
									type="text"
									minlength="4"
								/>
							</div>
						</details>
					{:else}
						<div class="w-full">
							<label class="label" for="password">
								<span class="label-text">Passwort</span>
							</label>
							<input
								class="input input-bordered w-full"
								name="password"
								type="text"
								minlength="4"
							/>
						</div>
					{/if}

					<button class="btn btn-primary w-full">Speichern</button>
				</form>
			{/if}
		</div>
	{/await}
</div>
