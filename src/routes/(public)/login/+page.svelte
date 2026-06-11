<script lang="ts">
	import { goto } from '$app/navigation';
	import { checkAuth, login } from '$lib/auth';
	import { MessageType } from '$lib/model';
	import { messageStore } from '$lib/stores';
	import { isEnterKeyEvent } from '$lib/util';
	import { onMount } from 'svelte';

	onMount(async () => {
		let isAuthenticated = await checkAuth();
		if (isAuthenticated) {
			goto(`/overview/pie`);
		}
	});

	let username: string = $state(''),
		password: string = $state('');

	async function handleKeydown(event: KeyboardEvent) {
		// login on enter
		if (isEnterKeyEvent(event)) {
			authenticate(username, password);
		}
	}

	async function authenticate(username: string, password: string) {
		const res = await login(username, password);
		if (res.status == 200) {
			goto(`/overview/pie`);
		} else {
			messageStore.set({
				type: MessageType.Error,
				message: `Fehler beim Anmelden: ${await res.text()}`
			});
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="grid h-full place-items-center p-4">
	<form
		class="flex flex-col w-full max-w-sm gap-3"
		onsubmit={(e) => {
			e.preventDefault();
			authenticate(username, password);
		}}
	>
		<h1 class="text-4xl text-center mb-2">Anmelden</h1>

		<input
			class="input input-bordered w-full"
			placeholder="Benutzername"
			bind:value={username}
			type="text"
			required
		/>

		<input
			class="input input-bordered w-full"
			placeholder="Passwort"
			bind:value={password}
			type="password"
			required
		/>

		<button class="btn btn-primary" type="submit">Anmelden</button>
	</form>
</div>
