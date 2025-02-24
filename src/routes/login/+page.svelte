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
<div class="flex flex-row h-full items-center">
	<div class="flex flex-col w-1/3 m-auto gap-2">
		<h1 class="text-4xl text-center">Anmelden</h1>
		<input
			class="input input-bordered"
			placeholder="Benutzername"
			bind:value={username}
			type="text"
		/>
		<input
			class="input input-bordered"
			placeholder="Passwort"
			bind:value={password}
			type="password"
		/>
		<button class="btn" onclick={() => authenticate(username, password)}>Anmelden</button>
	</div>
</div>
