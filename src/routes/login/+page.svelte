<script lang="ts">
	import { goto } from '$app/navigation';
	import { checkAuth, login } from '$lib/auth';
	import { isEnterKeyEvent } from '$lib/util';
	import { onMount } from 'svelte';

	onMount(async () => {
		let isAuthenticated = await checkAuth();
		if (isAuthenticated) {
			goto('/charts/pie');
		}
	});

	let username: string = '',
		password: string = '';

	async function handleKeydown(event: KeyboardEvent) {
		// login on enter
		if (isEnterKeyEvent(event)) {
			authenticate(username, password);
		}
	}

	async function authenticate(username: string, password: string) {
		await login(username, password);
		goto('/charts/pie');
	}
</script>

<svelte:window on:keydown={handleKeydown} />
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
		<button class="btn" on:click={() => authenticate(username, password)}>login</button>
	</div>
</div>
